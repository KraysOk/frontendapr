import React from 'react';
import { Container, Table, Row, Col, Form, Button  } from 'react-bootstrap';
import axios from 'axios';

import { API_HOST } from './config.js';

class IngresoLectura extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            procesos: [],
            socios: [],
            selectedSocio: null,
            selectedProceso: null,
            servicios: [],
            serviciosDisponibles: [],
            servicioSeleccionado: null,
            waterReading: null,
            tramos: [],
            inicioTramo: '',
            finTramo: '',
            valorTramo: '',
            tramoActual: null,
            valorTotal: 0,
            showForm: false, // Para mostrar u ocultar el formulario
            newProceso: {    // Datos del nuevo proceso
                id: '',
                processtype: { name: '' },
                mes: '',
                ano: '',
                fecha_vencimiento: ''
            }
        };
    }

    componentDidMount() {
        this.getProcesos();
        this.getSocios();
        this.getServiciosDisponibles();
        this.getTramos();
        this.getServiciosPorSocioYProceso();
    }

    determineTramo(consumo) {
        console.log("determino tramo inicio");
        let tramoCorrespondiente = null;
        let cost = 0;
        this.state.tramos.forEach(tramo => {
            if (consumo >= tramo.inicio && consumo <= tramo.fin) {
                tramoCorrespondiente = tramo;
                cost = consumo * tramo.valor;
            }
        });
        console.log("determino tramo fin");
        this.setState({ tramoActual: tramoCorrespondiente, valorTotal: cost });
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

    // Agregar un nuevo tramo
    addTramo() {
        axios.post(`${API_HOST}/api/tramos`, {
            nombre: this.state.nombreTramo,
            inicio: this.state.inicioTramo,
            fin: this.state.finTramo,
            valor: this.state.valorTramo
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
    }

    getServiciosDisponibles() {
        axios.get(`${API_HOST}/api/servicios`)
            .then(response => {
                this.setState({ serviciosDisponibles: response.data });
            })
            .catch(error => {
                console.error(error);
            });
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

    getSocios() {
        if (this.state.selectedProceso) {
        axios.get(`${API_HOST}/api/socio/${this.state.selectedProceso.id}`, {
        })
        .then(response => {
            this.setState({ socios: response.data });
        })
        .catch(error => {
            console.error(error);
        });
        }
    }

    selectSocio(socio) {
        console.log(socio);
        this.setState({ selectedSocio: socio });
        this.getServicios(socio.id);
        if (this.state.selectedProceso) {
            this.getServicios(socio.id, this.state.selectedProceso.id);
            this.getWaterReading(socio.id, this.state.selectedProceso.id);
            this.getServiciosPorSocioYProceso();
        }
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

    getServicios(socioId, procesoId) {
        axios.get(`${API_HOST}/api/proceso/${procesoId}/socio/${socioId}/servicios`)
            .then(response => {
                this.setState({ servicios: response.data });
            })
            .catch(error => {
                console.error(error);
            });
    }

    addServiceValue(serviceId, value) {
        // Aquí realizarías la llamada POST a la API
        axios.post(`${API_HOST}/api/servicio/addValue`, {
            servicioId: serviceId,
            valor: value
        })
        .then(response => {
            // Aquí puedes manejar la respuesta del servidor después de agregar el valor
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }

    addWaterReading = async () => {
        // Validaciones básicas antes de enviar
        if (!this.state.selectedSocio) {
            alert("Por favor, selecciona un socio primero.");
            return;
        }
        // Validaciones básicas antes de enviar
        if (!this.state.selectedProceso) {
            alert("Por favor, selecciona un proceso primero.");
            return;
        }
    
        if (!this.state.consumptionValue) {
            alert("Por favor, ingresa un valor de consumo.");
            return;
        }
    
        try {
            const response = await axios.post(`${API_HOST}/api/lectura-agua`, { // Asume que tienes una ruta en tu API para esto
                socio_id: this.state.selectedSocio.id, // Supongo que el backend necesita el ID del socio
                consumption_value: this.state.consumptionValue,
                proceso_id: this.state.selectedProceso.id,
            });
    
            if (response.data && response.status === 201) {
                this.setState({ consumptionValue: '' }); // Limpiar el input después de un envío exitoso
                this.getWaterReading(this.state.selectedSocio.id, this.state.selectedProceso.id);
                alert("Lectura de agua agregada exitosamente!");
            } else {
                alert("Hubo un problema al agregar la lectura de agua.");
            }
        } catch (error) {
            console.error("Error al agregar lectura de agua:", error);
            alert("Hubo un error al enviar la lectura. Por favor, inténtalo de nuevo.");
        }
    }

    getWaterReading(socioId, procesoId) {
        axios.get(`${API_HOST}/api/lectura-agua/socio/${socioId}/proceso/${procesoId}`)
            .then(response => {
                this.setState({ waterReading: response.data });

                // Determinar el tramo
                this.determineTramo(response.data.consumption_value);
            })
            .catch(error => {
                this.setState({ waterReading: null });
                console.error(error);
            });
    }

    
    handleInputChange = (e, key) => {
        this.setState({
            nuevoTramo: {
                ...this.state.nuevoTramo,
                [key]: e.target.value
            }
        });
    }

    handleNewServiceChange(event, field) {
    this.setState({
        [field]: event.target.value
    });
}

addNewService() {
    const { servicioSeleccionado, newServiceValue } = this.state;

    if (!servicioSeleccionado || !newServiceValue) {
        alert('Por favor, asegúrate de seleccionar un servicio y proporcionar un valor.');
        return;
    }

    const dataToSend = {
        servicio_id: servicioSeleccionado,
        socio_id: this.state.selectedSocio.id,
        proceso_id: this.state.selectedProceso.id,
        valor: newServiceValue
    };

    fetch(`${API_HOST}/api/socio-servicio-proceso`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Si estás usando autenticación, como un token, deberías agregarlo aquí.
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.success) {
            alert('Servicio agregado con éxito!');
            // Puedes resetear el estado o realizar otras acciones aquí si lo necesitas.
            this.setState({
                servicioSeleccionado: '',
                newServiceValue: ''
            });
        } else {
            alert('Hubo un error al agregar el servicio.');
        }
    })
    .catch(error => {
        console.error('Hubo un error al intentar comunicarse con la API:', error);
    });
}

getServiciosPorSocioYProceso() {
    console.log("ejecuto get socio servicio proceso");
    const { selectedSocio, selectedProceso } = this.state;

    if (!selectedSocio || !selectedProceso) return;  // No continuar si no hay socio y proceso seleccionados

    fetch(`${API_HOST}/api/socio/${selectedProceso.id}/${selectedSocio.id}`)
        .then(response => response.json())
        .then(data => {
            this.setState({ servicios: data });
        })
        .catch(error => {
            console.error('Error al obtener los servicios:', error);
        });
}

calculateTotalFacturado() {
    const totalServicios = this.state.servicios.reduce((acc, servicio) => acc + servicio.valor, 0);
    const totalConsumo = this.state.valorTotal || 0;
    return totalServicios + totalConsumo;
}



    

    render() {
        return (
            <Container>
                <h1>Ingreso de Lectura</h1>

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
                            <th>Cargo Fijo</th> {/* Nuevo encabezado para Cargo Fijo */}
                            <th>Otros Pagos</th> {/* Nuevo encabezado para Otros Pagos */}
                            <th>Costo Total</th> {/* Cambiado "Costo" a "Costo Total" para claridad */}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.socios.map(socio => (
                            <tr key={socio.id} onClick={() => this.selectSocio(socio)}>
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>{socio.id}</td>
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>{socio.nombre}</td>
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>{socio.apellido}</td>
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>{socio.consumo}</td>
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>${socio.cargo_consumo}</td>
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>${socio.cargoFijo}</td> {/* Nueva celda para Cargo Fijo */}
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>${socio.otrosPagos}</td> {/* Nueva celda para Otros Pagos */}
                                <td style={this.state.selectedSocio && this.state.selectedSocio.id === socio.id ? { backgroundColor: '#00e7ff' } : {}}>${socio.costo}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>


                <h2>Servicios del Socio</h2>
                {this.state.selectedSocio && (
                    <div>
                    {this.state.waterReading ? (
                        <p>Consumo de Agua: {this.state.waterReading.consumption_value} litros</p>
                    ) : (
                        <p>No hay lectura de agua disponible para el socio y proceso seleccionados.</p>
                    )}
                    <hr/>
                    {this.state.tramoActual && (
                        <p>Tramo correspondiente: {this.state.tramoActual.name} (De {this.state.tramoActual.inicio} a {this.state.tramoActual.fin} litros)</p>
                    )}
                    <hr/>
                    {this.state.valorTotal > 0 && (
                        <p>Costo total del consumo: ${this.state.valorTotal.toFixed(0)}</p>
                    )}
                    <h4>Lectura de Agua</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID Servicio</th>
                                <th>Nombre del Servicio</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.servicios.map(servicio => (
                                <tr key={servicio.id}>
                                    <td>{servicio.id}</td>
                                    <td>{servicio.item}</td>
                                    <td>{servicio.valor}</td>
                                </tr>
                            ))}
                            <tr><p>Total Facturado: ${this.calculateTotalFacturado().toFixed(0)}</p></tr>
                        </tbody>
                    </Table>
                    </div>
                )}

            <Row>
                <Col md={6}>
            <h3>Agregar Nuevo Servicio</h3>
            {this.state.selectedSocio && (
                <p>Socio seleccionado: {this.state.selectedSocio.nombre} {this.state.selectedSocio.apellido}</p>
            )}
 <Form onSubmit={e => { e.preventDefault(); this.addNewService(); }}>

    <Row className="mb-3">
        <Col>
            <Form.Label>Servicio:</Form.Label>
            <Form.Select 
                value={this.state.servicioSeleccionado || ''}
                onChange={e => this.setState({ servicioSeleccionado: e.target.value })}
            >
                <option value="" disabled>Seleccione un servicio</option>
                {this.state.serviciosDisponibles.map(servicio => (
                    <option key={servicio.id} value={servicio.id}>
                        {servicio.item}
                    </option>
                ))}
            </Form.Select>
        </Col>
    </Row>

    <Row className="mb-3">
        <Col>
            <Form.Label>Valor:</Form.Label>
            <Form.Control 
                type="text" 
                placeholder="Valor" 
                value={this.state.newServiceValue || ''}
                onChange={e => this.handleNewServiceChange(e, 'newServiceValue')}
            />
        </Col>
    </Row>

    <Button type="submit">Agregar Servicio</Button>
</Form>

                </Col>
                <Col md={6}>
                    <h3>Agregar Lectura de Agua</h3>
                    <Form onSubmit={e => { e.preventDefault(); this.addWaterReading(); }}>
                        <Form.Group>
                            <Form.Label>Valor del Consumo:</Form.Label>
                            <Form.Control 
                                type="text"
                                placeholder="Valor del consumo"
                                value={this.state.consumptionValue}
                                onChange={e => this.setState({ consumptionValue: e.target.value })}
                            />
                        </Form.Group>
                        <Button type="submit">Agregar Lectura</Button>
                    </Form>
                </Col>
            </Row>
            </Container>
        );
    }
}

export default IngresoLectura;
