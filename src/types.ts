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

export type userType = {
    _id?: string
    username?: string
    email?: string
    password?: string
    password2?: string
    isSuper?: boolean
    newData?: userType
    ownedSystems?: systemType[]
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
    owners?: userType[]
    createdBy?: string
    updatedBy?: string
    lastCheck?: Date
    lastCheckStatus?: boolean
    active?: boolean
    reportedlyDown?: boolean
    createdAt?: Date
    updatedAt?: Date
    downtimeArray?: eventType[]
    newData?: systemType
    customType?: string
    downtimeNote?: string
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
    note?: string
    newData?: eventType
}

export type historyType = {
    _id?: string
    url?: string
    systemId?: string
    status?: boolean
    description?: string
    createdAt?: Date
    updatedAt?: Date
    newData?: historyType
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
    newData?: alertType
}

export type logType = {
    _id?: string
    username?: string
    email?: string
    details?: string
    module?: string
    newData?: logType
}

export type statusType = {
    time: Date
    status: number
}

export type onChangeEventType = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>