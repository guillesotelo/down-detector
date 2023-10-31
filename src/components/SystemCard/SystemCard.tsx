import React from 'react'
import Button from '../Button/Button'
import { dataObj } from '../../types'

type Props = {
    system?: any
    status?: boolean
    reportIssue: (value: string) => void
    downtime?: any
}

export default function SystemCard(props: Props) {

    const {
        system,
        status,
        reportIssue,
        downtime
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
                <div className="systemcard__graph">GRAPH</div>
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