import React, { createContext } from 'react'

type AppContextType = {
    isMobile: boolean
    search: string[]
    setSearch: (search: string[]) => void
    isLoggedIn: boolean
    isSuper: boolean
    setIsLoggedIn: (value: boolean) => void
    setIsSuper: (value: boolean) => void
    children: React.ReactNode
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<AppContextType> = ({
    isMobile,
    setIsLoggedIn,
    isLoggedIn,
    isSuper,
    setIsSuper,
    search,
    setSearch,
    children
}) => (
    <AppContext.Provider value={{
        search,
        setSearch,
        isSuper,
        setIsSuper,
        isMobile,
        setIsLoggedIn,
        isLoggedIn,
        children
    }}>{children}</AppContext.Provider>
);
