import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { URL_API, GModal, numberFormat } from '../utils/Index'
import { Button, Card, Table, Row, Col, Form, InputGroup, Dropdown, Container } from 'react-bootstrap'

export const GList = ({ tableName, columns, displayColumns, className }) => {
    const [data, setData] = useState([])
    const [page, setPage] = useState({ start: 0, end: 10 })
    const [sortColumn, setSortColumn] = useState()
    const [sortOrder, setSortOrder] = useState(true)
    const token = localStorage.getItem('token')
    const [gModal, setGModal] = useState({
        type: 'question',
        title: 'Konfirmasi',
        body: null,
        show: false,
        buttons: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                let headers = {
                    accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }

                let res = await axios.get(URL_API + tableName, { headers: headers })

                if (res.data.status === 200) {
                    setData(res.data[tableName])
                } else {
                    setGModal({
                        show: true,
                        type: 'information',
                        title: 'Error' + (res.data.status ? ' ' + res.data.status : ''),
                        body: res.data.message ? res.data.message : 'Gagal mendapatkan data',
                        buttons: [{ text: 'Ok', onClick: null }]
                    })
                }

            } catch (error) {
                setGModal({
                    show: true,
                    type: 'information',
                    title: 'Error',
                    body: error.response.data.message,
                    buttons: [{ text: 'Ok', onClick: null }]
                })
            }

        }

        if (tableName) { fetchData() }

    }, [tableName])

    const handleSort = (col) => {
        setSortColumn(col)
        setSortOrder(!sortOrder)

        data.sort((a, b) => {
            if (sortOrder) {
                if (a[col] < b[col]) { return -1 }
                if (a[col] > b[col]) { return 1 }
            }

            if (!sortOrder) {
                if (a[col] > b[col]) { return -1 }
                if (a[col] < b[col]) { return 1 }
            }
        })

    }

    const next = () => {
        const start_ = page.start + 10
        const end_ = page.end + 10

        setPage({ start: start_, end: end_ })
    }

    const prev = () => {
        const start_ = page.start - 10
        const end_ = page.end - 10

        setPage({ start: start_, end: end_ })
    }

    return (
        <React.Fragment>
            <Table hover className='w-100'>
                <thead className='bg-light'>
                    <tr>
                        {displayColumns && displayColumns.map(col => (
                            <th
                                key={col.name}
                                className={(col.type === 'number' ? 'text-end' : 'text-start') + (sortColumn === col.name ? (!sortOrder ? ' sorted-asc' : ' sorted-desc') : '')}
                                onClick={() => handleSort(col.name)}
                            >
                                {col.text}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data && data.slice(page.start, page.end).map((row, i) => (
                        <tr key={i}>
                            {displayColumns && displayColumns.map((col, index) => (
                                <td key={i + '_' + col.name} className={col.type === 'number' ? 'text-end' : 'text-start'}>
                                    { col.type === 'number' ? numberFormat.format(row[col.name]) : row[col.name] }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>

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
