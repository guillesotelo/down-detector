import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { dataObj } from '../../types'
import { getAllHistory } from '../../services'
import { hisrotyHeaders } from '../../constants/tableHeaders'

type Props = {}

export default function History({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState(-1)
    const [tableData, setTableData] = useState<dataObj[]>([])

    console.log(tableData)

    useEffect(() => {
        getHistory()
    }, [])

    const getHistory = async () => {
        try {
            const systems = await getAllHistory()
            if (systems && systems.length) setTableData(systems)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="history__container">
            <div className="systems__col">
                <DataTable
                    title='History'
                    tableData={tableData}
                    setTableData={setTableData}
                    tableHeaders={hisrotyHeaders}
                    name='systems'
                    selected={selected}
                    setSelected={setSelected}
                    loading={loading}
                />
            </div>
        </div>
    )
}