import React, { useEffect, useState } from 'react'
import { dataObj } from '../../types'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import { updateUser } from '../../services'
import UserIcon from '../../assets/icons/user-icon.svg'
import MoonLoader from "react-spinners/MoonLoader"
import { useHistory } from 'react-router-dom'

type Props = {}

export default function Account({ }: Props) {
  const [data, setData] = useState<dataObj>({})
  const [loading, setLoading] = useState(false)
  const [dataIsUpdated, setDataIsUpdated] = useState(false)
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
    history.go(0)
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

  return (
    <div className="account__container">
      <h1 className="page__header-title">Account</h1>
      {loading ? <MoonLoader color='#0057ad' size={50} />
        :
        <div className="account__details">
          <img src={UserIcon} alt="User Profile" className="account__details-icon" />
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
        </div>
      }
    </div>
  )
}