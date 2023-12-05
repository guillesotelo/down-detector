import React from 'react'

type Props = {
    label: string
    on: string
    off: string
    value: boolean
    setValue: (value: boolean) => void
}

export default function Switch({ label, on, off, value, setValue }: Props) {
    return (
        <div
            className="switch__container"
            onClick={() => setValue(!value)}
        >
            {label ? <p className="switch__label">{label}</p> : ''}
            <div
                className="switch__row"
                style={{
                    backgroundColor: value ? '#e5f0e5' : '#e9d8d8',
                }}>
                <p className="switch__on">{on}</p>
                <p className={`switch__slider${value ? '--on' : '--off'}`} >|||</p>
                <p className="switch__off">{off}</p>
            </div>
        </div>
    )
}