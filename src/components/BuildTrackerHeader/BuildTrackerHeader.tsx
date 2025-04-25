import React, { useContext, useState } from 'react'
import BTLogo from '../../assets/logos/build-tracker2.png'
import BTLogoDark from '../../assets/logos/build-tracker2-dark.png'
import SearchBar from '../SearchBar/SearchBar'
import { onChangeEventType } from '../../types'
import { AppContext } from '../../AppContext'
import Day from '../../assets/icons/day.svg'
import Night from '../../assets/icons/night.svg'
import { useHistory } from 'react-router-dom'

type Props = {
    search?: string
    setSearch?: (value: string) => void
    onChangeSearch?: (e: onChangeEventType) => void
    style?: React.CSSProperties
}

export default function BuildTrackerHeader({ search, setSearch, onChangeSearch, style }: Props) {
    const { setDarkMode, darkMode } = useContext(AppContext)
    const history = useHistory()

    const switchMode = () => {
        setDarkMode(!darkMode)
        localStorage.setItem('preferredMode', JSON.stringify(!darkMode))
        const event = new Event('darkMode')
        document.dispatchEvent(event)
    }

    return (
        <div className={`btheader__container${darkMode ? '--dark' : ''}`} style={style}>
            <div className="btheader__wrapper">
                <img
                    src={darkMode ? BTLogoDark : BTLogo}
                    alt="Build Tracker"
                    className="btheader__logo"
                    draggable={false}
                    style={{ opacity: darkMode ? '.9' : '1' }} 
                    onClick={() => history.push('/build-tracker')}
                    />
                <div className="btheader__row">
                    <img onClick={switchMode} src={darkMode ? Day : Night} draggable={false} alt="Switch Mode" className={`header__darkmode${darkMode ? '--dark' : ''}`} />
                    {setSearch && <SearchBar
                        handleChange={onChangeSearch}
                        value={search}
                        placeholder='Search builds...'
                    />}
                </div>
            </div>
        </div>
    )
}