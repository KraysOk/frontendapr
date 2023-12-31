import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

// Importar las páginas aquí
import IngresoSocio from './IngresoSocio';
import IngresoSector from './IngresoSector';
import IngresoServicio from './IngresoServicio';
import IngresoProceso from './IngresoProceso';
import IngresoLectura from './IngresoLectura';
import Pagos from './Pagos';
import Tramos from './Tramos';
import Inicio from './Inicio';


function HomePage() {
    return (
        <Router basename="/apr">
            <div>
                <Navbar bg="light" expand="lg" className='px-3'>
                    <Navbar.Brand className="mx-auto">
                            <Link to="inicio"><span className="text-dark fw-bold text-center">APR</span></Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" style={{ backgroundColor: 'white' }}/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown title={<span className='text-dark'>Procesos</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item><Link to="ingreso-proceso">Procesos</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="ingreso-lectura">Ingreso Lectura</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="pagos">Pagos</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                            </NavDropdown>
                            <NavDropdown title={<span className='text-dark'>Datos Iniciales</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item><Link to="ingreso-sector">Ingreso Sector</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="ingreso-servicio">Ingreso Servicio</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="ingreso-socio">Ingreso Socio</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="tramos">Tramos</Link></NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Container fluid style={{paddingLeft: 0, backgroundColor: "#0000"}}>
                    <div className="d-flex">
                        <div className="p-2" style={{minWidth: "150px", backgroundColor: "#ffff", height: "100vh", color: "#0000"}}>Sidebar</div>
                        <div className="p-2 flex-grow-1 content-container">
                                <Routes>
                                    <Route path="/ingreso-socio" element={<IngresoSocio />} />
                                    <Route path="/ingreso-sector" element={<IngresoSector />} />
                                    <Route path="/ingreso-servicio" element={<IngresoServicio />} />
                                    <Route path="/ingreso-proceso" element={<IngresoProceso />} />
                                    <Route path="/ingreso-lectura" element={<IngresoLectura />} />
                                    <Route path="/pagos" element={<Pagos />} />
                                    <Route path="/tramos" element={<Tramos />} />
                                    <Route path="/inicio" element={<Inicio />} />
                                </Routes>
                        </div>
                    </div>
                </Container>
            </div>
        </Router>
    );
}

export default HomePage;
