import React, { useContext, useState } from 'react'
import Dropdown from '../Dropdown/Dropdown'
import { AppContext } from '../../AppContext'

type Props = {
    setSortBy: (value: string) => void
    sortBy: string
    options: string[]
}

export default function SortBar({ setSortBy, sortBy, options }: Props) {
    const { darkMode } = useContext(AppContext)
    return (
        <div className='sortbar__container'>
            <p className="sortbar__label" style={{ color: darkMode ? '#bfbfbf' : '#636363' }}>Sort by:</p>
            <Dropdown
                label=''
                options={options}
                selected={sortBy}
                setSelected={setSortBy}
                value={sortBy}
            />
        </div>
    )
}