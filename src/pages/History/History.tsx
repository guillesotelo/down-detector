import { useContext, useEffect, useState, useTransition } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { hisrotyHeaders } from '../../constants/tableHeaders'
import { getHistoryAndAlerts, getUser } from '../../helpers'
import { alertType, eventType, historyType, logType, onChangeEventType } from '../../types'
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
    const { isLoggedIn, isSuper } = useContext(AppContext)
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
            const { systems } = getUser()
            const ownedSystems = systems && Array.isArray(systems) ? systems.map(system => system._id) : []
            const completeHistory = isSuper ? data : data.filter(history => ownedSystems.includes(history.systemId))
           
            const statusAndAlerts = completeHistory.sort((a: eventType & alertType, b: eventType & alertType) => {
              if (new Date(a.createdAt || new Date()).getTime() > new Date(b.createdAt || new Date()).getTime()) return -1
              return 1
            })
            .reverse()
            .map((item, i, arr) => {
              const currentStatus = item.status
              const currentTime = new Date(item.createdAt || new Date()).getTime()
              const nextTime = arr[i + 1] ? new Date(arr[i + 1].createdAt || new Date()).getTime() : null
              const nextStatus = arr[i + 1] ? arr[i + 1].status : currentStatus
              // We check if less than 2 minutes passed between peaks to spot BUSY states (unlike DOWN states)
              if (nextStatus && nextStatus !== currentStatus && nextTime && nextTime - currentTime < 120000) {
                item.status = 'BUSY'
              }
              return item
            })
            .reverse()

            setTableData(statusAndAlerts)
            setFilteredData(statusAndAlerts)
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