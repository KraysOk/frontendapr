import React from 'react';
import { Container, Form, Button, Table, Row, Col } from 'react-bootstrap';  // Importar Row y Col
import axios from 'axios';

class IngresoSocio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            sector_id: '',
            socios: [],
            sectores: [],
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
        axios.get('http://apiapr.lucasbravopy.cl/api/socio')
            .then(response => {
                this.setState({ socios: response.data });
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    getSectores() {
        axios.get('http://apiapr.lucasbravopy.cl/api/sectores')
            .then(response => {
                this.setState({ sectores: response.data });
            })
            .catch(error => {
                console.error(error);
                // manejar el error aquí
            });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
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
        };

        console.log(nuevoSocio);
        
        axios.post('http://apiapr.lucasbravopy.cl/api/socio', nuevoSocio)
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
        axios.delete(`http://apiapr.lucasbravopy.cl/api/socio/${socioId}`)
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
    

    render() {
        return (
            <Container>
                <h1>Socios</h1>
                <Row>
                    <Col>
                        <h3>Ingreso Socio</h3>
                        <Form onSubmit={this.handleSubmit}>
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
                    </Col>
                    <Col>
                        <h3>Listado de Socios</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
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
                                        <td>{socio.nombre}</td>
                                        <td>{socio.apellido}</td>
                                        <td>{socio.email}</td>
                                        <td>{socio.telefono}</td>
                                        <td>{socio.sector && socio.sector.nombre}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => this.handleDelete(socio.id)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default IngresoSocio;
