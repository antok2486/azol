import React, { useState } from 'react'
import { Navbar, Container, Button, Row, Col, Card, Form, Table, Tab } from 'react-bootstrap'
import '../assets/css/product.css'
import {GInputNumber, GModal} from '../utils/Index'
import axios from 'axios'

export const NavProduct = () => {
    const [view, setView] = useState('list')
    const [dataMpprod, setDataMpprod] = useState({})
    const [dataMpprog, setDataMpprog] = useState([])
    const [gModal, setGModal] = useState({
        type: 'question',
        title: 'Konfirmasi',
        body: 'Apakah data yang diinput sudah benar ?',
        show: false,
        buttons: [],
    })

    const addHargaGrosir = () => {
        let temp = dataMpprog.map(l => Object.assign({}, l))
        let row = {'id': '', 'id_produk' : '', 'qty_min' : 0, 'hrg_jual1' : 0, 'hrg_jual2' : 0}

        temp.push(row)
        setDataMpprog(temp)
    }

    const handleChangeMpprod = (e) => {
        let temp = Object.assign({}, dataMpprod)

        if (e.target.className === 'form-check-input' && e.target.type !== 'radio') {  //switches
            if (e.target.checked) {
                temp[e.target.name] = 1
            } else {
                temp[e.target.name] = 0
            }
        } else {
            temp[e.target.name] = e.target.value
        }

        setDataMpprod(temp)

    }

    const handleChangeMpprog = (e, index) => {
        let temp = dataMpprog.map(l => Object.assign({}, l))
        
        temp[index][e.target.name] = e.target.value

        setDataMpprog(temp)

    }

    const handleClickAdd = () => {
        let temp = {'id':'', 'kode':'', 'nama':'', 'hrg_beli':'', 'hrg_jual1':'', 'hrg_jual2':''}

        setDataMpprod(temp)
        setView('edit')
    }

    const handleClickSave = () => {
        setGModal({
            show: true,
            type: 'question',
            title: 'Konfirmasi',
            body: 'Apakah data yang diinput sudah benar ?',
            buttons: [
                { text: 'Ya', onClick: () => null },
                { text: 'Tidak', onClick: null }
            ]
        })

    }

    const save = async () => {
        let arrMpprod = Object.assign({}, dataMpprod)
        let arrMpprog = dataMpprog.map(l => Object.assign({}, l))

        //remove commas from input number
        arrMpprod['hrg_beli'] = arrMpprod['hrg_beli'] ? arrMpprod['hrg_beli'].toString().replace(/,/g, '') : 0
        arrMpprod['hrg_jual1'] = arrMpprod['hrg_jual1'] ? arrMpprod['hrg_jual1'].toString().replace(/,/g, '') : 0
        arrMpprod['hrg_jual2'] = arrMpprod['hrg_jual2'] ? arrMpprod['hrg_jual2'].toString().replace(/,/g, '') : 0

        for(let index in arrMpprog){
            arrMpprog[index]['qty_min'] = arrCusp[index]['qty_min'] ? arrCusp[index]['qty_min'].toString().replace(/,/g, '') : 0
            arrMpprog[index]['hrg_jual1'] = arrCusp[index]['hrg_jual1'] ? arrCusp[index]['hrg_jual1'].toString().replace(/,/g, '') : 0
            arrMpprog[index]['qty_min'] = arrCusp[index]['qty_min'] ? arrCusp[index]['qty_min'].toString().replace(/,/g, '') : 0
        }

        let payload = JSON.stringify({ 'mpprod': arrMpprod, 'mpprog': arrMpprog })

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

            <Form.Group className="mb-3">
                <Form.Label>Kode</Form.Label>
                <Form.Control type="text" name='kode' onChange={(e) => handleChangeMpprod(e)} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Nama</Form.Label>
                <Form.Control type="text" name='nama' onChange={(e) => handleChangeMpprod(e)} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Harga Beli</Form.Label>
                <GInputNumber name='hrg_beli' onChange={(e) => handleChangeMpprod(e)} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Harga Jual Offline</Form.Label>
                <GInputNumber name='hrg_jual1' onChange={(e) => handleChangeMpprod(e)} />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>Harga Jual Online</Form.Label>
                <GInputNumber name='hrg_jual1' onChange={(e) => handleChangeMpprod(e)} />
            </Form.Group>

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

    return (
        <React.Fragment>
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
                            <Button name="btnSave" type='button' variant='light' onClick={() => handleClickSave()}><i className="fa-solid fa-floppy-disk" /></Button>
                        }
                    </div>
                </Container>
            </Navbar>

            <Container className='mt-2'>
                <div className='content-wrapper'>
                    {view === 'list' &&
                        DisplayCard()
                    }
                    {view === 'edit'  &&
                        DisplayEdit()
                    }
                </div>
            </Container>

            <GModal
                show={gModal.show}
                type={gModal.type}
                title={gModal.title}
                body={gModal.body}
                buttons={gModal.buttons}
                onHide={() => setGModal({ show: false })}
            />
        </React.Fragment>

    )
}
