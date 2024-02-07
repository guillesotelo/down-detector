import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'
import Modal from '../../components/Modal/Modal'
import { getAllSystems, getAllHistory, createUserAlert, getAllAlerts, getAllEvents } from '../../services'
import { alertType, dataObj, downtimeModalType, eventType, historyType, onChangeEventType, systemType } from '../../types'
import { Line } from 'react-chartjs-2'
import { registerables, Chart } from 'chart.js';
import DataTable from '../../components/DataTable/DataTable'
import { hisrotyHeaders, systemHisrotyHeaders } from '../../constants/tableHeaders'
import InputField from '../../components/InputField/InputField'
import Dropdown from '../../components/Dropdown/Dropdown'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import { MoonLoader } from 'react-spinners'
import { APP_COLORS } from '../../constants/app'
import { getUser, sortArray, toHex } from '../../helpers'
Chart.register(...registerables);

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [selected, setSelected] = useState('')
  const [showDowntime, setShowDowntime] = useState<downtimeModalType>(null)
  const [allSystems, setAllSystems] = useState<systemType[]>([])
  const [allEvents, setAllEvents] = useState<eventType[]>([])
  const [statusAndAlerts, setStatusAndAlerts] = useState<alertType & historyType[]>([])
  const [allStatus, setAllStatus] = useState<historyType[]>([])
  const [allAlerts, setAllAlerts] = useState<alertType[]>([])
  const [data, setData] = useState<alertType>({})
  const [chartData, setChartData] = useState<any>({ datasets: [{}], labels: [''] })
  const [reportedStatus, setReportedStatus] = useState({ name: 'Unable to access' })
  const [modalChartOptions, setModalChartOptions] = useState({})
  const { darkMode, setHeaderLoading, isMobile } = useContext(AppContext)

  const chartHeight = '30vh'
  const chartWidth = '80vw'

  const issueOptions = [
    { name: 'Unable to access' },
    { name: `Not responding` },
    { name: 'Low response time' },
    { name: 'Unstable' },
  ]

  const loadData = useMemo(() => {
    return () => {
      setLoading(true)
      getSystems()
      getAllStatus()
      getAllUserAlerts()
      getAllDownTimes()
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setHeaderLoading(true)
    loadData()
    const intervalId = setInterval(() => loadData(), 1 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [loadData])

  useEffect(() => {
    if (selected || report) {
      document.body.style.overflow = 'hidden'
      if (allStatus.length) getStatusAndAlerts()
    } else document.body.style.overflow = 'auto'
  }, [selected, report])

  const getStatusAndAlerts = () => {
    const statusAndAlertsByID = allStatus.filter((status: eventType) => status.systemId === selected)
      .concat(allAlerts.filter((alert: alertType) => alert.systemId === selected))
      .sort((a: eventType & alertType, b: eventType & alertType) => {
        if (new Date(a.createdAt || new Date()).getTime() > new Date(b.createdAt || new Date()).getTime()) return -1
        return 1
      })
    setStatusAndAlerts(statusAndAlertsByID)
  }

  const getAllDownTimes = async () => {
    try {
      let events = await getAllEvents()
      if (events && Array.isArray(events)) {
        setAllEvents(events)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getSystems = async () => {
    try {
      let systems = await getAllSystems()
      if (systems && Array.isArray(systems)) {
        setAllSystems(sortArray(systems, 'order'))
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllStatus = async () => {
    try {
      let history = await getAllHistory()
      if (history && Array.isArray(history)) {
        setAllStatus(history)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllUserAlerts = async () => {
    try {
      let alerts = await getAllAlerts()
      if (alerts && Array.isArray(alerts)) {
        setAllAlerts(alerts)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getCurrentStatus = (system: systemType) => {
    const history: historyType | null = allStatus.find((status: eventType) => status.systemId === system._id) || null
    return history ? history.status : null
  }

  const getLastCheck = (system: systemType) => {
    const history: historyType | null = allStatus.find((status: eventType) => status.systemId === system._id) || null
    if (!allStatus || !allStatus.length || history?.status) return 0
    const now = new Date().getTime()
    const historyDate = new Date(history?.createdAt || new Date()).getTime()
    const minutesPassed = (now - historyDate) / 60000
    let timePassed
    if (minutesPassed >= 60) {
      if (minutesPassed >= 1440) {
        const days = (minutesPassed / 60 / 24).toFixed(0)
        timePassed = `${days} day${Number(days) > 1 ? 's' : ''}`
      }
      else {
        const hours = (minutesPassed / 60).toFixed(0)
        timePassed = `${hours} hour${Number(hours) > 1 ? 's' : ''}`
      }
    } else timePassed = `${minutesPassed.toFixed(0)} min${Number(minutesPassed.toFixed(0)) > 1 ? 's' : ''}`
    return `For ${timePassed}`
  }

  const getSystemData = (id: string, type: string) => {
    if (allSystems.length) {
      const found = allSystems.find(system => system._id === id)
      return found ? found[type as keyof systemType] || null : null
    }
    return null
  }

  const getDate = (date: Date | undefined) => {
    return date ? new Date(date).toLocaleString('sv-SE',
      { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
      : 'No data'
  }

  const sendReport = async () => {
    try {
      setLoading(true)
      const user = getUser()
      let nav: dataObj = {}
      for (let i in navigator) nav[i] = (navigator as any)[i]
      let geoLocation = ''
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => geoLocation = JSON.stringify(pos),
          (err) => geoLocation = err.message
        )
      }

      const reportData = {
        ...data,
        geoLocation,
        navigator: JSON.stringify(nav),
        type: reportedStatus.name,
        systemId: report,
        url: getSystemData(report, 'url'),
        description: `${reportedStatus.name}${data.description ? ': ' + data.description : ''}`,
        createdBy: user.username || `${report} - ${toHex(JSON.stringify(nav))}`
      }

      const sent = await createUserAlert(reportData)
      if (sent && sent._id) {
        toast.success('Report sent successfully')
        setSelected('')
        setReport('')
        setData({})
        loadData()
      } else toast.success('Error sending report. Try again later.')
      setLoading(false)
    } catch (error) {
      toast.success('Error sending report. Try again later.')
      setLoading(false)
    }
  }

  const getAlertsBySystem = (system: systemType) => {
    return allAlerts.filter((alert: alertType) => alert.systemId === system._id)
  }

  const getHistoryBySystem = (system: systemType) => {
    return allStatus.filter((history: alertType) => history.systemId === system._id)
  }

  const updateData = (key: string, e: onChangeEventType) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const isComingEvent = (event: eventType) => {
    if (event && event.end) {
      const now = new Date().getTime()
      const eventEnd = new Date(event.end || new Date()).getTime()
      if (eventEnd - now > 0) return true
    }
    return false
  }

  const getComingEvent = (events: eventType[]) => {
    let lastEvent: eventType = events[0]
    events.forEach(event => {
      const lastEventStart = new Date(lastEvent.start || new Date()).getTime()
      const currentEventStart = new Date(event.start || new Date()).getTime()
      if (isComingEvent(event) && currentEventStart < lastEventStart) lastEvent = event
    })
    return lastEvent
  }

  const getDownTime = (system: systemType) => {
    return sortArray(
      allEvents.filter((event: eventType) => {
        if (event.systemId === system._id &&
          new Date(event.end || '').getTime() > new Date().getTime()) return event
      }),
      'start'
    )
  }

  const getSelectedSystem = () => {
    return allSystems.find(system => system._id === selected) || {}
  }

  const getDowntimeString = () => {
    const system = getSelectedSystem()
    const event = getComingEvent(getDownTime(system || {}))
    if (event && event.start && event.end) {
      return (<span>
        <span className={`systemcard__event-time${darkMode ? '--dark' : ''}`}>{getDate(event.start)}</span>
        <span style={{ fontWeight: 'normal' }}> ➜ </span>
        <span className={`systemcard__event-time${darkMode ? '--dark' : ''}`}>{getDate(event.end)}</span>
        <p className="systemcard__event-note">{event.note}</p>
      </span>
      )
    }
    else return ''
  }

  const isLiveDowntime = () => {
    const system = getSelectedSystem()
    const downtime = getComingEvent(getDownTime(system || {}))
    if (downtime && downtime.start) {
      const now = new Date().getTime()
      const start = new Date(downtime.start || new Date()).getTime()
      const end = new Date(downtime.end || new Date()).getTime()
      if (now - start > 0 && now - end < 0) return true
    }
    return false
  }

  const discardReport = () => {
    setReport('')
    setData({})
    setReportedStatus({ name: 'Unable to access' })
  }

  const getDowntimeDate = (date: Date | string) => {
    return `${new Date(date).toDateString()}, ${new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}`
  }

  const renderReportModal = () => {
    return (
      <Modal
        title='Report Issue'
        onClose={() => setReport('')}>
        <div className="home__modal-issue-col">
          <InputField
            label='Name'
            name='name'
            value={String(getSystemData(report, 'name'))}
            disabled
          />
          <Dropdown
            label='Type of issue'
            options={issueOptions}
            value={reportedStatus.name}
            selected={reportedStatus}
            setSelected={setReportedStatus}
            maxHeight='20vh'
            objKey='name'
          />
          <InputField
            label='Details'
            name='description'
            value={data.description}
            updateData={updateData}
            type='textarea'
            placeholder='Describe what happened...'
            rows={5}
          />
        </div>
        <div className="home__modal-issue-btns">
          <Button
            label='Cancel'
            handleClick={discardReport}
            bgColor={darkMode ? APP_COLORS.GRAY_ONE : APP_COLORS.GRAY_ONE}
            textColor='white'
            disabled={loading}
            style={{ width: '45%' }}
          />
          <Button
            label='Send Report'
            handleClick={sendReport}
            disabled={loading}
            bgColor={APP_COLORS.BLUE_TWO}
            textColor='white'
            style={{ width: '45%' }}
          />
        </div>
      </Modal>
    )
  }

  const renderSystemDetailsModal = () => {
    return (
      <Modal
        title={String(getSystemData(selected, 'name'))}
        // subtitle={parseUrl(String(getSystemData(selected, 'url')))}
        onClose={() => setSelected('')}>
        {getDowntimeString() ?
          <div
            className={`home__modal-downtime${darkMode ? '--dark' : ''}`}
            style={{
              backgroundColor: isLiveDowntime() ? darkMode ?
                'transparent' : '#ffdada' : darkMode ?
                'transparent' : '#fcd9a5',
              border: isLiveDowntime() ? '1px solid red' : '1px solid orange'
            }}>
            <p className='home__modal-downtime-text'>Planned downtime:</p>
            <p className='home__modal-downtime-text'>{getDowntimeString()}</p>
          </div>
          : ''}
        <div className="home__modal-downtime-row">
          <p className="home__modal-hours">Last two weeks</p>
        </div>
        <div className="home__modal-graph-wrapper">
          <div className='home__modal-graph'>
            <Line data={chartData} height={chartHeight} width={chartWidth} options={modalChartOptions} />
          </div>
        </div>
        <div className="home__modal-table">
          <DataTable
            title='Latest system logs'
            tableData={statusAndAlerts}
            setTableData={setStatusAndAlerts}
            tableHeaders={systemHisrotyHeaders}
            name='history'
            loading={loading}
            max={getDowntimeString() ? 2 : 3}
            orderDataBy={hisrotyHeaders[0]}
            style={{ width: isMobile ? '80vw' : '50vw' }}
          />
        </div>
        <div className="home__modal-footer">
          <h2
            className="systemcard__status"
            style={{ color: getSystemData(selected, 'reportedlyDown') ? 'orange' : getCurrentStatus(getSelectedSystem()) ? darkMode ? '#00b000' : 'green' : 'red' }}>
            ● &nbsp;Current status: <strong>{getSystemData(selected, 'reportedlyDown') ? 'Problem' : getCurrentStatus(getSelectedSystem()) ? 'UP' : 'DOWN'}</strong>
          </h2>
          {getLastCheck(getSelectedSystem()) ?
            <p
              style={{ color: darkMode ? 'lightgray' : 'gray' }}
              className="systemcard__status-caption">
              {getLastCheck(getSelectedSystem())}
            </p>
            :
            <Button
              label='Report Issue'
              handleClick={() => setReport(selected)}
              bgColor={darkMode ? APP_COLORS.GRAY_ONE : APP_COLORS.GRAY_THREE}
              textColor={darkMode ? 'white' : 'black'}
            />}
        </div>
      </Modal>
    )
  }

  const renderDowntimeModal = () => {
    if (showDowntime) {
      const { system, start, end, note, index } = showDowntime
      return (
        <Modal
          title='Planned Downtime'
          subtitle={system?.name}
          onClose={() => setShowDowntime(null)}>
          <div className="home__modal-col">
            <p className="home__modal-downtime-note">
              The system will probably be down between <strong>{getDowntimeDate(start || '')}</strong> and <strong>{getDowntimeDate(end || '')}</strong>.
            </p>
            {note ? <p className="home__modal-downtime-note">The reason: <br />{note}</p> : ''}
          </div>
          <Button
            label='System Details'
            handleClick={() => {
              setShowDowntime(null)
              const systemCard = Array.from(document.querySelectorAll('.systemcard__graph'))[index || 0] as HTMLElement
              systemCard.click()
            }}
            textColor='white'
          />
        </Modal>
      )
    }
  }

  const renderSystemList = () => {
    return allSystems.length ?
      allSystems.map((system: systemType, i: number) =>
        <SystemCard
          key={system._id || i}
          index={i}
          system={system}
          reportIssue={setReport}
          history={getHistoryBySystem(system)}
          alerts={getAlertsBySystem(system)}
          setSelected={setSelected}
          setSelectedData={setChartData}
          setModalChartOptions={setModalChartOptions}
          downtime={getDownTime(system)}
          lastCheck={getLastCheck(system)}
          delay={String(i ? i / 10 : 0) + 's'}
          setShowDowntime={setShowDowntime}
        />)
      : loading ?
        <div className='home__loading'>
          <MoonLoader color='#0057ad' size={50} />
          <p>Loading systems...</p>
        </div>
        :
        <p className="home__system-void">No systems found</p>
  }

  return (
    <div className={`home__container${darkMode ? '--dark' : ''}`}>
      {showDowntime ? renderDowntimeModal()
        : report ? renderReportModal()
          : selected ? renderSystemDetailsModal() : ''}
      <div
        className="home__system-list"
        style={{
          filter: showDowntime || report || selected ? 'blur(6px)' : ''
        }}
      >
        {renderSystemList()}
      </div>
    </div>
  )
}

export default React.memo(Home)