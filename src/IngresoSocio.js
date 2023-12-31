import React from 'react';
import { Container, Form, Button, Table, Row, Col, Modal } from 'react-bootstrap';  // Importar Row y Col
import axios from 'axios';

import { API_HOST } from './config.js';

class IngresoSocio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            sector_id: '',
            rut: '',
            socios: [],
            sectores: [],
            showMedidorModal: false, // Controla la visibilidad del modal
            medidores: [], // Datos de medidores
            medidorId: '',
            showEditModal: false,
            editedNombre: '',
            editedApellido: '',
            editedEmail: '',
            editedTelefono: '',
            editedSector: '',
            editedSocioId: null,
            editedRut:'',
            showAddModal: false,
            // Nuevos estados para los filtros
            filtroNombre: '',
            filtroSector: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSocios = this.getSocios.bind(this);
        this.getSectores = this.getSectores.bind(this);
    }

    componentDidMount() {
        this.getSocios();
        this.getSectores();
    }

    getSocios() {
        const { filtroNombre, filtroSector } = this.state;

        // Ajusta la URL para incluir los filtros
        let url = `${API_HOST}/api/socio?`;
        if (filtroNombre) {
            url += `nombre=${filtroNombre}&`;
        }
        // Agrega el filtro de sector si está presente y no es el valor predeterminado
        if (filtroSector && filtroSector !== "Seleccione un sector...") {
            url += `sector_id=${filtroSector}&`;
        }

        axios.get(url)
            .then(response => {
                this.setState({ socios: response.data });
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    getSectores() {
        axios.get(`${API_HOST}/api/sectores`)
            .then(response => {
                this.setState({ sectores: response.data });
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        const nuevoSocio = {
            nombre: this.state.nombre,
            apellido: this.state.apellido,
            email: this.state.email,
            telefono: this.state.telefono,
            sector_id: this.state.sector,
            rut: this.state.rut,
        };

        if (!this.validarRutChileno(nuevoSocio.rut)) {
            // Manejar el caso cuando el RUT no es válido (puedes mostrar un mensaje de error, por ejemplo)
            alert('El RUT no es válido. Por favor, ingresá un RUT válido.')
            return;
        }

        console.log(nuevoSocio);
        
        axios.post(`${API_HOST}/api/socio`, nuevoSocio)
            .then(response => {
                console.log(response);
                this.getSocios();
                // manejar la respuesta exitosa aquí
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    handleDelete(socioId) {
        axios.delete(`${API_HOST}/api/socio/${socioId}`)
            .then(response => {
                console.log(response);
                this.getSocios();
                // manejar la respuesta exitosa aquí
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    // Método para abrir el modal de medidores
    handleAddMedidor = (socioId) => {
        this.setState({ showMedidorModal: true, medidorId: '', selectedSocioId: socioId }); // Reiniciar el valor del ID del medidor
        this.getMedidores(socioId);
    }


    // Método para cerrar el modal de medidores
    closeMedidorModal = () => {
        this.setState({ showMedidorModal: false });
    }

    getMedidores = (socioId) => {
    
        axios.get(`${API_HOST}/api/socio/${socioId}/medidores`)
            .then(response => {
                this.setState({ medidores: response.data });
            })
            .catch(error => {
                console.error(error);
                // Maneja el error aquí
            });
    }
    
    // Método para mostrar el modal de eliminación
    showDeleteConfirmation = (socio) => {
        this.setState({ showDeleteModal: true, socioToDelete: socio });
    }

    // Método para ocultar el modal de eliminación
    hideDeleteConfirmation = () => {
        this.setState({ showDeleteModal: false, socioToDelete: null });
    }

    // Método para confirmar la eliminación del socio
    confirmDelete = () => {
        const { socioToDelete } = this.state;
        if (socioToDelete) {
            // Realiza la eliminación aquí
            this.handleDelete(socioToDelete.id);
        }
        this.hideDeleteConfirmation(); // Cierra el modal
    }

    // Nueva función para enviar el formulario de medidor con el ID del socio
    handleAddMedidorSubmit = event => {
        event.preventDefault();

        const { medidorId, selectedSocioId } = this.state; // Obtener los valores del estado

        const nuevoMedidor = {
            numero: medidorId,
            socio_id: selectedSocioId, // Incluir el ID del socio en el objeto del medidor
        };

        // Envía la solicitud para agregar un medidor
        axios.post(`${API_HOST}/api/medidor`, nuevoMedidor)
            .then(response => {
                console.log(response);
                this.getMedidores(selectedSocioId); // Actualizar la lista de medidores
            })
            .catch(error => {
                console.error(error);
                // Manejar el error aquí
            });
    }

    showEditModal = (socio) => {
        this.setState({
            showEditModal: true,
            editedNombre: socio.nombre,
            editedApellido: socio.apellido,
            editedEmail: socio.email,
            editedTelefono: socio.telefono,
            editedSector: socio.sector ? socio.sector.id : '',
            editedSocioId: socio.id,
            editedRut: socio.rut,
        });
    }
    
    closeEditModal = () => {
        this.setState({
            showEditModal: false,
            editedNombre: '',
            editedApellido: '',
            editedEmail: '',
            editedTelefono: '',
            editedSector: '',
            editedSocioId: null,
            editedRut: '',
        });
    }
    
    handleUpdate = () => {
        const { editedSocioId, editedNombre, editedApellido, editedEmail, editedTelefono, editedSector, editedRut } = this.state;
    
        const socioActualizado = {
            nombre: editedNombre,
            apellido: editedApellido,
            email: editedEmail,
            telefono: editedTelefono,
            sector_id: editedSector,
            rut: editedRut
        };
    
        axios.put(`${API_HOST}/api/socio/${editedSocioId}`, socioActualizado)
            .then(response => {
                console.log(response);
                this.getSocios(); // Actualizar la lista de socios después de la edición
                this.closeEditModal(); // Cerrar el modal después de la edición
            })
            .catch(error => {
                console.error(error);
                // Manejar el error aquí
            });
    }
    
    // Función para validar un RUT chileno
    validarRutChileno(rut) {
        // Eliminar puntos y guión del RUT
        const rutLimpio = rut.replace(/[.-]/g, '');
    
        // Separar el cuerpo y el dígito verificador
        const cuerpo = rutLimpio.slice(0, -1);
        const digitoVerificador = rutLimpio.slice(-1).toUpperCase();
    
        // Validar que el cuerpo sea un número válido
        if (!/^[0-9]+$/.test(cuerpo)) {
        return false;
        }
    
        // Calcular el dígito verificador esperado
        let suma = 0;
        let multiplicador = 2;
    
        for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }
    
        const resto = suma % 11;
        const dvEsperado = resto === 0 ? 0 : resto === 1 ? 'K' : 11 - resto;
    
        // Validar que el dígito verificador coincida
        return dvEsperado.toString() === digitoVerificador;
  };

  handleChange(event) {
    const { name, value } = event.target;
  
    if (name === 'rut') {
      this.setState({ [name]: value });
    } else {
      this.setState({ [name]: value });
    }
  }

  showAddModal = () => {
    this.setState({ showAddModal: true });
}

// Método para cerrar el modal de agregar socio
closeAddModal = () => {
    this.setState({ showAddModal: false });
}

    render() {
        return (
            <Container>
                <h1>Socios</h1>
                <Button variant="primary" onClick={this.showAddModal}>
                            Agregar Socio
                </Button>
                <Form>
                        
                        <Form.Group as={Col} controlId="filtroNombre">
                            <Form.Label>Filtrar por Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre" name="filtroNombre" value={this.state.filtroNombre} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="filtroSector">
                            <Form.Label>Filtrar por Sector</Form.Label>
                            <Form.Control as="select" name="filtroSector" value={this.state.filtroSector} onChange={this.handleChange}>
                                <option>Seleccione un sector...</option>
                                {this.state.sectores.map(sector =>
                                    <option key={sector.id} value={sector.id}>{sector.nombre}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        
                    <Button variant="primary" onClick={this.getSocios}>
                        Aplicar Filtros
                    </Button>
                </Form>
                <Row>
                    <Col>
                        <h3>Listado de Socios</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>RUT</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Sector</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.socios.map(socio => 
                                    <tr key={socio.id}>
                                        <td>{socio.rut}</td>
                                        <td>{socio.nombre}</td>
                                        <td>{socio.apellido}</td>
                                        <td>{socio.email}</td>
                                        <td>{socio.telefono}</td>
                                        <td>{socio.sector && socio.sector.nombre}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => this.showDeleteConfirmation(socio)}>
                                                Eliminar
                                            </Button>
                                            <Button variant="primary" onClick={() => this.handleAddMedidor(socio.id)}>
                                                Agregar Medidor
                                            </Button>
                                            <Button variant="warning" onClick={() => this.showEditModal(socio)}>
                                                Editar
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Modal show={this.state.showMedidorModal} onHide={this.closeMedidorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Medidores del Socio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Listado de medidores */}
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Numero</th> {/* Agrega los nombres de los campos que tiene tu medidor */}
                                    {/* ... Otros encabezados según los campos de tu modelo de medidor ... */}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.medidores.map(medidor => 
                                    <tr key={medidor.id}>
                                        <td>{medidor.id}</td>
                                        <td>{medidor.numero}</td> 
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <h3>Agregar Nuevo Medidor</h3>
                        <Form onSubmit={this.handleAddMedidorSubmit}>
                            <Form.Group controlId="medidorId">
                                <Form.Label>ID del Medidor</Form.Label>
                                <Form.Control type="text" placeholder="ID del Medidor" name="medidorId" value={this.state.medidorId} onChange={this.handleChange} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Agregar Medidor
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Modal para confirmación de eliminación */}
                <Modal show={this.state.showDeleteModal} onHide={this.hideDeleteConfirmation}>
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar Socio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ¿Está seguro de que desea eliminar a este socio?
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
                <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Socio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="editedNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre"
                                    name="editedNombre"
                                    value={this.state.editedNombre}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editedApellido">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Apellido"
                                    name="editedApellido"
                                    value={this.state.editedApellido}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editedEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    name="editedEmail"
                                    value={this.state.editedEmail}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editedTelefono">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Teléfono"
                                    name="editedTelefono"
                                    value={this.state.editedTelefono}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="editedSector">
                                <Form.Label>Sector</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="editedSector"
                                    value={this.state.editedSector}
                                    onChange={this.handleChange}
                                >
                                    <option>Seleccione un sector...</option>
                                    {this.state.sectores.map(sector => (
                                        <option key={sector.id} value={sector.id}>
                                            {sector.nombre}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeEditModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={this.handleUpdate}>
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Socio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="editedNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre"
                                    name="editedNombre"
                                    value={this.state.editedNombre}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="editedApellido">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Apellido"
                                    name="editedApellido"
                                    value={this.state.editedApellido}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="editedEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    name="editedEmail"
                                    value={this.state.editedEmail}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="editedTelefono">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Teléfono"
                                    name="editedTelefono"
                                    value={this.state.editedTelefono}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="editedRut">
                                <Form.Label>Rut</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Rut"
                                    name="editedRut"
                                    value={this.state.editedRut}
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="editedSector">
                                <Form.Label>Sector</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="editedSector"
                                    value={this.state.editedSector}
                                    onChange={this.handleChange}
                                >
                                    <option>Seleccione un sector...</option>
                                    {this.state.sectores.map(sector => (
                                        <option key={sector.id} value={sector.id}>
                                            {sector.nombre}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeEditModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={this.handleUpdate}>
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Modal>

                                {/* Modal de Agregar Socio */}
                                <Modal show={this.state.showAddModal} onHide={this.closeAddModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Socio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="rut">
                                <Form.Label>RUT</Form.Label>
                                <Form.Control type="text" placeholder="RUT" name="rut" value={this.state.rut} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" placeholder="Nombre" name="nombre" value={this.state.nombre} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="apellido">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control type="text" placeholder="Apellido" name="apellido" value={this.state.apellido} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="telefono">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="text" placeholder="Teléfono" name="telefono" value={this.state.telefono} onChange={this.handleChange} />
                            </Form.Group>

                            <Form.Group controlId="sector">
                                <Form.Label>Sector</Form.Label>
                                <Form.Control as="select" name="sector" value={this.state.sector} onChange={this.handleChange}>
                                    <option>Seleccione un sector...</option>
                                    {this.state.sectores.map(sector =>
                                        <option key={sector.id} value={sector.id}>{sector.nombre}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Ingresar Socio
                            </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeAddModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Ingresar Socio
                        </Button>
                    </Modal.Footer>
                </Modal>


            </Container>
        );
    }
}

export default IngresoSocio;
