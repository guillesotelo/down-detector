import React from 'react'

type Props = {
    label?: string
    value?: string | number
    inline?: boolean
}

export default function TextData({ label, value, inline }: Props) {
    return (
        <div
            className="textdata__container"
            style={{
                flexDirection: inline ? 'row' : 'column',
                gap: inline ? '1rem' : ''
            }}>
            <p className="textdata__label">{label}</p>
            <p className="textdata__value" style={{ marginTop: !inline ? '.2rem' : '' }}>{value}</p>
        </div>
    )
}