import React, { useEffect, useState, useTransition } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { getAllLogs, verifyToken } from '../../services'
import { logHeaders } from '../../constants/tableHeaders'
import { logType, onChangeEventType } from '../../types'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useHistory } from 'react-router-dom'

type Props = {}

export default function AppLogs({ }: Props) {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)
  const [tableData, setTableData] = useState<logType[]>([])
  const [filteredData, setFilteredData] = useState<logType[]>([])
  const [pending, startTransition] = useTransition()
  const history = useHistory()

  useEffect(() => {
    verifyUser()
    getHistory()
  }, [])

  const verifyUser = async () => {
    const verified = await verifyToken()
    if (!verified.isSuper) return history.push('/')
  }

  const getHistory = async () => {
    try {
      const logs = await getAllLogs()
      if (logs && logs.length) {
        setTableData(logs)
        setFilteredData(logs)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onChangeSearch = (e: onChangeEventType) => {
    const { value } = e.target || {}
    setSearch(value)
    triggerSearch(value)
  }

  const triggerSearch = (searchString?: string) => {
    if (searchString) {
      startTransition(() => {
        setFilteredData(tableData
          .filter((log: logType) =>
            JSON.stringify(log).toLocaleLowerCase().includes(searchString.trim().toLocaleLowerCase())
          ))
      })
    } else setFilteredData(tableData)
  }

  return (
    <div className="applogs__container">
      <SearchBar
        handleChange={onChangeSearch}
        triggerSearch={triggerSearch}
        value={search}
        placeholder='Search logs...'
      />
      <div className="applogs__col">
        <DataTable
          title='App Logs'
          tableData={filteredData}
          setTableData={setFilteredData}
          tableHeaders={logHeaders}
          name='logs'
          selected={selected}
          setSelected={setSelected}
          loading={loading || pending}
        />
      </div>
    </div>
  )
}