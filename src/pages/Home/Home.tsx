import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext'
import SystemCard from '../../components/SystemCard/SystemCard'
import Modal from '../../components/Modal/Modal'
import { getAllSystems, getAllHistory, getHistoryBySystemId, createUserAlert, getAllAlerts } from '../../services'
import { dataObj } from '../../types'
import { Line } from 'react-chartjs-2'
import { registerables, Chart } from 'chart.js';
import DataTable from '../../components/DataTable/DataTable'
import { hisrotyHeaders } from '../../constants/tableHeaders'
import InputField from '../../components/InputField/InputField'
import Dropdown from '../../components/Dropdown/Dropdown'
import Button from '../../components/Button/Button'
import { toast } from 'react-toastify'
Chart.register(...registerables);

type Props = {}

export default function Home({ }: Props) {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [selected, setSelected] = useState('')
  const [allSystems, setAllSystems] = useState<any[]>([])
  const [allStatus, setAllStatus] = useState([])
  const [allAlerts, setAllAlerts] = useState([])
  const [data, setData] = useState<dataObj>({})
  const [chartData, setChartData] = useState<any>({})
  const [totalHours, setTotalHours] = useState<number>(0)
  const [reportedStatus, setReportedStatus] = useState<dataObj>({ name: 'Unable to access' })

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
    getSystems()
    getAllStatus()
    getAllUserAlerts()
  }, [])

  useEffect(() => {
    getTotalRegisteredHours()
  }, [allStatus, selected])

  useEffect(() => {
    if (report) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [report])

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
      const systems = await getAllSystems()
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
      const history = await getAllHistory()
      if (history && history.length) {
        setAllStatus(history)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAllUserAlerts = async () => {
    try {
      const alerts = await getAllAlerts()
      if (alerts && alerts.length) {
        setAllAlerts(alerts)
      }
    } catch (error) {
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
      const reportData = {
        ...data,
        type: reportedStatus.name,
        systemId: report,
        url: getSystemData(report, 'url')
      }
      const sent = await createUserAlert(reportData)
      if (sent && sent._id) {
        setSelected('')
        setReport('')
        setData({})
        toast.success('Report sent successfully')
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

  const chartOptions: any = {
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        border: {
          display: false
        },
        ticks: {
          autoSkip: false,
          display: false,
          // color: 'gray'
        },
        grid: {
          // display: false,
          // drawBorder: false,
          // drawChartArea: false
        }
      },
      y: {
        // beginAtZero: true,
        border: {
          // display: false
        },
        ticks: {
          display: false
        },
        grid: {
          // display: false,
          // drawBorder: false,
          // drawChartArea: false
        }
      }
    }
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
            bgColor='lightgray'
          />
          <Button
            label='Send Report'
            handleClick={sendReport}
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
        subtitle={getSystemData(selected, 'url')}
        onClose={() => setSelected('')}>
        <h2
          className="systemcard__status"
          style={{ color: getCurrentStatus(allSystems.find(system => system._id === selected)) ? 'green' : 'red' }}>
          ● &nbsp;Current status: <strong>{getCurrentStatus(allSystems.find(system => system._id === selected)) ? 'UP' : 'DOWN'}</strong>
        </h2>
        <p className="home__modal-hours">Total registered: {totalHours} hours</p>
        <div className="home__modal-graph-wrapper">
          <div className='home__modal-graph'>
            <Line data={chartData} height={chartHeight} width={chartWidth} options={chartOptions} />
          </div>
        </div>
        <div className="home__modal-table">
          <DataTable
            title='Latest system logs'
            tableData={allStatus.filter((status: dataObj) => status.systemId === selected)}
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
    <div className="home__container">
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
            />)
          :
          <p className="home__system-void">No systems found</p>
        }
      </div>
    </div>
  )
}