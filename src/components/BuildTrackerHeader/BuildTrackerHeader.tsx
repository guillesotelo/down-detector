import { useState } from 'react'
import BTLogo from '../../assets/logos/build-tracker2.png'
import SearchBar from '../SearchBar/SearchBar'
import { onChangeEventType } from '../../types'

type Props = {
    search: string
    setSearch: (value: string) => void
    onChangeSearch: (e: onChangeEventType) => void
}

export default function BuildTrackerHeader({ search, setSearch, onChangeSearch }: Props) {

    return (
        <div className="btheader__container">
            <div className="btheader__wrapper">
                <img src={BTLogo} alt="Build Tracker" className="btheader__logo" draggable={false} />
                <SearchBar
                    handleChange={onChangeSearch}
                    value={search}
                    placeholder='Search...'
                />
            </div>
        </div>
    )
}