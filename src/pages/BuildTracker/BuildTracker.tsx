import { useContext, useEffect, useState } from "react"
import BuildCard from "../../components/BuildCard/BuildCard"
import Modal from "../../components/Modal/Modal"
import { dataObj, onChangeEventType } from "../../types"
import { testBuilds } from "../../constants/builds"
import { AppContext } from "../../AppContext"
import ModulesTable from "../../components/ModulesTable/ModulesTable"
import { moduleHeaders } from "../../constants/tableHeaders"
import { getDate } from "../../helpers"
import BuildTrackerHeader from "../../components/BuildTrackerHeader/BuildTrackerHeader"
import ProgressBar from "../../components/ProgressBar/ProgressBar"
import SearchBar from "../../components/SearchBar/SearchBar"

export default function BuildTracker() {
    const [builds, setBuilds] = useState<null | dataObj[]>(testBuilds)
    const [copyBuilds, setCopyBuilds] = useState<null | dataObj[]>(testBuilds)
    const [openModal, setOpenModal] = useState<null | string>(null)
    const [build, setBuild] = useState<null | dataObj>(null)
    const [search, setSearch] = useState('')
    const [searchModules, setSearchModules] = useState('')
    const [moduleArray, setModuleArray] = useState<dataObj[]>([])
    const [copyModuleArray, setCopyModuleArray] = useState<dataObj[]>([])
    const { darkMode, setDarkMode } = useContext(AppContext)

    useEffect(() => {
        if (openModal && builds) {
            const selected = builds.find(b => b.id === openModal) || null
            if (selected) {
                setBuild(selected)
                setModuleArray(getModuleArray(selected.modules))
                setCopyModuleArray(getModuleArray(selected.modules))
            }
        } else {
            setBuild(null)
            setModuleArray([])
            setCopyModuleArray([])
        }
    }, [openModal, builds])

    useEffect(() => {
        if (search.trim() && copyBuilds) {
            setBuilds(copyBuilds.filter(b =>
                JSON.stringify(Object.values(b)).toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase().trim())
            ))
        } else setBuilds(copyBuilds)
    }, [search, copyBuilds])

    useEffect(() => {
        if (searchModules.trim() && copyModuleArray) {
            setModuleArray(copyModuleArray.filter(b =>
                JSON.stringify(Object.values(b)).toLocaleLowerCase()
                    .includes(searchModules.toLocaleLowerCase().trim())
            ))
        } else setModuleArray(copyModuleArray)
    }, [searchModules, copyModuleArray])

    const getModuleArray = (modules: dataObj) => {
        return Object.keys(modules).map(key => {
            return {
                ...modules[key],
                name: key,
                org: null,
                art: modules[key].org.art,
                solution: modules[key].org.solution,
            }
        })
    }

    const onChangeSearch = (e: onChangeEventType) => {
        const { value } = e.target || {}
        setSearch(value)
    }

    const onChangeSearchModules = (e: onChangeEventType) => {
        const { value } = e.target || {}
        setSearchModules(value.trim())
    }


    return (
        <div className="buildtracker__container">
            <BuildTrackerHeader
                search={search}
                setSearch={setSearch}
                onChangeSearch={onChangeSearch}
            />
            {openModal && build ?
                <Modal
                    title={build.title}
                    subtitle={getDate(build.date)}
                    onClose={() => setOpenModal(null)}
                    style={{ maxHeight: '80vh', overflow: 'hidden' }}>
                    <div className="buildtracker__modal">
                        <div className="buildtracker__modal-row">
                            <ProgressBar
                                label="Total built"
                                arrData={copyModuleArray}
                                colors={[
                                    { key: "success", color: "#00b500" },
                                    { key: "failure", color: "#e70000" },
                                ]}
                                objKey="status"
                                percentageFor={{ key: 'status', value: 'success' }}
                                style={{ width: '45%', marginBottom: '.1rem' }}
                            />
                            <SearchBar
                                handleChange={onChangeSearchModules}
                                value={searchModules}
                                placeholder='Search modules...'
                                style={{ width: '30%' }}
                            />
                        </div>
                        <ModulesTable
                            title={`${searchModules ? 'Module search results' : 'Module list'} (${moduleArray.length})`}
                            tableData={moduleArray}
                            setTableData={setModuleArray}
                            tableHeaders={moduleHeaders}
                            orderDataBy={moduleHeaders[3]}
                            style={{ maxHeight: '60vh', overflowX: 'hidden', overflowY: 'scroll', paddingRight: '1rem' }}
                        />
                    </div>
                </Modal>
                : ''}
            <div className="buildtracker__list" style={{ filter: openModal ? 'blur(7px)' : '' }}>
                {builds?.map((b, i) =>
                    <BuildCard
                        key={i}
                        build={b}
                        setOpenModal={setOpenModal}
                        delay={String(i ? i / 20 : 0) + 's'}
                    />
                )}
            </div>
        </div>
    )
}