import React, { useContext, useEffect, useState } from 'react'
import MoonLoader from "react-spinners/MoonLoader"
import { dataObj } from '../../types'
import { AppContext } from '../../AppContext'

type Props = {
    tableData: dataObj[]
    setTableData?: (value: dataObj[]) => void
    tableHeaders: dataObj
    title?: string
    name?: string
    loading?: boolean
    selected?: number
    setSelected?: (value: number) => void
    max?: number
    style?: React.CSSProperties
    orderDataBy?: dataObj
}

export default function DataTable(props: Props) {
    const {
        tableData,
        setTableData,
        tableHeaders,
        title,
        name,
        loading,
        selected,
        setSelected,
        max,
        style,
        orderDataBy
    } = props

    const [maxItems, setMaxItems] = useState(max || 10)
    const [ordered, setOrdered] = useState({ ...tableHeaders.forEach((h: dataObj) => { return { [h.name]: false } }) })
    const [startTime, setStartTime] = useState(new Date())
    const [loadingTime, setLoadingTime] = useState(0)
    const { darkMode } = useContext(AppContext)

    useEffect(() => {
        if (orderDataBy) orderBy(orderDataBy)
    }, [])

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
        const orderedData = copyData.slice().sort((a, b) => {
            if (ordered[header.name]) {
                if (header.value === 'createdAt' || header.value === 'updatedAt') {
                    if (new Date(a[header.value]).getTime() < new Date(b[header.value]).getTime()) return -1
                    if (new Date(a[header.value]).getTime() > new Date(b[header.value]).getTime()) return 1
                }
                if (a[header.value] && !b[header.value]) return -1
                if (!a[header.value] && b[header.value]) return 1
                if (a[header.value] > b[header.value]) return -1
                if (a[header.value] < b[header.value]) return 1
            } else {
                if (header.value === 'createdAt' || header.value === 'updatedAt') {
                    if (new Date(a[header.value]).getTime() > new Date(b[header.value]).getTime()) return -1
                    if (new Date(a[header.value]).getTime() < new Date(b[header.value]).getTime()) return 1
                }
                if (a[header.value] && !b[header.value]) return 1
                if (!a[header.value] && b[header.value]) return -1
                if (a[header.value] < b[header.value]) return -1
                if (a[header.value] > b[header.value]) return 1
            }
            return 0
        })
        if (setTableData) setTableData(orderedData)
        setOrdered({ [header.name]: !ordered[header.name] })
        if (setSelected) setSelected(-1)
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
        return <div className={`datatable__row${darkMode ? '--dark' : ''}`} style={{ height: '2vw', justifyContent: 'center', cursor: 'default' }}>
            {`No ${name || 'data'} to show.`}
        </div>
    }

    const renderTable = () => {
        return <div className='datatable__data-rows'>
            {tableData.map((row: dataObj, i: number) => i < maxItems &&
                <div
                    key={i}
                    className={selected === i ? `datatable__row-selected${darkMode ? '--dark' : ''}` : `datatable__row${darkMode ? '--dark' : ''}`}
                    onClick={() => setSelected ? i === selected ? setSelected(-1) : setSelected(i) : {}}
                    style={{
                        backgroundColor: !darkMode ? selected === i ? '#d4e1f6' : i % 2 === 0 ? 'white' : '#f5f5f5'
                            : selected === i ? '#656565' : i % 2 === 0 ? '#383838' : ''
                    }}
                >
                    {tableHeaders.map((header: dataObj, j: number) =>
                        <h4
                            key={j}
                            className={`datatable__row-item datatable__row-${header.value}`}
                            style={{
                                width: `${100 / tableHeaders.length}%`,
                                color: typeof row[header.value] === 'boolean' && header.value != 'userAlert' ? row[header.value] ? 'green' : 'red' : ''
                            }}
                        >
                            {(header.value === 'createdAt' || header.value === 'updatedAt' || header.value === 'start' || header.value === 'end') && row[header.value] ? `${new Date(row[header.value]).toLocaleDateString('sv-SE')} ${new Date(row[header.value]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}` :
                                header.value === 'active' || header.value === 'isSuper' ? row[header.value] ? 'Yes' : 'No' :
                                    header.value === 'createdBy' ? row[header.value] ? `User: ${row[header.value]}` : 'App' :
                                        header.value === 'status' ? row[header.value] ? 'UP' : 'DOWN' :
                                            header.value === 'description' ? row[header.value] ? row[header.value] : row['raw'] || '--' :
                                                row && row[header.value] ? String(row[header.value])
                                                    : '--'}
                        </h4>
                    )}
                </div>
            )}
            {maxItems < tableData.length ?
                <button className={`datatable__lazy-btn${darkMode ? '--dark' : ''}`} onClick={() => setMaxItems(maxItems + 10)}>{`Show more ${name ? name : ''} ▼`}</button>
                : tableData.length && maxItems >= tableData.length && tableData.length > (max || 10) ?
                    <button className={`datatable__lazy-btn${darkMode ? '--dark' : ''}`} onClick={() => setMaxItems(max || 10)}>Show less ▲</button>
                    : ''
            }
        </div>
    }

    const renderHeaders = () => {
        return <div className={`datatable__headers${darkMode ? '--dark' : ''}`}>
            {tableHeaders.map((header: dataObj, i: number) =>
                <h4
                    key={i}
                    className={`datatable__header${darkMode ? '--dark' : ''}`}
                    onClick={() => orderBy(header)}
                    style={{ width: `${100 / tableHeaders.length}%` }}>
                    {header.name} {Object.keys(ordered).includes(header.name) ? ordered[header.name] ? `▼` : `▲` : ''}
                </h4>
            )}
        </div>
    }

    return (
        <div className={`datatable__container${darkMode ? '--dark' : ''}`} style={style}>
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