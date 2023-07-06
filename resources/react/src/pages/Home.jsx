import React, { useState } from 'react'
import { Container, Row, Col, Nav, NavDropdown, Dropdown, NavItem, NavLink } from 'react-bootstrap'
import '../assets/css/home.css'
import { Components } from '../utils/Index'

export const Home = () => {
    const [navPage, setNavPage] = useState('NavHome')

    const GetComponent = () => {
        const Component = Components[navPage]
        return (<Component />)
    }

    const setComponent = (e, component) => {
        e.preventDefault()
        setNavPage(component)
    }

    return (
        <Container className='p-0'>
            {GetComponent()}

            <Nav fill className="justify-content-center fixed-bottom border-top bg-light" activeKey="/home">
                <Nav.Item>
                    <Nav.Link href="/home" onClick={(e) => setComponent(e, 'NavHome')}><i className="d-block fa-solid fa-house" />Home</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link href="/product" onClick={(e) => setComponent(e, 'NavProduct')}><i className="d-block fa-solid fa-box" />Produk</Nav.Link>
                </Nav.Item>

                <Dropdown as={NavItem}>
                    <Dropdown.Toggle as={NavLink} className='gdropdown-toggle'><i className="d-block fa-solid fa-cart-shopping" /> Transaksi</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Hello there!</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Nav.Item>
                    <Nav.Link href="/other" onClick={(e) => setComponent(e, 'NavOthers')}><i className="d-block fa-solid fa-bars" />Lainya</Nav.Link>
                </Nav.Item>
            </Nav>

        </Container>
    )
}
