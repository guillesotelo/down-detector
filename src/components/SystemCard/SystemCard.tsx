import { useContext, useEffect, useState } from 'react'
import Button from '../Button/Button'
import { Line } from 'react-chartjs-2'
import { alertType, downtimeModalType, eventType, historyType, statusType, systemType } from '../../types'
import { AppContext } from '../../AppContext'
import { registerables, Chart } from 'chart.js';
import { APP_COLORS } from '../../constants/app'
import PuffLoader from "react-spinners/PuffLoader"
Chart.register(...registerables);

type Props = {
    system?: systemType
    status?: boolean
    reportIssue: (value: string) => void
    downtime?: { start?: Date, end?: Date }[]
    history?: historyType[]
    alerts?: alertType[]
    setSelected: (value: string) => void
    setSelectedData: (value: systemType) => void
    setModalChartOptions: (value: systemType[]) => void
    lastCheck?: Date
    delay?: string
    setShowDowntime: (value: downtimeModalType) => void
    index: number
}

export default function SystemCard(props: Props) {
    const [lastDayData, setLastDayData] = useState<any[]>([])
    const [completeData, setCompleteData] = useState<any[]>([])
    const [lastDayChartData, setLastDayChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [completeChartData, setCompleteChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [loading, setLoading] = useState(true)
    const [showMoreDowntime, setShowMoreDowntime] = useState(false)
    const { darkMode, headerLoading, setHeaderLoading } = useContext(AppContext)

    const chartHeight = '30vw'
    const chartWidth = '40vw'

    const {
        system,
        status,
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
        index
    } = props

    const {
        _id,
        url,
        name,
        type,
        description,
        timeout,
        interval,
        createdBy,
        updatedBy,
        updatedAt,
        lastCheckStatus,
        reportedlyDown,
        logo
    } = system || {}

    const timeOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }

    useEffect(() => {
        if (!headerLoading) setHeaderLoading(true)
    }, [loading])

    useEffect(() => {
        processChartData()
    }, [history, system, alerts])

    useEffect(() => {
        setLastDayChartData({
            labels: lastDayData.length ? lastDayData.map((el: statusType) => getDate(el.time)) : [],
            datasets: [
                {
                    data: lastDayData.length ? lastDayData.map((el: statusType) => el.status) : [],
                    backgroundColor: (ctx: any) => lastDayData[ctx.index] && lastDayData[ctx.index].reported ? darkMode ? 'white' : 'black' : 'transparent',
                    borderColor: 'transparent',
                    label: 'Reported DOWN by user'
                },
                {
                    data: lastDayData.length ? lastDayData.map((el: statusType) => el.status) : [],
                    backgroundColor: 'transparent',
                    borderColor: status ? 'green' : 'red',
                    tension: .4,
                    pointBorderWidth: 0,
                    label: 'Status',
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem: any) => tooltipItem === 1 ? 'UP' : 'DOWN'
                        }
                    },
                }
            ]
        })

        setCompleteChartData({
            labels: completeData.length ? completeData.map(el => parseCompleteDataTime(el.time)) : [],
            datasets: [
                {
                    data: completeData.length ? completeData.map((el: statusType) => el.status) : [],
                    backgroundColor: (ctx: any) => completeData[ctx.index] && completeData[ctx.index].reported ? darkMode ? 'white' : 'black' : 'transparent',
                    borderColor: 'transparent',
                    label: 'Reported DOWN by user'
                },
                {
                    data: completeData.length ? completeData.map((el: statusType) => el.status) : [],
                    backgroundColor: 'transparent',
                    borderColor: status ? 'green' : 'red',
                    tension: .4,
                    pointBorderWidth: 0,
                    label: 'Status',
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem: any) => tooltipItem === 1 ? 'UP' : 'DOWN'
                        }
                    },
                }
            ]
        })

    }, [lastDayData, completeData])

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
        const reportedHours: string[] = []

        alerts?.forEach((el: alertType) => {
            const date = new Date(el.createdAt || new Date())
            date.setMinutes(0)
            date.setSeconds(0)
            reportedHours.push(date.toLocaleString())
        })

        const lastDay = processLastDayHistory()
        let complete = processCompleteHistory()

        setLastDayData(lastDay.map(item => {
            if (reportedHours.includes(item.time.toLocaleString())) {
                return { ...item, reported: true }
            }
            return item
        }))

        complete = complete.map(item => {
            if (reportedHours.includes(item.time.toLocaleString())) {
                return { ...item, reported: true }
            }
            return item
        })

        setCompleteData(complete)
        setLoading(false)
    }

    const processLastDayHistory = () => {
        const downHours: string[] = []
        const upHours: string[] = []
        const allHours: statusType[] = []

        history?.forEach((el: historyType) => {
            const date = new Date(el.createdAt || new Date())
            date.setMinutes(0)
            date.setSeconds(0)

            if (!el.status) downHours.push(date.toLocaleString())
            else upHours.push(date.toLocaleString())
            allHours.push({ time: date, status: el.status ? 1 : 0 })
        })

        const getDateWithGivenHour = (hour: number) => {
            const today = new Date()
            today.setMinutes(0)
            today.setSeconds(0)
            today.setHours(today.getHours() - hour)
            return today
        }

        let status: statusType[] = Array.from({ length: 24 }).map((_, i) => {
            return {
                status: 1,
                time: getDateWithGivenHour(i)
            }
        }).reverse()

        const copyLastStatus = (status: statusType[], last: statusType) => {
            return status.map((item, i) => {
                const newItem = { ...item }
                // Replicate last saved register to the rest of status until now
                if (new Date(last.time).getTime() <= new Date(newItem.time).getTime()) {
                    newItem.status = last.status
                }
                else if (downHours.includes(newItem.time.toLocaleString())) {
                    newItem.status = 0
                }
                return newItem
            })
        }

        return allHours.length ? copyLastStatus(status, allHours[0]) : []
    }

    const processCompleteHistory = () => {
        const downHours: string[] = []
        const upHours: string[] = []
        const allHours: statusType[] = []
        const systemStatus = history?.filter((status: historyType) => status.systemId === _id)
        const firstStatus = systemStatus?.length ? systemStatus[systemStatus.length - 1] : null
        const firstCheck = firstStatus ? firstStatus.createdAt : null
        const timeSinceFirstCheck = Math.floor((new Date().getTime() - new Date(firstCheck || new Date()).getTime()) / 3600000) + 2

        history?.forEach((el: historyType) => {
            const date = new Date(el.createdAt || new Date())
            date.setMinutes(0)
            date.setSeconds(0)

            if (!el.status) downHours.push(date.toLocaleString())
            else upHours.push(date.toLocaleString())
            allHours.push({ time: date, status: el.status ? 1 : 0 })
        })

        const getDateWithGivenHour = (hour: number) => {
            const today = new Date()
            today.setMinutes(0)
            today.setSeconds(0)
            today.setHours(today.getHours() - hour)
            return today
        }

        let status: statusType[] = Array.from({ length: timeSinceFirstCheck }).map((_, i) => {
            return {
                status: 1,
                time: getDateWithGivenHour(i)
            }
        }).reverse()

        const copyLastStatus = (status: statusType[], last: statusType) => {
            return status.map((item, i) => {
                const newItem = { ...item }
                // Replicate last saved register to the rest of status until now
                if (new Date(last.time).getTime() <= new Date(newItem.time).getTime()) {
                    newItem.status = last.status
                }
                else if (downHours.includes(newItem.time.toLocaleString())) {
                    newItem.status = 0
                }

                return newItem
            })
        }
        return allHours.length ? copyLastStatus(status, allHours[0]) : []
    }

    const getDate = (date: Date | undefined) => {
        return date ? new Date(date).toLocaleString('es',
            { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
            : 'No data'
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
        setSelected(system?._id || '')
        setSelectedData(completeChartData)
        setModalChartOptions(completeChartOptions)
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
                        return label
                    }
                }
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
                    drawChartArea: false
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
                    drawChartArea: false
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
                        return label
                    }
                }
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
                    // display: false,
                    // drawBorder: false,
                    // drawChartArea: false
                }
            },
            y: {
                // beginAtZero: true,
                border: {
                    // display: false
                },
                ticks: {
                    display: false
                },
                grid: {
                    // display: false,
                    // drawBorder: false,
                    // drawChartArea: false
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
                        backgroundImage: loading ? '' : darkMode ?
                            `linear-gradient(to bottom right, #252525, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`
                            :
                            `linear-gradient(to bottom right, white, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`
                    }}
                >
                    <div className="systemcard__header">
                        <h1 className="systemcard__name">{name || 'Api Name'}</h1>
                        {logo ? <img src={logo} alt="System Logo" className="systemcard__logo" /> : ''}
                    </div>
                    {loading ?
                        <div className='systemcard__loading'>
                            <PuffLoader color='lightgray' size={40} />
                        </div>
                        :
                        <div className="systemcard__graph" onClick={selectSystem}>
                            <Line data={lastDayChartData} height={chartHeight} width={chartWidth} options={chartOptions} />
                        </div>}
                    <div className="systemcard__footer">
                        <h2
                            className="systemcard__status"
                            style={{ color: loading ? 'gray' : status ? 'green' : 'red' }}>
                            {loading ? <p style={{ color: 'gray' }}>Checking status...</p> :
                                <><span className='systemcard__status-dot'>●</span> &nbsp;&nbsp;Status: <strong>{reportedlyDown ? 'Reported' : status ? 'UP' : 'DOWN'}</strong></>
                            }
                        </h2>
                        <Button
                            label='Report Issue'
                            handleClick={() => reportIssue(_id || '')}
                            bgColor={darkMode ? APP_COLORS.GRAY_ONE : APP_COLORS.GRAY_THREE}
                            textColor={darkMode ? 'white' : 'black'}
                        />
                    </div>
                </div>
                {downtime && downtime.length ?
                    <div
                        className={`systemcard__event${darkMode ? '--dark' : ''}`}
                        style={{
                            backgroundColor: isLiveDowntime(downtime[0]) ? darkMode ?
                                'black' : '#ff6161' : darkMode ?
                                'black' : '#fcd9a5',
                            border: isLiveDowntime(downtime[0]) ? '1px solid red' : '1px solid orange'
                        }}
                        onMouseEnter={() => setShowMoreDowntime(true)}
                        onMouseLeave={() => setShowMoreDowntime(false)}
                    >
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
        </div>
    )
}