import { useEffect, useState } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { hisrotyHeaders } from '../../constants/tableHeaders'
import { getHistoryAndAlerts } from '../../helpers'
import { historyType, logType, onChangeEventType } from '../../types'
import SearchBar from '../../components/SearchBar/SearchBar'

type Props = {}

export default function History({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [tableData, setTableData] = useState<historyType[]>([])
    const [filteredData, setFilteredData] = useState<historyType[]>([])

    useEffect(() => {
        getHistory()
    }, [])

    const getHistory = async () => {
        try {
            setLoading(true)
            const data = await getHistoryAndAlerts()
            setTableData(data)
            setFilteredData(data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
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
            setFilteredData(tableData
                .filter((log: logType) =>
                    JSON.stringify(log).toLocaleLowerCase().includes(searchString.trim().toLocaleLowerCase())
                ))
        } else setFilteredData(tableData)
    }

    return (
        <div className="history__container">
            <SearchBar
                handleChange={onChangeSearch}
                triggerSearch={triggerSearch}
                value={search}
                placeholder='Search histories...'
            />
            <div className="history__col">
                <DataTable
                    title='History'
                    tableData={filteredData}
                    setTableData={setFilteredData}
                    tableHeaders={hisrotyHeaders}
                    name='history'
                    loading={loading}
                />
            </div>
        </div>
    )
}