import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { loginUser } from '../../services'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext'

type Props = {}

export default function Login({ }: Props) {
    const [data, setData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [dataOk, setDataOk] = useState(false)
    const history = useHistory()
    const { setIsLoggedIn, setIsSuper } = useContext(AppContext)

    useEffect(() => {
        setDataOk(checkData())
    }, [data])

    const updateData = (key: string, e: { [key: string | number]: any }) => {
        const value = e.target.value
        setData({ ...data, [key]: value })
    }

    const login = async () => {
        try {
            const logged = await loginUser(data)
            if (logged) {
                toast.success(`Welcome back, ${logged.username ? logged.username.split(' ')[0] : 'admin'}`)
                setTimeout(() => history.push('/'), 2000)
            }
            else toast.error('An error occurred while logging in. Please try again.')
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    const checkData = () => {
        if (data.email &&
            data.password &&
            data.email.includes('@') &&
            data.email.includes('.') &&
            data.password.length > 4) return true
        return false
    }

    return (
        <div className="login__container">
            <div className="login__box">
                <InputField
                    label="Email"
                    name='email'
                    value={data.email}
                    updateData={updateData}
                />
                <InputField
                    label="Password"
                    name='password'
                    value={data.password}
                    updateData={updateData}
                    type='password'
                />
                <div className="login__btns">
                    <Button
                        label='Cancel'
                        handleClick={() => history.push('/')}
                        bgColor="lightgray"
                    />
                    <Button
                        label={loading ? 'Loggin in...' : 'Login'}
                        handleClick={login}
                        disabled={!dataOk}
                        bgColor=""
                    />
                </div>
            </div>
        </div>
    )
}