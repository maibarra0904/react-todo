import PropTypes from "prop-types";
import { useState } from "react";

export const ProjectSelector = ({ projects, currentProjectId, onSelectProject, onCreateProject, onExport, onImport }) => {
ProjectSelector.propTypes = {
  projects: PropTypes.array.isRequired,
  currentProjectId: PropTypes.string.isRequired,
  onSelectProject: PropTypes.func.isRequired,
  onCreateProject: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
};
  const [newProjectName, setNewProjectName] = useState("");
  const [importData, setImportData] = useState("");

  const handleCreate = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName("");
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      onImport(data);
      setImportData("");
    } catch {
      alert("JSON inválido");
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2 items-center">
        <select
          value={currentProjectId || ""}
          onChange={e => onSelectProject(e.target.value)}
          className="rounded px-2 py-1"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nuevo proyecto"
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          className="rounded px-2 py-1"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-2 py-1 rounded">Crear</button>
        <button onClick={onExport} className="bg-green-500 text-white px-2 py-1 rounded">Exportar</button>
      </div>
      <div className="flex gap-2 items-center">
        <textarea
          placeholder="Pega aquí el JSON para importar"
          value={importData}
          onChange={e => setImportData(e.target.value)}
          className="rounded px-2 py-1 w-full"
        />
        <button onClick={handleImport} className="bg-yellow-500 text-white px-2 py-1 rounded">Importar</button>
      </div>
    </div>
  );
};
