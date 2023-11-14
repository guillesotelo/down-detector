import { getAllAlerts, getAllHistory } from "../services"

export const chunkArray = (arr: any[], chunkSize: number) => {
    const result = []
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize))
    }
    return result
}

export const sortArray = (arr: any[], key: string | number, order?: boolean) => {
    return arr.slice().sort((a: any, b: any) => {
        const aValue = a[key]
        const bValue = b[key]
        if (!aValue) return 1
        if (!bValue) return -1
        return order ? aValue < bValue ? 1 : -1 : aValue < bValue ? -1 : 1
    })
}

export const filterArray = (arr: any[], key: string | number, filter: string) => {
    if (key === 'name') return arr.filter(element => element.name?.toLocaleLowerCase().includes(filter))
    if (key === 'office') return arr.filter(element => element.office?.toLocaleLowerCase().includes(filter))
    return arr
}

export const goToUrl = (url: string) => {
    const anchor = document.createElement('a')
    anchor.target = '_blank'
    anchor.href = url
    anchor.click()
}

export const getHistoryAndAlerts = async (systemId?: string) => {
    try {
        const systems = await getAllHistory(systemId)
        const userAlerts = await getAllAlerts(systemId)
        if ((systems && Array.isArray(systems)) || (userAlerts && Array.isArray(userAlerts))) {
            const allHistory = sortArray([...systems, ...userAlerts], 'createdAt', true)
            return allHistory
        }
        return []
    } catch (error) {
        console.error(error)
        return []
    }
}