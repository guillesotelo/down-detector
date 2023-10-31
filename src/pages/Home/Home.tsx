import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'
import Modal from '../../components/Modal/Modal'

type Props = {}

export default function Home({ }: Props) {
  const [report, setReport] = useState('')
  const { isLoggedIn, isSuper } = useContext(AppContext)

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
        <SystemCard
          reportIssue={setReport}
        />
        <SystemCard
          reportIssue={setReport}
        />
        <SystemCard
          reportIssue={setReport}
        />
        <SystemCard
          reportIssue={setReport}
        />
        <SystemCard
          reportIssue={setReport}
        />
        <SystemCard
          reportIssue={setReport}
        />
        <SystemCard
          reportIssue={setReport}
        />
      </div>
    </div>
  )
}