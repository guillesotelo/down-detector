import React, { useContext, useEffect, useState } from 'react'
import { AppContextType, dataObj } from '../../types'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import { updateUser } from '../../services'
import UserIcon from '../../assets/icons/user-icon.svg'
import MoonLoader from "react-spinners/MoonLoader"
import { useHistory } from 'react-router-dom'
import { AppContext, AppProvider } from '../../AppContext'
import TextData from '../../components/TextData/TextData'

type Props = {}

export default function Account({ }: Props) {
  const [data, setData] = useState<dataObj>({})
  const [loading, setLoading] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const [dataIsUpdated, setDataIsUpdated] = useState(false)
  const [edit, setEdit] = useState(false)
  const { setIsLoggedIn } = useContext(AppContext) as AppContextType
  const history = useHistory()

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    if (user._id) {
      delete user.password
      setData(user)
    }
  }

  const updateData = (key: string, e: { [key: string | number]: any }) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
    setDataIsUpdated(true)
  }

  const discardChanges = () => {
    setData({})
    setDataIsUpdated(false)
    setEdit(false)
    getUserData()
  }

  const saveChanges = async () => {
    setLoading(true)
    try {
      const newData = { ...data }
      delete newData._id

      const updated = await updateUser({ _id: data._id, newData })
      if (updated && updated._id) {
        toast.success('User updated successfully')
        getUserData()
      }
      else toast.error('Error updating system. Try again later')
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const logout = () => {
    setLoggedOut(true)
    toast.info('See you later!')
    setTimeout(() => {
      setIsLoggedIn(false)
      localStorage.clear()
      history.push('/')
    }, 1500)
  }

  return (
    <div className="account__container">
      <h1 className="page__header-title">Account</h1>
      {loading ? <MoonLoader color='#0057ad' size={50} />
        :
        <div className="account__details">
          <h2 className='account__details-title'>Account Information</h2>
          <img src={UserIcon} alt="User Profile" className="account__details-icon" />
          {edit ?
            <>
              <InputField
                label='Full Name'
                name='username'
                updateData={updateData}
                value={data.username}
              />
              <InputField
                label='Email'
                name='email'
                updateData={updateData}
                value={data.email}
              />
              <InputField
                label='Password'
                name='password'
                updateData={updateData}
                value={data.password}
                type='password'
              />
              <div className="account__details-row">
                <Button
                  label='Discard Changes'
                  handleClick={discardChanges}
                  bgColor='gray'
                  textColor='white'
                  style={{ width: '45%' }}
                />
                <Button
                  label='Save Changes'
                  handleClick={saveChanges}
                  bgColor='#105ec6'
                  textColor='white'
                  style={{ width: '45%' }}
                  disabled={!dataIsUpdated}
                />
              </div>
            </>
            :
            <>
              <TextData label='Full Name' value={data.username} />
              <TextData label='Email' value={data.email} />
              <TextData label='Super User' value={data.isSuper ? 'Yes' : 'No'} />
            </>
          }
          <div className="account__details-row">
            {!edit &&
              <Button
                label='Edit Details'
                handleClick={() => setEdit(true)}
                bgColor='#105ec6'
                textColor='white'
                style={{ width: '45%' }}
                disabled={loggedOut}
              />}
            <Button
              label='Logout'
              handleClick={logout}
              disabled={loggedOut}
              bgColor='#105ec6'
              textColor='white'
              style={{ width: edit ? '100%' : '45%' }}
            />
          </div>
        </div>
      }
    </div>
  )
}