import React from 'react'
import { Navbar, Container, Button, Row, Col, Card } from 'react-bootstrap'

export const NavHome = () => {
    return (
        <React.Fragment>
            <Navbar bg="light" className='border-bottom'>
                <Container>
                    <Navbar.Brand href="#home">Azol Mart</Navbar.Brand>
                    <div className='ms-auto'>
                        <Button name="btnSearch" type='button' variant='light'><i className="fa-solid fa-magnifying-glass" /></Button>
                    </div>
                </Container>
            </Navbar>

            <Container>
                <Row className='justify-content-center my-5'>
                    <Col xs={5}>
                        <Card>
                            <Card.Header><i className="fa-solid fa-box" /> Penjualan</Card.Header>
                            <Card.Body><h5>Belum ada data</h5></Card.Body>
                        </Card>
                    </Col>

                    <Col xs={5}>
                        <Card>
                            <Card.Header><i className="fa-solid fa-cash-register" /> Stok</Card.Header>
                            <Card.Body><h5>Belum ada data</h5></Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}
