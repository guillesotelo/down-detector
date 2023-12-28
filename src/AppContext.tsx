import React, { createContext, useEffect, useState } from 'react'
import { verifyToken } from './services'
import { AppContextType } from './types'

export const AppContext = createContext<AppContextType>({
    isMobile: false,
    search: [],
    setSearch: () => { },
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
    const [search, setSearch] = useState<string[]>([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isSuper, setIsSuper] = useState(false)
    const [item, setItem] = useState('/')
    const [darkMode, setDarkMode] = useState(false)
    const [headerLoading, setHeaderLoading] = useState(false)

    useEffect(() => {
        verifyUser()
        const preferredMode = JSON.parse(localStorage.getItem('preferredMode') || 'false')
        setDarkMode(preferredMode)
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

    return <AppContext.Provider
        value={{
            search,
            setSearch,
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
        }}>
        {children}
    </AppContext.Provider>
}
