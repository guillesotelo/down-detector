import React, { SyntheticEvent, useContext } from 'react'
import { AppContext } from '../../AppContext'

type Props = {
    name: string
    updateData?: (name: string, e: SyntheticEvent) => void
    className?: string
    type?: string
    label?: string
    placeholder?: string
    value?: string | number
    cols?: number
    rows?: number
    style?: { [key: string | number]: any }
    disabled?: boolean
}

export default function InputField(props: Props) {
    const { darkMode } = useContext(AppContext)
    const {
        value,
        name,
        label,
        updateData,
        className,
        type,
        placeholder,
        cols,
        rows,
        style,
        disabled
    } = props

    return type === 'textarea' ?
        <div className='inputfield__container' style={style}>
            {label ? <h2 className={`inputfield__label${darkMode ? '--dark' : ''}`}>{label}</h2> : ''}
            <textarea
                className={className || `textarea__default${darkMode ? '--dark' : ''}`}
                placeholder={placeholder || ''}
                onChange={e => updateData ? updateData(name, e) : null}
                value={value}
                cols={cols}
                rows={rows}
            />
        </div>
        :
        <div className='inputfield__container' style={style}>
            {label ? <h2 className={`inputfield__label${darkMode ? '--dark' : ''}`}>{label}</h2> : ''}
            <input
                type={type || 'text'}
                className={className || `inputfield__default${darkMode ? '--dark' : ''}`}
                placeholder={placeholder || ''}
                onChange={e => updateData ? updateData(name, e) : null}
                value={value}
                disabled={disabled}
            />
        </div>
}