// Inicio.js
import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    return (
        <div>
        <h1>Inicio</h1>
        <div className="d-flex justify-content-center">
          <div className="mx-2">
            <Link to="/ingreso-socio" className="btn btn-primary">
              Socios
            </Link>
          </div>
          <div className="mx-2">
            <Link to="/pagos" className="btn btn-primary">
              Pagos
            </Link>
          </div>
          <div className="mx-2">
            <Link to="/ingreso-lectura" className="btn btn-primary">
              Lectura
            </Link>
          </div>
          <div className="mx-2">
            <Link to="/tramos" className="btn btn-primary">
              Tramos
            </Link>
          </div>
        </div>
      </div>
    );
};

export default Inicio;