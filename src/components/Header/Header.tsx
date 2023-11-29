import React, { useContext, useState } from 'react'
import LoginIcon from '../../assets/icons/login-icon.svg'
import UserIcon from '../../assets/icons/user-icon.svg'
import DDLogo from '../../assets/logos/dd_logo.png'
import { AppContext, AppProvider } from '../../AppContext'
import { useHistory } from 'react-router-dom'

export default function Header() {
  const { isLoggedIn, setItem } = useContext(AppContext)
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

  return (
    <div className="header__container">
      <div className="header__col">
        <img src={DDLogo} onClick={goHome} alt="DownDetector Logo" className="header__downdetector-icon" />
      </div>
      <div className="header__col">
      </div>
      <div className="header__col">
        <img src={isLoggedIn ? UserIcon : LoginIcon} alt="User Login" onClick={userOptions} className="header__login-icon" />
      </div>
    </div>
  )
}