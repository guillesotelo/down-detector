import React, { useCallback, useContext, useEffect, useMemo, useState, useTransition } from 'react'
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
  const [totalHours, setTotalHours] = useState<number>(0)
  const [reportedStatus, setReportedStatus] = useState({ name: 'Unable to access' })
  const [modalChartOptions, setModalChartOptions] = useState({})
  const [lastCheck, setLastCheck] = useState(new Date())
  const { darkMode, setHeaderLoading } = useContext(AppContext)
  const [pending, startTransition] = useTransition()

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
      getSystems()
      getAllStatus()
      getAllUserAlerts()
      getAllDownTimes()
      setLastCheck(new Date())
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
      if (allStatus.length) {
        getTotalRegisteredHours()
        getStatusAndAlerts()
      }
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

  const getTotalRegisteredHours = () => {
    const systemStatus = allStatus.filter((status: eventType) => status.systemId === selected)
    const firstStatus: eventType = systemStatus.length ? systemStatus[systemStatus.length - 1] : {}
    const firstCheck = firstStatus ? firstStatus.createdAt : null
    const timeSinceFirstCheck = Math.floor((new Date().getTime() - new Date(firstCheck || new Date()).getTime()) / 3600000)
    setTotalHours(timeSinceFirstCheck)
  }

  const getAllDownTimes = async () => {
    try {
      setLoading(true)
      let events = await getAllEvents()
      if (events && Array.isArray(events)) {
        setAllEvents(events)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const getSystems = async () => {
    try {
      setLoading(true)
      let systems = await getAllSystems()
      if (systems && Array.isArray(systems)) {
        setAllSystems(systems)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const getAllStatus = async () => {
    try {
      setLoading(true)
      let history = await getAllHistory()
      if (history && Array.isArray(history)) {
        setAllStatus(history)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const getAllUserAlerts = async () => {
    try {
      setLoading(true)
      let alerts = await getAllAlerts()
      if (alerts && Array.isArray(alerts)) {
        setAllAlerts(alerts)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const getCurrentStatus = (system: systemType) => {
    const history: historyType | null = allStatus.find((status: eventType) => status.systemId === system._id) || null
    return history ? history.status : false
  }

  const getLastCheckMinutes = (system: systemType) => {
    const history: historyType | null = allStatus.find((status: eventType) => status.systemId === system._id) || null
    if (!allStatus || !allStatus.length || history?.status) return 0
    const now = new Date().getTime()
    const historyDate = new Date(history?.createdAt || '').getTime()
    return ((now - historyDate) / 60000).toFixed(0)
  }

  const getSystemData = (id: string, type: string) => {
    if (allSystems.length) {
      const found = allSystems.find(system => system._id === id)
      return found ? String(found[type as keyof systemType]) || null : null
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
      }
      setLoading(false)
    } catch (error) {
      toast.success('Error sending report. Try again.')
      setLoading(false)
    }
  }

  const getAlertsBySystem = (system: systemType) => {
    return allAlerts.filter((alert: alertType) => alert.systemId === system._id)
  }

  const getHistoryBySystem = (system: systemType) => {
    return allStatus.filter((alert: alertType) => alert.systemId === system._id)
  }

  const updateData = (key: string, e: onChangeEventType) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const parseUrl = (url: string) => {
    return url.replace(/^((?:[^]*){3}).*$/, '$1')
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
            value={getSystemData(report, 'name')}
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
        title={getSystemData(selected, 'name')}
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
            style={{ width: '50vw' }}
          />
        </div>
        <div className="home__modal-footer">
          <h2
            className="systemcard__status"
            style={{ color: getCurrentStatus(getSelectedSystem()) ? darkMode ? '#00b000' : 'green' : 'red' }}>
            ● &nbsp;Current status: <strong>{getCurrentStatus(getSelectedSystem()) ? 'UP' : 'DOWN'}</strong>
          </h2>
          {getLastCheckMinutes(getSelectedSystem()) ?
            <p
              style={{ color: darkMode ? 'lightgray' : 'gray' }}
              className="systemcard__status-caption">
              For {getLastCheckMinutes(getSelectedSystem())} min
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
          key={i}
          index={i}
          status={getCurrentStatus(system)}
          system={system}
          reportIssue={setReport}
          history={getHistoryBySystem(system)}
          alerts={getAlertsBySystem(system)}
          setSelected={setSelected}
          setSelectedData={setChartData}
          setModalChartOptions={setModalChartOptions}
          downtime={getDownTime(system)}
          lastCheck={getLastCheckMinutes(system)}
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