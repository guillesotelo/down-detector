import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL

const getHeaders = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { authorization: `Bearer ${token}` }
}
const getConfig = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { headers: { authorization: `Bearer ${token}` } }
}

const getAllHistory = async () => {
    try {
        const history = await axios.get(`${API_URL}/api/history/getAll`, { headers: getHeaders() })
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
        const history = await axios.post(`${API_URL}/api/history/create`, data, getConfig())
        return history.data
    } catch (err) { console.log(err) }
}

const updateHistory = async (data: { [key: string | number]: any }) => {
    try {
        const history = await axios.post(`${API_URL}/api/history/update`, data, getConfig())
        return history.data
    } catch (err) { console.log(err) }
}

const deleteHistory = async (data: { [key: string | number]: any }) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/history/remove`, data, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllHistory,
    createHistory,
    getHistoryById,
    updateHistory,
    deleteHistory,
}