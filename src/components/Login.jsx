import { useState } from 'react';

import PropTypes from 'prop-types';
import swasLogo from '../assets/swas-logo.svg';

export default function Login({ onLogin, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    onLogin(email, password, setError);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white dark:bg-gray-800 d-flex flex-column align-items-center" style={{minWidth:320, maxWidth:400}}>
        <img
          src={swasLogo}
          alt="SWAS Logo"
          style={{ width: '60%', maxWidth: 180, minWidth: 90, height: 'auto', marginBottom: 18, filter: 'drop-shadow(0 2px 12px #0d6efd33)', display: 'block' }}
          draggable={false}
        />
        <h2 className="mb-4 text-center w-100">Iniciar sesión</h2>
        <div className="mb-3 w-100">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
        </div>
        <div className="mb-3 w-100">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div className="alert alert-danger py-1 w-100">{error}</div>}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
