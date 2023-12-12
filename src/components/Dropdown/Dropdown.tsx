import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { dataObj } from '../../types'
import { AppContext } from '../../AppContext'

type Props = {
    label: string
    options: any[]
    value: string | number
    objKey?: string | number
    selected: any
    setSelected: (value: any) => void
    isTime?: boolean
    isDate?: boolean
    locale?: string
    maxHeight?: string
    style?: { [key: string | number]: any }
}

export default function Dropdown(props: Props) {
    const [openDrop, setOpenDrop] = useState(false)
    const { darkMode } = useContext(AppContext)

    const {
        label,
        selected,
        setSelected,
        options,
        value,
        objKey,
        isTime,
        isDate,
        locale,
        maxHeight,
        style
    } = props

    useEffect(() => {
        window.addEventListener('mouseup', (e: MouseEvent) => {
            if (e.target && (e.target as HTMLElement).className) {
                if ((e.target as HTMLElement).className !== 'dropdown__option') setOpenDrop(false)
            } else setOpenDrop(false)
        })
    }, [])

    const getSelectValue = () => {
        if (value) {
            if (isDate) return value ? new Date(value).toLocaleDateString(locale || 'sv-SE') : 'Select'
            if (isTime) return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            else return value
        }
        return objKey && selected && selected[objKey] ? selected[objKey] : 'Select'
    }

    const renderSelectedItem = () => {
        return <div
            className={`dropdown__select${darkMode ? '--dark' : ''}`}
            style={{
                border: !darkMode ? openDrop ? '1px solid #105ec6' : '1px solid lightgray' : '',
                borderBottomRightRadius: openDrop ? 0 : '',
                borderBottomLeftRadius: openDrop ? 0 : '',
                backgroundColor: openDrop ? '#e1eeff' : ''
            }}
            onClick={() => setOpenDrop(!openDrop)}>
            <h4 className={`dropdown__selected${darkMode ? '--dark' : ''}`}>
                {getSelectValue()}
            </h4>
            < h4 className={`dropdown__selected${darkMode ? '--dark' : ''}`}>▾</h4>
        </div>
    }

    const renderDropDownOptions = () => {
        return <div
            className={`dropdown__options${darkMode ? '--dark' : ''}`}
            style={{ borderTop: 'none', maxHeight: maxHeight || '' }}>
            {options.length ?
                options.map((option: any, i: number) =>
                    <h4
                        key={i}
                        className={`dropdown__option${darkMode ? '--dark' : ''}`}
                        style={{
                            marginTop: i === 0 ? '.3rem' : 0,
                            borderTop: i === 0 ? 'none' : '1px solid #e7e7e7'
                        }}
                        onClick={() => {
                            setSelected(option)
                            setOpenDrop(false)
                        }}>
                        {isDate ? new Date(option).toLocaleDateString(locale || 'sv-SE') :
                            isTime ? new Date(option).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                objKey ? option[objKey] : option}
                    </h4>)
                :
                <h4 className={`dropdown__option${darkMode ? '--dark' : ''}`} style={{ borderTop: 'none' }}>Cargando...</h4>
            }
        </div>
    }

    return (
        <div className={`dropdown__container${darkMode ? '--dark' : ''}`} style={style}>
            {label ? <h4 className={`dropdown__label${darkMode ? '--dark' : ''}`}>{label}</h4> : ''}
            <div className={`dropdown__select-section${darkMode ? '--dark' : ''}`}>
                {renderSelectedItem()}
                {openDrop ? renderDropDownOptions() : ''}
            </div>
        </div >
    )
}
