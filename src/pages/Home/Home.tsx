import { useCallback, useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'
import Modal from '../../components/Modal/Modal'
import { getAllSystems, getAllHistory, createUserAlert, getAllAlerts, getAllEvents } from '../../services'
import { dataObj } from '../../types'
import { Line } from 'react-chartjs-2'
import { registerables, Chart } from 'chart.js';
import DataTable from '../../components/DataTable/DataTable'
import { hisrotyHeaders } from '../../constants/tableHeaders'
import InputField from '../../components/InputField/InputField'
import Dropdown from '../../components/Dropdown/Dropdown'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
import { MoonLoader } from 'react-spinners'
import { APP_COLORS } from '../../constants/app'
Chart.register(...registerables);

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [selected, setSelected] = useState('')
  const [allSystems, setAllSystems] = useState<dataObj[]>([])
  const [allEvents, setAllEvents] = useState<dataObj[]>([])
  const [statusAndAlerts, setStatusAndAlerts] = useState<dataObj[]>([])
  const [allStatus, setAllStatus] = useState<dataObj[]>([])
  const [allAlerts, setAllAlerts] = useState<dataObj[]>([])
  const [data, setData] = useState<dataObj>({})
  const [chartData, setChartData] = useState<any>({})
  const [totalHours, setTotalHours] = useState<number>(0)
  const [reportedStatus, setReportedStatus] = useState<dataObj>({ name: 'Unable to access' })
  const [modalChartOptions, setModalChartOptions] = useState<dataObj>({})
  const [lastCheck, setLastCheck] = useState(new Date())
  const { darkMode } = useContext(AppContext)

  const chartHeight = '30vh'
  const chartWidth = '80vw'

  const issueOptions = [
    { name: 'Unable to access' },
    { name: `Can access but doesn't work` },
    { name: 'Low response time' },
    { name: 'Other (describe)' },
  ]

  const loadData = useCallback((reset?: boolean) => {
    setData({})
    if (reset) {
      setSelected('')
      setReport('')
    }
    getSystems()
    getAllStatus()
    getAllUserAlerts()
    getAllDownTimes()
    setLastCheck(new Date())
  }, [])

  useEffect(() => {
    loadData()
    const intervalId = setInterval(loadData, 1 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [loadData])

  useEffect(() => {
    getTotalRegisteredHours()
  }, [allStatus, selected])

  useEffect(() => {
    if (selected) getStatusAndAlerts()
  }, [selected])

  useEffect(() => {
    if (report) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [report])

  const getStatusAndAlerts = () => {
    const statusAndAlertsByID = allStatus.filter((status: dataObj) => status.systemId === selected)
      .concat(allAlerts.filter((alert: dataObj) => alert.systemId === selected))
      .sort((a: dataObj, b: dataObj) => {
        if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) return -1
        return 1
      })
    setStatusAndAlerts(statusAndAlertsByID)
  }

  const getTotalRegisteredHours = () => {
    const systemStatus = allStatus.filter((status: dataObj) => status.systemId === selected)
    const firstStatus: dataObj = systemStatus.length ? systemStatus[systemStatus.length - 1] : {}
    const firstCheck = firstStatus ? firstStatus.createdAt : null
    const timeSinceFirstCheck = Math.floor((new Date().getTime() - new Date(firstCheck).getTime()) / 3600000)
    setTotalHours(timeSinceFirstCheck)
  }

  const getAllDownTimes = async () => {
    try {
      setLoading(true)
      let events = []
      const { saved, data } = JSON.parse(localStorage.getItem('localEvents') || '{}') || {}
      if (saved && new Date().getTime() - new Date(saved).getTime() < 59000) {
        events = data
      }
      else {
        events = await getAllEvents()
        localStorage.setItem('localEvents', JSON.stringify({ data: events, saved: new Date() }))
      }
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
      let systems = []
      const { saved, data } = JSON.parse(localStorage.getItem('localSystems') || '{}') || {}
      if (data && saved && new Date().getTime() - new Date(saved).getTime() < 59000) {
        systems = data
      }
      else {
        systems = await getAllSystems()
        localStorage.setItem('localSystems', JSON.stringify({ data: systems, saved: new Date() }))
      }
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
      let history = []
      const { saved, data } = JSON.parse(localStorage.getItem('localHistory') || '{}') || {}
      if (data && saved && new Date().getTime() - new Date(saved).getTime() < 59000) {
        history = data
      }
      else {
        history = await getAllHistory()
        localStorage.setItem('localHistory', JSON.stringify({ data: history, saved: new Date() }))
      }
      if (history && history.length) {
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
      let alerts = []
      const { saved, data } = JSON.parse(localStorage.getItem('localAlerts') || '{}') || {}
      if (data && saved && new Date().getTime() - new Date(saved).getTime() < 59000) {
        alerts = data
      }
      else {
        alerts = await getAllAlerts()
        localStorage.setItem('localAlerts', JSON.stringify({ data: alerts, saved: new Date() }))
      }
      if (alerts && alerts.length) {
        setAllAlerts(alerts)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const getCurrentStatus = (system: dataObj) => {
    const history: any = allStatus.find((status: dataObj) => status.systemId === system._id) || null
    return history ? history.status : null
  }

  const getSystemData = (id: string, type: string) => {
    if (allSystems.length) {
      const found = allSystems.find(system => system._id === id)
      return found ? found[type] || null : null
    }
    return null
  }

  const getDate = (date: Date | undefined) => {
    return date ? new Date(date).toLocaleString('es',
      { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
      : 'No data'
  }

  const sendReport = async () => {
    try {
      setLoading(true)
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
      const reportData = {
        ...data,
        type: reportedStatus.name,
        systemId: report,
        url: getSystemData(report, 'url'),
        description: reportedStatus.name + ': ' + data.description || getSystemData(report, 'description') || '',
        createdBy: user.username || 'anonymous'
      }

      const sent = await createUserAlert(reportData)
      if (sent && sent._id) {
        toast.success('Report sent successfully')
        localStorage.removeItem('localSystems')
        localStorage.removeItem('localHistory')
        localStorage.removeItem('localAlerts')
        loadData(true)
      }
      setLoading(false)
    } catch (error) {
      toast.success('Error sending report. Try again.')
      setLoading(false)
    }
  }

  const getAlertsBySystem = (system: dataObj) => {
    return allAlerts.filter((alert: dataObj) => alert.systemId === system._id)
  }

  const getHistoryBySystem = (system: dataObj) => {
    return allStatus.filter((alert: dataObj) => alert.systemId === system._id)
  }

  const updateData = (key: string, e: { [key: string | number]: any }) => {
    const value = e.target.value
    setData({ ...data, [key]: value })
  }

  const parseUrl = (url: string) => {
    return url.replace(/^((?:[^]*){3}).*$/, '$1')
  }

  const isComingEvent = (event: dataObj) => {
    const now = new Date().getTime()
    const eventEnd = new Date(event.end).getTime()
    if (eventEnd - now > 0) return true
    return false
  }

  const getComingEvent = (events: dataObj[]) => {
    let lastEvent: dataObj = events[0]
    events.forEach(event => {
      const lastEventStart = new Date(lastEvent.start).getTime()
      const currentEventStart = new Date(event.start).getTime()
      if (isComingEvent(event) && currentEventStart < lastEventStart) lastEvent = event
    })
    return isComingEvent(lastEvent) ? lastEvent : {}
  }

  const getDownTime = (system: dataObj) => {
    const events = allEvents.filter((event: dataObj) => event.systemId === system._id)
    return events.length ? getComingEvent(events) : {}
  }

  const getSelectedSystem = () => {
    return allSystems.find(system => system._id === selected) || {}
  }

  const getDowntimeString = () => {
    const system = getSelectedSystem()
    const event = getDownTime(system || {})
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
    const downtime = getDownTime(system || {})
    if (downtime && downtime.start) {
      const now = new Date().getTime()
      const start = new Date(downtime.start).getTime()
      const end = new Date(downtime.end).getTime()
      if (now - start > 0 && now - end < 0) return true
    }
    return false
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
            disabled={true}
          />
          <InputField
            label='URL'
            name='url'
            value={getSystemData(report, 'url')}
            disabled={true}
          />
          <InputField
            label='Status'
            name='status'
            value='DOWN'
            disabled={true}
          />
          <Dropdown
            label='Issue type'
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
          />
        </div>
        <div className="home__modal-issue-btns">
          <Button
            label='Cancel'
            handleClick={() => setReport('')}
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
        subtitle={parseUrl(getSystemData(selected, 'url'))}
        onClose={() => setSelected('')}>
        {getDowntimeString() ?
          <div
            className={`home__modal-downtime${darkMode ? '--dark' : ''}`}
            style={{
              backgroundColor: isLiveDowntime() ? darkMode ?
                APP_COLORS.RED_TWO : '#ff6161' : darkMode ?
                'transparent' : '#fcd9a5',
              border: darkMode ? '1px solid orange' : '1px solid gray'
            }}>
            <p className='home__modal-downtime-text'>Planned downtime:</p>
            <p className='home__modal-downtime-text'>{getDowntimeString()}</p>
          </div>
          : ''}
        <p className="home__modal-hours">Total registered: {totalHours} hours</p>
        <div className="home__modal-graph-wrapper">
          <div className='home__modal-graph'>
            <Line data={chartData} height={chartHeight} width={chartWidth} options={modalChartOptions} />
          </div>
        </div>
        <div className="home__modal-table">
          <DataTable
            title='Latest system logs'
            tableData={statusAndAlerts}
            tableHeaders={hisrotyHeaders}
            name='history'
            loading={loading}
            max={getDowntimeString() ? 2 : 3}
            style={{ width: '50vw' }}
          />
        </div>
        <div className="home__modal-footer">
          <h2
            className="systemcard__status"
            style={{ color: getCurrentStatus(getSelectedSystem()) ? 'green' : 'red' }}>
            ● &nbsp;Current status: <strong>{getCurrentStatus(getSelectedSystem()) ? 'UP' : 'DOWN'}</strong>
          </h2>
          <Button
            label='Report Issue'
            handleClick={() => setReport(selected)}
            bgColor={darkMode ? APP_COLORS.GRAY_ONE : APP_COLORS.GRAY_THREE}
            textColor={darkMode ? 'white' : 'black'}
          />
        </div>
      </Modal>
    )
  }


  return (
    <div className={`home__container${darkMode ? '--dark' : ''}`}>
      {report ? renderReportModal() : ''}
      {!report && selected ? renderSystemDetailsModal() : ''}
      <div
        className="home__system-list"
        style={{ filter: report || selected ? 'blur(10px)' : '' }}
      >
        {allSystems.length && !loading ?
          allSystems.map((system: dataObj, i: number) =>
            <SystemCard
              key={i}
              status={getCurrentStatus(system)}
              system={system}
              reportIssue={setReport}
              history={getHistoryBySystem(system)}
              alerts={getAlertsBySystem(system)}
              setSelected={setSelected}
              setSelectedData={setChartData}
              setModalChartOptions={setModalChartOptions}
              downtime={getDownTime(system)}
              lastCheck={lastCheck}
              delay={String(i ? i / 10 : 0) + 's'}
            />)
          : loading ?
            <div className='home__loading'>
              <MoonLoader color='#0057ad' size={50} />
              <p>Loading systems...</p>
            </div>
            :
            <p className="home__system-void">No systems found</p>
        }
      </div>
    </div>
  )
}