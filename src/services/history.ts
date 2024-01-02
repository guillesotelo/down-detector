import axios from 'axios';
import { historyType } from '../types';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL || ''

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

const getHeaders = () => {
    return { authorization: `Bearer ${user.token}` }
}

const getConfig = () => {
    return { headers: { authorization: `Bearer ${user.token}` } }
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

const createHistory = async (data: historyType) => {
    try {
        const history = await axios.post(`${API_URL}/api/history/create`, { ...data, user }, getConfig())
        return history.data
    } catch (err) { console.log(err) }
}

const updateHistory = async (data: historyType) => {
    try {
        const history = await axios.post(`${API_URL}/api/history/update`, { ...data, user }, getConfig())
        return history.data
    } catch (err) { console.log(err) }
}

const deleteHistory = async (data: historyType) => {
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