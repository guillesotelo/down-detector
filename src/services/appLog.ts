import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL || ''

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

const getHeaders = () => {
    const { token }: { [key: string | number]: any } = user
    return { authorization: `Bearer ${token}` }
}

const getConfig = () => {
    const { token }: { [key: string | number]: any } = user
    return { headers: { authorization: `Bearer ${token}` } }
}

const getAllLogs = async () => {
    try {
        const appLogs = await axios.get(`${API_URL}/api/appLog/getAll`, { headers: getHeaders() })
        return appLogs.data
    } catch (err) { console.log(err) }
}

const getLogById = async (_id: string) => {
    try {
        const appLog = await axios.get(`${API_URL}/api/appLog/getById`, { params: { _id }, headers: getHeaders() })
        return appLog.data
    } catch (err) { console.log(err) }
}

const createLog = async (data: { [key: string | number]: any }) => {
    try {
        const appLog = await axios.post(`${API_URL}/api/appLog/create`, { ...data, user }, getConfig())
        return appLog.data
    } catch (err) { console.log(err) }
}

const updateLog = async (data: { [key: string | number]: any }) => {
    try {
        const appLog = await axios.post(`${API_URL}/api/appLog/update`, { ...data, user }, getConfig())
        return appLog.data
    } catch (err) { console.log(err) }
}

const deleteLog = async (data: { [key: string | number]: any }) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/appLog/remove`, { ...data, user }, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllLogs,
    createLog,
    getLogById,
    updateLog,
    deleteLog,
}