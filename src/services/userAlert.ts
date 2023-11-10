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

const getAllAlerts = async () => {
    try {
        const userAlert = await axios.get(`${API_URL}/api/userAlert/getAll`, { headers: getHeaders() })
        return userAlert.data
    } catch (err) { console.log(err) }
}

const getUserAlertBySystemId = async (_id: string) => {
    try {
        const userAlert = await axios.get(`${API_URL}/api/userAlert/getBySystemId`, { params: { _id }, headers: getHeaders() })
        return userAlert.data
    } catch (err) { console.log(err) }
}

const getUserAlertById = async (_id: string) => {
    try {
        const userAlert = await axios.get(`${API_URL}/api/userAlert/getById`, { params: { _id }, headers: getHeaders() })
        return userAlert.data
    } catch (err) { console.log(err) }
}

const createUserAlert = async (data: { [key: string | number]: any }) => {
    try {
        const userAlert = await axios.post(`${API_URL}/api/userAlert/create`, data, getConfig())
        return userAlert.data
    } catch (err) { console.log(err) }
}

const updateUserAlert = async (data: { [key: string | number]: any }) => {
    try {
        const userAlert = await axios.post(`${API_URL}/api/userAlert/update`, data, getConfig())
        return userAlert.data
    } catch (err) { console.log(err) }
}

const deleteUserAlert = async (data: { [key: string | number]: any }) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/userAlert/remove`, data, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllAlerts,
    createUserAlert,
    getUserAlertBySystemId,
    getUserAlertById,
    updateUserAlert,
    deleteUserAlert,
}