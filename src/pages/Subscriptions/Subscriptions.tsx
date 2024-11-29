import React, { useContext, useEffect, useState, useTransition } from 'react'
import DataTable from '../../components/DataTable/DataTable'
import { getAllSubscriptions } from '../../services'
import { subscriptionHeaders } from '../../constants/tableHeaders'
import { logType, onChangeEventType, SubscriptionType } from '../../types'
import SearchBar from '../../components/SearchBar/SearchBar'
import { useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext'

type Props = {}

export default function Subscriptions({ }: Props) {
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [tableData, setTableData] = useState<logType[]>([])
    const [filteredData, setFilteredData] = useState<logType[]>([])
    const [pending, startTransition] = useTransition()
    const { isLoggedIn, isSuper } = useContext(AppContext)
    const history = useHistory()

    useEffect(() => {
        getSubs()
    }, [])

    useEffect(() => {
        if (isLoggedIn !== null && !isLoggedIn && !isSuper) return history.push('/')
    }, [isLoggedIn])

    const getSubs = async () => {
        try {
            setLoading(true)
            const subs = await getAllSubscriptions()
            if (subs && subs.length) {
                setTableData(subs)
                setFilteredData(subs)
            }
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
                    .filter((sub: SubscriptionType) =>
                        JSON.stringify(sub).toLocaleLowerCase().includes(searchString.trim().toLocaleLowerCase())
                    ))
            })
        } else setFilteredData(tableData)
    }

    return (
        <div className="applogs__container">
            <div className="applogs__row">
                <div className="applogs__col">
                </div>
                <div className="applogs__col">
                    <SearchBar
                        handleChange={onChangeSearch}
                        triggerSearch={triggerSearch}
                        value={search}
                        placeholder='Search subscriptions...'
                    />
                </div>
                <div className="applogs__col">
                </div>
            </div>
            <div className="applogs__col">
                <DataTable
                    title='Subscriptions'
                    tableData={filteredData}
                    tableHeaders={subscriptionHeaders}
                    name='subscriptions'
                    loading={loading || pending}
                    max={18}
                />
            </div>
        </div>
    )
}