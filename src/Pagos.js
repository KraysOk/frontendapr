import React from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';

class Pagos extends React.Component {
    state = {
        procesos: [],
        socios: [],
        sociosDelProceso: [],
        nuevoPago: {
            socioId: '',
            cantidad: '',
            fecha: '',
            descripcion: ''
        },
        pagos: [],
        tipoPago: 'efectivo'
    }

    componentDidMount() {
        this.getProcesos();
    }

    fetchSociosWithPagos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/socios-with-pagos'); // Replace with your API endpoint
            this.setState({ socios: response.data });
        } catch (error) {
            console.error(error);
        }
    }


    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            nuevoPago: {
                ...prevState.nuevoPago,
                [name]: value
            }
        }));
    }

    handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            // Suponiendo que la API espera un objeto de pago en el body
            const response = await axios.post('/api/pagos', this.state.nuevoPago);
            if (response.data && response.data.success) {
                // Actualiza la lista de pagos o muestra un mensaje de éxito
                this.setState(prevState => ({
                    pagos: [...prevState.pagos, response.data.pago]
                }));
            } else {
                // Maneja errores, por ejemplo, muestra un mensaje de error
            }
        } catch (error) {
            // Maneja errores, por ejemplo, muestra un mensaje de error
        }
    }

    getProcesos() {
        axios.get('http://localhost:8000/api/procesos')
            .then(response => {
                this.setState({ procesos: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    selectProceso(proceso) {
        this.setState({ selectedProceso: proceso }, () => {  // callback para asegurarnos de que el estado se ha actualizado
            this.getSocios();
    
            if (this.state.selectedSocio) {
                this.getServicios(this.state.selectedSocio.id, proceso.id);
                this.getWaterReading(this.state.selectedSocio.id, proceso.id);
                this.getServiciosPorSocioYProceso();
            }
        });
    }

    getSocios() {
        if (this.state.selectedProceso) {
        axios.get(`http://localhost:8000/api/socio/${this.state.selectedProceso.id}`, {
        })
        .then(response => {
            this.setState({ socios: response.data });
        })
        .catch(error => {
            console.error(error);
        });
        }
    }

    
    handlePagoClick = async (socioId) => {
        try {
            const socio = this.state.socios.find(s => s.id === socioId);
            if (!socio) {
                return; // Handle the case where socio is not found
            }
            console.log(socio);
            const pagoData = {
                socio_id: socioId,
                proceso_id: this.state.selectedProceso.id,
                tipo_pago: socio.selectedTipoPago, 
                monto_total: this.calcularMontoTotal(socioId) // Implementa la función para calcular el monto total
            };

            const response = await axios.post('http://localhost:8000/api/pagos', pagoData);

            if (response.data && response.data.success) {
                // Call getSociosWithPaymentStatus to update the list of socios
                const sociosResponse = await axios.get(`http://localhost:8000/api/socio/${this.state.selectedProceso.id}`);
                const updatedSocios = sociosResponse.data;
    
                this.setState({
                    pagos: [...this.state.pagos, response.data.pago],
                    socios: updatedSocios
                });
            } else {
                // Handle errors, e.g., show an error message
            }
        } catch (error) {
            // Maneja errores, por ejemplo, muestra un mensaje de error
        }
    }

    calcularMontoTotal = (socioId) => {
        const socio = this.state.socios.find(socio => socio.id === socioId);

        if (!socio) {
            return 0; // Retorna 0 en caso de no encontrar el socio
        }

        const montoTotal = socio.costo; // Esto podría incluir los valores de cargoConsumo, cargoFijo y otrosPagos

        return montoTotal;
    }

    calculateTotalFacturado() {
        const totalServicios = this.state.servicios.reduce((acc, servicio) => acc + servicio.valor, 0);
        const totalConsumo = this.state.valorTotal || 0;
        return totalServicios + totalConsumo;
    }

    handleTipoPagoChange = (socioId, event) => {
        const { value } = event.target;
    
        // Update the socio's payment type in the state
        this.setState(prevState => ({
            socios: prevState.socios.map(socio => {
                if (socio.id === socioId) {
                    return { ...socio, selectedTipoPago: value };
                }
                return socio;
            })
        }));
    }
    render() {
        return (
            <Container>
                <h1>Pagos Boleta</h1>

                <h2>Procesos</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Proceso</th>
                            <th>Mes</th>
                            <th>Año</th>
                            <th>Fecha Vencimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.procesos.map(proceso => (
                        <tr key={proceso.id} onClick={() => this.selectProceso(proceso)}>
                            <td style={this.state.selectedProceso && this.state.selectedProceso.id === proceso.id ? { backgroundColor: '#00e7ff' } : {}}>{proceso.id}</td>
                            <td style={this.state.selectedProceso && this.state.selectedProceso.id === proceso.id ? { backgroundColor: '#00e7ff' } : {}}>{proceso.processtype.name}</td>
                            <td style={this.state.selectedProceso && this.state.selectedProceso.id === proceso.id ? { backgroundColor: '#00e7ff' } : {}}>{proceso.mes}</td>
                            <td style={this.state.selectedProceso && this.state.selectedProceso.id === proceso.id ? { backgroundColor: '#00e7ff' } : {}}>{proceso.ano}</td>
                            <td style={this.state.selectedProceso && this.state.selectedProceso.id === proceso.id ? { backgroundColor: '#00e7ff' } : {}}>{proceso.fecha_vencimiento}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <h2>Socios</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Consumo de Agua</th>
                            <th>Cargo Consumo</th>
                            <th>Cargo Fijo</th>
                            <th>Otros Pagos</th>
                            <th>Costo Total</th>
                            <th>Acción</th>
                            <th>Tipo Pago</th>
                            <th>Estado</th> {/* Nuevo encabezado para el botón de pago */}
                            <th>Tipo Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.socios.map(socio => (
                            <tr key={socio.id}>
                                <td>{socio.id}</td>
                                <td>{socio.nombre}</td>
                                <td>{socio.apellido}</td>
                                <td>{socio.consumo}</td>
                                <td>${socio.cargo_consumo}</td>
                                <td>${socio.cargoFijo}</td>
                                <td>${socio.otrosPagos}</td>
                                <td>${socio.costo}</td>
                                <td>
                                    {/* Botón de pago */}
                                    <Button onClick={() => this.handlePagoClick(socio.id)}>Pagar</Button>
                                </td>
                                <td>
                                    <select
                                        value={socio.selectedTipoPago}
                                        onChange={(event) => this.handleTipoPagoChange(socio.id, event)}
                                    >
                                        <option value="efectivo">Efectivo</option>
                                        <option value="tarjeta">Tarjeta de Crédito</option>
                                        <option value="transferencia">Transferencia Bancaria</option>
                                    </select>
                                </td>
                                <td>{socio.estadoPago}</td>
                                <td>{socio.tipoPago}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default Pagos;
