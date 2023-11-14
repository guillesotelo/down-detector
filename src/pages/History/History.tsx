import React, { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { dataObj } from '../../types'
import { getAllAlerts, getAllHistory } from '../../services'
import { hisrotyHeaders } from '../../constants/tableHeaders'
import { getHistoryAndAlerts, sortArray } from '../../helpers'

type Props = {}

export default function History({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [tableData, setTableData] = useState<dataObj[]>([])

    useEffect(() => {
        getHistory()
    }, [])

    const getHistory = async () => {
        try {
            setLoading(true)
            setTableData(await getHistoryAndAlerts())
            setLoading(false)
        } catch (error) {
            setLoading(false)
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