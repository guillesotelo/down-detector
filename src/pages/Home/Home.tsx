import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'
import Modal from '../../components/Modal/Modal'
import { getAllSystems, getAllHistory, createUserAlert, getAllAlerts } from '../../services'
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
Chart.register(...registerables);

type Props = {}

export default function Home({ }: Props) {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [selected, setSelected] = useState('')
  const [allSystems, setAllSystems] = useState<any[]>([])
  const [statusAndAlerts, setStatusAndAlerts] = useState<any[]>([])
  const [allStatus, setAllStatus] = useState([])
  const [allAlerts, setAllAlerts] = useState([])
  const [data, setData] = useState<dataObj>({})
  const [chartData, setChartData] = useState<any>({})
  const [totalHours, setTotalHours] = useState<number>(0)
  const [reportedStatus, setReportedStatus] = useState<dataObj>({ name: 'Unable to access' })
  const [modalChartOptions, setModalChartOptions] = useState<dataObj>({})
  const { darkMode } = useContext(AppContext)

  const chartHeight = '30vh'
  const chartWidth = '80vw'
  const timeOptions: any = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
  const issueOptions = [
    { name: 'Unable to access' },
    { name: `Can access but doesn't work` },
    { name: 'Low response time' },
    { name: 'Other (describe)' },
  ]

  useEffect(() => {
    loadData()
  }, [])

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
    setStatusAndAlerts(statusAndAlertsByID)
  }

  const loadData = () => {
    setData({})
    setSelected('')
    setReport('')
    getSystems()
    getAllStatus()
    getAllUserAlerts()
  }

  const getTotalRegisteredHours = () => {
    const systemStatus = allStatus.filter((status: dataObj) => status.systemId === selected)
    const firstStatus: dataObj = systemStatus.length ? systemStatus[systemStatus.length - 1] : {}
    const firstCheck = firstStatus ? firstStatus.createdAt : null
    const timeSinceFirstCheck = Math.floor((new Date().getTime() - new Date(firstCheck).getTime()) / 3600000)
    setTotalHours(timeSinceFirstCheck)
  }

  const getSystems = async () => {
    try {
      setLoading(true)
      let systems = []
      const { saved, data } = JSON.parse(localStorage.getItem('localSystems') || '{}') || {}
      if (saved && new Date().getTime() - new Date(saved).getTime() < 600000) {
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
      if (saved && new Date().getTime() - new Date(saved).getTime() < 600000) {
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
      if (saved && new Date().getTime() - new Date(saved).getTime() < 600000) {
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
    return date ? new Date(date).toLocaleString([], timeOptions) : 'No data'
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
        description: getSystemData(report, 'description') || '',
        createdBy: user.username || 'anonymous'
      }

      const sent = await createUserAlert(reportData)
      if (sent && sent._id) {
        loadData()
        toast.success('Report sent successfully')
        localStorage.removeItem('localSystems')
        localStorage.removeItem('localHistory')
        localStorage.removeItem('localAlerts')
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
    return url.replace(/^((?:[^\/]*\/){3}).*$/, '$1')
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
            label='Name'
            name='name'
            value={getSystemData(report, 'name')}
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
            bgColor='gray'
            disabled={loading}
          />
          <Button
            label='Send Report'
            handleClick={sendReport}
            disabled={loading}
            bgColor='#105ec6'
            textColor='white'
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
        <h2
          className="systemcard__status"
          style={{ color: getCurrentStatus(allSystems.find(system => system._id === selected)) ? 'green' : 'red' }}>
          ● &nbsp;Current status: <strong>{getCurrentStatus(allSystems.find(system => system._id === selected)) ? 'UP' : 'DOWN'}</strong>
        </h2>
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
            max={3}
            style={{ width: '50vw' }}
          />
        </div>
        <div className="home__modal-footer">
          <p className="home__modal-updated">Last updated: {getDate(getSystemData(selected, 'lastCheck'))}</p>
          <Button
            label='Report Issue'
            handleClick={() => setReport(selected)}
            bgColor='#C45757'
            textColor='white'
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
            />)
          : loading ? <MoonLoader color='#0057ad' size={50} /> :
            <p className="home__system-void">No systems found</p>
        }
      </div>
    </div>
  )
}