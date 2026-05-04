import { useState } from 'react';
import PropTypes from 'prop-types';
import swasLogo from '../assets/swas-logo.svg';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ onLogin, loading }) {
  const [error, setError] = useState('');

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light dark:bg-gray-900">
      <div className="p-4 rounded shadow bg-white dark:bg-gray-800 d-flex flex-column align-items-center" style={{minWidth:320, maxWidth:400}}>
        <img
          src={swasLogo}
          alt="SWAS Logo"
          style={{ width: '60%', maxWidth: 180, minWidth: 90, height: 'auto', marginBottom: 18, filter: 'drop-shadow(0 2px 12px #0d6efd33)', display: 'block' }}
          draggable={false}
        />
        <h2 className="mb-4 text-center w-100">Iniciar sesión</h2>
        
        {error && <div className="alert alert-danger py-1 w-100">{error}</div>}
        
        <div className="d-flex justify-content-center w-100 mb-3 mt-2">
          {loading ? (
            <button className="btn btn-primary w-100" disabled>
              Ingresando...
            </button>
          ) : (
            <GoogleLogin 
              onSuccess={credentialResponse => {
                if(onLogin) onLogin(credentialResponse, setError);
              }}
              onError={() => setError('Error al iniciar sesión con Google')}
            />
          )}
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <a 
              href={`${import.meta.env.VITE_FRONTEND_URL}/register`} 
              style={{ color: '#007bff', textDecoration: 'underline' }}
              target="_blank" 
              rel="noopener noreferrer"
            >
              ¿No tienes cuenta? Regístrate aquí
            </a>
          </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
