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

export const getTimeOption = (arr: any[], value: number) => {
    return arr.find(item => item.value === value) || { name: '', value: '' }
}

export const isTooBright = (color: string | undefined) => {
    color = color === 'gray' ? '#808080' :
        color === 'lightgray' ? '#d3d3d3' :
            color === 'black' ? '#000000' :
                color === 'white' ? '#ffffff' : color
    if (!color || !color.includes('#')) return false
    const hexToRgb = (hex: string) =>
        hex.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16))
    const [r, g, b] = hexToRgb(color) || []
    const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255)
    const threshold = 0.5
    return luminance > threshold
}

export const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => position,
            (error) => {
                console.error("Error getting location:", error)
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser")
    }
}

export const toHex = (str: string) => {
    var result = ''
    for (var i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16)
    }
    return result
}

export const getUser = () => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}