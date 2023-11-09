import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { dataObj } from '../../types'
import { getAllHistory } from '../../services'
import { hisrotyHeaders } from '../../constants/tableHeaders'

type Props = {}

export default function History({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState<dataObj[]>([])

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
            <div className="history__col">
                <DataTable
                    title='History'
                    tableData={tableData}
                    tableHeaders={hisrotyHeaders}
                    name='history'
                    loading={loading}
                />
            </div>
        </div>
    )
}