import { useContext, useEffect, useRef, useState, useTransition } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { historyHeaders } from '../../constants/tableHeaders'
import { getDate, getHistoryAndAlerts, getUser, sortArray } from '../../helpers'
import { alertType, dataObj, eventType, historyType, logType, onChangeEventType, systemType } from '../../types'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext'
import Switch from '../../components/Switch/Swith'
import Dropdown from '../../components/Dropdown/Dropdown'
import { getActiveSystems } from '../../services'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { APP_COLORS } from '../../constants/app'

type Props = {}

const emptyFilter: dataObj = {
    status: { label: 'All', value: null },
    logsFrom: '2000-01-01'
}

export default function History({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [getRaw, setGetRaw] = useState(false)
    const [tableData, setTableData] = useState<historyType[]>([])
    const [filteredData, setFilteredData] = useState<historyType[]>([])
    const [allSystems, setAllSystems] = useState<systemType[]>([])
    const [selectedSystem, setSelectedSystem] = useState<systemType>({ name: 'All' })
    const [paginate, setPaginate] = useState(0)
    const [filter, setFilter] = useState(emptyFilter)
    const [openCalendar, setOpenCalendar] = useState(false)
    const [pending, startTransition] = useTransition()
    const { isLoggedIn, isSuper } = useContext(AppContext)
    const history = useHistory()
    const historyContainerRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        if (historyContainerRef.current) {
            historyContainerRef.current.addEventListener('scroll', autoPaginate)
        }
    }, [historyContainerRef])

    useEffect(() => {
        getHistory(false)
        getSystems()
    }, [isSuper])

    useEffect(() => {
        if (selectedSystem.name !== 'All' && getRaw) getHistory(true)
    }, [getRaw])

    useEffect(() => {
        if (isLoggedIn !== null && !isLoggedIn) return history.push('/')
    }, [isLoggedIn])

    useEffect(() => {
        setFilteredData(() =>
            tableData.filter(h => (
                (!selectedSystem._id || h.systemId === selectedSystem._id) &&
                (filter.status.value === null || h.status === filter.status.value) &&
                new Date(h.createdAt || '').getTime() >= new Date(filter.logsFrom).getTime()
            )))
        if (!selectedSystem._id) setGetRaw(false)
    }, [selectedSystem, filter])

    const autoPaginate = (e: Event) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLElement
        if (scrollTop + clientHeight >= scrollHeight) {
            setPaginate(p => p + 1)
        }
    }

    const getSystems = async () => {
        try {
            let systems = await getActiveSystems()
            if (systems && Array.isArray(systems)) {
                setAllSystems([{ name: 'All' }].concat(systems))
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getHistory = async (getRawData: boolean) => {
        try {
            setLoading(true)
            const data = await getHistoryAndAlerts(selectedSystem._id || '', getRawData)
            const { systems } = getUser()
            const ownedSystems = systems && Array.isArray(systems) ? systems.map(system => system._id) : []
            const completeHistory = isSuper ? data : data.filter(history => ownedSystems.includes(history.systemId))

            const statusAndAlerts = completeHistory
                .reverse()
                .map((item, i, arr) => {
                    const currentStatus = item.status
                    const currentTime = new Date(item.createdAt || new Date()).getTime()
                    const nextTime = arr[i + 1] ? new Date(arr[i + 1].createdAt || new Date()).getTime() : null
                    const nextStatus = arr[i + 1] ? arr[i + 1].status : currentStatus
                    const isBusy = new Date().getTime() - currentTime < 120000
                    const isAlert = (item as alertType).userAlert
                    // We check if less than 2 minutes passed between peaks to spot BUSY states (unlike DOWN states)
                    if (!isAlert && (isBusy || (nextStatus && nextStatus !== currentStatus && nextTime && nextTime - currentTime < 120000))) {
                        item.status = 'BUSY'
                    }
                    return item
                })
                .reverse()

            if (!selectedSystem._id) setTableData(statusAndAlerts)
            setFilteredData(statusAndAlerts.filter(h => (
                (filter.status.value === null || h.status === filter.status.value) &&
                new Date(h.createdAt || '').getTime() >= new Date(filter.logsFrom).getTime()
            )))
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
        if (searchString && typeof searchString === 'string') {
            startTransition(() => {
                setFilteredData(tableData
                    .filter((log: logType) =>
                        JSON.stringify(log).toLocaleLowerCase().includes(searchString.trim().toLocaleLowerCase())
                    ))
            })
        } else setFilteredData(tableData)
    }

    const downloadCsv = () => {
        try {
            const headers = historyHeaders.concat(
                getRaw ? [{ name: 'RAW', value: 'raw' }] : []
            )

            const rows = [...filteredData] as any[]

            // CSV header row
            const headerRow = headers
                .map(h => `"${h.name}"`)
                .join(',')

            // CSV data rows
            const dataRows = rows.map(row =>
                headers
                    .map(h => {
                        let value = row[h.value]

                        // Special fallback
                        if (h.value === 'createdBy' && (value === null || value === undefined || value === '')) {
                            value = 'App'
                        }

                        return `"${String(value ?? '').replace(/"/g, '""')}"`
                    })
                    .join(',')
            )

            const csvContent = [headerRow, ...dataRows].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)

            const downloadLink = document.createElement('a')
            downloadLink.href = url
            downloadLink.download = `Down@Volvo - ${selectedSystem.name}.csv`
            downloadLink.style.display = 'none'

            document.body.appendChild(downloadLink)
            downloadLink.click()

            document.body.removeChild(downloadLink)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error(error)
            toast.error('Error generating CSV. Please try again')
        }
    }

    return (
        <div className="history__container" ref={historyContainerRef}>
            <div className="history__row">
                <div className="history__col" style={{ width: 'fit-content' }}>
                    <div className="history__row" style={{ margin: 0, justifyContent: 'flex-start' }}>
                        <Dropdown
                            label='System'
                            options={allSystems}
                            value={selectedSystem}
                            selected={selectedSystem}
                            setSelected={setSelectedSystem}
                            maxHeight='40vh'
                            objKey='name'
                            style={{ width: '16rem', marginRight: '1rem' }}
                            loading={loading}
                        />
                        <Dropdown
                            label='Status'
                            options={[{ label: 'All', value: null }, { label: 'DOWN', value: false }, { label: 'UP', value: true }]}
                            value={filter.status}
                            selected={filter.status}
                            setSelected={v => setFilter(f => ({ ...f, status: v }))}
                            maxHeight='20vh'
                            objKey='label'
                            style={{ width: '8rem', marginRight: '1rem' }}
                            loading={loading}
                        />
                        {openCalendar ?
                            <DatePicker
                                selected={filter.logsFrom !== '2000-01-01' ? new Date(filter.logsFrom) : new Date()}
                                onChange={v => {
                                    setFilter(f => ({ ...f, logsFrom: v }))
                                }}
                                showTimeSelect
                                timeCaption="time"
                                timeFormat="HH:mm"
                            // inline
                            />
                            :
                            <Button
                                label={filter.logsFrom !== '2000-01-01' ? getDate(filter.logsFrom) : 'Logs from date...'}
                                handleClick={() => setOpenCalendar(!openCalendar)}
                                bgColor={APP_COLORS.ORANGE_ONE}
                                textColor='white'
                                style={{ width: '45%' }}
                                disabled={loading || openCalendar}
                            />
                        }
                        {selectedSystem.name !== 'All' ?
                            <Switch
                                label='Get raw'
                                value={getRaw}
                                setValue={setGetRaw}
                                on='Yes'
                                off='No'
                            /> : ''}
                    </div>
                </div>
                <div className="history__col">
                    <Button
                        label='Download CSV'
                        handleClick={downloadCsv}
                        textColor='#fff'
                        style={{ alignSelf: 'flex-start', marginLeft: '1rem' }}
                        disabled={loading}
                    />
                </div>
                <div className="history__col">
                    <SearchBar
                        handleChange={onChangeSearch}
                        triggerSearch={triggerSearch}
                        value={search}
                        placeholder='Search history...'
                        style={{ alignSelf: 'flex-end' }}
                    />
                </div>
            </div>
            <div className="history__col">
                <DataTable
                    title='History'
                    tableData={filteredData}
                    setTableData={setFilteredData}
                    tableHeaders={historyHeaders.concat(
                        getRaw ?
                            [{
                                name: 'RAW',
                                value: 'raw'
                            }]
                            : [])}
                    name='history'
                    loading={loading || pending}
                    max={18}
                    paginate={paginate}
                />
            </div>
        </div>
    )
}