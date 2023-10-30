import React, { useContext, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'

type Props = {}

export default function Home({ }: Props) {
  const [report, setReport] = useState('')
  const { isLoggedIn, isSuper } = useContext(AppContext)

  return (
    <div className="home__container">
      <div className="home__system-list">
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