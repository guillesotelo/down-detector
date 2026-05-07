import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Button from '../Button/Button'
import { Line } from 'react-chartjs-2'
import { dataObj, downtimeModalType, eventType, historyType, statusType, systemType } from '../../types'
import { AppContext } from '../../AppContext'
import { registerables, Chart } from 'chart.js';
import { getDate, parseDateTime, sortArray } from '../../helpers'
import { SystemCardPlaceholderBlock } from './SystemCardPlaceholder'
import LiveIcon from '../../assets/icons/heart-pulse.svg'
import Api from '../../assets/icons/api.svg'
import Report from '../../assets/icons/report.svg'
import Subscribe from '../../assets/icons/subscribe.svg'
Chart.register(...registerables);

type Props = {
    system?: systemType
    reportIssue: (value: string) => void
    subscribe: (value: string) => void
    downtime?: { start?: Date, end?: Date }[]
    history?: historyType[]
    precomputedData?: { lastDayData: any[], completeData: any[] }
    setSelected: (value: string) => void
    setSelectedData: (value: any) => void
    setModalChartOptions: (value: systemType[]) => void
    lastCheck?: string | number
    delay?: string
    setShowDowntime: (value: downtimeModalType) => void
    index: number
    showDowntime?: downtimeModalType,
    animate?: boolean
    logo?: string
    raw?: string
    targeted?: boolean
}

const SystemCard = (props: Props) => {
    const [lastDayData, setLastDayData] = useState<any[]>([])
    const [completeData, setCompleteData] = useState<any[]>([])
    const [lastDayChartData, setLastDayChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [completeChartData, setCompleteChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [loading, setLoading] = useState(true)
    const [showMoreDowntime, setShowMoreDowntime] = useState(false)
    const [status, setStatus] = useState<boolean | null | string | undefined>(null)
    const { darkMode, headerLoading, setHeaderLoading, isSuper } = useContext(AppContext)
    const targetUsed = useRef<boolean>(false)
    const chartHeight = '.5rem'
    const chartWidth = ''

    const {
        system,
        reportIssue,
        downtime,
        history,
        precomputedData,
        setSelected,
        setSelectedData,
        setModalChartOptions,
        lastCheck,
        delay,
        setShowDowntime,
        index,
        animate,
        showDowntime,
        subscribe,
        logo,
        raw,
        targeted
    } = props

    const {
        _id,
        name,
        reportedlyDown,
        broadcastMessages,
    } = system || {}

    useEffect(() => {
        if ((loading || (status !== false && status !== true)) && !headerLoading) setHeaderLoading(true)
    }, [loading, status])

    useEffect(() => {
        if (precomputedData) {
            setLastDayData(precomputedData.lastDayData)
            setCompleteData(precomputedData.completeData)
        }
        if (history && history.length) setStatus(getCurrentStatus())
        else if (status === null && system?.lastCheckStatus !== undefined) setStatus(system.lastCheckStatus)
        setLoading(false)
    }, [precomputedData, history, system, animate])

    useEffect(() => {
        const hasData = lastDayData.length && completeData.length
        if (hasData && targeted && !targetUsed.current) {
            selectSystem()
            targetUsed.current = true
        }
    }, [lastDayData, completeData])

    useEffect(() => {
        generateLastDayData()
    }, [lastDayData, status])

    const getStatusColor = (item: statusType) => {
        if (!status) return 'red'
        if (reportedlyDown || status === 'BUSY') return 'orange'

        let color = darkMode ? '#00b000' : 'green'
        if (item && item.unknown) color = 'gray'
        if (item.busy) color = darkMode ? '#007f00' : '#006000'
        if (item.isDown) color = darkMode ? '#006600' : '#003a00'
        return color
    }

    const generateLastDayData = useCallback(() => {
        setLastDayChartData({
            labels: lastDayData.length ? lastDayData.map(el => parseDateTime(el.time)) : [],
            datasets: [
                {
                    data: lastDayData.length ? lastDayData.map((el: statusType) => !el.status || el.isDown ? 0 : el.busy ? 0.8 : 1) : [],
                    backgroundColor: (ctx: any) => lastDayData[ctx.index] && lastDayData[ctx.index].reported ? darkMode ? 'white' : 'black' : 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 4,
                    label: 'Reported DOWN by user'
                },
                {
                    data: lastDayData.length ? lastDayData.map((el: statusType) => !el.status || el.isDown ? 0 : el.busy ? 0.8 : 1) : [],
                    backgroundColor: 'transparent',
                    segment: {
                        borderColor: (ctx: any) => getStatusColor(lastDayData[ctx.p1DataIndex])
                    },
                    tension: .4,
                    borderWidth: 3,
                    pointBorderWidth: 0,
                }
            ]
        })
    }, [
        lastDayChartData,
        setLastDayChartData,
        lastDayData,
        completeData,
        darkMode,
        status
    ])

    const generateCompleteData = useCallback(() => {
        setSelectedData({
            labels: completeData.length ? completeData.map(el => parseCompleteDataTime(el.time)) : [],
            datasets: [
                {
                    data: completeData.length ? completeData.map((el: statusType) => !el.status || el.isDown ? 0 : el.busy ? 0.8 : 1) : [],
                    backgroundColor: (ctx: any) => completeData[ctx.index] && completeData[ctx.index].reported ? darkMode ? 'white' : 'black' : 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 4,
                    label: 'Reported DOWN by user'
                },
                {
                    data: completeData.length ? completeData.map((el: statusType) => !el.status || el.isDown ? 0 : el.busy ? 0.8 : 1) : [],
                    backgroundColor: 'transparent',
                    segment: {
                        borderColor: (ctx: any) => getStatusColor(completeData[ctx.p1DataIndex])
                    },
                    tension: .4,
                    pointBorderWidth: 0,
                    borderWidth: 3,
                }
            ]
        })
    }, [
        completeChartData,
        setCompleteChartData,
        lastDayData,
        completeData,
        darkMode,
        status
    ])

    const parseCompleteDataTime = (time: Date) => {
        const string = time ?
            getDate(time)
            : 'No data'
        return string ? string.split(' ').reverse().join(' - ') : ''
    }

    const getDowntime = (event: eventType) => {
        if (event && event.start && event.end) {
            return (
                <span>
                    <span className={`systemcard__event-time${darkMode ? '--dark' : ''}`}>{getDate(event.start)}</span>
                    {name === 'GitLab' ? '' : <span style={{ fontWeight: 'normal' }}> ➜ </span>}
                    {name === 'GitLab' ? '' : <span className={`systemcard__event-time${darkMode ? '--dark' : ''}`}>{getDate(event.end)}</span>}
                    <div className={`systemcard__event-note${darkMode ? '--dark' : ''}`} dangerouslySetInnerHTML={{ __html: event.note || '' }} />
                </span>
            )
        }
        else return ''
    }

    const selectSystem = () => {
        generateCompleteData()
        setModalChartOptions(completeChartOptions)
        setSelected(system?._id || '')
    }

    const isLiveDowntime = (downtime: eventType) => {
        if (downtime && downtime.start) {
            const now = new Date().getTime()
            const start = new Date(downtime.start || new Date()).getTime()
            const end = new Date(downtime.end || new Date()).getTime()
            if (now - start > 0 && now - end < 0) return true
        }
        return false
    }

    const getCurrentStatus = () => {
        const lastHistories: historyType[] | null = history && Array.isArray(history) ?
            sortArray(history, 'createdAt', true).slice(0, 2) : null
        const current = lastHistories && lastHistories.length ? { ...lastHistories[0] } : null

        if (current && !current.status) {
            const currentStatus = current.status
            const currentTime = new Date(current.createdAt || new Date()).getTime()
            const isBusy = new Date().getTime() - currentTime < 120000
            current.status = isBusy ? 'BUSY' : currentStatus
        }
        if (!current) return null
        if (current.status === 'BUSY') return 'BUSY'
        return Boolean(current.status)
    }

    const hasPageMessage = () => {
        const json = JSON.parse(broadcastMessages || '[]')
        const banners = Array.isArray(json) ? json.filter((message: dataObj) =>
            message.active && new Date(message.ends_at).getTime() - new Date().getTime() > 0) : []
        const gerritMessage = name?.toLocaleLowerCase().includes('gerrit') && raw?.includes('plugins/banner/static/banner.js')
        const gitLabMessage = name?.toLocaleLowerCase().includes('gitlab') && banners.length
        return isSuper && (gerritMessage || gitLabMessage)
    }

    const chartOptions: any = {
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Last 24 hours',
                align: 'start',
                fullSize: false,
                font: {
                    weight: 'normal'
                }
            },
            tooltip: {
                callbacks: {
                    label: (ctx: any) => {
                        const label = ctx.dataset.label || ''
                        if (lastDayData[ctx.dataIndex] && lastDayData[ctx.dataIndex].reported) return label
                        else if (label.includes('user')) return ''
                        return lastDayData[ctx.dataIndex].unknown ? 'Not registered' :
                            lastDayData[ctx.dataIndex].busy ? 'BUSY' :
                                lastDayData[ctx.dataIndex].status ? 'UP' : 'DOWN'
                    },
                    labelColor: (ctx: any) => {
                        return {
                            backgroundColor: lastDayData[ctx.dataIndex].unknown ? 'gray' :
                                lastDayData[ctx.dataIndex].busy ? 'orange' :
                                    lastDayData[ctx.dataIndex].reported ? darkMode ? 'white' : 'black' :
                                        lastDayData[ctx.dataIndex].status ? 'green' : 'red',
                            borderWidth: 0,
                            borderRadius: 5,
                        }
                    },
                },
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                border: {
                    display: false
                },
                ticks: {
                    autoSkip: false,
                    display: false,
                    color: 'gray'
                },
                grid: {
                    display: false,
                    drawBorder: false,
                    drawChartArea: false,
                    color: darkMode ? '#333333a1' : '#dbdbdb9d'
                }
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false
                },
                ticks: {
                    display: false
                },
                grid: {
                    display: false,
                    drawBorder: false,
                    drawChartArea: false,
                    color: darkMode ? '#333333a1' : '#dbdbdb9d'
                }
            }
        }
    }

    const completeChartOptions: any = {
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (ctx: any) => {
                        const label = ctx.dataset.label || ''
                        if (completeData[ctx.dataIndex] && completeData[ctx.dataIndex].reported) return label
                        else if (label.includes('user')) return ''
                        return completeData[ctx.dataIndex].unknown ? 'Not registered' :
                            completeData[ctx.dataIndex].busy ? 'BUSY' :
                                completeData[ctx.dataIndex].status ? 'UP' : 'DOWN'
                    },
                    labelColor: (ctx: any) => {
                        return {
                            backgroundColor: completeData[ctx.dataIndex].unknown ? 'gray' :
                                completeData[ctx.dataIndex].busy ? 'orange' :
                                    completeData[ctx.dataIndex].reported ? darkMode ? 'white' : 'black' :
                                        completeData[ctx.dataIndex].status ? 'green' : 'red',
                            borderWidth: 0,
                            borderRadius: 5,
                        }
                    },
                },
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                border: {
                    display: false
                },
                ticks: {
                    autoSkip: false,
                    display: false,
                    // color: 'gray'
                },
                grid: {
                    display: false,
                    drawBorder: false,
                    drawChartArea: false,
                    color: darkMode ? '#333333a1' : '#dbdbdb9d'
                }
            },
            y: {
                beginAtZero: true,
                border: {
                    display: false
                },
                ticks: {
                    display: false
                },
                grid: {
                    display: false,
                    drawBorder: false,
                    drawChartArea: false,
                    color: (ctx: any) => ctx.tick.value !== .5 ? darkMode ? '#333333a1' : '#dbdbdb9d' : 'transparent'
                }
            }
        }
    }

    return (
        <div className="systemcard__wrapper" style={{ animationDelay: `${delay || '0'}` }}>
            <>
                <div
                    className={`systemcard__container${darkMode ? '--dark' : ''}`}
                    style={{
                        borderColor: darkMode ? '#424244' : '#d3d3d3',
                        // borderColor: loading ? 'gray' : status ? 'green' : 'red',
                        backgroundImage: loading || (status !== false && status !== true && status !== 'BUSY') ? '' :
                            status === 'BUSY' ? darkMode ? 'linear-gradient(to right bottom, rgb(0, 0, 0), rgb(255 152 0 / 26%)'
                                : 'linear-gradient(to right bottom, white, rgb(202 120 0 / 17%))' : darkMode ?
                                `linear-gradient(to bottom right, #000000, ${status ? '#00600085' : '#7000008c'})`
                                :
                                `linear-gradient(to bottom right, white, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`,
                        zIndex: downtime && downtime.length ? 4 : '',
                        borderBottom: downtime && downtime.length ? 'none' : `1px solid ${darkMode ? '#424244' : '#d3d3d3'}`,
                    }}
                    onMouseEnter={() => setShowMoreDowntime(true)}
                    onMouseLeave={() => setShowMoreDowntime(false)}>
                    <div className="systemcard__header" onClick={selectSystem}>
                        <img
                            src={logo || Api}
                            alt="System Logo"
                            className="systemcard__logo"
                            style={{
                                filter: darkMode && !logo ? 'invert(100%) sepia(5%) saturate(433%) hue-rotate(6deg) brightness(120%) contrast(100%)' : ''
                            }}
                            draggable={false}
                        />
                        <h1 className="systemcard__name">{hasPageMessage() ? '️🚧 ' : ''}{name || 'Api Name'}</h1>
                    </div>
                    {loading || (status !== false && status !== true && status !== 'BUSY') ?
                        SystemCardPlaceholderBlock(darkMode, '3rem')
                        :
                        <div className="systemcard__graph" onClick={selectSystem}>
                            {animate && !showDowntime ? <Line data={lastDayChartData} height={chartHeight} width={chartWidth} options={chartOptions} /> : ''}
                        </div>}
                    <div className="systemcard__footer">
                        <h2
                            className="systemcard__status"
                            style={{ color: loading ? 'gray' : reportedlyDown || status === 'BUSY' ? 'orange' : status ? darkMode ? '#00b000' : 'green' : 'red' }}>
                            {loading || (status !== false && status !== true && status !== 'BUSY') ? <p style={{ color: 'gray', paddingBottom: '1rem' }}>Checking status...</p> :
                                <>
                                    <span
                                        style={{
                                            animation: animate ? '' : 'none',
                                            animationDelay: `${delay || '0'}`
                                        }}
                                        className='systemcard__status-dot'>
                                        <img
                                            style={{
                                                filter: reportedlyDown || status === 'BUSY' ? 'invert(64%) sepia(97%) saturate(1746%) hue-rotate(359deg) brightness(101%) contrast(106%)'
                                                    : status ? 'invert(24%) sepia(100%) saturate(1811%) hue-rotate(97deg) brightness(130%) contrast(105%)' :
                                                        'invert(19%) sepia(87%) saturate(7117%) hue-rotate(358deg) brightness(97%) contrast(117%)'
                                            }}
                                            src={LiveIcon}
                                            alt="Live"
                                            className="systemcard__status-live"
                                            draggable={false} />
                                    </span>
                                    &nbsp;
                                    <strong>{reportedlyDown ? 'Problem' : status ? status === 'BUSY' ? status : 'UP' : 'DOWN'}</strong>
                                </>
                            }
                        </h2>
                        {status ?
                            <div className='systemcard__buttons'>
                                <Button
                                    handleClick={() => subscribe(_id || '')}
                                    bgColor={darkMode ? '#2d2d2d' : '#dcdcdc'}
                                    textColor={darkMode ? 'lightgray' : '#323232'}
                                    svg={Subscribe}
                                    tooltip='Subscribe for updates'
                                    style={{ minHeight: '1.75rem', width: '1rem', padding: '0 .4§rem' }}
                                />
                                <Button
                                    handleClick={() => reportIssue(_id || '')}
                                    bgColor={darkMode ? '#2d2d2d' : '#dcdcdc'}
                                    textColor={darkMode ? 'lightgray' : '#323232'}
                                    svg={Report}
                                    tooltip='Report Issue'
                                    style={{ minHeight: '1.75rem', width: '1rem', padding: '0 .4rem' }}
                                />
                            </div>
                            : !loading && (status || status === false) && lastCheck ?
                                <p style={{ color: darkMode ? 'lightgray' : 'gray' }} className="systemcard__status-caption">{lastCheck}</p>
                                : ''}

                    </div>
                </div>
                {downtime && downtime.length ?
                    <div
                        className={`systemcard__event${darkMode ? '--dark' : ''}`}
                        style={{
                            backgroundColor: isLiveDowntime(downtime[0]) || name === 'GitLab' ? darkMode ?
                                '#000' : '#ffc3c3' : darkMode ?
                                '#000' : '#fff',
                            border: isLiveDowntime(downtime[0]) || name === 'GitLab' ? darkMode ? '1px solid red'
                                : '1px solid transparent' : darkMode ? '1px solid #ffc7006b' : '1px solid #dbdbdb',
                            animationDelay: `${delay || '0'}`
                        }}
                        onMouseEnter={() => setShowMoreDowntime(true)}
                        onMouseLeave={() => setShowMoreDowntime(false)}>
                        <p className="systemcard__event-title">🚧 {name === 'GitLab' ? 'Decommission' : 'Planned downtime'} 🚧</p>
                        {downtime.map((time, i) =>
                            <div key={i}>
                                {showMoreDowntime && i > 0 ? <div className='systemcard__event-downtime-separator' /> : ''}
                                <div
                                    className={`systemcard__event-downtime${darkMode ? '--dark' : ''}`}
                                    onClick={() => setShowDowntime({ ...time, system, index })}
                                    style={{
                                        display: !showMoreDowntime ? 'none' : '',
                                        marginTop: i === 0 ? '.5rem' : ''
                                    }}>
                                    {getDowntime(time)}
                                </div>
                            </div>
                        )}
                    </div>
                    : ''}
            </>
        </div >
    )
}

export default React.memo(SystemCard)