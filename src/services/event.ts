import axios from 'axios';
import { eventType } from '../types';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL || ''

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

const getHeaders = () => {
    return { authorization: `Bearer ${user.token}` }
}

const getConfig = () => {
    return { headers: { authorization: `Bearer ${user.token}` } }
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

const createEvent = async (data: eventType) => {
    try {
        const event = await axios.post(`${API_URL}/api/event/create`, { ...data, user }, getConfig())
        return event.data
    } catch (err) { console.log(err) }
}

const updateEvent = async (data: eventType) => {
    try {
        const event = await axios.post(`${API_URL}/api/event/update`, { ...data, user }, getConfig())
        return event.data
    } catch (err) { console.log(err) }
}

const deleteEvent = async (data: eventType) => {
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