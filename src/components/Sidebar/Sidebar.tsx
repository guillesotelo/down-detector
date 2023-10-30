import React, { useContext, useEffect, useState } from 'react'
import Dashboard from '../../assets/icons/dashboard.svg'
import History from '../../assets/icons/history.svg'
import AppLogs from '../../assets/icons/logs.svg'
import Settings from '../../assets/icons/settings.svg'
import Help from '../../assets/icons/help.svg'
import Api from '../../assets/icons/api.svg'
import Users from '../../assets/icons/users.svg'
import { AppContext } from '../../AppContext'
import { useHistory } from 'react-router-dom'

type Props = {}

export default function Sidebar({ }: Props) {
    const [openSettings, setOpenSettings] = useState(false)
    const [item, setItem] = useState('/')
    const history = useHistory()
    const { isSuper } = useContext(AppContext)

    return (
        <div className="sidebar__container">
            <div
                className="sidebar__item"
                onClick={() => {
                    history.push('/')
                    setItem('/')
                }}
                style={{
                    marginTop: '2rem',
                    backgroundColor: item === '/' ? 'rgb(237, 237, 237)' : ''
                }}>
                <img src={Dashboard} alt="Dashboard" className="sidebar__item-svg" />
                <h4 className="sidebar__item-label">Dashboard</h4>
            </div>
            <div
                className="sidebar__item"
                style={{
                    backgroundColor: item === '/history' ? 'rgb(237, 237, 237)' : ''
                }}
                onClick={() => {
                    history.push('/history')
                    setItem('/history')
                }}>
                <img src={History} alt="History" className="sidebar__item-svg" />
                <h4 className="sidebar__item-label">History</h4>
            </div>
            <div
                className="sidebar__item"
                style={{
                    backgroundColor: item === '/applogs' ? 'rgb(237, 237, 237)' : ''
                }}
                onClick={() => {
                    history.push('/applogs')
                    setItem('/applogs')
                }}>
                <img src={AppLogs} alt="App Logs" className="sidebar__item-svg" />
                <h4 className="sidebar__item-label">App Logs</h4>
            </div>
            <div className="sidebar__separator"></div>
            <div
                className="sidebar__item"
                onClick={() => setItem(!item.includes('settings') ? 'settings' : '')}
                style={{
                    backgroundColor: item.includes('settings') ? 'rgb(237, 237, 237)' : ''
                }}
            >
                <img src={Settings} alt="Settings" className="sidebar__item-svg" />
                <h4 className="sidebar__item-label">Settings</h4>
            </div>
            {
                item.includes('settings') ?
                    <div className="sidebar__subitem">
                        <div
                            className="sidebar__item"
                            style={{
                                backgroundColor: item.includes('systems') ? 'rgb(242, 242, 242)' : ''
                            }}
                            onClick={() => {
                                history.push('/systems')
                                setItem('settings-systems')
                            }}>
                            <img src={Api} alt="Settings" className="sidebar__item-svg" />
                            <h4 className="sidebar__item-label">Systems</h4>
                        </div>
                        {isSuper ?
                            <div
                                className="sidebar__item"
                                style={{
                                    backgroundColor: item.includes('users') ? 'rgb(242, 242, 242)' : ''
                                }}
                                onClick={() => {
                                    history.push('/users')
                                    setItem('settings-users')
                                }}>
                                <img src={Users} alt="Users" className="sidebar__item-svg" />
                                <h4 className="sidebar__item-label">Users</h4>
                            </div>
                            : ''}
                    </div>
                    : ''
            }
            <div
                className="sidebar__item"
                style={{
                    backgroundColor: item === '/help' ? 'rgb(237, 237, 237)' : ''
                }}
                onClick={() => {
                    history.push('/help')
                    setItem('/help')
                }}>
                <img src={Help} alt="Help" className="sidebar__item-svg" />
                <h4 className="sidebar__item-label">Help</h4>
            </div>
        </div >
    )
}