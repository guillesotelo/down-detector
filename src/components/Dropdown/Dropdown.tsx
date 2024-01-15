import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { dataObj } from '../../types'
import { AppContext } from '../../AppContext'
import { BeatLoader } from 'react-spinners'

type Props = {
    label: string
    options: string[] | number[] | dataObj[]
    value?: string | number | dataObj
    objKey?: string | number
    selected: any
    setSelected: (value: any) => void
    isTime?: boolean
    isDate?: boolean
    locale?: string
    maxHeight?: string
    style?: React.CSSProperties
    multiselect?: boolean
    loading?: boolean
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
        style,
        multiselect,
        loading
    } = props

    useEffect(() => {
        window.addEventListener('mouseup', (e: MouseEvent) => {
            const className = (e.target as HTMLElement).className
            if (!className.includes('dropdown')) setOpenDrop(false)
        })
    }, [])

    // useEffect(() => {
    //     const dark = darkMode ? '--dark' : ''
    //     const selection = document.querySelector(`.dropdown__select-selection${dark}`) as HTMLElement
    //     const dropdown = document.querySelector(`.dropdown__options${dark}`) as HTMLElement
    //     if (selection && dropdown) {
    //         const { width, height } = selection.getBoundingClientRect()
    //         console.log('width', width.toFixed(0))
    //         console.log('height', height.toFixed(0))
    //         dropdown.style.marginTop = height.toFixed(0) + 'px'
    //         dropdown.style.width = width.toFixed(0) + 'px'
    //     }
    // }, [openDrop])

    const getSelectValues = () => {
        if (value && Array.isArray(value) && value.length) {
            return value.map((val: dataObj | string | number) =>
                typeof val === 'string' || typeof val === 'number' ? val :
                    objKey && val[objKey] ? val[objKey] : 'Select')
        }
        return []
    }

    const getSelectValue = () => {
        if (value && typeof value === 'string' || typeof value === 'number') {
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
                border: openDrop ? '1px solid #105ec6' : darkMode ? '1px solid gray' : '1px solid lightgray',
                borderBottomRightRadius: openDrop ? 0 : '',
                borderBottomLeftRadius: openDrop ? 0 : '',
                filter: openDrop ? 'brightness(120%)' : ''
            }}
            onClick={() => setOpenDrop(!openDrop)}>
            <h4 className={`dropdown__selected${darkMode ? '--dark' : ''}`}>
                {getSelectValue()}
            </h4>
            < h4 className={`dropdown__selected${darkMode ? '--dark' : ''}`}>▾</h4>
        </div>
    }

    const removeItem = (index: number) => {
        const newSelection = [...selected]
        newSelection.splice(index, 1)
        setSelected(newSelection)
    }

    const renderSelectedItems = () => {
        return <div
            className={`dropdown__select${darkMode ? '--dark' : ''}`}
            style={{
                border: openDrop ? '1px solid #105ec6' : darkMode ? '1px solid gray' : '1px solid lightgray',
                borderBottomRightRadius: openDrop ? 0 : '',
                borderBottomLeftRadius: openDrop ? 0 : ''
            }}
            onClick={() => setOpenDrop(!openDrop)}>
            <h4
                className={`dropdown__selected${darkMode ? '--dark' : ''}`}
                style={{
                    height: multiselect ? 'fit-content' : '',
                    flexWrap: multiselect ? 'wrap' : 'unset',
                }}>
                {getSelectValues() ? getSelectValues()?.map((val, i) =>
                    <span key={i} className={`dropdown__selected-multi-item${darkMode ? '--dark' : ''}`}>
                        <p className='dropdown__selected-multi-label'>{val}</p>
                        <p className='dropdown__selected-multi-remove' onClick={() => removeItem(i)}>X</p>
                    </span>
                ) : <p className='dropdown__selected-multi-label'>Select</p>}
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
                            borderTop: i === 0 ? '1px solid #105ec6' : '1px solid #e7e7e7'
                        }}
                        onClick={() => {
                            if (multiselect) {
                                if (objKey && selected.filter((el: dataObj) => el[objKey] && el[objKey] === option[objKey]).length) return setOpenDrop(false)
                                if (selected.filter((el: any) => el === option).length) return setOpenDrop(false)
                                const newSelection = [...selected]
                                setSelected(newSelection.concat(option))
                            }
                            else setSelected(option)
                            setOpenDrop(false)
                        }}>
                        {isDate ? new Date(option).toLocaleDateString(locale || 'sv-SE') :
                            isTime ? new Date(option).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                objKey ? option[objKey] : option}
                    </h4>)
                :
                <h4 className={`dropdown__option${darkMode ? '--dark' : ''}`} style={{ borderTop: 'none' }}>Loading...</h4>
            }
        </div>
    }

    const renderLoading = () => {
        return (
            <div className={`dropdown__select${darkMode ? '--dark' : ''}`}>
                <h4
                    className={`dropdown__selected${darkMode ? '--dark' : ''}`}
                    style={{
                        height: multiselect ? 'fit-content' : '',
                        flexWrap: multiselect ? 'wrap' : 'unset',
                    }}>
                    <BeatLoader color='lightgray' size='1rem' />
                </h4>
            </div >
        )
    }

    const renderMultiSelect = () => {
        return (
            <div className={`dropdown__container${darkMode ? '--dark' : ''}`} style={style}>
                {label ? <h4 className={`dropdown__label${darkMode ? '--dark' : ''}`}>{label}</h4> : ''}
                <div className={`dropdown__select-section${darkMode ? '--dark' : ''}`}>
                    {loading ? renderLoading() : renderSelectedItems()}
                    {openDrop ? renderDropDownOptions() : ''}
                </div>
            </div >
        )
    }

    const renderSimpleSelect = () => {
        return (
            <div className={`dropdown__container${darkMode ? '--dark' : ''}`} style={style}>
                {label ? <h4 className={`dropdown__label${darkMode ? '--dark' : ''}`}>{label}</h4> : ''}
                <div className={`dropdown__select-section${darkMode ? '--dark' : ''}`}>
                    {loading ? renderLoading() : renderSelectedItem()}
                    {openDrop ? renderDropDownOptions() : ''}
                </div>
            </div >
        )
    }


    return multiselect ? renderMultiSelect() : renderSimpleSelect()
}
