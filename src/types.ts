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
    darkMode: boolean
    setDarkMode: (value: boolean) => void
    headerLoading: boolean
    setHeaderLoading: (value: boolean) => void
}

export type systemType = {
    _id?: string
    name?: string
    url?: string
    type?: string
    description?: string
    timeout?: number
    interval?: number
    alertThreshold?: number
    alertsExpiration?: number
    owner?: string
    ownerId?: string
    createdBy?: string
    updatedBy?: string
    lastCheck?: Date
    lastCheckStatus?: boolean
    active?: boolean
    reportedlyDown?: boolean
    createdAt?: Date
    updatedAt?: Date
}

export type eventType = {
    _id?: string
    url?: string
    start?: Date
    end?: Date
    systemId?: string
    node?: string
    createdAt?: Date
    updatedAt?: Date
}

export type historyType = {
    _id?: string
    url?: string
    systemId?: string
    status?: string
    description?: string
    createdAt?: Date
    updatedAt?: Date
}

export type alertType = {
    _id?: string
    systemId?: string
    type?: string
    userAlert?: boolean
    description?: string
    createdBy?: string
    createdAt?: Date
    updatedAt?: Date
}