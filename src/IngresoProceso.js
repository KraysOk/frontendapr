import React from 'react';
import { Container, Form, Button, Table, Row, Col,Modal  } from 'react-bootstrap';
import axios from 'axios';

import { API_HOST } from './config.js';

class IngresoProceso extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tipo_proceso: '',
            fecha_emision: '',
            fecha_vencimiento: '',
            mes: '',
            ano: '',
            procesos: [],
            tiposProceso: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getProcesos = this.getProcesos.bind(this);
        this.getTiposProceso = this.getTiposProceso.bind(this);
    }

    componentDidMount() {
        this.getProcesos();
        this.getTiposProceso();
    }

    getProcesos() {
        axios.get(`${API_HOST}/api/procesos`)
            .then(response => {
                this.setState({ procesos: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    getTiposProceso() {
        axios.get(`${API_HOST}/api/tipos-proceso`)
            .then(response => {
                this.setState({ tiposProceso: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const nuevoProceso = {
            tipo_proceso_id: this.state.tipo_proceso,
            fecha_emision: this.state.fecha_emision,
            fecha_vencimiento: this.state.fecha_vencimiento,
            mes: this.state.mes,
            ano: this.state.ano,
        };

        console.log(nuevoProceso);
        
        axios.post(`${API_HOST}/api/procesos`, nuevoProceso)
            .then(response => {
                console.log(response);
                this.getProcesos();
            })
            .catch(error => {
                console.error(error);
            });
    }

        // Función para mostrar el modal
        handleShowModal = () => {
            this.setState({ showModal: true });
        }
    
        // Función para ocultar el modal
        handleCloseModal = () => {
            this.setState({ showModal: false, nuevoTipo: '', error: null });
        }
    
        // Función para manejar el envío del formulario en el modal
        handleModalSubmit = () => {
            const { nuevoTipo } = this.state;
    
            // Validación simple: asegurarse de que el tipo no esté vacío
            if (nuevoTipo.trim() === '') {
                this.setState({ error: "El nombre del tipo no puede estar vacío." });
                return;
            }
    
            // Envía el nuevo tipo a la API
            axios.post(`${API_HOST}/api/tipos-proceso`, { name: nuevoTipo })
                .then(response => {
                    console.log(response);
                    this.handleCloseModal();
                    this.getTiposProceso();
                })
                .catch(error => {
                    this.setState({ error: "Hubo un error al agregar el nuevo tipo." });
                    console.error(error);
                });
        }

    render() {
        return (
            <Container>
                <h1>Procesos</h1>
                <Row>
                    <Col>
                        <h3>Ingreso Proceso</h3>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="tipo_proceso">
                                <Form.Label>Tipo de Proceso</Form.Label>
                                <Form.Control as="select" name="tipo_proceso" value={this.state.tipo_proceso} onChange={this.handleChange}>
                                    <option>Seleccione un tipo...</option>
                                    {this.state.tiposProceso.map(tipo =>
                                        <option key={tipo.id} value={tipo.id}>{tipo.name}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleShowModal}>
                                Añadir nuevo tipo de proceso
                            </Button>

                            <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Añadir tipo de proceso</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group controlId="nuevoTipo">
                                        <Form.Label>Nombre del Tipo</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Ej. Pago Mensual" 
                                            name="nuevoTipo" 
                                            value={this.state.nuevoTipo} 
                                            onChange={this.handleChange} />
                                        {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.handleCloseModal}>
                                        Cerrar
                                    </Button>
                                    <Button variant="primary" onClick={this.handleModalSubmit}>
                                        Añadir
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Form.Group controlId="fecha_emision">
                                <Form.Label>Fecha de Emisión</Form.Label>
                                <Form.Control type="date" name="fecha_emision" value={this.state.fecha_emision} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="fecha_vencimiento">
                                <Form.Label>Fecha de Vencimiento</Form.Label>
                                <Form.Control type="date" name="fecha_vencimiento" value={this.state.fecha_vencimiento} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="mes">
                                <Form.Label>Mes</Form.Label>
                                <Form.Control type="number" name="mes" value={this.state.mes} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="ano">
                                <Form.Label>Año</Form.Label>
                                <Form.Control type="number" name="ano" value={this.state.ano} onChange={this.handleChange} />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Ingresar Proceso
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="mt-5"> {/* Added a top margin for spacing */}
                    <Col>
                        <h3>Lista de Procesos</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tipo de Proceso</th>
                                    <th>Fecha de Emisión</th>
                                    <th>Fecha de Vencimiento</th>
                                    <th>Mes</th>
                                    <th>Año</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.procesos.map(proceso => (
                                    <tr key={proceso.id}>
                                        <td>{proceso.id}</td>
                                        <td>{proceso.processtype.name}</td>
                                        <td>{proceso.fecha_emision}</td>
                                        <td>{proceso.fecha_vencimiento}</td>
                                        <td>{proceso.mes}</td>
                                        <td>{proceso.ano}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default IngresoProceso;
