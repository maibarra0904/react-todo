import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
// Inyectar estilos globales para hover en modo claro/oscuro
const sidebarCustomStyles = `
.project-btn.btn-outline-secondary:hover,
.project-btn.btn-outline-secondary:focus {
  background-color: #e9ecef !important;
  color: #212529 !important;
}
.dark .project-btn.btn-outline-secondary:hover,
.dark .project-btn.btn-outline-secondary:focus {
  background-color: #343a40 !important;
  color: #f8f9fa !important;
}
.project-btn.btn-outline-primary,
.project-btn.btn-outline-primary:focus,
.project-btn.btn-outline-primary:hover {
  color: #0d6efd !important;
  background-color: #e7f1ff !important;
}
.dark .project-btn.btn-outline-primary,
.dark .project-btn.btn-outline-primary:focus,
.dark .project-btn.btn-outline-primary:hover {
  color: #fff !important;
  background-color: #0d6efd !important;
}
.project-delete-btn.btn-danger:hover,
.project-delete-btn.btn-danger:focus {
  background-color: #bb2d3b !important;
  color: #fff !important;
}
.dark .project-delete-btn.btn-danger:hover,
.dark .project-delete-btn.btn-danger:focus {
  background-color: #a71d2a !important;
  color: #fff !important;
}
`;

function useSidebarCustomStyles() {
  useEffect(() => {
    if (!document.getElementById('sidebar-custom-styles')) {
      const style = document.createElement('style');
      style.id = 'sidebar-custom-styles';
      style.innerHTML = sidebarCustomStyles;
      document.head.appendChild(style);
    }
  }, []);
}
import Swal from 'sweetalert2';

export const ProjectSidebar = ({ projects, currentProjectId, onSelectProject, onCreateProject, onExport, onImport, onDeleteProject, sidebarOpen, setSidebarOpen }) => {
  useSidebarCustomStyles();
  const [newProjectName, setNewProjectName] = useState("");
  const fileInputRef = useRef();
  const [showImport, setShowImport] = useState(false);

  const handleCreate = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName("");
    }
  };

  const handleImport = () => {
    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onImport(data);
          setShowImport(false);
          fileInputRef.current.value = "";
          Swal.fire({ icon: 'success', title: 'Importación exitosa', timer: 1500, showConfirmButton: false, confirmButtonColor: '#3085d6' });
        } catch {
          Swal.fire({ icon: 'error', title: 'JSON inválido', text: 'El archivo no tiene el formato correcto.', confirmButtonColor: '#3085d6' });
        }
      };
      reader.readAsText(file);
    } else {
  Swal.fire({ icon: 'warning', title: 'Selecciona un archivo JSON', confirmButtonColor: '#3085d6' });
    }
  };

  // Responsive: mostrar botón flotante en móvil
  return (
    <>
      {/* Botón solapa para mostrar/ocultar sidebar (escritorio y móvil) */}
      <button
        className={`position-fixed top-50 start-0 translate-middle-y btn border-0 sidebar-toggle-btn z-50 d-flex align-items-center justify-content-center ${sidebarOpen ? '' : 'collapsed'}`}
        style={{
          width: '44px',
          height: '80px',
          borderTopRightRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
          left: sidebarOpen ? '18rem' : 0,
          transition: 'left 0.3s, box-shadow 0.2s',
          background: 'linear-gradient(135deg, #0d6efd 60%, #6ea8fe 100%)',
          boxShadow: '0 4px 24px 0 rgba(13,110,253,0.25), 0 1.5px 0 0 #fff inset',
          outline: '3px solid #fff',
          outlineOffset: '-2px',
          padding: 0,
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? 'Ocultar menú proyectos' : 'Mostrar menú proyectos'}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(13,110,253,0.45), 0 1.5px 0 0 #fff inset'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(13,110,253,0.25), 0 1.5px 0 0 #fff inset'}
      >
        <span style={{
          fontSize: 32,
          color: '#fff',
          textShadow: '0 0 8px #6ea8fe, 0 0 2px #0d6efd',
          transition: 'transform 0.3s, text-shadow 0.2s',
          transform: sidebarOpen ? 'rotate(180deg)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Ícono de flecha animado */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
            <circle cx="16" cy="16" r="15" fill="rgba(255,255,255,0.08)"/>
            <path d="M20.5 16L13.5 11V21L20.5 16Z" fill="#fff" style={{filter:'drop-shadow(0 0 4px #6ea8fe)'}}/>
          </svg>
        </span>
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 shadow-lg d-flex flex-column p-3 z-40 transition-all duration-300 bg-white dark:bg-gray-900
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ minWidth: '16rem', maxWidth: '100vw', width: '18rem', height: '100dvh', background: 'inherit', transition: 'transform 0.3s' }}
      >
  <h2 className="fs-5 fw-bold mb-4 text-white dark:text-light">Proyectos</h2>
        <form className="mb-4" onSubmit={e => { e.preventDefault(); handleCreate(); }}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nuevo proyecto"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">Crear</button>
          </div>
        </form>
  <ul className="list-group flex-grow-1 mb-4 overflow-auto bg-transparent" style={{maxHeight:'40vh'}}>
          {projects.map(p => (
            <li key={p.id} className="list-group-item p-0 border-0 bg-transparent d-flex align-items-center">
              <button
                className={`btn flex-grow-1 text-start mb-1 project-btn ${currentProjectId === p.id ? 'btn-outline-primary fw-bold' : 'btn-outline-secondary dark:bg-gray-800 dark:text-light'}`}
                style={{background: 'inherit'}}
                onClick={() => { onSelectProject(p.id); }}
              >
                {p.name}
              </button>
              {projects.length > 1 && (
                <button
                  className="btn btn-sm btn-danger ms-2 project-delete-btn d-flex align-items-center justify-content-center"
                  title="Eliminar proyecto"
                  style={{padding: '0.375rem'}}
                  onClick={async e => {
                    e.stopPropagation();
                    const result = await Swal.fire({
                      title: '¿Seguro que deseas eliminar este proyecto?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'Sí, eliminar',
                      cancelButtonText: 'Cancelar',
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                    });
                    if(result.isConfirmed){
                      onDeleteProject(p.id);
                      Swal.fire({ icon: 'success', title: 'Proyecto eliminado', timer: 1200, showConfirmButton: false, confirmButtonColor: '#3085d6' });
                    }
                  }}
                >
                  {/* Ícono de tacho de basura SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm2.5-.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 0 0 1H13.5a.5.5 0 0 0 0-1H10.5a.5.5 0 0 1-1-1h-2a.5.5 0 0 1-1 1H2.5z"/>
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="d-flex flex-column gap-2">
          <button onClick={onExport} className="btn btn-success mb-2">Exportar</button>
          <button onClick={() => setShowImport(!showImport)} className="btn btn-warning mb-2">{showImport ? 'Cerrar' : 'Importar'}</button>
          {showImport && (
            <div className="mt-2">
              <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                className="form-control mb-2 bg-white dark:bg-gray-800 text-dark dark:text-light"
              />
              <button onClick={handleImport} className="btn btn-warning w-100">Importar</button>
            </div>
          )}
        </div>
      </aside>
      {/* Fondo oscuro al abrir sidebar en móvil */}
      {sidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-30 d-md-none" style={{background: 'rgba(0,0,0,0.5)'}} onClick={() => setSidebarOpen(false)}></div>
      )}
    </>
  );
};

ProjectSidebar.propTypes = {
  projects: PropTypes.array.isRequired,
  currentProjectId: PropTypes.string.isRequired,
  onSelectProject: PropTypes.func.isRequired,
  onCreateProject: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onDeleteProject: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};
