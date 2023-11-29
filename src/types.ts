export type dataObj = { [key: string | number]: any }

export type AppContextType = {
    isMobile: boolean
    search: string[]
    setSearch: (search: string[]) => void
    isLoggedIn: boolean
    isSuper: boolean
    setIsLoggedIn: (value: boolean) => void
    setIsSuper: (value: boolean) => void
    item: string
    setItem: (value: string) => void
}