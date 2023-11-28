import React from 'react';
import { Container, Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import SectorEditForm from './SectorEditForm'; // Ajusta la ruta de importación según tu estructura
import { API_HOST } from './config.js';
class IngresoSector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            sectores: [],
            showDeleteModal: false,
            sectorToDelete: null,
            showEditModal: false,
            sectorToEdit: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSectores = this.getSectores.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.hideEditModal = this.hideEditModal.bind(this);
        this.confirmEdit = this.confirmEdit.bind(this);
    }

    componentDidMount() {
        this.getSectores();
    }

    getSectores() {
        axios.get(`${API_HOST}/api/sectores`)
            .then(response => {
                this.setState({ sectores: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post(`${API_HOST}/api/sectores`, this.state)
            .then(response => {
                this.getSectores();
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleDelete(sectorId) {
        axios.delete(`${API_HOST}/api/sectores/${sectorId}`)
            .then(response => {
                this.getSectores();
            })
            .catch(error => {
                console.error(error);
            });
    }

    showDeleteConfirmation(sector) {
        this.setState({ showDeleteModal: true, sectorToDelete: sector });
    }

    hideDeleteConfirmation() {
        this.setState({ showDeleteModal: false, sectorToDelete: null });
    }

    confirmDelete() {
        const { sectorToDelete } = this.state;
        if (sectorToDelete) {
            this.handleDelete(sectorToDelete.id);
        }
        this.hideDeleteConfirmation();
    }

    showEditModal(sector) {
        this.setState({ showEditModal: true, sectorToEdit: sector });
    }

    hideEditModal() {
        this.setState({ showEditModal: false, sectorToEdit: null });
    }

    confirmEdit(updatedSector) {
        const { sectorToEdit } = this.state;
        if (sectorToEdit) {
            axios.put(`${API_HOST}/api/sectores/${sectorToEdit.id}`, updatedSector)
                .then(response => {
                    this.getSectores();
                    this.hideEditModal();
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    render() {
        return (
            <Container>
                <h1>Ingreso Sector</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="nombre" value={this.state.nombre} onChange={this.handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Ingresar Sector
                    </Button>
                </Form>
                <h2>Listado de Sectores</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.sectores.map(sector => (
                            <tr key={sector.id}>
                                <td>{sector.id}</td>
                                <td>{sector.nombre}</td>
                                <td>
                                    <Button variant="danger" onClick={() => this.showDeleteConfirmation(sector)}>
                                        Eliminar
                                    </Button>
                                    <Button variant="warning" onClick={() => this.showEditModal(sector)}>
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal show={this.state.showDeleteModal} onHide={this.hideDeleteConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar Sector</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ¿Está seguro de que desea eliminar este sector?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideDeleteConfirmation}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={this.confirmDelete}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditModal} onHide={this.hideEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Sector</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SectorEditForm
                            sector={this.state.sectorToEdit}
                            onConfirm={this.confirmEdit}
                            onCancel={this.hideEditModal}
                        />
                    </Modal.Body>
                </Modal>
            </Container>
        );
    }
}

export default IngresoSector;
