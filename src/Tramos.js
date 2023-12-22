import React from 'react';
import { Container, Form, Button, Table, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { API_HOST } from './config.js';
import SectorEditForm from './SectorEditForm.js';

class Tramos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tramos: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.getTramos();
    }

    // Recuperar la lista de tramos desde el backend
    getTramos() {
        axios.get(`${API_HOST}/api/tramos`)
            .then(response => {
                this.setState({ tramos: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    addTramo() {
        // Parsea los valores de inicio y fin como números enteros
        const inicio = parseInt(this.state.inicioTramo, 10);
        const fin = parseInt(this.state.finTramo, 10);
        const valor = parseInt(this.state.valorTramo, 10);
    
        // Verifica si los valores son enteros positivos
        if (!isNaN(inicio) && !isNaN(fin) && !isNaN(valor) && inicio >= 0 && fin >= 0 && valor >= 0) {
            // Verifica si hay algún tramo existente que se superpone con el nuevo tramo
            const tramosSuperpuestos = this.state.tramos.some(tramo => {
                const tramoInicio = parseInt(tramo.inicio, 10);
                const tramoFin = parseInt(tramo.fin, 10);
                
                return (
                    // Comprueba si el inicio del nuevo tramo está dentro de un tramo existente
                    (inicio >= tramoInicio && inicio <= tramoFin) ||
                    // Comprueba si el fin del nuevo tramo está dentro de un tramo existente
                    (fin >= tramoInicio && fin <= tramoFin) ||
                    // Comprueba si el nuevo tramo envuelve completamente a un tramo existente
                    (inicio <= tramoInicio && fin >= tramoFin)
                );
            });
    
            if (!tramosSuperpuestos) {
                axios.post(`${API_HOST}/api/tramos`, {
                    nombre: this.state.nombreTramo,
                    inicio: inicio,
                    fin: fin,
                    valor: valor
                })
                .then(response => {
                    this.getTramos(); // Refresca la lista de tramos después de agregar uno
                    this.setState({ // Limpia los campos del formulario
                        nombreTramo: '',
                        inicioTramo: '',
                        finTramo: '',
                        valorTramo: ''
                    });
                    alert("Tramo agregado exitosamente.");
                })
                .catch(error => {
                    console.error(error);
                });
            } else {
                alert("El nuevo tramo se superpone con tramos existentes. Por favor, elige valores de inicio y fin que no se superpongan.");
            }
        } else {
            alert("Los valores de inicio, fin y valor deben ser enteros positivos.");
        }
    }
    

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        
        axios.post(`${API_HOST}/api/sectores`, this.state)
            .then(response => {
                console.log(response);
                this.getSectores();
                // manejar la respuesta exitosa aquí
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    handleDelete(sectorId) {
        axios.delete(`${API_HOST}/api/sectores/${sectorId}`)
            .then(response => {
                console.log(response);
                this.getSectores();
                // manejar la respuesta exitosa aquí
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }
        
    // Método para mostrar el modal de eliminación
    showDeleteConfirmation = (sector) => {
        this.setState({ showDeleteModal: true, sectorToDelete: sector });
    }

    // Método para ocultar el modal de eliminación
    hideDeleteConfirmation = () => {
        this.setState({ showDeleteModal: false, sectorToDelete: null });
    }

    // Método para confirmar la eliminación del sector
    confirmDelete = () => {
        const { sectorToDelete } = this.state;
        if (sectorToDelete) {
            this.handleDelete(sectorToDelete.id);
        }
        this.hideDeleteConfirmation();
    }

    // Método para mostrar el modal de edición
    showEditModal = (sector) => {
        this.setState({ showEditModal: true, sectorToEdit: sector });
    }

    // Método para ocultar el modal de edición
    hideEditModal = () => {
        this.setState({ showEditModal: false, sectorToEdit: null });
    }

    // Método para confirmar la edición del sector
    confirmEdit = (updatedSector) => {
        // Realiza la solicitud para actualizar el sector con los datos de updatedSector
        // Después de actualizar, actualiza la lista de sectores y oculta el modal
        // Asegúrate de que `this` se refiera a la instancia de la clase
        const { sectorToEdit } = this.state.sectorToEdit;
    
        if (sectorToEdit) {
            axios.put(`${API_HOST}/api/sectores/${sectorToEdit.id}`, updatedSector)
                .then(response => {
                    console.log(response);
                    this.getSectores(); // Actualiza la lista después de la edición
                    this.hideEditModal(); // Oculta el modal de edición
                })
                .catch(error => {
                    console.error(error);
                    // manejar el error aquí
                });
        }
    }

    deleteTramo(tramoId) {
        // Realiza la solicitud para eliminar el tramo con el ID tramoId
        // Después de eliminar, actualiza la lista de tramos
        axios.delete(`${API_HOST}/api/tramos/${tramoId}`)
            .then(response => {
                console.log(response);
                this.getTramos(); // Actualiza la lista después de la eliminación
                alert("Tramo eliminado exitosamente.");
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    render() {
        return (
            <Container>
            <Row>
                {/* ... otras columnas ... */}
                <Col md={6}>
                    {/* Listado de Tramos */}
                    <h2>Tramos</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tramos.map(tramo => (
                                <tr key={tramo.id}>
                                    <td>{tramo.id}</td>
                                    <td>{tramo.inicio}</td>
                                    <td>{tramo.fin}</td>
                                    <td>{tramo.valor}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => this.deleteTramo(tramo.id)}>
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Formulario para agregar tramos */}
                    <h3>Agregar Nuevo Tramo</h3>
                    <Form onSubmit={e => { e.preventDefault(); this.addTramo(); }}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Inicio:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={this.state.inicioTramo}
                                    onChange={e => this.setState({ inicioTramo: e.target.value })}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Fin:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={this.state.finTramo}
                                    onChange={e => this.setState({ finTramo: e.target.value })}
                                />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>Valor:</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={this.state.valorTramo}
                                    onChange={e => this.setState({ valorTramo: e.target.value })}
                                />
                            </Col>
                        </Row>
                        <Button type="submit">Agregar Tramo</Button>
                    </Form>
                </Col>
            </Row>

            </Container>
        );
    }
}

export default Tramos;
