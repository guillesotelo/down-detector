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

const getAllHistory = async (systemId?: string) => {
    try {
        const history = await axios.get(`${API_URL}/api/history/getAll`, { params: { systemId }, headers: getHeaders() })
        return history.data
    } catch (err) { console.log(err) }
}

const getHistoryBySystemId = async (_id: string) => {
    try {
        const history = await axios.get(`${API_URL}/api/history/getBySystemId`, { params: { _id }, headers: getHeaders() })
        return history.data
    } catch (err) { console.log(err) }
}

const getHistoryById = async (_id: string) => {
    try {
        const history = await axios.get(`${API_URL}/api/history/getById`, { params: { _id }, headers: getHeaders() })
        return history.data
    } catch (err) { console.log(err) }
}

const createHistory = async (data: { [key: string | number]: any }) => {
    try {
        const history = await axios.post(`${API_URL}/api/history/create`, { ...data, user }, getConfig())
        return history.data
    } catch (err) { console.log(err) }
}

const updateHistory = async (data: { [key: string | number]: any }) => {
    try {
        const history = await axios.post(`${API_URL}/api/history/update`, { ...data, user }, getConfig())
        return history.data
    } catch (err) { console.log(err) }
}

const deleteHistory = async (data: { [key: string | number]: any }) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/history/remove`, { ...data, user }, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllHistory,
    createHistory,
    getHistoryBySystemId,
    getHistoryById,
    updateHistory,
    deleteHistory,
}