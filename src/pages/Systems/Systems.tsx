import React, { useContext, useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import DataTable from '../../components/DataTable/DataTable'
import { eventType, onChangeEventType, systemType, userType } from '../../types'
import Modal from '../../components/Modal/Modal'
import InputField from '../../components/InputField/InputField'
import Dropdown from '../../components/Dropdown/Dropdown'
import {
  downtimeHeaders,
  systemHeaders,
} from '../../constants/tableHeaders'
import {
  intervalDefaultOptions,
  timeoutDefaultOptions
} from '../../constants/default'
import {
  createSystem,
  getAllSystems,
  updateSystem,
  deleteEvent,
  getAllEvents,
  deleteSystem,
  getAllUsers,
  getSystemsByOwnerId
} from '../../services'
import { toast } from 'react-toastify'
import Calendar from 'react-calendar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Separator from '../../components/Separator/Separator'
import { AppContext } from '../../AppContext'
import { APP_COLORS } from '../../constants/app'
import { getTimeOption } from '../../helpers'
type Props = {}

export default function Systems({ }: Props) {
  const [data, setData] = useState<systemType>({})
  const [newSystem, setNewSystem] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addDowntime, setAddDowntime] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [selectedDowntime, setSelectedDowntime] = useState(-1)
  const [tableData, setTableData] = useState<systemType[]>([])
  const [typeOptions, setTypeOptions] = useState(['Detection', 'Other'])
  const [intervalOptions, setIntervalOptions] = useState(intervalDefaultOptions)
  const [timeoutOptions, setTimeoutOptions] = useState(timeoutDefaultOptions)
  const [alertsThreshold, setAlertsThreshold] = useState(Array.from({ length: 20 }, (_, i) => i + 1))
  const [alertsExpiration, setAlertsExpiration] = useState(Array.from({ length: 72 }, (_, i) => i + 1))
  const [selectedType, setSelectedType] = useState('')
  const [selectedInterval, setSelectedInterval] = useState({ name: '', value: 120000 })
  const [selectedTimeout, setSelectedTimeout] = useState({ name: '', value: 10000 })
  const [selectedThreshold, setSelectedThreshold] = useState(3)
  const [selectedAlertExpiration, setSelectedAlertExpiration] = useState(2)
  const [start, setStart] = useState<any>(null)
  const [end, setEnd] = useState<any>(null)
  const [openStartCalendar, setOpenStartCalendar] = useState(false)
  const [openEndCalendar, setOpenEndCalendar] = useState(false)
  const [downtimeArray, setDowntimeArray] = useState<any[]>([])
  const [onDeleteSystem, setOnDeleteSystem] = useState(false)
  const [allUsers, setAllUsers] = useState<userType[]>([])
  const [selectedOwners, setSelectedOwners] = useState<userType[]>([])
  const { darkMode, isSuper } = useContext(AppContext)
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}

  useEffect(() => {
    getSystems()
    getUsers()
  }, [isSuper])

  useEffect(() => {
    if (selected !== -1 || newSystem) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'

    if (selected !== -1) {
      const select = tableData[selected]
      setData(select)
      getDowntimeData(select)
      if (select.type) setSelectedType(select.type)
      if (select.interval) setSelectedInterval(getTimeOption(intervalDefaultOptions, select.interval))
      if (select.timeout) setSelectedTimeout(getTimeOption(timeoutDefaultOptions, select.timeout))
      if (select.owners) setSelectedOwners(select.owners)
      if (select.alertThreshold) setSelectedThreshold(select.alertThreshold)
      if (select.alertsExpiration) setSelectedAlertExpiration(select.alertsExpiration)
    }
  }, [selected, newSystem])

  const getSystems = async () => {
    try {
      setLoading(true)
      const systems = isSuper ? await getAllSystems() : await getSystemsByOwnerId(user._id)
      if (systems && systems.length) setTableData(systems)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const getUsers = async () => {
    try {
      setLoading(true)
      const users = isSuper ? await getAllUsers() : []
      if (users && users.length) setAllUsers(users)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const getDowntimeData = async (system: systemType) => {
    const allDowntimes = await getAllEvents()
    if (allDowntimes && allDowntimes.length) {
      setDowntimeArray(allDowntimes.filter((downtime: eventType) => downtime.systemId === system._id))
    }
  }

  const updateData = (key: string, e: onChangeEventType) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const discardChanges = () => {
    setData({})
    setNewSystem(false)
    setSelected(-1)
    setAddDowntime(false)
    setSelectedType('')
    setSelectedInterval({ name: '', value: 120000 })
    setSelectedTimeout({ name: '', value: 10000 })
    setDowntimeArray([])
    setSelectedDowntime(-1)
    setOnDeleteSystem(false)
    setSelectedOwners([])
    setSelectedThreshold(3)
    setSelectedAlertExpiration(2)
  }

  const saveChanges = async (dtArray?: systemType[]) => {
    setLoading(true)
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    try {
      const systemData = {
        ...data,
        type: data.customType || selectedType,
        interval: selectedInterval.value,
        timeout: selectedTimeout.value,
        alertThreshold: selectedThreshold,
        alertsExpiration: selectedAlertExpiration,
        selectedOwners,
        updatedBy: user.username || '',
        downtimeArray: Array.isArray(dtArray) ? dtArray : downtimeArray
      }
      if (newSystem) {
        const saved = await createSystem(systemData)
        if (saved && saved._id) {
          toast.success('System created successfully')
          discardChanges()
          getSystems()
        }
        else toast.error('Error creating system. Try again later')
      } else {
        const updated = await updateSystem(systemData)
        if (updated && updated._id) {
          toast.success('System updated successfully')
          discardChanges()
          getSystems()
        }
        else toast.error('Error updating system. Try again later')
      }
      setLoading(false)
      localStorage.removeItem('localSystems')
      localStorage.removeItem('localEvents')
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const checkErrors = () => {
    const errors = []
    if (!start) errors.push('Select start date')
    if (!end) errors.push('Select end date')
    if (new Date(end).getTime() <= new Date().getTime()) errors.push('Wrong end date')
    if (new Date(end).getTime() <= new Date(start).getTime()) errors.push('End date should be after start date')
    return errors
  }

  const saveDowntime = async () => {
    try {
      const errors = checkErrors()
      if (errors.length) return errors.map((error: string) => toast.error(error))

      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
      if (selectedDowntime !== -1) {
        const newArr = [...downtimeArray]
        newArr[selectedDowntime] = {
          ...downtimeArray[selectedDowntime],
          start,
          end,
          updatedBy: user.username || '',
          note: data.downtimeNote,
          url: data.url || ''
        }
        await saveChanges(newArr)
      } else await saveChanges(downtimeArray.concat({
        start,
        end,
        updatedBy: user.username || '',
        note: data.downtimeNote,
        url: data.url || ''
      }))

      setAddDowntime(false)
      setSelectedDowntime(-1)
      setStart(null)
      setEnd(null)
    } catch (error) {
      console.error(error)
    }
  }

  const getDate = (date: Date) => {
    return new Date(date).toLocaleString('es',
      { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
  }

  const removeDowntime = async () => {
    try {
      const removed = await deleteEvent(downtimeArray[selectedDowntime])
      if (removed) {
        toast.success('Downtime removed successfully')
        setSelectedDowntime(-1)
        getDowntimeData(data)
        localStorage.removeItem('localSystems')
        localStorage.removeItem('localEvents')
      }
      else toast.error('Error removing downtime')
    } catch (error) {
      console.error(error)
    }
  }

  const editDowntime = () => {
    const downtime = downtimeArray[selectedDowntime]
    setStart(new Date(downtime.start))
    setEnd(new Date(downtime.end))
    setData({ ...data, downtimeNote: downtime.note })
    setAddDowntime(true)
  }

  const removeSystem = async () => {
    setLoading(true)
    try {
      const deleted = await deleteSystem(tableData[selected])
      if (deleted) {
        toast.success('System deleted successfully')
        discardChanges()
        getSystems()
        localStorage.removeItem('localSystems')
        localStorage.removeItem('localEvents')
      }
      else toast.error('Error deleting system. Try again later')
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="systems__container">
      {newSystem || selected !== -1 ? onDeleteSystem ?
        <Modal onClose={discardChanges} title='Delete System'>
          <div className='users__delete-modal'>
            <p>Are you sure you want to delete system <strong>{tableData[selected].name}</strong>?</p>
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
                handleClick={removeSystem}
                bgColor={APP_COLORS.BLUE_TWO}
                textColor='white'
                style={{ width: '45%' }}
                disabled={loading}
              />
            </div>
          </div>
        </Modal>
        :
        <Modal
          onClose={discardChanges}
          title={newSystem ? 'New System' : 'System Details'}
          style={{ maxWidth: '50vw' }}
        >
          <div className="systems__new">
            <InputField
              label='Name'
              name='name'
              updateData={updateData}
              value={data.name}
              disabled={!isSuper}
            />
            <InputField
              label='URL'
              name='url'
              updateData={updateData}
              value={data.url}
              disabled={!isSuper}
            />
            <div className="systems__new-row">
              {isSuper ?
                <Dropdown
                  label='Owner'
                  options={allUsers}
                  value={selectedOwners}
                  selected={selectedOwners}
                  setSelected={setSelectedOwners}
                  maxHeight='20vh'
                  objKey='username'
                  style={{ width: '100%' }}
                  multiselect
                />
                : <InputField
                  label='Owner'
                  name='owner'
                  updateData={updateData}
                  disabled
                  value={user.username}
                />}
              <InputField
                label='Description (optional)'
                name='description'
                updateData={updateData}
                value={data.description}
                disabled={!isSuper}
              />
            </div>
            {isSuper ?
              <div className="systems__new-row">
                <Dropdown
                  label='Type'
                  options={typeOptions}
                  value={selectedType}
                  selected={selectedType}
                  setSelected={setSelectedType}
                  maxHeight='20vh'
                  style={{ width: '100%' }}
                />
                {selectedType === 'Other' ?
                  <InputField
                    label='Describe type'
                    name='customType'
                    updateData={updateData}
                    value={data.customType}
                  />
                  : ''}
                <Dropdown
                  label='Interval'
                  options={intervalOptions}
                  value={selectedInterval.name}
                  selected={selectedInterval}
                  setSelected={setSelectedInterval}
                  maxHeight='20vh'
                  objKey='name'
                  style={{ width: '100%' }}
                />
                <Dropdown
                  label='Timeout'
                  options={timeoutOptions}
                  value={selectedTimeout.name}
                  selected={selectedTimeout}
                  setSelected={setSelectedTimeout}
                  maxHeight='20vh'
                  objKey='name'
                  style={{ width: '100%' }}
                />
              </div> : ''}
            {isSuper ?
              <div className="systems__new-row">
                <Dropdown
                  label='User Alerts Threshold'
                  options={alertsThreshold}
                  value={selectedThreshold}
                  selected={selectedThreshold}
                  setSelected={setSelectedThreshold}
                  maxHeight='20vh'
                  style={{ width: '100%' }}
                />
                <Dropdown
                  label='User Alerts Expiration (hours)'
                  options={alertsExpiration}
                  value={selectedAlertExpiration}
                  selected={selectedAlertExpiration}
                  setSelected={setSelectedAlertExpiration}
                  maxHeight='20vh'
                  style={{ width: '100%' }}
                />
              </div> : ''}
            <div className="systems__new-downtime">
              {!addDowntime ?
                <DataTable
                  title='Planned downtime'
                  tableData={downtimeArray}
                  setTableData={setDowntimeArray}
                  tableHeaders={downtimeHeaders}
                  name='downtime'
                  selected={selectedDowntime}
                  setSelected={setSelectedDowntime}
                  loading={loading}
                /> : ''}
              {addDowntime ?
                <div>
                  <h4 className="systems__new-downtime-title">{selectedDowntime !== -1 ? 'Edit Downtime' : 'New Downtime'}</h4>
                  <div className="systems__new-row">
                    {openStartCalendar ?
                      <DatePicker
                        selected={start}
                        onChange={setStart}
                        showTimeSelect
                        timeCaption="time"
                        timeFormat="HH:mm"
                        inline
                      />
                      : ''
                    }
                    {openEndCalendar ?
                      <DatePicker
                        selected={end}
                        onChange={setEnd}
                        showTimeSelect
                        timeCaption="time"
                        timeFormat="HH:mm"
                        inline
                      />
                      : ''
                    }
                  </div>
                  <div className="systems__new-row">
                    <Button
                      label={openStartCalendar ? 'OK' : start ? 'Start: ' + getDate(start) : 'Select Start'}
                      handleClick={() => setOpenStartCalendar(!openStartCalendar)}
                      bgColor={APP_COLORS.ORANGE_ONE}
                      textColor='white'
                      style={{ width: '45%' }}
                      disabled={loading}
                    />
                    <Button
                      label={openEndCalendar ? 'OK' : end ? 'End: ' + getDate(end) : 'Select End'}
                      handleClick={() => setOpenEndCalendar(!openEndCalendar)}
                      bgColor={APP_COLORS.ORANGE_ONE}
                      textColor='white'
                      style={{ width: '45%' }}
                      disabled={loading}
                    />
                  </div>
                  <InputField
                    label='Note'
                    name='downtimeNote'
                    updateData={updateData}
                    value={data.downtimeNote}
                  />
                </div>
                : ''}
              <div className="systems__new-row">
                <Button
                  label={addDowntime ? 'Discard' : 'New Downtime'}
                  handleClick={() => {
                    setData({ ...data, downtimeNote: '' })
                    setSelectedDowntime(-1)
                    setStart(null)
                    setEnd(null)
                    setAddDowntime(!addDowntime)
                  }}
                  bgColor={addDowntime ? APP_COLORS.GRAY_ONE : APP_COLORS.ORANGE_ONE}
                  textColor='white'
                  style={{ width: '45%' }}
                  disabled={loading}
                />
                {addDowntime ?
                  <Button
                    label={selectedDowntime !== -1 ? 'Save Downtime' : 'Add'}
                    handleClick={saveDowntime}
                    bgColor={APP_COLORS.BLUE_TWO}
                    textColor='white'
                    disabled={!start || !end || loading}
                    style={{ width: '45%' }}
                  /> : ''}
                {!addDowntime && selectedDowntime !== -1 ?
                  <>
                    <Button
                      label='Edit'
                      handleClick={editDowntime}
                      bgColor={APP_COLORS.BLUE_TWO}
                      textColor='white'
                      style={{ width: '22.5%' }}
                      disabled={loading}
                    />
                    <Button
                      label='Remove'
                      handleClick={removeDowntime}
                      bgColor={APP_COLORS.RED_TWO}
                      textColor='white'
                      style={{ width: '22.5%' }}
                      disabled={loading}
                    />
                  </> : ''}
              </div>
            </div>
            {!addDowntime && selectedDowntime === -1 ?
              <div className="systems__new-row" style={{ marginTop: '1rem' }}>
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
              : ''}
            {isSuper && !newSystem && !addDowntime && selectedDowntime === -1 ?
              <>
                <Separator />
                <Button
                  label='Delete System'
                  handleClick={() => setOnDeleteSystem(true)}
                  bgColor={APP_COLORS.RED_TWO}
                  textColor='white'
                  disabled={loading}
                />
              </>
              : ''}
          </div>
        </Modal>
        : ''}
      <div className="systems__col" style={{ filter: selected !== -1 || newSystem ? 'blur(10px)' : '' }}>
        {isSuper ?
          <Button
            label='New System'
            handleClick={() => setNewSystem(true)}
            bgColor={APP_COLORS.BLUE_TWO}
            textColor='white'
            disabled={loading}
          /> : ''}
        <DataTable
          title='Systems'
          tableData={tableData}
          setTableData={setTableData}
          tableHeaders={systemHeaders}
          name='systems'
          selected={selected}
          setSelected={setSelected}
          loading={loading}
        />
      </div>
    </div>
  )
}