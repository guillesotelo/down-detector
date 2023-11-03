import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'
import Modal from '../../components/Modal/Modal'
import { getAllSystems, getAllHistory } from '../../services'
import { dataObj } from '../../types'

type Props = {}

export default function Home({ }: Props) {
  const [report, setReport] = useState('')
  const [allSystems, setAllSystems] = useState<any[]>([])
  const [allStatus, setAllStatus] = useState([])
  const { isLoggedIn, isSuper } = useContext(AppContext)

  useEffect(() => {
    getSystems()
    getAllStatus()
  }, [])

  const getSystems = async () => {
    try {
      const systems = await getAllSystems()
      if (systems && Array.isArray(systems)) {
        setAllSystems(systems)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllStatus = async () => {
    try {
      const status = await getAllHistory()
      if (status && status.length) {
        setAllStatus(status)
      }
    } catch (error) {
      console.error(error)
    }
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
          />)}
      </div>
    </div>
  )
}