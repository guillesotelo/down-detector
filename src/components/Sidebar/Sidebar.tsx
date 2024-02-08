import React, { useContext, useEffect, useState } from 'react'
import Dashboard from '../../assets/icons/dashboard.svg'
import History from '../../assets/icons/history.svg'
import AppLogs from '../../assets/icons/logs.svg'
import Settings from '../../assets/icons/settings.svg'
import Help from '../../assets/icons/help.svg'
import Api from '../../assets/icons/api.svg'
import Users from '../../assets/icons/users.svg'
import { AppContext } from '../../AppContext'
import { useHistory, useLocation } from 'react-router-dom'
import { APP_VERSION } from '../../constants/app'

type Props = {}

export default function Sidebar({ }: Props) {
    const history = useHistory()
    const location = useLocation()
    const { isSuper, item, setItem, darkMode, isMobile } = useContext(AppContext)

    useEffect(() => {
        setItem(window.location.pathname)
    }, [window.location, location])

    return (
        <div className={`sidebar__container${darkMode ? '--dark' : ''}`} style={{ display: isMobile ? 'none' : '' }}>
            <div
                className={`sidebar__item${darkMode ? '--dark' : ''}`}
                onClick={() => {
                    history.push('/')
                    setItem('/')
                }}
                style={{
                    marginTop: '1.5rem',
                    backgroundColor: item === '/' ? darkMode ? 'rgb(57, 57, 57)' : 'rgb(237, 237, 237)' : ''
                }}>
                <img src={Dashboard} alt="Dashboard" className={`sidebar__item-svg${darkMode ? '--dark' : ''}`} />
                <h4 className={`sidebar__item-label${darkMode ? '--dark' : ''}`}>Dashboard</h4>
            </div>
            <div
                className={`sidebar__item${darkMode ? '--dark' : ''}`}
                style={{
                    backgroundColor: item === '/history' ? darkMode ? 'rgb(57, 57, 57)' : 'rgb(237, 237, 237)' : ''
                }}
                onClick={() => {
                    history.push('/history')
                    setItem('/history')
                }}>
                <img src={History} alt="History" className={`sidebar__item-svg${darkMode ? '--dark' : ''}`} />
                <h4 className={`sidebar__item-label${darkMode ? '--dark' : ''}`}>History</h4>
            </div>
            <div className={`sidebar__separator${darkMode ? '--dark' : ''}`}></div>
            <div
                className={`sidebar__item${darkMode ? '--dark' : ''}`}
                style={{
                    backgroundColor: item.includes('systems') ? darkMode ? 'rgb(57, 57, 57)' : 'rgb(237, 237, 237)' : ''
                }}
                onClick={() => {
                    history.push('/systems')
                    setItem('settings-systems')
                }}>
                <img src={Api} alt="Settings" className={`sidebar__item-svg${darkMode ? '--dark' : ''}`} />
                <h4 className={`sidebar__item-label${darkMode ? '--dark' : ''}`}>Systems</h4>
            </div>
            {isSuper ?
                <div
                    className={`sidebar__item${darkMode ? '--dark' : ''}`}
                    style={{
                        backgroundColor: item.includes('users') ? darkMode ? 'rgb(57, 57, 57)' : 'rgb(237, 237, 237)' : ''
                    }}
                    onClick={() => {
                        history.push('/users')
                        setItem('settings-users')
                    }}>
                    <img src={Users} alt="Users" className={`sidebar__item-svg${darkMode ? '--dark' : ''}`} />
                    <h4 className={`sidebar__item-label${darkMode ? '--dark' : ''}`}>Users</h4>
                </div>
                : ''}
            {isSuper ?
                <>
                    <div className={`sidebar__separator${darkMode ? '--dark' : ''}`}></div>
                    <div
                        className={`sidebar__item${darkMode ? '--dark' : ''}`}
                        style={{
                            backgroundColor: item === '/applogs' ? darkMode ? 'rgb(57, 57, 57)' : 'rgb(237, 237, 237)' : ''
                        }}
                        onClick={() => {
                            history.push('/applogs')
                            setItem('/applogs')
                        }}>
                        <img src={AppLogs} alt="App Logs" className={`sidebar__item-svg${darkMode ? '--dark' : ''}`} />
                        <h4 className={`sidebar__item-label${darkMode ? '--dark' : ''}`}>App Logs</h4>
                    </div>
                </>
                : ''}
            {/* <div
                className={`sidebar__item${darkMode ? '--dark' : ''}`}
                style={{
                    backgroundColor: item === '/help' ? darkMode ? 'rgb(57, 57, 57)' : 'rgb(237, 237, 237)' : ''
                }}
                onClick={() => {
                    history.push('/help')
                    setItem('/help')
                }}>
                <img src={Help} alt="Help" className={`sidebar__item-svg${darkMode ? '--dark' : ''}`} />
                <h4 className={`sidebar__item-label${darkMode ? '--dark' : ''}`}>Help</h4>
            </div> */}
            <p className="sidebar__version">{APP_VERSION}</p>
        </div >
    )
}