import { useContext, useEffect, useState } from "react"
import BuildCard from "../../components/BuildCard/BuildCard"
import Modal from "../../components/Modal/Modal"
import { Build, dataObj, ModuleInfo, onChangeEventType } from "../../types"
import { testBuilds } from "../../constants/builds"
import { AppContext } from "../../AppContext"
import ModulesTable from "../../components/ModulesTable/ModulesTable"
import { moduleHeaders } from "../../constants/tableHeaders"
import { getBuildStatus, getDate, randomColors, sortArray } from "../../helpers"
import BuildTrackerHeader from "../../components/BuildTrackerHeader/BuildTrackerHeader"
import ProgressBar from "../../components/ProgressBar/ProgressBar"
import SearchBar from "../../components/SearchBar/SearchBar"
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart"
import TextData from "../../components/TextData/TextData"
import { COLOR_PALETTE, DARK_MODE_COLOR_PALETTE } from "../../constants/app"
import { generateBuildSamples } from "../../helpers/buildSamples"
import PolarAreaChart from "../../components/PolarAreaChart/PolarAreaChart"
import DataTable from "../../components/DataTable/DataTable"

export default function BuildTracker() {
    const [builds, setBuilds] = useState<null | Build[]>(null)
    const [copyBuilds, setCopyBuilds] = useState<null | Build[]>(null)
    const [buildsDB, setBuildsDB] = useState<null | Build[]>(null)
    const [openModal, setOpenModal] = useState<null | string>(null)
    const [build, setBuild] = useState<null | Build>(null)
    const [search, setSearch] = useState('')
    const [searchModules, setSearchModules] = useState('')
    const [moduleArray, setModuleArray] = useState<ModuleInfo[]>([])
    const [copyModuleArray, setCopyModuleArray] = useState<ModuleInfo[]>([])
    const [selectedModule, setSelectedModule] = useState(-1)
    const [artsChartData, setArtsChartData] = useState<dataObj>([])
    const [modulePresenceChartData, setModulePresenceChartData] = useState<dataObj>([])
    const { darkMode, setDarkMode } = useContext(AppContext)
    const buildSamples = generateBuildSamples()

    useEffect(() => {
        getBuilds()
        getBuildsDB()
    }, [])

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
            setModuleArray(copyModuleArray.filter(b => {
                b.date = ''
                return JSON.stringify(Object.values(b)).toLocaleLowerCase()
                    .includes(searchModules.toLocaleLowerCase().trim())
            }))
        } else setModuleArray(copyModuleArray)

        if (!searchModules) setArtsChartData(getArtsChartData())
    }, [searchModules, copyModuleArray])

    const getBuilds = async () => {
        try {
            let samples = sortBuildsByStatus(buildSamples)
            if (samples && Array.isArray(samples) && samples.length) {
                samples = samples.map(build => {
                    return {
                        ...build,
                        name: getBuildName(build),
                        id: getBuildId(build)
                    }
                })
                setBuilds(samples)
                setCopyBuilds(samples)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getBuildId = (build: Build) => {
        return `${build.classifier}__${build.target_branch}`
    }

    const getBuildName = (build: Build) => {
        if (buildsDB?.length) {
            const found = buildsDB.find(b => getBuildId(b) === getBuildId(build))
            return found?.name || ''
        }
        return build.name || ''
    }

    const getBuildsDB = () => {
        const db = JSON.parse(localStorage.getItem('buildsDB') || '[]')
        setBuildsDB(db)
    }

    const sortBuildsByStatus = (builds: Build[]) => {
        return sortArray(builds.map(b => ({ ...b, status: getBuildStatus(b) })), 'status')
    }

    const getModuleArray = (modules: dataObj) => {
        const seedModules = Array.from({ length: 10 }).map((_, i) => ({
            name: `module${i + 21}`,
            status: "success",
            date: "2025-03-16T00:00:00Z",
            art: "ARTCSAS",
            solution: "SEED",
            version: '0.1.2'
        }))

        return Object.keys(modules).map(key => {
            return {
                ...modules[key],
                name: key,
                org: null,
                art: modules[key].org.art,
                solution: modules[key].org.solution,
            }
        })
        // .concat(seedModules)
    }

    const onChangeSearch = (e: onChangeEventType) => {
        const { value } = e.target || {}
        setSearch(value)
    }

    const onChangeSearchModules = (e: onChangeEventType) => {
        const { value } = e.target || {}
        setSearchModules(value.trim())
    }

    const chartCalculator = (arrData: dataObj[], key: string, value: any) => {
        let sum = 0
        arrData.forEach(data => {
            if (value === 'failed' && data[key] && data[key] !== 'success') sum += 1
            else if (data[key] && data[key] === value) sum += 1
        })
        return sum
    }

    const getArtsChartData = () => {
        const labels = Array.from(new Set(copyModuleArray.map(data => data.art)))
        return {
            labels,
            datasets: [{
                data: labels.map(item => chartCalculator(copyModuleArray, 'art', item)),
                backgroundColor: randomColors(darkMode ? DARK_MODE_COLOR_PALETTE : COLOR_PALETTE).slice(0, copyModuleArray.length)
            }]
        }
    }

    const renderModuleDetails = () => {
        const module = moduleArray[selectedModule] || null
        if (!module) return null

        const {
            name,
            status,
            date,
            art,
            solution,
            version
        } = module

        return (
            <div className="buildtracker__module">
                <button onClick={() => setSelectedModule(-1)} className="buildtracker__module-back">Module list</button>
                <div className={`buildtracker__module-wrapper${darkMode ? '--dark' : ''}`}>
                    <p className={`buildtracker__module-title${darkMode ? '--dark' : ''}`}>{name}</p>
                    <div className="buildtracker__module-row">
                        <div className="buildtracker__module-body">
                            <TextData label="Status" value={status} inline color={status === 'success' ? 'green' : 'red'} />
                            <TextData label="Date" value={getDate(date)} inline />
                            <TextData label="ART" value={art} inline />
                            <TextData label="Solution" value={solution} inline />
                            <TextData label="Version" value={version} inline />
                        </div>
                        <DataTable
                            title="Presence in other builds"
                            tableData={builds || []}
                            tableHeaders={[{ name: 'Module', value: 'name' }]}
                            max={4}
                            style={{ width: '18rem', margin: '.5rem 1rem 1rem', maxHeight: '15rem', overflow: 'auto' }}
                            setSelected={i => {
                                const selected = (builds || [])[i < 0 ? 0 : i]
                                setBuild(selected)
                                setModuleArray(getModuleArray(selected.modules))
                                setCopyModuleArray(getModuleArray(selected.modules))
                                setSelectedModule(getModuleArray(selected.modules).findIndex(m => m.name === module.name))
                                setOpenModal(selected.id || null)
                            }}
                            selected={builds?.findIndex(b => b.id === openModal)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const closeModal = () => {
        setOpenModal(null)
        setSelectedModule(-1)
    }

    const renderBuildModal = () => {
        if (!build) return ''
        return (
            <Modal
                title={build.name}
                subtitle={getDate(build.date)}
                onClose={closeModal}
                style={{ maxHeight: '85vh', width: '42rem' }}
                contentStyle={{ overflow: 'hidden' }}>
                <div className="buildtracker__modal">
                    <div className="buildtracker__modal-row" style={{ alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <div className="buildtracker__modal-col">
                            <TextData label="Target branch" value={build.target_branch} style={{ marginBottom: '.7rem' }} />
                            <TextData label="Classifier" value={build.classifier} style={{ marginBottom: '.7rem' }} />
                            <TextData label="Module count" value={copyModuleArray.length} />
                        </div>
                        <DoughnutChart
                            label="ARTs involved"
                            chartData={artsChartData}
                            style={{ width: '7rem', textAlign: 'center' }}
                            chartOptions={{
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                borderColor: 'transparent',
                            }}
                        />
                    </div>

                    {selectedModule !== -1 ?
                        renderModuleDetails()
                        :
                        <>
                            <p className="buildtracker__modal-modules">Modules</p>
                            <div className="buildtracker__modal-row" style={{ margin: '1.5rem 0 0' }}>
                                <div className="buildtracker__modal-col" style={{ width: '45%' }}>
                                    <ProgressBar
                                        label="Score"
                                        arrData={copyModuleArray}
                                        colors={{ "success": "#00b500", "failed": "#e70000" }}
                                        objKey="status"
                                        percentageFor='success'
                                    />
                                    <div className="buildtracker__modal-table">
                                        <div className="buildtracker__modal-table-container">
                                            <div className="buildtracker__modal-table-row">
                                                <p className="buildtracker__modal-table-text">Built</p>
                                                <p className="buildtracker__modal-table-value" style={{ color: 'green' }}>
                                                    {copyModuleArray.filter(m => m.status === 'success').length}
                                                </p>
                                            </div>
                                            <div className="buildtracker__modal-table-row">
                                                <p className="buildtracker__modal-table-text">Not built</p>
                                                <p className="buildtracker__modal-table-value" style={{ color: 'red' }}>
                                                    {copyModuleArray.filter(m => m.status !== 'success').length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <SearchBar
                                    handleChange={onChangeSearchModules}
                                    value={searchModules}
                                    placeholder='Search modules...'
                                    style={{ width: '30%', alignSelf: 'flex-start' }}
                                />
                            </div>

                            <ModulesTable
                                title={`${searchModules ? 'Module search results' : 'Module list'} (${moduleArray.length})`}
                                tableData={moduleArray}
                                setTableData={setModuleArray}
                                tableHeaders={moduleHeaders}
                                orderDataBy={moduleHeaders[5]}
                                style={{ maxHeight: '40vh', marginTop: '2rem', overflow: 'auto' }}
                                selected={selectedModule}
                                setSelected={setSelectedModule}
                            />
                        </>
                    }
                </div>
            </Modal>
        )
    }

    return (
        <div className="buildtracker__container">
            <BuildTrackerHeader
                search={search}
                setSearch={setSearch}
                onChangeSearch={onChangeSearch}
            />
            {openModal && renderBuildModal()}
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