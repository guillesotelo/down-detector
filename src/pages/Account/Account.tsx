import React, { useContext, useEffect, useState } from 'react'
import { AppContextType, onChangeEventType, systemType, userType } from '../../types'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import { getSystemsByOwnerId, updateUser } from '../../services'
import UserIcon from '../../assets/icons/user-icon.svg'
import MoonLoader from "react-spinners/MoonLoader"
import { useHistory } from 'react-router-dom'
import { AppContext, AppProvider } from '../../AppContext'
import TextData from '../../components/TextData/TextData'
import { APP_COLORS } from '../../constants/app'

type Props = {}

export default function Account({ }: Props) {
  const [data, setData] = useState<userType>({})
  const [loading, setLoading] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)
  const [dataIsUpdated, setDataIsUpdated] = useState(false)
  const [edit, setEdit] = useState(false)
  const [ownedSystems, setOwnedSystems] = useState<systemType[]>([])
  const { setIsLoggedIn, darkMode, setIsSuper } = useContext(AppContext) as AppContextType
  const history = useHistory()
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

  useEffect(() => {
    getUserData()
    getOwnedSystems()
  }, [])

  const getOwnedSystems = async () => {
    const systems = await getSystemsByOwnerId(user._id)
    setOwnedSystems(systems && Array.isArray(systems) ? systems : [])
  }

  const getUserData = () => {
    if (user._id) {
      delete user.password
      setData(user)
    }
  }

  const updateData = (key: string, e: onChangeEventType) => {
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
      setIsSuper(false)
      const mode = localStorage.getItem('preferredMode')
      localStorage.clear()
      localStorage.setItem('preferredMode', mode || 'false')
      history.push('/')
    }, 1500)
  }

  const getOwnedSystemNames = () => {
    return ownedSystems.length ? ownedSystems.map(system => system.name).join(', ')
      : 'No systems owned'
  }

  return (
    <div className="account__container">
      <h1 className="page__header-title">Account</h1>
      {loading ? <MoonLoader color='#0057ad' size={50} />
        :
        <div className={`account__details${darkMode ? '--dark' : ''}`}>
          <h2 className='account__details-title'>Account Information</h2>
          <img src={UserIcon} alt="User Profile" className={`account__details-icon${darkMode ? '--dark' : ''}`} />
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
                  bgColor={APP_COLORS.GRAY_ONE}
                  textColor='white'
                  style={{ width: '45%' }}
                />
                <Button
                  label='Save Changes'
                  handleClick={saveChanges}
                  bgColor={APP_COLORS.ORANGE_ONE}
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
              <TextData label='Owned Systems' value={getOwnedSystemNames()} />
            </>
          }
          <div className="account__details-row">
            {!edit &&
              <Button
                label='Edit Details'
                handleClick={() => setEdit(true)}
                bgColor={APP_COLORS.ORANGE_ONE}
                textColor='white'
                style={{ width: '45%' }}
                disabled={loggedOut}
              />}
            <Button
              label='Logout'
              handleClick={logout}
              disabled={loggedOut}
              bgColor={APP_COLORS.BLUE_TWO}
              textColor='white'
              style={{ width: edit ? '100%' : '45%' }}
            />
          </div>
        </div>
      }
    </div>
  )
}