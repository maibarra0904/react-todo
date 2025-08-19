import PropTypes from "prop-types";
import { useRef, useState } from "react";

export const DataSidebar = ({ onExport, onImport, dataSidebarOpen, setDataSidebarOpen }) => {
  const fileInputRef = useRef();
  const [showImport, setShowImport] = useState(false);

  const handleImport = () => {
    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onImport(data);
        } catch (err) {
          alert('Archivo inválido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <button
        className={`btn border-0 sidebar-toggle-btn d-flex align-items-center justify-content-center ${dataSidebarOpen ? '' : 'collapsed'}`}
        style={{
          width: '44px',
          height: '80px',
          borderTopLeftRadius: '1.5rem',
          borderBottomLeftRadius: '1.5rem',
          background: 'linear-gradient(135deg, #6c757d 60%, #adb5bd 100%)',
          boxShadow: '0 4px 24px 0 rgba(108,117,125,0.25), 0 -1.5px 0 0 #fff inset',
          outline: '3px solid #fff',
          outlineOffset: '-2px',
          padding: 0,
          marginTop: 0,
          marginBottom: 0,
          position: 'fixed',
          right: 0,
          left: 'auto',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
        }}
        onClick={() => setDataSidebarOpen(!dataSidebarOpen)}
        aria-label={dataSidebarOpen ? 'Ocultar menú datos' : 'Mostrar menú datos'}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(108,117,125,0.45), 0 -1.5px 0 0 #fff inset'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(108,117,125,0.25), 0 -1.5px 0 0 #fff inset'}
      >
        <span style={{
          fontSize: 32,
          color: '#fff',
          textShadow: '0 0 8px #adb5bd, 0 0 2px #6c757d',
          transition: 'transform 0.3s, text-shadow 0.2s',
          transform: dataSidebarOpen ? 'rotate(180deg)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Ícono de base de datos */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
            <ellipse cx="16" cy="8" rx="12" ry="5" fill="#adb5bd"/>
            <rect x="4" y="8" width="24" height="16" rx="8" fill="#dee2e6"/>
            <ellipse cx="16" cy="24" rx="12" ry="5" fill="#adb5bd"/>
          </svg>
          <span style={{position:'absolute',left:0,right:0,bottom:8,fontSize:13,fontWeight:600,letterSpacing:'1px',color:'#fff',textShadow:'0 1px 4px #6c757d88',textAlign:'center'}}>Data</span>
        </span>
      </button>
      {/* Sidebar de datos */}
      <aside
        className={`fixed right-0 top-0 shadow-lg d-flex flex-column p-3 z-40 transition-all duration-300 bg-white dark:bg-gray-900
          ${dataSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ minWidth: '16rem', maxWidth: '100vw', width: '18rem', height: '100dvh', background: 'inherit', transition: 'transform 0.3s' }}
      >
        <h2 className="fs-5 fw-bold mb-4 text-dark dark:text-light">Gestión de datos</h2>
        <div className="alert alert-info" style={{fontSize:'0.97rem'}}>
          <b>Guía de importación/exportación:</b>
          <ul className="mb-1 mt-2 ps-3">
            <li>La exportación descarga un archivo JSON con todos tus proyectos y tareas.</li>
            <li>Para importar, selecciona un archivo JSON previamente exportado desde esta app.</li>
            <li>El respaldo debe pertenecer al mismo usuario activo.</li>
            <li>La importación reemplazará todos los proyectos actuales.</li>
          </ul>
        </div>
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
      {dataSidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-30 d-md-none" style={{background: 'rgba(0,0,0,0.5)'}} onClick={() => setDataSidebarOpen(false)}></div>
      )}
    </>
  );
};

DataSidebar.propTypes = {
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  dataSidebarOpen: PropTypes.bool.isRequired,
  setDataSidebarOpen: PropTypes.func.isRequired,
};
