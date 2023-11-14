import React, { SyntheticEvent } from 'react'
import SearchIcon from '../../assets/icons/search.svg'
import { dataObj } from '../../types'

type Props = {
    handleChange: (value: SyntheticEvent) => void,
    triggerSearch: () => void,
    placeholder?: string,
    value?: string,
    style?: dataObj
}

export default function SearchBar(props: Props) {

    const {
        handleChange,
        triggerSearch,
        placeholder,
        value,
        style
    } = props

    return (
        <div className='searchbar__container' style={style}>
            <img src={SearchIcon} className='searchbar__icon' onClick={triggerSearch} />
            <input
                className='searchbar__input'
                onChange={handleChange}
                placeholder={placeholder}
                type='text'
                value={value}
            />
        </div>
    )
}