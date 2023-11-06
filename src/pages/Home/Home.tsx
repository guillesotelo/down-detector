import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'
import Modal from '../../components/Modal/Modal'
import { getAllSystems, getAllHistory, getHistoryBySystemId } from '../../services'
import { dataObj } from '../../types'

type Props = {}

export default function Home({ }: Props) {
  const [report, setReport] = useState('')
  const [allSystems, setAllSystems] = useState<any[]>([])
  const [allStatus, setAllStatus] = useState([])
  const [historyByIds, setHistoryByIds] = useState<dataObj>({})
  const { isLoggedIn, isSuper } = useContext(AppContext)

  console.log('historyByIds', historyByIds)

  useEffect(() => {
    getSystems()
    getAllStatus()
  }, [])

  const getSystems = async () => {
    try {
      const systems = await getAllSystems()
      if (systems && Array.isArray(systems)) {
        setHistoryByIds(await getSystemsHistory(systems))
        setAllSystems(systems)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllStatus = async () => {
    try {
      const history = await getAllHistory()
      if (history && history.length) {
        setAllStatus(history)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getSystemsHistory = async (systems: dataObj) => {
    const promises = systems.map(async (system: dataObj) => {
      return await getHistoryBySystemId(system._id)
    })

    return await Promise.all(promises)
  }

  const getSystemStatus = (system: dataObj) => {
    const history: any = allStatus.find((status: dataObj) => status.systemId === system._id) || null
    return history ? history.status || null : null
  }

  useEffect(() => {
    if (report) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [report])

  return (
    <div className="home__container">
      {report ?
        <Modal onClose={() => setReport('')}>
        </Modal>
        : ''}
      <div className="home__system-list" style={{ filter: report ? 'blur(10px)' : '' }}>
        {allSystems.map((system: dataObj, i: number) =>
          <SystemCard
            key={i}
            status={getSystemStatus(system)}
            system={system}
            reportIssue={setReport}
            history={historyByIds[i]}
          />)}
      </div>
    </div>
  )
}