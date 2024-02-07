import React, { createContext, useEffect, useState } from 'react'
import { verifyToken } from './services'
import { AppContextType } from './types'
import { useHistory } from 'react-router-dom'

export const AppContext = createContext<AppContextType>({
    isMobile: false,
    isLoggedIn: false,
    isSuper: false,
    setIsLoggedIn: () => { },
    setIsSuper: () => { },
    item: '',
    setItem: () => { },
    darkMode: false,
    setDarkMode: () => { },
    headerLoading: false,
    setHeaderLoading: () => { },
})

type Props = {
    children?: React.ReactNode
}

export const AppProvider = ({ children }: Props) => {
    const isMobile = window.screen.width <= 768
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isSuper, setIsSuper] = useState(false)
    const [item, setItem] = useState('/')
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('preferredMode') || 'false'))
    const [headerLoading, setHeaderLoading] = useState(false)

    useEffect(() => {
        verifyUser()
    }, [])

    useEffect(() => {
        const body = document.querySelector('body')
        if (body) {
            body.classList.remove('--dark')
            if (darkMode) body.classList.add('--dark')

            document.documentElement.setAttribute(
                "data-color-scheme",
                darkMode ? "dark" : "light"
            )
        }
    }, [darkMode])

    const verifyUser = async () => {
        const verified = await verifyToken()
        if (verified) {
            setIsLoggedIn(true)
            setIsSuper(verified.isSuper)
        }
    }

    const contextValue = React.useMemo(() => ({
        isSuper,
        setIsSuper,
        isMobile,
        setIsLoggedIn,
        isLoggedIn,
        item,
        setItem,
        darkMode,
        setDarkMode,
        headerLoading,
        setHeaderLoading
    }), [
        isSuper,
        setIsSuper,
        isMobile,
        setIsLoggedIn,
        isLoggedIn,
        item,
        setItem,
        darkMode,
        setDarkMode,
        headerLoading,
        setHeaderLoading
    ])


    return <AppContext.Provider
        value={contextValue}>
        {children}
    </AppContext.Provider>
}
