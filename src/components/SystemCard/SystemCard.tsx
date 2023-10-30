import React from 'react'
import Button from '../Button/Button'

type Props = {
    _id?: string
    name?: string
    status?: boolean
    url?: string
    type?: string
    description?: string
    timeout?: number
    interval?: number
    createdBy?: string
    modifiedBy?: string
    reportIssue: (value: string) => void
    updatedAt?: Date
    downtime?: any
}

export default function SystemCard(props: Props) {

    const {
        _id,
        name,
        status,
        url,
        type,
        description,
        timeout,
        interval,
        createdBy,
        modifiedBy,
        reportIssue,
        updatedAt,
        downtime
    } = props

    const getDate = (date: Date | undefined) => {
        return date ? new Date(date).toLocaleDateString() : 'No data'
    }

    const getDowntime = (schedule: any) => {
        if (schedule && schedule.start && schedule.end) {
            return `${getDate(schedule.start)} to ${getDate(schedule.end)}`
        }
        else return 'No data'
    }

    return (
        <div className="systemcard__wrapper">
            <div className="systemcard__container">
                <div className="systemcard__header">
                    <h1 className="systemcard__name">{name || 'Api Name'}</h1>
                    <h2 className="systemcard__status">{status || 'Loading'}</h2>
                </div>
                <div className="systemcard__graph">GRAPH</div>
                <div className="systemcard__footer">
                    <div className="systemcard__details">
                        <h4 className="systemcard__url">{url || 'https://apiexample.com/'}</h4>
                        <h4 className="systemcard__updatedAt">Last updated: {getDate(updatedAt)}</h4>
                    </div>
                    <Button
                        label='Report Issue'
                        handleClick={() => reportIssue(_id || '')}
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