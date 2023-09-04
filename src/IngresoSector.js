import React from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

class IngresoSector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codigo: '',
            nombre: '',
            sectores: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getSectores = this.getSectores.bind(this);
    }

    componentDidMount() {
        this.getSectores();
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
        
        axios.post('http://apiapr.lucasbravopy.cl/api/sectores', this.state)
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
    

    render() {
        return (
            <Container>
                <h1>Ingreso Sector</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="codigo">
                        <Form.Label>Código</Form.Label>
                        <Form.Control type="text" placeholder="Código" name="codigo" value={this.state.codigo} onChange={this.handleChange} />
                    </Form.Group>

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
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.sectores.map(sector => 
                            <tr key={sector.id}>
                                <td>{sector.codigo}</td>
                                <td>{sector.nombre}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default IngresoSector;
