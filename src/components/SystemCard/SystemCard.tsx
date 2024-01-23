import React, { useCallback, useContext, useEffect, useState } from 'react'
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
    setSelectedData: (value: any) => void
    setModalChartOptions: (value: systemType[]) => void
    lastCheck?: string | number
    delay?: string
    setShowDowntime: (value: downtimeModalType) => void
    index: number
}

const SystemCard = (props: Props) => {
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
        name,
        reportedlyDown,
        logo
    } = system || {}

    useEffect(() => {
        if (loading && !headerLoading) setHeaderLoading(true)
    }, [loading])

    useEffect(() => {
        processChartData()
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
                    label: 'Reported DOWN by user'
                },
                {
                    data: lastDayData.length ? lastDayData.map((el: statusType) => el.status) : [],
                    backgroundColor: 'transparent',
                    borderColor: reportedlyDown ? 'orange' : status ? darkMode ? '#00b000' : 'green' : 'red',
                    tension: .4,
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
                    label: 'Reported DOWN by user'
                },
                {
                    data: completeData.length ? completeData.map((el: statusType) => el.status) : [],
                    backgroundColor: 'transparent',
                    borderColor: reportedlyDown ? 'orange' : status ? darkMode ? '#00b000' : 'green' : 'red',
                    tension: .4,
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
            const date = new Date(el.createdAt || new Date())
            date.setMinutes(0)
            date.setSeconds(0)
            reportedHours.push(date.toLocaleString())
        })

        let twoWeeksSet = processHistoryByHours(336) // two weeks = 336 hours
        const lastDaySet = twoWeeksSet.slice(Math.max(twoWeeksSet.length - 24, 0)) // take the last 24 hours for cards

        setLastDayData(lastDaySet.map(item => {
            if (reportedHours.includes(item.time.toLocaleString())) {
                return { ...item, reported: true }
            }
            return item
        }))

        twoWeeksSet = twoWeeksSet.map(item => {
            if (reportedHours.includes(item.time.toLocaleString())) {
                return { ...item, reported: true }
            }
            return item
        })

        setCompleteData(twoWeeksSet)
        setTimeout(() => setLoading(false), 1000)
    }

    const processHistoryByHours = (hours: number = 0) => {
        /* This is the main functions that processes the 
        complete system history based on the number of hours 
        passed as parameter. It creates a map of values with 
        the date and the status as key-value pairs for fast 
        indexing. */
        const allHours = new Map() // The complete system history with exact dates and status
        const flattenHours = new Map() // The complete system history with flatten dates (0 min, 0 sec) and status

        // Construct hour maps iterating the history
        let lastItem = {}
        history?.forEach((el: historyType) => {
            if (el.createdAt) {
                const hour = new Date(el.createdAt)
                const flatten = new Date(el.createdAt)
                flatten.setMinutes(0)
                flatten.setSeconds(0)

                if (flattenHours.has(flatten.toLocaleString())) {
                    // Check if there's more than 3 minutes between records to take them in account
                    const lastItemTime = new Date(Object.keys(lastItem)[0]).getTime()
                    const currentTime = hour.getTime()
                    if (currentTime - lastItemTime > 180000) {
                        allHours.set(hour.toLocaleString(), el.status ? 1 : 0)
                        flattenHours.set(flatten.toLocaleString(), el.status ? 1 : 0)
                        lastItem = { [hour.toLocaleString()]: el.status ? 1 : 0 }
                    }
                } else {
                    allHours.set(hour.toLocaleString(), el.status ? 1 : 0)
                    flattenHours.set(flatten.toLocaleString(), el.status ? 1 : 0)
                    lastItem = { [hour.toLocaleString()]: el.status ? 1 : 0 }
                }
            }
        })

        const getDateWithGivenHour = (hour: number) => {
            /* Build dates with given hours passed */
            const today = new Date()
            today.setMinutes(0)
            today.setSeconds(0)
            today.setHours(today.getHours() - hour)
            return today.toLocaleString()
        }

        // Build datasets with given hour maps and registered statuses
        let previousStatus = 0
        const dataset = Array.from({ length: hours + 3 }).map((_, i) => {
            let status = 0
            const entriesArray = Array.from(allHours.entries())
            const firstDate = entriesArray && entriesArray.length ? entriesArray[entriesArray.length - 1][0] : ''
            const lastDate = allHours.keys().next().value

            const item = {
                status,
                time: getDateWithGivenHour(hours - i + 1)
            }

            // Copy all status from the left to the first registered
            if (new Date(item.time).getTime() <= new Date(firstDate).getTime()) {
                item.status = allHours.get(firstDate)
                previousStatus = allHours.get(firstDate)
                // Copy all status to the right from the last registered
            } else if (new Date(item.time).getTime() >= new Date(lastDate).getTime()) {
                item.status = allHours.get(lastDate)
                previousStatus = allHours.get(lastDate)
            } else {
                const currentDate = item.time.toLocaleString()
                if (flattenHours.has(currentDate)) {
                    item.status = flattenHours.get(currentDate)
                    previousStatus = flattenHours.get(currentDate)
                } else item.status = previousStatus
            }
            return item
        })
        return dataset
    }

    const getDate = (date: Date | number | undefined) => {
        return date ? new Date(date).toLocaleString('sv-SE',
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
                    display: false,
                    drawBorder: false,
                    drawChartArea: false
                }
            },
            y: {
                // beginAtZero: true,
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

    return (
        <div className="systemcard__wrapper" style={{ animationDelay: `${delay || '0'}` }}>
            <>
                <div
                    className={`systemcard__container${darkMode ? '--dark' : ''}`}
                    style={{
                        borderColor: darkMode ? 'gray' : '#d3d3d361',
                        // borderColor: loading ? 'gray' : status ? 'green' : 'red',
                        backgroundImage: loading ? '' : darkMode ?
                            `linear-gradient(to bottom right, #000000, ${status ? '#00600085' : '#7000008c'})`
                            :
                            `linear-gradient(to bottom right, white, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`
                    }}
                >
                    <div className="systemcard__header" onClick={selectSystem}>
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
                            style={{ color: loading ? 'gray' : reportedlyDown ? 'orange' : status ? darkMode ? '#00b000' : 'green' : 'red' }}>
                            {loading ? <p style={{ color: 'gray' }}>Checking status...</p> :
                                <>
                                    <span className='systemcard__status-dot'>●</span>
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
                            textColor={darkMode ? 'white' : 'black'}
                        />
                            : !loading && lastCheck ?
                                <p style={{ color: darkMode ? 'lightgray' : 'gray' }} className="systemcard__status-caption">For {lastCheck} min</p>
                                : ''}
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

export default React.memo(SystemCard)