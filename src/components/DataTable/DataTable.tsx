import React, { useEffect, useState } from 'react'
import MoonLoader from "react-spinners/MoonLoader"
import { dataObj } from '../../types'

type Props = {
    tableData: dataObj[]
    setTableData: (value: dataObj[]) => void
    tableHeaders: dataObj
    title?: string
    name?: string
    loading?: boolean
    selected: number
    setSelected: (value: number) => void
}

export default function DataTable({ tableData, setTableData, tableHeaders, title, name, loading, selected, setSelected }: Props) {
    const [maxItems, setMaxItems] = useState(10)
    const [ordered, setOrdered] = useState({ ...tableHeaders.forEach((h: dataObj) => { return { [h.name]: false } }) })
    const [startTime, setStartTime] = useState(new Date())
    const [loadingTime, setLoadingTime] = useState(0)

    useEffect(() => {
        setStartTime(new Date())
        setLoadingTime(0)
    }, [loading])

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date()
            const miliSeconds = now.getTime() - startTime.getTime()
            const elapsedSeconds = Math.floor(miliSeconds / 1000)
            setLoadingTime(elapsedSeconds)
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime])

    const orderBy = (header: dataObj) => {
        const copyData = [...tableData]
        const orderedData = copyData.sort((a, b) => {
            if (ordered[header.name]) {
                if (header.value === 'createdAt' || header.value === 'updatedAt') {
                    if (new Date(a[header.value]).getTime() < new Date(b[header.value]).getTime()) return -1
                    if (new Date(a[header.value]).getTime() > new Date(b[header.value]).getTime()) return 1
                }
                if (a[header.value] > b[header.value]) return -1
                if (a[header.value] < b[header.value]) return 1
            } else {
                if (header.value === 'createdAt' || header.value === 'updatedAt') {
                    if (new Date(a[header.value]).getTime() > new Date(b[header.value]).getTime()) return -1
                    if (new Date(a[header.value]).getTime() < new Date(b[header.value]).getTime()) return 1
                }
                if (a[header.value] < b[header.value]) return -1
                if (a[header.value] > b[header.value]) return 1
            }
            return 0
        })
        setTableData(orderedData)
        setOrdered({ [header.name]: !ordered[header.name] })
        setSelected(-1)
    }

    const loadingText = () => {
        return loadingTime > 3 ? <h4>This is taking a little longer than expected...</h4>
            : <h4>{`Loading ${name || 'table data'}...`}</h4>
    }

    const renderLoading = () => {
        return <div className='datatable__loading'>
            <MoonLoader color='#0057ad' size={50} />
            {loadingText()}
        </div>
    }

    const renderNoData = () => {
        return <div className='datatable__row --no-hover' style={{ height: '2vw', justifyContent: 'center', cursor: 'default' }}>
            {`No ${name || 'data'} to show.`}
        </div>
    }

    const renderTable = () => {
        return <div className='datatable__data-rows'>
            {tableData.map((row: dataObj, i: number) => i < maxItems &&
                <div
                    key={i}
                    className={selected === i ? 'datatable__row-selected' : 'datatable__row'}
                    onClick={() => i === selected ? setSelected(-1) : setSelected(i)}
                    style={{ backgroundColor: selected === i ? '#d4e1f6' : i % 2 === 0 ? 'white' : '#f5f5f5' }}
                >
                    {tableHeaders.map((header: dataObj, j: number) =>
                        <h4
                            key={j}
                            className={`datatable__row-item datatable__row-${header.value}`}
                            style={{ width: `${100 / tableHeaders.length}%` }}
                        >
                            {header.value === 'createdAt' || header.value === 'updatedAt' || header.value === 'start' || header.value === 'end' ? `${new Date(row[header.value]).toLocaleDateString('es-ES')} ${new Date(row[header.value]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                                header.value === 'isActive' || header.value === 'isSuper' ? row[header.value] ? 'Si' : 'No' :
                                    row && row[header.value] ? String(row[header.value])
                                        : '--'}
                        </h4>
                    )}
                </div>
            )}
            {maxItems < tableData.length ?
                <button className='datatable__lazy-btn' onClick={() => setMaxItems(maxItems + 10)}>{`Show more ${name ? name : ''} ▼`}</button>
                : tableData.length && tableData.length > 10 && maxItems >= tableData.length && tableData.length ?
                    <button className='datatable__lazy-btn' onClick={() => setMaxItems(maxItems - 10)}>{`Show less ▲`}</button>
                    : ''
            }
        </div>
    }

    const renderHeaders = () => {
        return <div className='datatable__headers'>
            {tableHeaders.map((header: dataObj, i: number) =>
                <h4
                    key={i}
                    className='datatable__header'
                    onClick={() => orderBy(header)}
                    style={{ width: `${100 / tableHeaders.length}%` }}>
                    {header.name} {Object.keys(ordered).includes(header.name) ? ordered[header.name] ? `▼` : `▲` : ''}
                </h4>
            )}
        </div>
    }

    return (
        <div className='datatable__container'>
            <div className='datatable__titles'>
                <h4 className='datatable__title'>{title || ''}</h4>
            </div>
            {renderHeaders()}
            {loading ? renderLoading() :
                tableData && Array.isArray(tableData) && tableData.length ? renderTable() :
                    renderNoData()}
        </div >
    )
}