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


function HomePage() {
    return (
        <Router basename="/apr">
            <div>
                <Navbar bg="light" expand="lg" className='px-3'>
                    <Navbar.Brand href="#home" className="mx-auto">
                        <span className="text-dark fw-bold text-center">APR</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" style={{ backgroundColor: 'white' }}/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home" className='text-dark'>Inicio</Nav.Link>
                            <Nav.Link href="#link" className='text-dark'>Link</Nav.Link>
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
                                </Routes>
                        </div>
                    </div>
                </Container>
            </div>
        </Router>
    );
}

export default HomePage;
