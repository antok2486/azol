import React, { useState, useRef, useEffect } from 'react'
import { Navbar, Container, Button, Row, Col, Card, Form, Table, Tab, InputGroup } from 'react-bootstrap'
import '../assets/css/product.css'
import { GInputNumber, GList, GModal, GFormEdit, URL_API } from '../utils/Index'
import axios from 'axios'

export const NavProduct = () => {
    const [view, setView] = useState('list')
    const [dataMpprod, setDataMpprod] = useState([])
    const [dataMpprog, setDataMpprog] = useState([])
    const [validated, setValidated] = useState(false)
    const ref = useRef()
    const token = localStorage.getItem('token')
    const [idProduk, setIdProduk] = useState(null)

    const addHargaGrosir = () => {
        let temp = dataMpprog.map(l => Object.assign({}, l))
        let row = { 'id': '', 'id_produk': '', 'qty_min': 0, 'hrg_jual1': 0, 'hrg_jual2': 0 }

        temp.push(row)
        setDataMpprog(temp)
    }

    const handleChangeMpprog = (e, index) => {
        let temp = dataMpprog.map(l => Object.assign({}, l))

        temp[index][e.target.name] = e.target.value

        setDataMpprog(temp)

    }

    const handleClickAdd = () => {
        let temp = { 'id': '', 'kode': '', 'nama': '', 'hrg_beli': '', 'hrg_jual1': '', 'hrg_jual2': '' }

        setDataMpprod(temp)
        setView('edit')
    }

    const handleSave = async () => {
        let arrMpprod = Object.assign({}, dataMpprod)
        let arrMpprog = dataMpprog.map(l => Object.assign({}, l))

        //remove commas from input number
        arrMpprod['hrg_beli'] = arrMpprod['hrg_beli'] ? arrMpprod['hrg_beli'].toString().replace(/,/g, '') : 0
        arrMpprod['hrg_jual1'] = arrMpprod['hrg_jual1'] ? arrMpprod['hrg_jual1'].toString().replace(/,/g, '') : 0
        arrMpprod['hrg_jual2'] = arrMpprod['hrg_jual2'] ? arrMpprod['hrg_jual2'].toString().replace(/,/g, '') : 0

        for (let index in arrMpprog) {
            arrMpprog[index]['qty_min'] = arrMpprog[index]['qty_min'] ? arrMpprog[index]['qty_min'].toString().replace(/,/g, '') : 0
            arrMpprog[index]['hrg_jual1'] = arrMpprog[index]['hrg_jual1'] ? arrMpprog[index]['hrg_jual1'].toString().replace(/,/g, '') : 0
            arrMpprog[index]['qty_min'] = arrMpprog[index]['qty_min'] ? arrMpprog[index]['qty_min'].toString().replace(/,/g, '') : 0
        }

        let payload = JSON.stringify({ 'mpprod': arrMpprod, 'mpprog': arrMpprog })
        console.log(payload)
        let resData = await ref.current.axiosPut('mpprod', payload)

        if (resData.status === 200) {
            setView('list')
        }
    }

    const DisplayEdit = () => (
        <Form>
            <Row>
                <Col className='text-center'>
                    <img className='img-add-product' src='/gallery.svg' />
                </Col>
            </Row>

            <Row className='mb-3'>
                <Form.Label as={Col} xs={3}>Kode</Form.Label>
                <Col xs={8}>
                    <Form.Control type="text" name='kode' onChange={(e) => ref.current.handleChangeDataHeader(e)} />
                </Col>
            </Row>

            <Row className='mb-3'>
                <Form.Label as={Col} xs={3}>Nama</Form.Label>
                <Col xs={8}>
                    <Form.Control type="text" name='nama' onChange={(e) => ref.current.handleChangeDataHeader(e)} />
                </Col>
            </Row>

            <Row className='mb-3'>
                <Form.Label as={Col} xs={3}>Hrg Beli</Form.Label>
                <Col xs={8}>
                    <InputGroup>
                        <InputGroup.Text>Rp</InputGroup.Text>
                        <GInputNumber name='hrg_beli' onChange={(e) => ref.current.handleChangeDataHeader(e)} />
                    </InputGroup>
                </Col>
            </Row>

            <Row className='mb-3'>
                <Form.Label as={Col} xs={3}>Stok</Form.Label>
                <Col xs={8}>
                    <InputGroup>
                        <GInputNumber name='stok' onChange={(e) => ref.current.handleChangeDataHeader(e)} />
                        <InputGroup.Text>Pcs</InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>

            <Row className='mb-3'>
                <Form.Label as={Col} xs={3}>Hrg Offline</Form.Label>
                <Col xs={8}>
                    <InputGroup>
                        <InputGroup.Text>Rp</InputGroup.Text>
                        <GInputNumber name='hrg_jual1' onChange={(e) => ref.current.handleChangeDataHeader(e)} />
                    </InputGroup>
                </Col>
            </Row>

            <Row className='mb-3'>
                <Form.Label as={Col} xs={3}>Hrg Online</Form.Label>
                <Col xs={8}>
                    <InputGroup>
                        <InputGroup.Text>Rp</InputGroup.Text>
                        <GInputNumber name='hrg_jual2' onChange={(e) => ref.current.handleChangeDataHeader(e)} />
                    </InputGroup>
                </Col>
            </Row>


            <Button type='button' variant='light' className='mb-2' onClick={() => addHargaGrosir()}><i className="fa-solid fa-plus" /> Tambah Harga Grosir</Button>

            <Table hover className='w-100'>
                <thead className='bg-light'>
                    <tr>
                        <th>Qty Minimal</th>
                        <th className='text-center'>Harga Jual Offline</th>
                        <th className='text-center'>Harga Jual Online</th>
                    </tr>
                </thead>

                <tbody>
                    {dataMpprog && dataMpprog.map((row, index) =>
                        <tr key={index}>
                            <td><GInputNumber name='qty_min' initialValue={row['qty_min']} onChange={(e) => handleChangeMpprog(e, index)} /></td>
                            <td><GInputNumber name='hrg_jual1' initialValue={row['hrg_jual1']} onChange={(e) => handleChangeMpprog(e, index)} /></td>
                            <td><GInputNumber name='hrg_jual2' initialValue={row['hrg_jual2']} onChange={(e) => handleChangeMpprog(e, index)} /></td>
                        </tr>
                    )}
                </tbody>

            </Table>

        </Form>
    )

    const DisplayCard = () => (
        <Row className='justify-content-center'>
            <Col xs={4}>
                <Card>
                    <Card.Header>Tambah Produk</Card.Header>
                    <Card.Body>

                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )

    const DisplayList = () => (
        <GList
            tableName='mpprod'
            displayColumns={[
                { name: 'kode', text: 'Kode', type: 'text' },
                { name: 'nama', text: 'Nama', type: 'text' },
                { name: 'hrg_beli', text: 'Hrg Beli', type: 'number' },
                { name: 'hrg_jual1', text: 'Hrg Ofl', type: 'number' },
                { name: 'hrg_jual2', text: 'Hrg Onl', type: 'number' },
            ]}
        />

    )

    return (
        <GFormEdit ref={ref} setValidated={setValidated} dataHeader={dataMpprod} setDataHeader={setDataMpprod} >
            <Navbar bg="light" className='border-bottom'>
                <Container>
                    <Navbar.Brand href="#home">Azol Mart - Product</Navbar.Brand>
                    <div className='ms-auto'>
                        {view !== 'edit' &&
                            <Button name="btnSearch" type='button' variant='light' className='me-1'><i className="fa-solid fa-magnifying-glass" /></Button>
                        }
                        {view === 'list' &&
                            <Button name="btnAdd" type='button' variant='light' onClick={() => handleClickAdd()}><i className="fa-solid fa-plus" /></Button>
                        }
                        {view === 'edit' &&
                            <Button name="btnSave" type='button' variant='light' onClick={(e) => ref.current.handleSubmit(e, handleSave)}><i className="fa-solid fa-floppy-disk" /></Button>
                        }
                    </div>
                </Container>
            </Navbar>

            <Container className='mt-2'>
                <div className='content-wrapper'>
                    {view === 'list' &&
                        DisplayList()
                    }
                    {view === 'edit' &&
                        DisplayEdit()
                    }
                </div>
            </Container>

        </GFormEdit>

    )
}
