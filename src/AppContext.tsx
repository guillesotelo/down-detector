import React, { createContext, useEffect, useState } from 'react'
import { verifyToken } from './services'
import { AppContextType } from './types'
import { useHistory } from 'react-router-dom'

export const AppContext = createContext<AppContextType>({
    isMobile: false,
    isLoggedIn: null,
    isSuper: false,
    setIsLoggedIn: () => { },
    setIsSuper: () => { },
    item: '',
    setItem: () => { },
    darkMode: false,
    setDarkMode: () => { },
    headerLoading: false,
    setHeaderLoading: () => { },
    addSystemModal: false,
    setAddSystemModal: () => { },
    sort: '',
    setSort: () => { },
    dashboard: '',
    setDashboard: () => { },
})

type Props = {
    children?: React.ReactNode
}

export const AppProvider = ({ children }: Props) => {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const [isSuper, setIsSuper] = useState(false)
    const [item, setItem] = useState('/')
    const [darkMode, setDarkMode] = useState(localStorage.getItem('preferredMode') !== 'false')
    const [headerLoading, setHeaderLoading] = useState(false)
    const [addSystemModal, setAddSystemModal] = useState(false)
    const [dashboard, setDashboard] = useState(localStorage.getItem('dashboard') || 'SWEP SWF')
    const [sort, setSort] = useState(localStorage.getItem('sortSystems') || 'Relevance')

    useEffect(() => {
        verifyUser()

        const checkWidth = () => setIsMobile(window.innerWidth <= 768)

        window.addEventListener("resize", checkWidth)
        return () => window.removeEventListener("resize", checkWidth)
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


    useEffect(() => {
        if (dashboard) localStorage.setItem('dashboard', dashboard)
    }, [dashboard])

    const verifyUser = async () => {
        const verified = await verifyToken()
        if (verified) {
            setIsLoggedIn(true)
            setIsSuper(verified.isSuper)
            localStorage.setItem('user', JSON.stringify(verified))
        } else setIsLoggedIn(false)
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
        setHeaderLoading,
        addSystemModal,
        setAddSystemModal,
        sort,
        setSort,
        dashboard,
        setDashboard,
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
        setHeaderLoading,
        addSystemModal,
        setAddSystemModal,
        sort,
        setSort,
        dashboard,
        setDashboard,
    ])


    return <AppContext.Provider
        value={contextValue}>
        {children}
    </AppContext.Provider>
}
