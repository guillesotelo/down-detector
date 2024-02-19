import React, { useCallback, useContext, useEffect, useState } from 'react'
import Button from '../Button/Button'
import { Line } from 'react-chartjs-2'
import { alertType, dataObj, downtimeModalType, eventType, historyType, statusType, systemType } from '../../types'
import { AppContext } from '../../AppContext'
import { registerables, Chart } from 'chart.js';
import { APP_COLORS } from '../../constants/app'
import { getDate, getDateWithGivenHour } from '../../helpers'
import { SystemCardPlaceholderBlock } from './SystemCardPlaceholder'
Chart.register(...registerables);

type Props = {
    system?: systemType
    reportIssue: (value: string) => void
    downtime?: { start?: Date, end?: Date }[]
    history?: historyType[]
    alerts?: alertType[]
    setSelected: (value: string) => void
    setSelectedData: (value: any) => void
    setModalChartOptions: (value: systemType[]) => void
    lastCheck?: string | number
    delay?: string
    setShowDowntime: (value: downtimeModalType) => void
    index: number
    selected?: string
    report?: string
    showDowntime?: downtimeModalType
}

const SystemCard = (props: Props) => {
    const [lastDayData, setLastDayData] = useState<any[]>([])
    const [completeData, setCompleteData] = useState<any[]>([])
    const [lastDayChartData, setLastDayChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [completeChartData, setCompleteChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [loading, setLoading] = useState(true)
    const [showMoreDowntime, setShowMoreDowntime] = useState(false)
    const [status, setStatus] = useState<boolean | null | undefined>(null)
    const { darkMode, headerLoading, setHeaderLoading, isSuper } = useContext(AppContext)

    const chartHeight = '30vw'
    const chartWidth = '40vw'

    const {
        system,
        reportIssue,
        downtime,
        history,
        setSelected,
        setSelectedData,
        alerts,
        setModalChartOptions,
        lastCheck,
        delay,
        setShowDowntime,
        index,
        selected,
        report,
        showDowntime
    } = props

    const {
        _id,
        name,
        reportedlyDown,
        logo,
        raw,
        broadcastMessages,
        firstStatus
    } = system || {}

    useEffect(() => {
        if ((loading || (status !== false && status !== true)) && !headerLoading) setHeaderLoading(true)
    }, [loading, status])

    useEffect(() => {
        processChartData()
        setStatus(getCurrentStatus(system))
    }, [history, alerts, system])

    useEffect(() => {
        generateLastDayData()
    }, [lastDayData])

    const generateLastDayData = useCallback(() => {
        setLastDayChartData({
            labels: lastDayData.length ? lastDayData.map((el: statusType) => getDate(el.time)) : [],
            datasets: [
                {
                    data: lastDayData.length ? lastDayData.map((el: statusType) => el.status) : [],
                    backgroundColor: (ctx: any) => lastDayData[ctx.index] && lastDayData[ctx.index].reported ? darkMode ? 'white' : 'black' : 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 4,
                    label: 'Reported DOWN by user'
                },
                {
                    data: lastDayData.length ? lastDayData.map((el: statusType) => el.status) : [],
                    backgroundColor: 'transparent',
                    borderColor: reportedlyDown ? 'orange' : status ? darkMode ? '#00b000' : 'green' : 'red',
                    tension: .4,
                    borderWidth: 4,
                    pointBorderWidth: 0,
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem: any) => tooltipItem === 1 ? 'UP' : 'DOWN'
                        }
                    },
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
                    data: completeData.length ? completeData.map((el: statusType) => el.status) : [],
                    backgroundColor: (ctx: any) => completeData[ctx.index] && completeData[ctx.index].reported ? darkMode ? 'white' : 'black' : 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 4,
                    label: 'Reported DOWN by user'
                },
                {
                    data: completeData.length ? completeData.map((el: statusType) => el.status) : [],
                    backgroundColor: 'transparent',
                    borderColor: reportedlyDown ? 'orange' : status ? darkMode ? '#00b000' : 'green' : 'red',
                    tension: .4,
                    pointBorderWidth: 0,
                    borderWidth: 4,
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem: any) => tooltipItem === 1 ? 'UP' : 'DOWN'
                        }
                    },
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
            new Date(time).toLocaleDateString('sv-SE')
            + ' - '
            + new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            : 'No data'
        const parsed = string.split(' - ')
        return parsed[1] + ' - ' + parsed[0]
    }

    const processChartData = () => {
        /* Process datasets for cards and modals (two weeks) 
        and calculates user alerts to add them as a top layer 
        on the graphs (dots) */
        const reportedHours: string[] = []

        alerts?.forEach((el: alertType) => {
            if (el.createdAt) {
                const date = new Date(el.createdAt)
                date.setMinutes(0)
                date.setSeconds(0)
                reportedHours.push(date.toLocaleString())
            }
        })

        let twoWeeksSet = processSet(336) // Two weeks = 336 h
        const lastDaySet = twoWeeksSet.slice(Math.max(twoWeeksSet.length - 24, 0)) // take the last 24 hours for cards

        setLastDayData(lastDaySet.map(item => {
            if (reportedHours.includes(item.time.toLocaleString())) {
                return { ...item, reported: true }
            }
            return item
        }))

        setCompleteData(twoWeeksSet.map(item => {
            if (reportedHours.includes(item.time.toLocaleString())) {
                return { ...item, reported: true }
            }
            return item
        }))

        setLoading(false)
    }

    const processSet = (hourSet: number = 336) => {
        if (!history || !history.length) return []
        const firstRegister = history[history.length - 1]
        const lastRegister = history[0]
        const lastStatus = lastRegister.status ? 1 : 0
        const firstTime = new Date(firstRegister.createdAt || new Date())
        const lastTime = new Date(lastRegister.createdAt || new Date())
        firstTime.setMinutes(0)
        firstTime.setSeconds(0)
        lastTime.setMinutes(0)
        lastTime.setSeconds(0)

        const allHours = new Map()
        history.reverse().forEach(register => {
            const time = new Date(register.createdAt || new Date)
            time.setMinutes(0)
            time.setSeconds(0)

            if (allHours.get(time.toLocaleString())) {
                // If the hour is already registered, we decide which one stays 
                // based on how much time has passed (>3 mins)
                const currentTime = new Date(register.createdAt || new Date()).getTime()
                const prevTime = new Date(allHours.get(time.toLocaleString()).createdAt || new Date()).getTime()

                // If new status is UP in short time, we overwrite. 
                // We just overwrite with DOWN when more than 3 minutes passed.
                if (register.status || currentTime - prevTime > 180000) {
                    allHours.set(
                        time.toLocaleString(),
                        { ...register, status: register.status ? 1 : 0 }
                    )
                }
            } else {
                allHours.set(
                    time.toLocaleString(),
                    { ...register, status: register.status ? 1 : 0 }
                )
            }
        })

        let prevStatus = 1
        const set = Array.from({ length: hourSet }).map((_, i) => {
            const time = getDateWithGivenHour(hourSet - i)
            let status = firstStatus ? 1 : 0

            if (new Date(time).getTime() <= new Date(firstTime).getTime()) {
                // Copy all status from the left to the first registered
                if (allHours.get(firstTime)) status = allHours.get(firstTime).status
            }
            else if (new Date(time).getTime() >= new Date(lastTime).getTime()) {
                status = lastStatus
            }
            else if (allHours.get(time)) {
                const register = allHours.get(time)
                status = register.status
                prevStatus = register.status
            }
            // Copy status in between registered statuses
            else status = prevStatus

            return {
                time,
                status
            }
        })
        return set
    }

    const getDowntime = (event: eventType) => {
        if (event && event.start && event.end) {
            return (
                <span>
                    <span className={`systemcard__event-time${darkMode ? '--dark' : ''}`}>{getDate(event.start)}</span>
                    <span style={{ fontWeight: 'normal' }}> ➜ </span>
                    <span className={`systemcard__event-time${darkMode ? '--dark' : ''}`}>{getDate(event.end)}</span>
                    <p className="systemcard__event-note">{event.note}</p>
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

    const getCurrentStatus = (system: systemType | undefined) => {
        const lastHistory: historyType | null = history ? history.find((status: eventType) => status.systemId === system?._id) || null : null
        return lastHistory ? lastHistory.status : null
    }

    const hasPageMessage = () => {
        const json = JSON.parse(broadcastMessages || '[]')
        const banners = json && typeof json === 'string' ? JSON.parse(json) : []
        const hasBanner = Array.isArray(banners) ? banners.filter((message: dataObj) =>
            message.ends_at && new Date(message.ends_at).getTime() - new Date().getTime() > 0) : ''
        return isSuper && (raw?.includes('plugins/banner/static/banner.js') || hasBanner.length)
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
                        return lastDayData[ctx.dataIndex].status ? 'UP' : 'DOWN'
                    },
                    labelColor: (ctx: any) => {
                        return {
                            backgroundColor: lastDayData[ctx.dataIndex].reported ? darkMode ? 'white' : 'black' : lastDayData[ctx.dataIndex].status ? 'green' : 'red',
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
                    display: true,
                    drawBorder: false,
                    drawChartArea: false,
                    color: darkMode ? '#333333' : '#dbdbdb'
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
                    display: true,
                    drawBorder: false,
                    drawChartArea: false,
                    color: darkMode ? '#333333' : '#dbdbdb'
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
                        return completeData[ctx.dataIndex].status ? 'UP' : 'DOWN'
                    },
                    labelColor: (ctx: any) => {
                        return {
                            backgroundColor: completeData[ctx.dataIndex].reported ? darkMode ? 'white' : 'black' : completeData[ctx.dataIndex].status ? 'green' : 'red',
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
                    display: true,
                    drawBorder: false,
                    drawChartArea: false,
                    color: darkMode ? '#333333' : '#dbdbdb'
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
                    display: true,
                    drawBorder: false,
                    drawChartArea: false,
                    color: (ctx: any) => ctx.tick.value !== .5 ? darkMode ? '#333333' : '#dbdbdb' : 'transparent'
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
                        borderColor: darkMode ? 'gray' : '#d3d3d361',
                        // borderColor: loading ? 'gray' : status ? 'green' : 'red',
                        backgroundImage: loading || (status !== false && status !== true) ? '' : darkMode ?
                            `linear-gradient(to bottom right, #000000, ${status ? '#00600085' : '#7000008c'})`
                            :
                            `linear-gradient(to bottom right, white, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`
                    }}>
                    <div className="systemcard__header" onClick={selectSystem}>
                        <h1 className="systemcard__name">{hasPageMessage() ? '️⚠️ ' : ''}{name || 'Api Name'}</h1>
                        {logo ? <img src={logo} alt="System Logo" className="systemcard__logo" /> : ''}
                    </div>
                    {loading || (status !== false && status !== true) ?
                        SystemCardPlaceholderBlock(darkMode)
                        :
                        <div className="systemcard__graph" onClick={selectSystem}>
                            {!selected && !report && !showDowntime ? <Line data={lastDayChartData} height={chartHeight} width={chartWidth} options={chartOptions} /> : ''}
                        </div>}
                    <div className="systemcard__footer">
                        <h2
                            className="systemcard__status"
                            style={{ color: loading ? 'gray' : reportedlyDown ? 'orange' : status ? darkMode ? '#00b000' : 'green' : 'red' }}>
                            {loading || (status !== false && status !== true) ? <p style={{ color: 'gray' }}>Checking status...</p> :
                                <>
                                    <span style={{ animation: selected || report ? 'none' : '' }} className='systemcard__status-dot'>●</span>
                                    &nbsp;&nbsp;Status:&nbsp;
                                    <strong>{reportedlyDown ? 'Problem' : status ? 'UP' : 'DOWN'}
                                    </strong>
                                </>
                            }
                        </h2>
                        {status ? <Button
                            label='Report Issue'
                            handleClick={() => reportIssue(_id || '')}
                            bgColor={darkMode ? APP_COLORS.GRAY_ONE : APP_COLORS.GRAY_THREE}
                            textColor={darkMode ? 'white' : 'black'} />
                            : !loading && (status || status === false) && lastCheck ?
                                <p style={{ color: darkMode ? 'lightgray' : 'gray' }} className="systemcard__status-caption">{lastCheck}</p>
                                : ''}
                    </div>
                </div>
                {downtime && downtime.length ?
                    <div
                        className={`systemcard__event${darkMode ? '--dark' : ''}`}
                        style={{
                            backgroundColor: isLiveDowntime(downtime[0]) ? darkMode ?
                                'black' : '#ff6161' : darkMode ?
                                'black' : '#fcd9a563',
                            border: isLiveDowntime(downtime[0]) ? '1px solid red'
                                : darkMode ? '1px solid orange' : '1px solid #ffa50069'
                        }}
                        onMouseEnter={() => setShowMoreDowntime(true)}
                        onMouseLeave={() => setShowMoreDowntime(false)}>
                        <p className="systemcard__event-title">Planned downtime:</p>
                        {downtime.map((time, i) =>
                            <div
                                key={i}
                                className="systemcard__event-downtime"
                                onClick={() => setShowDowntime({ ...time, system, index })}
                                style={{
                                    borderTop: i > 0 ? '1px solid gray' : '',
                                    paddingTop: i > 0 ? '1rem' : '',
                                    marginTop: i > 0 ? '1rem' : '',
                                    display: i > 0 && !showMoreDowntime ? 'none' : ''
                                }}>{getDowntime(time)}</div>)}
                    </div>
                    : ''}
            </>
        </div >
    )
}

export default React.memo(SystemCard)