
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { TodoComputed } from "./components/TodoComputed";
import { TodoCreate } from "./components/TodoCreate";
import { TodoFilter } from "./components/TodoFilter";
import { TodoList } from "./components/TodoList";
import { ProjectSidebar } from "./components/ProjectSidebar";
import { DataSidebar } from "./components/DataSidebar";
import Swal from "sweetalert2";
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
  const [dataSidebarOpen, setDataSidebarOpen] = useState(false);
  const user = { email: "Usuario Local" };

  // Reset data handler
  const handleResetData = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto borrará todas tus tareas y proyectos locales de forma irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-danger px-4 mx-2',
        cancelButton: 'btn btn-secondary px-4 mx-2'
      },
      buttonsStyling: false
    });
    
    if (result.isConfirmed) {
      localStorage.removeItem('projects');
      setProjects([
        { id: "default", name: "Proyecto Principal", todos: [] }
      ]);
      setCurrentProjectId("default");
      Swal.fire({
        icon: 'success',
        title: 'Datos restablecidos',
        timer: 1200,
        showConfirmButton: false,
        confirmButtonColor: '#3085d6'
      });
    }
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

  const createTodo = (title, dueDate) => {
    const newTodo = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      dueDate: dueDate || null
    };

    const activeTodos = todos.filter((t) => !t.completed);
    const completedTodos = todos.filter((t) => t.completed);

    const sortedActiveTodos = [...activeTodos, newTodo].sort((a, b) => {
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });

    setTodosForCurrent([...sortedActiveTodos, ...completedTodos]);
  };

  const removeTodo = (id) => {
    setTodosForCurrent(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const isTurningCompleted = !todo.completed;
        return {
          ...todo,
          completed: isTurningCompleted,
          completedAt: isTurningCompleted ? new Date().toLocaleString('es-ES', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : null
        };
      }
      return todo;
    });

    const updatedItem = updatedTodos.find(t => t.id === id);
    if (updatedItem && updatedItem.completed) {
      const withoutCompletedItem = updatedTodos.filter(t => t.id !== id);
      setTodosForCurrent([...withoutCompletedItem, updatedItem]);
    } else {
      setTodosForCurrent(updatedTodos);
    }
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

    const draggedItem = filteredTodos[source.index];
    const activeCount = filteredTodos.filter(t => !t.completed).length;

    // Restricciones para mantener separadas activas de completadas
    if (!draggedItem.completed) {
      if (destination.index >= activeCount) {
        return; // Cancelar: Tarea activa no puede ir abajo de completadas
      }
    } else {
      if (destination.index < activeCount) {
        return; // Cancelar: Tarea completada no puede subir a zona de activas
      }
    }

    const targetItem = filteredTodos[destination.index];
    const sourceIndexInTodos = todos.findIndex(t => t.id === draggedItem.id);
    const destinationIndexInTodos = todos.findIndex(t => t.id === targetItem.id);

    if (sourceIndexInTodos !== -1 && destinationIndexInTodos !== -1) {
      setTodosForCurrent(reorder(todos, sourceIndexInTodos, destinationIndexInTodos));
    }
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
            onClick={handleResetData}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{marginRight:6,verticalAlign:'middle'}}>
              <path d="M11 5.466V4H5v1.466C5 5.76 5.23 6 5.5 6h5c.27 0 .5-.24.5-.534z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 0 0 1H13.5a.5.5 0 0 0 0-1H10.5a.5.5 0 0 1-1-1h-2a.5.5 0 0 1-1 1H2.5z"/>
            </svg>
            Restablecer datos
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
