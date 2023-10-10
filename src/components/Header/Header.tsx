import React, { useContext, useState } from 'react'
import LoginIcon from '../../assets/icons/login-icon.svg'
import UserIcon from '../../assets/icons/user-icon.svg'
import DDLogo from '../../assets/logos/dd_logo.png'
import { AppContext, AppProvider } from '../../AppContext'
import { useHistory } from 'react-router-dom'

type Props = {
  search: string[]
  setSearch: (value: string[]) => void
  logo?: string
}

export default function Header({ search, setSearch, logo }: Props) {
  const [showUSerOptions, setShowUserOptions] = useState(false)
  const { isLoggedIn } = useContext(AppContext)
  const history = useHistory()

  const userOptions = () => {
    if (isLoggedIn) toggleUserOptions()
    else history.push('/login')
  }

  const toggleUserOptions = () => {
    setShowUserOptions(true)
  }

  return (
    <div className="header__container">
      <div className="header__col">
        <img src={DDLogo} onClick={() => history.push('/')} alt="DownDetector Logo" className="header__downdetector-icon" />
      </div>
      <div className="header__col">

      </div>
      <div className="header__col">
        <img src={isLoggedIn ? UserIcon : LoginIcon} alt="User Login" onClick={userOptions} className="header__login-icon" />
      </div>
    </div>
  )
}