import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { getAllLogs } from '../../services'
import { logHeaders } from '../../constants/tableHeaders'
import { dataObj } from '../../types'

type Props = {}

export default function AppLogs({ }: Props) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [tableData, setTableData] = useState<dataObj[]>([])

  console.log(tableData)

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

  return (
    <div className="applogs__container">
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