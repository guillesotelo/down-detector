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

const getAllSystems = async () => {
    try {
        const systems = await axios.get(`${API_URL}/api/system/getAll`, { headers: getHeaders() })
        return systems.data
    } catch (err) { console.log(err) }
}

const getSystemById = async (_id: string) => {
    try {
        const system = await axios.get(`${API_URL}/api/system/getById`, { params: { _id }, headers: getHeaders() })
        return system.data
    } catch (err) { console.log(err) }
}

const createSystem = async (data: { [key: string | number]: any }) => {
    try {
        const system = await axios.post(`${API_URL}/api/system/create`, data, getConfig())
        return system.data
    } catch (err) { console.log(err) }
}

const updateSystem = async (data: { [key: string | number]: any }) => {
    try {
        const system = await axios.post(`${API_URL}/api/system/update`, data, getConfig())
        return system.data
    } catch (err) { console.log(err) }
}

const deleteSystem = async (data: { [key: string | number]: any }) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/system/remove`, data, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllSystems,
    createSystem,
    getSystemById,
    updateSystem,
    deleteSystem,
}