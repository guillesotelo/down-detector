import React, { SyntheticEvent, useContext } from 'react'
import SearchIcon from '../../assets/icons/search.svg'
import { dataObj } from '../../types'
import { AppContext } from '../../AppContext'

type Props = {
    handleChange: (value: SyntheticEvent) => void,
    triggerSearch: () => void,
    placeholder?: string,
    value?: string,
    style?: dataObj
}

export default function SearchBar(props: Props) {
    const { darkMode } = useContext(AppContext)

    const {
        handleChange,
        triggerSearch,
        placeholder,
        value,
        style
    } = props

    return (
        <div className={`searchbar__container${darkMode ? '--dark' : ''}`} style={style}>
            <img src={SearchIcon} className={`searchbar__icon${darkMode ? '--dark' : ''}`} onClick={triggerSearch} />
            <input
                className={`searchbar__input${darkMode ? '--dark' : ''}`}
                onChange={handleChange}
                placeholder={placeholder}
                type='text'
                value={value}
            />
        </div>
    )
}