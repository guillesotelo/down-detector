import React, { useContext } from 'react'
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
}

export default function SystemCard(props: Props) {
    const { isLoggedIn, isSuper, isMobile } = useContext(AppContext)

    const chartHeight = isMobile ? 350 : '30vw'
    const chartWidth = isMobile ? window.outerWidth * 0.9 : '40vw'

    const {
        system,
        status,
        reportIssue,
        downtime,
        history
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
    } = system

    const timeOptions: any = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }

    const getLastDayData = (history: dataObj[], type: string) => {
        const hours = history.map(el => new Date(el.createdAt).getHours())
        const time: any = {}

        history.forEach(el => {
            const date = new Date(el.createdAt)
            time[date.getHours()] = date.toLocaleTimeString([], timeOptions)
        })

        const status = Array.from({ length: 23 }).map((_, i) => {
            if (hours.includes(i)) return { status: 0, time: time[i] }
            return { status: 1, time: time[i] }
        })

        return type === 'data' ? status.map(el => el.status) : status.map(el => el.time)
    }

    const chartData = {
        labels: Array.isArray(history) ? getLastDayData(history, 'labels') : [],
        datasets: [{
            data: Array.isArray(history) ? getLastDayData(history, 'data') : [],
            backgroundColor: status ? 'green' : 'red',
            borderColor: status ? 'green' : 'red'
        }]
    }

    const chartOptions: any = {
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
            legend: {
                display: false
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
                    // display: false
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

    const getDate = (date: Date | undefined) => {
        return date ? new Date(date).toLocaleString('es') : 'No data'
    }

    const getDowntime = (schedule: any) => {
        if (schedule && schedule.start && schedule.end) {
            return `${getDate(schedule.start)} to ${getDate(schedule.end)}`
        }
        else return 'No data'
    }

    return (
        <div className="systemcard__wrapper">
            <div className="systemcard__container" style={{ borderColor: status ? 'green' : 'red' }}>
                <div className="systemcard__header">
                    <h1 className="systemcard__name">{name || 'Api Name'}</h1>
                    <h2
                        className="systemcard__status"
                        style={{ color: status ? 'green' : 'red' }}>
                        ● &nbsp;Status: <strong>{status ? 'UP' : 'DOWN'}</strong>
                    </h2>
                </div>
                <div className="systemcard__graph">
                    <Line data={chartData} height={chartHeight} width={chartWidth} options={chartOptions} />
                </div>
                <h4 className="systemcard__url">{url || 'https://apiexample.com/'}</h4>
                <div className="systemcard__footer">
                    <div className="systemcard__details">
                        <h4 className="systemcard__updatedAt">Last updated: <br />{getDate(updatedAt)}</h4>
                    </div>
                    <Button
                        label='Report Issue'
                        handleClick={() => reportIssue(_id || '-')}
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