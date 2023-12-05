import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL || ''
const getHeaders = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { authorization: `Bearer ${token}` }
}
const getConfig = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { headers: { authorization: `Bearer ${token}` } }
}

const loginUser = async (user: { [key: string | number]: any }) => {
    try {
        const res = await axios.post(`${API_URL}/api/user/login`, user)
        const finalUser = res.data
        localStorage.setItem('user', JSON.stringify({
            ...finalUser,
            app: 'downdetector',
            login: new Date()
        }))
        return finalUser
    } catch (error) { console.log(error) }
}

const verifyToken = async () => {
    try {
        const user: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
        if (user) {
            const verify = await axios.post(`${API_URL}/api/user/verify`, user, getConfig())
            return verify.data
        }
        return null
    } catch (err) { }
}

const registerUser = async (data: { [key: string | number]: any }) => {
    try {
        const newUser = await axios.post(`${API_URL}/api/user/create`, data, getConfig())
        return newUser.data
    } catch (err) { console.error(err) }
}

const getAllUsers = async () => {
    try {
        const users = await axios.get(`${API_URL}/api/user/getAll`, { headers: getHeaders() })
        return users.data
    } catch (err) { console.log(err) }
}

const updateUser = async (data: { [key: string | number]: any }) => {
    try {
        const user = await axios.post(`${API_URL}/api/user/update`, data, getConfig())
        const localUser = JSON.parse(localStorage.getItem('user') || '{}')
        localStorage.setItem('user', JSON.stringify({
            ...localUser,
            ...user.data
        }))
        return user.data
    } catch (err) { console.error(err) }
}

const deleteUser = async (data: { [key: string | number]: any }) => {
    try {
        const deleted = await axios.post(`${API_URL}/api/user/remove`, data, getConfig())
        return deleted.data
    } catch (err) { console.log(err) }
}

export {
    loginUser,
    verifyToken,
    registerUser,
    updateUser,
    getAllUsers,
    deleteUser
}