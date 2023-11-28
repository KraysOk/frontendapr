import React from 'react';
import { Form, Button } from 'react-bootstrap';

class SectorEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: props.sector ? props.sector.nombre : '',
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleConfirm = () => {
        if (this.props.onConfirm) {
            this.props.onConfirm(this.state);
        }
    }

    render() {
        return (
            <Form>
                <Form.Group controlId="nombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nombre"
                        name="nombre"
                        value={this.state.nombre}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Button variant="success" onClick={this.handleConfirm}>
                    Guardar Cambios
                </Button>
                <Button variant="secondary" onClick={this.props.onCancel}>
                    Cancelar
                </Button>
            </Form>
        );
    }
}

export default SectorEditForm;
