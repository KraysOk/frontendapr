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

function HomePage() {
    return (
        <Router>
            <div>
                <Navbar bg="dark" expand="lg">
                    <Navbar.Brand href="#home">
                        <span className="text-white fw-bold mx-auto">APR</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" style={{ backgroundColor: 'white' }}/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home" className='text-white'>Inicio</Nav.Link>
                            <Nav.Link href="#link" className='text-white'>Link</Nav.Link>
                            <NavDropdown title={<span className='text-white'>Procesos</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item><Link to="ingreso-proceso">Procesos</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="ingreso-lectura">Ingreso Lectura</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="pagos">Pagos</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                            </NavDropdown>
                            <NavDropdown title={<span className='text-white'>Datos Iniciales</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item><Link to="ingreso-socio">Ingreso Socio</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="ingreso-sector">Ingreso Sector</Link></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item><Link to="ingreso-servicio">Ingreso Servicio</Link></NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Container fluid style={{paddingLeft: 0}}>
                    <div className="d-flex">
                        <div className="p-2" style={{minWidth: "150px", backgroundColor: "#212529", height: "100vh", color: "#fff"}}>Sidebar</div>
                        <div className="p-2 flex-grow-1">
                                <Routes>
                                    <Route path="/ingreso-socio" element={<IngresoSocio />} />
                                    <Route path="/ingreso-sector" element={<IngresoSector />} />
                                    <Route path="/ingreso-servicio" element={<IngresoServicio />} />
                                    <Route path="/ingreso-proceso" element={<IngresoProceso />} />
                                    <Route path="/ingreso-lectura" element={<IngresoLectura />} />
                                    <Route path="/pagos" element={<Pagos />} />
                                </Routes>
                        </div>
                    </div>
                </Container>
            </div>
            </Router>
    );
}

export default HomePage;
