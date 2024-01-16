import React, { useContext, useEffect, useState } from 'react'
import LoginIcon from '../../assets/icons/login-icon.svg'
import UserIcon from '../../assets/icons/user-icon.svg'
import DDLogo from '../../assets/logos/down-logo.png'
import { AppContext, AppProvider } from '../../AppContext'
import { useHistory, useLocation } from 'react-router-dom'
import Day from '../../assets/icons/day.svg'
import Night from '../../assets/icons/night.svg'
import Tooltip from '../Tooltip/Tooltip'

export default function Header() {
  const [barWidth, setBarWidth] = useState('0%')
  const { isLoggedIn, setItem, darkMode, setDarkMode, headerLoading, setHeaderLoading } = useContext(AppContext)
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    if (headerLoading) renderHeaderLoader()
  }, [headerLoading])

  const renderHeaderLoader = () => {
    Array.from({ length: 110 }).forEach((_, i) => {
      setTimeout(() => setBarWidth(`${i < 109 ? i : 0}%`), 10)
    })
    setHeaderLoading(false)
  }

  const userOptions = () => {
    setItem('')
    if (isLoggedIn) history.push('/account')
    else history.push('/login')
  }

  const gotoAbout = () => {
    if (location.pathname.includes('about')) return history.push('/')
    setItem('/about')
    history.push('/about')
  }

  const switchMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('preferredMode', JSON.stringify(!darkMode))
    const event = new Event('darkMode')
    document.dispatchEvent(event)
  }

  return (
    <div className={`header__container${darkMode ? '--dark' : ''}`}>
      <div className="header__col">
        <Tooltip
          tooltip={location.pathname.includes('about') ? 'Down@Volvo' : 'About Down@Volvo'}
          inline>
          <img
            src={DDLogo}
            onClick={gotoAbout}
            alt={location.pathname.includes('about') ? 'Down@Volvo' : 'About Down@Volvo'}
            className={`header__down-icon${darkMode ? '--dark' : ''}`}
          />
        </Tooltip>
      </div>
      <div className="header__col">
      </div>
      <div className="header__col">
        <div className="header__user-group">
          <img onClick={switchMode} src={darkMode ? Day : Night} alt="Switch Mode" className={`header__darkmode${darkMode ? '--dark' : ''}`} />
          <img src={UserIcon} alt="User Login" onClick={userOptions} className={`header__login-icon${darkMode ? '--dark' : ''}`} />
        </div>
      </div>
      <div className="header__loading" style={{ width: barWidth }} />
    </div>
  )
}