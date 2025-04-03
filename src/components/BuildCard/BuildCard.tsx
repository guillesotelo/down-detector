import BuildOk from '../../assets/icons/build-ok.svg'
import BuildPending from '../../assets/icons/build-pending.svg'
import BuildFail from '../../assets/icons/build-fail.svg'
import BuildUnknown from '../../assets/icons/build-unknown.svg'
import { useContext, useEffect, useState } from 'react'
import { getDate } from '../../helpers'
import { dataObj } from '../../types'
import { AppContext } from '../../AppContext'

type Props = {
    build: dataObj
    setOpenModal: (value: string) => void
    delay?: string
}

export default function BuildCard(props: Props) {
    const [statusIcon, setStatusIcon] = useState(BuildUnknown)
    const { darkMode } = useContext(AppContext)

    const {
        build,
        setOpenModal,
        delay
    } = props

    const {
        id,
        title,
        classifier,
        date,
        target_branch,
        modules,
        tags,
    } = build

    useEffect(() => {
        setStatusIcon(getStatusIcon())
    }, [modules])

    const getStatusIcon = () => {
        const status = getBuildStatus()
        return !status ? BuildUnknown : status === 'success' ? BuildOk
            : status === 'pending' ? BuildPending : BuildFail
    }

    const getStatusLabel = () => {
        const status = getBuildStatus()
        return !status ? 'Unknown status' : status === 'success' ? 'Successfully built'
            : status === 'pending' ? 'Build in progress' : 'Build failed'
    }

    const getBuildStatus = () => {
        const moduleStats = new Map()
        Object.keys(build.modules).forEach(key => {
            if (build.modules[key].status === 'success') moduleStats.set('success', (moduleStats.get('success') || 0) + 1)
            if (build.modules[key].status === 'pending') moduleStats.set('pending', (moduleStats.get('pending') || 0) + 1)
            if (build.modules[key].status === 'failure') moduleStats.set('failure', (moduleStats.get('failure') || 0) + 1)
        })

        const status = moduleStats.entries() ? Object.keys(build.modules).length === moduleStats.get('success') ? 'success'
            : moduleStats.get('failure') > 0 ? 'failure' : moduleStats.get('pending') > 0 ? 'pending' : 'unknown' : 'unknown'

        return status
    }

    const getStatusBG = () => {
        const status = getBuildStatus()
        return status === 'failure' ? "#ff000014"
            : status === 'pending' ? "#ffa5001a"
                : status === 'success' ? "#00800017"
                    : "#80808026"
    }

    return (
        <div
            className={`buildcard__container${darkMode ? '--dark' : ''}`}
            onClick={() => setOpenModal(id)}
            style={{
                backgroundImage: `linear-gradient(to right bottom, ${darkMode ? 'black' : 'white'}, ${getStatusBG()})`,
                animationDelay: `${delay || '0'}`
            }}>
            <div className="buildcard__wrapper">
                <div className="buildcard__header">
                    <div className="buildcard__header-row">
                        <p className="buildcard__header-title">{title}</p>
                        <img src={statusIcon} alt="Icon Status" className="buildcard__header-icon" />
                    </div>
                    <div className="buildcard__header-row">
                        <p className="buildcard__header-branch">{target_branch}</p>
                        <p className="buildcard__header-classifier">{classifier}</p>
                    </div>
                </div>
                <p className={`buildcard__status-${getBuildStatus() || 'unknown'}`}>{getStatusLabel()}</p>
                {/* <div className="buildcard__tags">
                    {tags?.map((tag: dataObj, i: number) => <p key={i} className={`buildcard__tag-${tag.color || 'default'}`}>{tag.value}</p>)}
                </div> */}
                <div className="buildcard__footer">
                    <p className="buildcard__footer-date">{getDate(date)}</p>
                </div>
            </div>
        </div>
    )
}