import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { getAllLogs } from '../../services'
import { logHeaders } from '../../constants/tableHeaders'
import { dataObj } from '../../types'
import SearchBar from '../../components/SearchBar/SearchBar'

type Props = {}

export default function AppLogs({ }: Props) {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)
  const [tableData, setTableData] = useState<dataObj[]>([])

  useEffect(() => {
    getHistory()
  }, [])

  const getHistory = async () => {
    try {
      const logs = await getAllLogs()
      if (logs && logs.length) setTableData(logs)
    } catch (error) {
      console.error(error)
    }
  }

  const onChangeSearch = (e: any) => {
    const { value } = e.target || {}
    setSearch(value)
  }

  const triggerSearch = () => {
    return 0
  }

  return (
    <div className="applogs__container">
      <SearchBar
        handleChange={onChangeSearch}
        triggerSearch={triggerSearch}
        value={search}
      />
      <div className="applogs__col">
        <DataTable
          title='App Logs'
          tableData={tableData}
          setTableData={setTableData}
          tableHeaders={logHeaders}
          name='logs'
          selected={selected}
          setSelected={setSelected}
          loading={loading}
        />
      </div>
    </div>
  )
}