import React from 'react'

type Props = {
    label?: string
    value?: string | number
    row?: boolean
}

export default function TextData({ label, value, row }: Props) {
    return (
        <div
            className="textdata__container"
            style={{
                flexDirection: row ? 'row' : 'column',
                gap: row ? '1rem' : ''
            }}>
            <p className="textdata__label">{label}</p>
            <p className="textdata__value">{value}</p>
        </div>
    )
}