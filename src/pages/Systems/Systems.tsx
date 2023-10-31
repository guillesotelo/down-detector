import React, { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import DataTable from '../../components/DataTable/DataTable'
import { dataObj } from '../../types'
import Modal from '../../components/Modal/Modal'
import InputField from '../../components/InputField/InputField'
import Dropdown from '../../components/Dropdown/Dropdown'
import { downtimeHeaders, intervalDefaultOptions, systemHeaders, timeoutDefaultOptions } from '../../constants/tableHeaders'
import { createSystem, getAllSystems, updateSystem } from '../../services'
import { toast } from 'react-toastify'
import Calendar from 'react-calendar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteEvent, getAllEvents } from '../../services/event'
type Props = {}

export default function Systems({ }: Props) {
  const [data, setData] = useState<dataObj>({})
  const [newSystem, setNewSystem] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addDowntime, setAddDowntime] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [selectedDowntime, setSelectedDowntime] = useState(-1)
  const [tableData, setTableData] = useState<dataObj[]>([])
  const [typeOptions, setTypeOptions] = useState(['Detection', 'Other'])
  const [intervalOptions, setIntervalOptions] = useState(intervalDefaultOptions)
  const [timeoutOptions, setTimeoutOptions] = useState(timeoutDefaultOptions)
  const [selectedType, setSelectedType] = useState('')
  const [selectedInterval, setSelectedInterval] = useState({ name: '', value: null })
  const [selectedTimeout, setSelectedTimeout] = useState({ name: '', value: null })
  const [start, setStart] = useState<any>(null)
  const [end, setEnd] = useState<any>(null)
  const [openStartCalendar, setOpenStartCalendar] = useState(false)
  const [openEndCalendar, setOpenEndCalendar] = useState(false)
  const [downtimeArray, setDowntimeArray] = useState<any[]>([])

  useEffect(() => {
    getSystems()
  }, [])

  useEffect(() => {
    if (selected !== -1 || newSystem) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'

    if (selected !== -1) {
      const select = tableData[selected]
      setData(select)
      getDowntimeData(select)
      if (select.type) setSelectedType(data.type)
      if (select.interval) setSelectedInterval(getTimeOption(intervalDefaultOptions, select.interval))
      if (select.timeout) setSelectedTimeout(getTimeOption(timeoutDefaultOptions, select.timeout))
    }
  }, [selected, newSystem])

  const getTimeOption = (arr: any[], value: number) => {
    return arr.find(item => item.value === value) || { name: '', value: '' }
  }

  const getSystems = async () => {
    try {
      const systems = await getAllSystems()
      if (systems && systems.length) setTableData(systems)
    } catch (error) {
      console.error(error)
    }
  }

  const getDowntimeData = async (system: dataObj) => {
    const allDowntimes = await getAllEvents()
    if (allDowntimes && allDowntimes.length) {
      setDowntimeArray(allDowntimes.filter((downtime: dataObj) => downtime.systemId === system._id))
    }
  }

  const updateData = (key: string, e: { [key: string | number]: any }) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const discardChanges = () => {
    setData({})
    setNewSystem(false)
    setSelected(-1)
    setAddDowntime(false)
    setSelectedType('')
    setSelectedInterval({ name: '', value: null })
    setSelectedTimeout({ name: '', value: null })
    setDowntimeArray([])
    setSelectedDowntime(-1)
  }

  const saveChanges = async () => {
    setLoading(true)
    try {
      const systemData = {
        ...data,
        type: selectedType,
        interval: selectedInterval.value,
        timeout: selectedTimeout.value,
        downtimeArray
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
          toast.success('System created successfully')
          discardChanges()
          getSystems()
        }
        else toast.error('Error updating system. Try again later')
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const saveDowntime = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    if (selectedDowntime !== -1) {
      const newArr = [...downtimeArray]
      newArr[selectedDowntime] = {
        ...downtimeArray[selectedDowntime],
        start,
        end,
        updatedBy: user.username || '',
        note: data.downtimeNote
      }
      setDowntimeArray(newArr)
    } else setDowntimeArray(downtimeArray.concat({
      start,
      end,
      updatedBy: user.username || '',
      note: data.downtimeNote
    }))
    setAddDowntime(false)
    setStart(null)
    setEnd(null)
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
      }
      else toast.error('Error removing downtime')
    } catch (error) {
      console.error(error)
    }
  }

  const editDowntime = () => {
    const downtime = downtimeArray[selectedDowntime]
    setStart(downtime.start)
    setEnd(downtime.end)
    setData({ ...data, downtimeNote: downtime.note })
    setAddDowntime(true)
  }

  return (
    <div className="systems__container">
      {newSystem || selected !== -1 ?
        <Modal onClose={discardChanges} title={newSystem ? 'New System' : 'System Details'}>
          <div className="systems__new">
            <InputField
              label='Name'
              name='name'
              updateData={updateData}
              value={data.name}
            />
            <InputField
              label='URL'
              name='url'
              updateData={updateData}
              value={data.url}
            />
            <InputField
              label='Description (optional)'
              name='description'
              updateData={updateData}
              value={data.description}
            />
            <div className="systems__new-row">
              <Dropdown
                label='Type'
                options={typeOptions}
                value={selectedType}
                selected={selectedType}
                setSelected={setSelectedType}
                maxHeight='20vh'
              />
              <Dropdown
                label='Interval'
                options={intervalOptions}
                value={selectedInterval.name}
                selected={selectedInterval}
                setSelected={setSelectedInterval}
                maxHeight='20vh'
                objKey='name'
              />
              <Dropdown
                label='Timeout'
                options={timeoutOptions}
                value={selectedTimeout.name}
                selected={selectedTimeout}
                setSelected={setSelectedTimeout}
                maxHeight='20vh'
                objKey='name'
              />
            </div>
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
                    <Button
                      label={openStartCalendar ? 'OK' : start ? getDate(start) : 'Select Start'}
                      handleClick={() => setOpenStartCalendar(!openStartCalendar)}
                      bgColor='#264875'
                      textColor='white'
                      style={{ width: '45%' }}
                    />
                    <Button
                      label={openEndCalendar ? 'OK' : end ? getDate(end) : 'Select End'}
                      handleClick={() => setOpenEndCalendar(!openEndCalendar)}
                      bgColor='#264875'
                      textColor='white'
                      style={{ width: '45%' }}
                    />
                  </div>
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
                  handleClick={() => setAddDowntime(!addDowntime)}
                  bgColor={addDowntime ? 'gray' : '#264875'}
                  textColor='white'
                  style={{ width: '45%' }}
                />
                {addDowntime ?
                  <Button
                    label={selectedDowntime !== -1 ? 'Save' : 'Add'}
                    handleClick={saveDowntime}
                    bgColor='#264875'
                    textColor='white'
                    disabled={!start || !end}
                    style={{ width: '45%' }}
                  /> : ''}
                {!addDowntime && selectedDowntime !== -1 ?
                  <>
                    <Button
                      label='Edit'
                      handleClick={editDowntime}
                      bgColor='#264875'
                      textColor='white'
                      style={{ width: '22.5%' }}
                    />
                    <Button
                      label='Remove'
                      handleClick={removeDowntime}
                      bgColor='#C45757'
                      textColor='white'
                      style={{ width: '22.5%' }}
                    />
                  </> : ''}
              </div>
            </div>
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
      <div className="systems__col" style={{ filter: selected !== -1 || newSystem ? 'blur(10px)' : '' }}>
        <Button
          label='New System'
          handleClick={() => setNewSystem(true)}
          bgColor='#105ec6'
          textColor='white'
        />
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