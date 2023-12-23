import React from 'react';
import { Container, Form, Button, Table, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import { API_HOST } from './config.js';

class IngresoServicio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: '',
            servicios: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getServicios = this.getServicios.bind(this);
    }

    componentDidMount() {
        this.getServicios();
    }

    getServicios() {
        axios.get(`${API_HOST}/api/servicios`)
            .then(response => {
                this.setState({ servicios: response.data });
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

        const nuevoServicio = {
            item: this.state.item,
        };

        console.log(nuevoServicio);
        
        axios.post(`${API_HOST}/api/servicios`, nuevoServicio)
            .then(response => {
                console.log(response);
                this.getServicios();
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleDelete(servicioId) {
        axios.delete(`${API_HOST}/api/servicios/${servicioId}`)
            .then(response => {
                console.log(response);
                this.getServicios();
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        return (
            <Container>
                <h1>Servicios</h1>
                <Row>
                    <Col>
                        <h3>Ingreso Servicio</h3>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="item">
                                <Form.Label>Item</Form.Label>
                                <Form.Control type="text" placeholder="Item" name="item" value={this.state.item} onChange={this.handleChange} />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Ingresar Servicio
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <h3>Listado de Servicios</h3>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Item</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.servicios.map(servicio => 
                                    <tr key={servicio.id}>
                                        <td>{servicio.id}</td>
                                        <td>{servicio.item}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => this.handleDelete(servicio.id)}>
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

export default IngresoServicio;
