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

const getAllEvents = async () => {
    try {
        const events = await axios.get(`${API_URL}/api/event/getAll`, { headers: getHeaders() })
        return events.data
    } catch (err) { console.log(err) }
}

const getEventById = async (_id: string) => {
    try {
        const event = await axios.get(`${API_URL}/api/event/getById`, { params: { _id }, headers: getHeaders() })
        return event.data
    } catch (err) { console.log(err) }
}

const createEvent = async (data: { [key: string | number]: any }) => {
    try {
        const event = await axios.post(`${API_URL}/api/event/create`, { ...data, user }, getConfig())
        return event.data
    } catch (err) { console.log(err) }
}

const updateEvent = async (data: { [key: string | number]: any }) => {
    try {
        const event = await axios.post(`${API_URL}/api/event/update`, { ...data, user }, getConfig())
        return event.data
    } catch (err) { console.log(err) }
}

const deleteEvent = async (data: { [key: string | number]: any }) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/event/remove`, { ...data, user }, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    getAllEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
}