import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { getAllUsers, registerUser, updateUser } from '../../services'
import { logHeaders, userHeaders } from '../../constants/tableHeaders'
import { dataObj } from '../../types'
import { toast } from 'react-toastify'
import Modal from '../../components/Modal/Modal'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'

type Props = {}

export default function Users({ }: Props) {
  const [data, setData] = useState<dataObj>({})
  const [newUser, setNewUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [tableData, setTableData] = useState<dataObj[]>([])

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    if (selected !== -1 || newUser) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'

    if (selected !== -1) {
      const select = tableData[selected]
      setData(select)
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
  }

  const saveChanges = async () => {
    setLoading(true)
    try {
      const userData = {
        ...data,
      }
      if (newUser) {
        const saved = await registerUser(userData)
        if (saved && saved._id) {
          toast.success('User created successfully')
          discardChanges()
          getUsers()
        }
        else toast.error('Error creating system. Try again later')
      } else {
        const updated = await updateUser(userData)
        if (updated && updated._id) {
          toast.success('User updated successfully')
          discardChanges()
          getUsers()
        }
        else toast.error('Error updating system. Try again later')
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="users__container">
      {newUser || selected !== -1 ?
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
            />
            <div className="systems__new-row">
              <Button
                label='Close'
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
              />
            </div>
          </div>
        </Modal>
        : ''}
      <div className="users__col" style={{ filter: selected !== -1 || newUser ? 'blur(10px)' : '' }}>
        <Button
          label='New User'
          handleClick={() => setNewUser(true)}
          bgColor='#105ec6'
          textColor='white'
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