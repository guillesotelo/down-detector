import axios from 'axios';
import { alertType } from '../types';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL || ''

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

const getHeaders = () => {
    return { authorization: `Bearer ${user.token}` }
}

const getConfig = () => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const getAllAlerts = async (systemId?: string) => {
    try {
        const userAlert = await axios.get(`${API_URL}/api/userAlert/getAll`, { params: { systemId }, headers: getHeaders() })
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

const createUserAlert = async (data: alertType) => {
    try {
        const userAlert = await axios.post(`${API_URL}/api/userAlert/create`, { ...data, user }, getConfig())
        return userAlert.data
    } catch (err) { console.log(err) }
}

const updateUserAlert = async (data: alertType) => {
    try {
        const userAlert = await axios.post(`${API_URL}/api/userAlert/update`, { ...data, user }, getConfig())
        return userAlert.data
    } catch (err) { console.log(err) }
}

const deleteUserAlert = async (data: alertType) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/userAlert/remove`, { ...data, user }, getConfig())
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