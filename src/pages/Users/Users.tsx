import React, { useContext, useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { deleteUser, getAllUsers, registerUser, updateUser } from '../../services'
import { logHeaders, userHeaders } from '../../constants/tableHeaders'
import { dataObj } from '../../types'
import { toast } from 'react-toastify'
import Modal from '../../components/Modal/Modal'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import Switch from '../../components/Switch/Swith'
import Separator from '../../components/Separator/Separator'
import { AppContext } from '../../AppContext'
import { APP_COLORS } from '../../constants/app'

type Props = {}

export default function Users({ }: Props) {
  const [data, setData] = useState<dataObj>({})
  const [newUser, setNewUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuper, setIsSuper] = useState(false)
  const [onDeleteUser, setOnDeleteUser] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [tableData, setTableData] = useState<dataObj[]>([])
  const { darkMode } = useContext(AppContext)

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    if (selected !== -1 || newUser) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'

    if (selected !== -1) {
      const select = tableData[selected]
      setData(select)
      setIsSuper(select.isSuper || false)
    }
  }, [selected, newUser])

  const getUsers = async () => {
    try {
      setLoading(true)
      const users = await getAllUsers()
      if (users && users.length) setTableData(users)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const updateData = (key: string, e: { [key: string | number]: any }) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const discardChanges = () => {
    setData({})
    setNewUser(false)
    setSelected(-1)
    setIsSuper(false)
    setOnDeleteUser(false)
  }

  const dataOk = () => {
    return data.email.includes('@') &&
      data.email.includes('.') &&
      data.email.length > 5 &&
      (newUser ? (data.password && data.password2 &&
        data.password.length > 5 &&
        data.password === data.password2) : true)
  }

  const removeUser = async () => {
    setLoading(true)
    try {
      const deleted = await deleteUser(tableData[selected])
      if (deleted) {
        toast.success('User deleted successfully')
        discardChanges()
        getUsers()
      }
      else toast.error('Error deleting user. Try again later')
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const saveChanges = async () => {
    if (!dataOk()) return toast.error('Check the fields')
    setLoading(true)
    try {
      const userData: dataObj = {
        ...data,
        isSuper
      }
      if (data.passowrd === '') delete data.password
      if (newUser) {
        const saved = await registerUser(userData)
        if (saved && saved._id) {
          toast.success('User created successfully')
          discardChanges()
          getUsers()
        }
        else toast.error('Error creating user. Try again later')
      } else {
        delete userData._id
        const updated = await updateUser({ _id: data._id, newData: userData })
        if (updated && updated._id) {
          toast.success('User updated successfully')
          discardChanges()
          getUsers()
        }
        else toast.error('Error updating user. Try again later')
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="users__container">
      {newUser || selected !== -1 ? onDeleteUser ?
        <Modal onClose={discardChanges} title='Delete User'>
          <div className='users__delete-modal'>
            <p>Are you sure you want to delete user <strong>{tableData[selected].username}</strong>?</p>
            <div className="systems__new-row">
              <Button
                label='Cancel'
                handleClick={discardChanges}
                bgColor={APP_COLORS.GRAY_ONE}
                textColor='white'
                style={{ width: '45%' }}
                disabled={loading}
              />
              <Button
                label='Confirm'
                handleClick={removeUser}
                bgColor={APP_COLORS.BLUE_TWO}
                textColor='white'
                style={{ width: '45%' }}
                disabled={loading}
              />
            </div>
          </div>
        </Modal>
        :
        <Modal onClose={discardChanges} title={newUser ? 'New User' : 'User Details'}>
          <div className="systems__new">
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
            <InputField
              label='Repeat passowrd'
              name='password2'
              updateData={updateData}
              value={data.password2}
              type='password'
            />
            <Switch
              label='Super User'
              value={isSuper}
              setValue={setIsSuper}
              on='Yes'
              off='No'
            />
            <div className="systems__new-row">
              <Button
                label='Close'
                handleClick={discardChanges}
                bgColor={APP_COLORS.GRAY_ONE}
                textColor='white'
                style={{ width: '45%' }}
                disabled={loading}
              />
              <Button
                label='Save Changes'
                handleClick={saveChanges}
                bgColor={APP_COLORS.BLUE_TWO}
                textColor='white'
                style={{ width: '45%' }}
                disabled={loading}
              />
            </div>
            <Separator />
            <Button
              label='Delete User'
              handleClick={() => setOnDeleteUser(true)}
              bgColor={APP_COLORS.RED_TWO}
              textColor='white'
              disabled={loading}
            />
          </div>
        </Modal>
        : ''}
      <div className="users__col" style={{ filter: selected !== -1 || newUser ? 'blur(10px)' : '' }}>
        <Button
          label='New User'
          handleClick={() => setNewUser(true)}
          bgColor={APP_COLORS.BLUE_TWO}
          textColor='white'
          disabled={loading}
        />
        <DataTable
          title='Users'
          tableData={tableData}
          setTableData={setTableData}
          tableHeaders={userHeaders}
          name='users'
          selected={selected}
          setSelected={setSelected}
          loading={loading}
        />
      </div>
    </div>
  )
}