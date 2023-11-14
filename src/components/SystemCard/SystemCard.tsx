import React, { useContext, useEffect, useState } from 'react'
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
    setSelected: (value: string) => void
    setSelectedData: (value: dataObj) => void
}

export default function SystemCard(props: Props) {
    const [lastDayChartData, setLastDayChartData] = useState<any>({ datasets: [{}], labels: [''] })
    const [completeChartData, setCompleteChartData] = useState<any>({ datasets: [{}], labels: [''] })

    const chartHeight = '30vw'
    const chartWidth = '40vw'

    const {
        system,
        status,
        reportIssue,
        downtime,
        history,
        setSelected,
        setSelectedData
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
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }

    useEffect(() => {
        setLastDayChartData({
            labels: Array.isArray(history) ? getLastDayHistory(history, 'labels') : [],
            datasets: [
                {
                    data: Array.isArray(history) ? getLastDayHistory(history, 'data') : [],
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
                    data: Array.isArray(history) ? getLastDayReports(history, 'data') : [],
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
            labels: Array.isArray(history) ? getCompleteHistory(history, 'labels') : [],
            datasets: [{
                data: Array.isArray(history) ? getCompleteHistory(history, 'data') : [],
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
            }]
        })

    }, [history, system])

    const getLastDayReports = (history: dataObj[], type: string) => {
        const downHours: string[] = []
        const upHours: string[] = []
        const allHours: dataObj[] = []

        history.forEach(el => {
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

        let status: dataObj[] = Array.from({ length: 23 }).map((_, i) => {
            return {
                status: 0,
                time: getDateWithGivenHour(i),
                index: i
            }
        }).reverse()

        const copyLastStatus = (status: dataObj[], last: dataObj) => {
            let previousStatus: number = 0
            return status.map((item, i) => {
                // Replicate last saved register to the rest of status until now
                if (new Date(last.time).getTime() <= new Date(item.time).getTime()) {
                    item.status = last.status
                }
                else if (upHours.includes(item.time.toLocaleString())) {
                    item.status = 1
                    previousStatus = 1
                }
                else if (downHours.includes(item.time.toLocaleString())) {
                    item.status = 0
                    previousStatus = 0
                }
                // Replicate status between two registered status
                else item.status = previousStatus

                return item
            })
        }

        status = copyLastStatus(status, allHours[0])

        return type === 'data' ? status.map(el => el.status) : status.map(el => getDate(el.time))
    }

    const getLastDayHistory = (history: dataObj[], type: string) => {
        const downHours: string[] = []
        const upHours: string[] = []
        const allHours: dataObj[] = []

        history.forEach(el => {
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

        let status: dataObj[] = Array.from({ length: 23 }).map((_, i) => {
            return {
                status: 0,
                time: getDateWithGivenHour(i),
                index: i
            }
        }).reverse()

        const copyLastStatus = (status: dataObj[], last: dataObj) => {
            let previousStatus: number = 0
            return status.map((item, i) => {
                // Replicate last saved register to the rest of status until now
                if (new Date(last.time).getTime() <= new Date(item.time).getTime()) {
                    item.status = last.status
                }
                else if (upHours.includes(item.time.toLocaleString())) {
                    item.status = 1
                    previousStatus = 1
                }
                else if (downHours.includes(item.time.toLocaleString())) {
                    item.status = 0
                    previousStatus = 0
                }
                // Replicate status between two registered status
                else item.status = previousStatus

                return item
            })
        }

        status = copyLastStatus(status, allHours[0])

        return type === 'data' ? status.map(el => el.status) : status.map(el => getDate(el.time))
    }

    const getCompleteHistory = (history: dataObj[], type: string) => {
        const downHours: string[] = []
        const upHours: string[] = []
        const allHours: dataObj[] = []
        const systemStatus = history.filter(status => status.systemId === _id)
        const firstStatus = systemStatus.length ? systemStatus[systemStatus.length - 1] : null
        const firstCheck = firstStatus ? firstStatus.createdAt : null
        const timeSinceFirstCheck = Math.floor((new Date().getTime() - new Date(firstCheck).getTime()) / 3600000) + 2

        history.forEach(el => {
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
                status: 0,
                time: getDateWithGivenHour(i),
                index: i
            }
        }).reverse()

        const copyLastStatus = (status: dataObj[], last: dataObj) => {
            let previousStatus: number = 0
            return status.map((item, i) => {
                // Replicate last saved register to the rest of status until now
                if (new Date(last.time).getTime() <= new Date(item.time).getTime()) {
                    item.status = last.status
                }
                else if (upHours.includes(item.time.toLocaleString())) {
                    item.status = 1
                    previousStatus = 1
                }
                else if (downHours.includes(item.time.toLocaleString())) {
                    item.status = 0
                    previousStatus = 0
                }
                // Replicate status between two registered status
                else item.status = previousStatus

                return item
            })
        }
        status = copyLastStatus(status, allHours[0])

        // console.log('timeSinceFirstCheck', timeSinceFirstCheck)
        // console.log('SYSTEM', name)
        // console.log('history', history)
        // console.log('status', status)
        // console.log('allHours', allHours)
        // console.log('upHours', upHours)
        // console.log('downHours', downHours)
        // console.log('\n\n')
        return type === 'data' ? status.map(el => el.status) : status.map(el => getDate(el.time).replace(',', ' -'))
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

    return (
        <div className="systemcard__wrapper">
            <div
                className="systemcard__container"
                style={{
                    borderColor: status ? 'green' : 'red',
                    backgroundImage: `linear-gradient(to bottom right, white, ${status ? 'rgba(0, 128, 0, 0.120)' : 'rgba(255, 0, 0, 0.120)'})`
                }}
            >
                <div className="systemcard__header">
                    <h1 className="systemcard__name">{name || 'Api Name'}</h1>
                    <h2
                        className="systemcard__status"
                        style={{ color: status ? 'green' : 'red' }}>
                        <span className='systemcard__status-dot'>●</span> &nbsp;Status: <strong>{status ? 'UP' : 'DOWN'}</strong>
                    </h2>
                </div>
                <div className="systemcard__graph" onClick={selectSystem}>
                    <Line data={lastDayChartData} height={chartHeight} width={chartWidth} options={chartOptions} />
                </div>
                <h4 className="systemcard__url">{url || 'https://apiexample.com/'}</h4>
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
            {downtime && downtime.start ?
                <div className="systemcard__event">
                    <p className="systemcard__event-title">Planned downtime:</p>
                    <p className="systemcard__event-downtime">{getDowntime(downtime)}</p>
                </div>
                : ''}
        </div>
    )
}