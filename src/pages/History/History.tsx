import { useContext, useEffect, useState, useTransition } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { hisrotyHeaders } from '../../constants/tableHeaders'
import { getHistoryAndAlerts } from '../../helpers'
import { historyType, logType, onChangeEventType } from '../../types'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext'

type Props = {}

export default function History({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [tableData, setTableData] = useState<historyType[]>([])
    const [filteredData, setFilteredData] = useState<historyType[]>([])
    const [pending, startTransition] = useTransition()
    const { isLoggedIn } = useContext(AppContext)
    const history = useHistory()

    useEffect(() => {
        getHistory()
    }, [])

    useEffect(() => {
        if (isLoggedIn !== null && !isLoggedIn) return history.push('/')
      }, [isLoggedIn])
    
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
            startTransition(() => {
                setFilteredData(tableData
                    .filter((log: logType) =>
                        JSON.stringify(log).toLocaleLowerCase().includes(searchString.trim().toLocaleLowerCase())
                    ))
            })
        } else setFilteredData(tableData)
    }

    return (
        <div className="history__container">
            <SearchBar
                handleChange={onChangeSearch}
                triggerSearch={triggerSearch}
                value={search}
                placeholder='Search history...'
                style={{ marginBottom: '1rem' }}
            />
            <div className="history__col">
                <DataTable
                    title='History'
                    tableData={filteredData}
                    setTableData={setFilteredData}
                    tableHeaders={hisrotyHeaders}
                    name='history'
                    loading={loading || pending}
                    max={18}
                />
            </div>
        </div>
    )
}