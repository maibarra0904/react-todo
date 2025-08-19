
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { TodoComputed } from "./components/TodoComputed";
import { TodoCreate } from "./components/TodoCreate";
import { TodoFilter } from "./components/TodoFilter";
import { TodoList } from "./components/TodoList";
import { ProjectSidebar } from "./components/ProjectSidebar";
import { DataSidebar } from "./components/DataSidebar";
import Login from "./components/Login";
// Leer la URL de la API desde variable de entorno Vite



function getValidProjectsFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem("projects"));
    if (
      Array.isArray(data) &&
      data.every(
        p => p && typeof p === 'object' && p.id && p.name && Array.isArray(p.todos)
      )
    ) {
      return data;
    }
  } catch (e) { console.error("Error parsing projects from localStorage", e); }
  // Si hay datos corruptos o inválidos, limpiar localStorage y devolver el estado inicial
  localStorage.removeItem("projects");
  return [
    { id: "default", name: "Proyecto Principal", todos: [] }
  ];
}

const initialStateProjects = getValidProjectsFromStorage();

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex,0, removed)

  return result;
}



function App() {
  const [projects, setProjects] = useState(initialStateProjects);
  const [currentProjectId, setCurrentProjectId] = useState(initialStateProjects[0]?.id || "");
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataSidebarOpen, setDataSidebarOpen] = useState(true);
  const [user, setUser] = useState(() => {
    // Persistencia simple en localStorage
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Login handler
  const handleLogin = async (email, password, setError) => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL;
    setError && setError("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Credenciales incorrectas');
      }
      const data = await res.json();
      setUser(data.user || { email });
      localStorage.setItem('user', JSON.stringify(data.user || { email }));
    } catch (err) {
      setError && setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const currentProject = Array.isArray(projects) && projects.length > 0
    ? (projects.find(p => p.id === currentProjectId) || projects[0])
    : { todos: [] };
  const todos = Array.isArray(currentProject?.todos) ? currentProject.todos : [];

  const setTodosForCurrent = (newTodos) => {
    setProjects(projects => projects.map(p =>
      p.id === currentProjectId ? { ...p, todos: newTodos } : p
    ));
  };

  // Generador de UUID seguro para proyectos y tareas
  function generateId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  const createTodo = (title) => {
    const newTodo = {
      id: generateId(),
      title: title.trim(),
      completed: false
    };
    setTodosForCurrent([...todos, newTodo]);
  };

  const removeTodo = (id) => {
    setTodosForCurrent(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id) => {
    setTodosForCurrent(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const computedItemsLeft = todos.filter((todo) => !todo.completed).length;
  const computedItemsCompleted = todos.filter((todo) => todo.completed).length;

  const clearCompleted = () => {
    setTodosForCurrent(todos.filter((todo) => !todo.completed));
  };

  const changeFilter = (filter) => setFilter(filter);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'active') {
      return !todo.completed;
    } else if (filter === 'completed') {
      return todo.completed;
    } else {
      return todos;
    }
  });

  const handleDragEnd = result => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;
    setTodosForCurrent(reorder(todos, source.index, destination.index));
  };

  // Project management
  const createProject = (name) => {
    const id = generateId();
    setProjects([...projects, { id, name, todos: [] }]);
    setCurrentProjectId(id);
  };

  const selectProject = (id) => {
    setCurrentProjectId(id);
  };

  // Export/Import
  const exportProjects = () => {
    const data = JSON.stringify(projects, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proyectos_tareas.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProjects = (data) => {
    if (Array.isArray(data) && data.every(p => p.id && p.name && Array.isArray(p.todos))) {
      setProjects(data);
      setCurrentProjectId(data[0]?.id || "");
    } else {
      alert("El JSON no tiene el formato correcto");
    }
  };


  if (!user) {
    return <Login onLogin={handleLogin} loading={loading} />;
  }

  return (
    <div className="bg-gray-300 dark:bg-gray-800 transition-all duration-700 bg-[url('./assets/images/bg-mobile-light.jpg')] bg-no-repeat bg-contain min-h-screen dark:bg-[url('./assets/images/bg-mobile-dark.jpg')] md:bg-[url('./assets/images/bg-desktop-light.jpg')] md:dark:bg-[url('./assets/images/bg-desktop-dark.jpg')] flex">
      {/* Sidebars fijos */}
      <ProjectSidebar
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={selectProject}
        onCreateProject={createProject}
        onDeleteProject={(id) => {
          const newProjects = projects.filter(p => p.id !== id);
          setProjects(newProjects);
          if (currentProjectId === id && newProjects.length > 0) {
            setCurrentProjectId(newProjects[0].id);
          }
        }}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <DataSidebar
        onExport={exportProjects}
        onImport={importProjects}
        dataSidebarOpen={dataSidebarOpen}
        setDataSidebarOpen={setDataSidebarOpen}
      />
      {/* Wrapper para centrar el contenido entre sidebars */}
      <div
        className="flex-1 transition-all"
        style={{
          marginLeft: sidebarOpen ? '18rem' : 0,
          marginRight: dataSidebarOpen ? '18rem' : 0,
          transition: 'margin-left 0.3s, margin-right 0.3s',
        }}
      >
        <div className="d-flex justify-content-end align-items-center p-2">
          <span className="me-2" style={{color: '#fff', fontWeight: 500, letterSpacing: '0.5px', textShadow: '0 1px 4px #0008'}}>{user?.email}</span>
          <button
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(90deg, #d32f2f 60%, #ff6b6b 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '1.5rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px 0 #d32f2f33',
              padding: '0.5rem 1.2rem',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #d32f2f 100%)';
              e.currentTarget.style.boxShadow = '0 4px 16px 0 #d32f2f55';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #d32f2f 60%, #ff6b6b 100%)';
              e.currentTarget.style.boxShadow = '0 2px 8px 0 #d32f2f33';
            }}
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{marginRight:6,verticalAlign:'middle'}}><path d="M6 13.5A1.5 1.5 0 0 1 4.5 12V4A1.5.5 0 0 1 6 2.5h4A1.5.5 0 0 1 11.5 4v2a.5.5 0 0 1-1 0V4a.5.5 0 0 0-.5-.5H6A.5.5 0 0 0 5.5 4v8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 10 13.5H6z"/><path d="M8.146 11.354a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.293V6.5a.5.5 0 0 0-1 0v2.793l-2.646-2.647a.5.5 0 0 0-.708.708l3 3z"/></svg>
            Cerrar sesión
          </button>
        </div>
        <Header />
        <main className="container mx-auto px-4 mt-8 md:max-w-xl ">
          <TodoCreate createTodo={createTodo} />
          <DragDropContext onDragEnd={handleDragEnd}>
            <TodoList
              todos={filteredTodos}
              removeTodo={removeTodo}
              updateTodo={updateTodo}
              onEditTodo={(id, newTitle) => {
                setTodosForCurrent(
                  todos.map(todo =>
                    todo.id === id ? { ...todo, title: newTitle } : todo
                  )
                );
              }}
            />
          </DragDropContext>
          <TodoComputed computedItemsLeft={computedItemsLeft} computedItemsCompleted={computedItemsCompleted} clearCompleted={clearCompleted} />
          <TodoFilter changeFilter={changeFilter} filter={filter} />
        </main>
        <footer className="text-center dark:text-gray-400 transition-all duration-700">Drag and drop to reorder list</footer>
      </div>
    </div>
  );
}

export default App;
