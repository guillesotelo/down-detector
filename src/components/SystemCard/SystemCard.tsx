import React, { useContext, useEffect, useState, useMemo } from 'react'
import Button from '../Button/Button'
import { Line } from 'react-chartjs-2'
import { dataObj } from '../../types'
import { AppContext } from '../../AppContext'
import { registerables, Chart } from 'chart.js';
Chart.register(...registerables);

type Props = {
    system?: any
    status?: boolean
    reportIssue: (value: string) => void
    downtime?: any
    history?: any
    alerts?: any
    setSelected: (value: string) => void
    setSelectedData: (value: dataObj) => void
    setModalChartOptions: (value: dataObj[]) => void
}

export default function SystemCard(props: Props) {
    const [lastDayData, setLastDayData] = useState<any[]>([])
    const [completeData, setCompleteData] = useState<any[]>([])
    const [lastDayChartData, setLastDayChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [completeChartData, setCompleteChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const { darkMode } = useContext(AppContext)

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
        setModalChartOptions
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
        lastCheck,
        lastCheckStatus
    } = system

    const timeOptions: any = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }

    useEffect(() => {
        processChartData()
    }, [history, system, alerts])

    useEffect(() => {
        setLastDayChartData({
            labels: lastDayData.length ? lastDayData.map((el: dataObj) => getDate(el.time)) : [],
            datasets: [
                {
                    data: lastDayData.length ? lastDayData.map((el: dataObj) => el.status) : [],
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
                },
                {
                    data: lastDayData.length ? lastDayData.map((el: dataObj) => el.status) : [],
                    backgroundColor: (ctx: any) => lastDayData[ctx.index] && lastDayData[ctx.index].reported ? 'black' : 'transparent',
                    borderColor: 'transparent',
                    label: 'Reported DOWN by user'
                }
            ]
        })

        setCompleteChartData({
            labels: completeData.length ? completeData.map(el => parseCompleteDataTime(el.time)) : [],
            datasets: [
                {
                    data: completeData.length ? completeData.map((el: dataObj) => el.status) : [],
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
                },
                {
                    data: completeData.length ? completeData.map((el: dataObj) => el.status) : [],
                    backgroundColor: (ctx: any) => completeData[ctx.index] && completeData[ctx.index].reported ? 'black' : 'transparent',
                    borderColor: 'transparent',
                    label: 'Reported DOWN by user'
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

        alerts.forEach((el: dataObj) => {
            const date = new Date(el.createdAt)
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
    }

    const processLastDayHistory = () => {
        const downHours: string[] = []
        const upHours: string[] = []
        const allHours: dataObj[] = []

        history.forEach((el: dataObj) => {
            const date = new Date(el.createdAt)
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

        let status: dataObj[] = Array.from({ length: 24 }).map((_, i) => {
            return {
                status: 1,
                time: getDateWithGivenHour(i)
            }
        }).reverse()

        const copyLastStatus = (status: dataObj[], last: dataObj) => {
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
        const allHours: dataObj[] = []
        const systemStatus = history.filter((status: dataObj) => status.systemId === _id)
        const firstStatus = systemStatus.length ? systemStatus[systemStatus.length - 1] : null
        const firstCheck = firstStatus ? firstStatus.createdAt : null
        const timeSinceFirstCheck = Math.floor((new Date().getTime() - new Date(firstCheck).getTime()) / 3600000) + 2

        history.forEach((el: dataObj) => {
            const date = new Date(el.createdAt)
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

        let status: dataObj[] = Array.from({ length: timeSinceFirstCheck }).map((_, i) => {
            return {
                status: 1,
                time: getDateWithGivenHour(i)
            }
        }).reverse()

        const copyLastStatus = (status: dataObj[], last: dataObj) => {
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
        return date ? new Date(date).toLocaleString([], timeOptions) : 'No data'
    }

    const getDowntime = (schedule: any) => {
        if (schedule && schedule.start && schedule.end) {
            return `${getDate(schedule.start)} to ${getDate(schedule.end)}`
        }
        else return 'No data'
    }

    const selectSystem = () => {
        setSelected(system._id)
        setSelectedData(completeChartData)
        setModalChartOptions(completeChartOptions)
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
        <div className="systemcard__wrapper">
            <>
                <div
                    className={`systemcard__container${darkMode ? '--dark' : ''}`}
                    style={{
                        borderColor: status ? 'green' : 'red',
                        backgroundImage: darkMode ?
                            `linear-gradient(to bottom right, black, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`
                            :
                            `linear-gradient(to bottom right, white, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`
                    }}
                >
                    <div className="systemcard__header">
                        <h1 className="systemcard__name">{name || 'Api Name'}</h1>
                        <h2
                            className="systemcard__status"
                            style={{ color: status ? 'green' : 'red' }}>
                            <span className='systemcard__status-dot'>●</span>&nbsp;&nbsp;Status: <strong>{status ? 'UP' : 'DOWN'}</strong>
                        </h2>
                    </div>
                    <div className="systemcard__graph" onClick={selectSystem}>
                        <Line data={lastDayChartData} height={chartHeight} width={chartWidth} options={chartOptions} />
                    </div>
                    {/* <h4 className="systemcard__url">{url}</h4> */}
                    <div className="systemcard__footer">
                        <div className="systemcard__details">
                            <h4 className="systemcard__updatedAt">Updated: <br />{getDate(lastCheck)}</h4>
                        </div>
                        <Button
                            label='Report Issue'
                            handleClick={() => reportIssue(_id)}
                            bgColor='#C45757'
                            textColor='white'
                        />
                    </div>
                </div>
                {/* {downtime && downtime.start ? */}
                    <div className="systemcard__event">
                        <p className="systemcard__event-title">Planned downtime:</p>
                        <p className="systemcard__event-downtime">{getDowntime(downtime)}</p>
                    </div>
                    {/* : ''} */}
            </>
        </div>
    )
}