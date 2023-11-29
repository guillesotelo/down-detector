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
    setItem: () => { }
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


    useEffect(() => {
        verifyUser()
    }, [])

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
            setItem
        }}>
        {children}
    </AppContext.Provider>
}
