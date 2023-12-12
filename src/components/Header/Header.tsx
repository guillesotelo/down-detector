import React, { useContext, useState } from 'react'
import LoginIcon from '../../assets/icons/login-icon.svg'
import UserIcon from '../../assets/icons/user-icon.svg'
import DDLogo from '../../assets/logos/down-logo.png'
import { AppContext, AppProvider } from '../../AppContext'
import { useHistory } from 'react-router-dom'
import Day from '../../assets/icons/day.svg'
import Night from '../../assets/icons/night.svg'

export default function Header() {
  const { isLoggedIn, setItem, darkMode, setDarkMode } = useContext(AppContext)
  const history = useHistory()

  const userOptions = () => {
    setItem('')
    if (isLoggedIn) history.push('/account')
    else history.push('/login')
  }

  const goHome = () => {
    setItem('/')
    history.push('/')
  }

  const switchMode = () => {
    setDarkMode(!darkMode)
    localStorage.setItem('preferredMode', JSON.stringify(!darkMode))
  }

  return (
    <div className={`header__container${darkMode ? '--dark' : ''}`}>
      <div className="header__col">
        <img src={DDLogo} onClick={goHome} alt="DownDetector Logo" className={`header__downdetector-icon${darkMode ? '--dark' : ''}`} />
      </div>
      <div className="header__col">
      </div>
      <div className="header__col">
        <div className="header__user-group">
          <img onClick={switchMode} src={darkMode ? Day : Night} alt="Switch Mode" className={`header__darkmode${darkMode ? '--dark' : ''}`} />
          <img src={isLoggedIn ? UserIcon : LoginIcon} alt="User Login" onClick={userOptions} className={`header__login-icon${darkMode ? '--dark' : ''}`} />
        </div>
      </div>
    </div>
  )
}