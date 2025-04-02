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

export default function BuildTracker() {
    const [builds, setBuilds] = useState<null | dataObj[]>(testBuilds)
    const [copyBuilds, setCopyBuilds] = useState<null | dataObj[]>(testBuilds)
    const [openModal, setOpenModal] = useState<null | string>(null)
    const [build, setBuild] = useState<null | dataObj>(null)
    const [search, setSearch] = useState('')
    const [moduleArray, setModuleArray] = useState<dataObj[]>([])
    const { darkMode, setDarkMode } = useContext(AppContext)

    useEffect(() => {
        if (openModal && builds) {
            const selected = builds.find(b => b.id === openModal) || null
            if (selected) {
                setBuild(selected)
                setModuleArray(getModuleArray(selected.modules))
            }
        } else {
            setBuild(null)
            setModuleArray([])
        }

        setDarkMode(false)
    }, [openModal, builds])

    useEffect(() => {
        if (search.trim() && copyBuilds) {
            setBuilds(copyBuilds.filter(b =>
                    JSON.stringify(Object.values(b)).toLocaleLowerCase()
                        .includes(search.toLocaleLowerCase().trim())
                ))
        } else setBuilds(copyBuilds)
    }, [search, copyBuilds])

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
                    onClose={() => setOpenModal(null)}>
                    <div className="buildtracker__modal">
                        <ModulesTable
                            title="Modules"
                            tableData={moduleArray}
                            setTableData={setModuleArray}
                            tableHeaders={moduleHeaders}
                            orderDataBy={moduleHeaders[3]}
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