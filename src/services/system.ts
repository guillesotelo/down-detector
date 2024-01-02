import axios from 'axios';
import { systemType } from '../types';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL || ''

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

const getHeaders = () => {
    return { authorization: `Bearer ${user.token}` }
}

const getConfig = () => {
    return { headers: { authorization: `Bearer ${user.token}` } }
}

const getAllSystems = async () => {
    try {
        const systems = await axios.get(`${API_URL}/api/system/getAll`, { params: { _id: user._id }, headers: getHeaders() })
        return systems.data
    } catch (err) { console.log(err) }
}

const getSystemsByOwnerId = async (_id: string) => {
    try {
        const systems = await axios.get(`${API_URL}/api/system/getAllByOwnerId`, { params: { _id }, headers: getHeaders() })
        return systems.data
    } catch (err) { console.log(err) }
}

const getSystemById = async (_id: string) => {
    try {
        const system = await axios.get(`${API_URL}/api/system/getById`, { params: { _id }, headers: getHeaders() })
        return system.data
    } catch (err) { console.log(err) }
}

const createSystem = async (data: systemType) => {
    try {
        const system = await axios.post(`${API_URL}/api/system/create`, { ...data, user }, getConfig())
        return system.data
    } catch (err) { console.log(err) }
}

const updateSystem = async (data: systemType) => {
    try {
        const system = await axios.post(`${API_URL}/api/system/update`, { ...data, user }, getConfig())
        return system.data
    } catch (err) { console.log(err) }
}

const deleteSystem = async (data: systemType) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/system/remove`, { ...data, user }, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllSystems,
    getSystemsByOwnerId,
    createSystem,
    getSystemById,
    updateSystem,
    deleteSystem,
}