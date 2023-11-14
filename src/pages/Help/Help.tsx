import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import SearchBar from '../../components/SearchBar/SearchBar'
import Page from '../../assets/icons/page.svg'

type Props = {}

export default function Help({ }: Props) {
  const [search, setSearch] = useState('')
  const [sections, setSections] = useState([])
  const history = useHistory()

  const onChangeSearch = (e: any) => {
    const { value } = e.target || {}
    setSearch(value)
  }

  const triggerSearch = () => {
    return 0
  }

  return (
    <div className="help__container">
      <h1 className="page__header-title">Help Center</h1>
      <h2 className="help__search-title">How can we help?</h2>
      <SearchBar
        handleChange={onChangeSearch}
        triggerSearch={triggerSearch}
        value={search}
      />
      <div className="help__section-row">
        <div className="help__section">
          <h2 className="help__section-title">Getting Started</h2>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=app-tour`)}>App tour</h3>
          </span>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=create-system`)}>Create a system</h3>
          </span>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=plan-downtime`)}>Plan for a downtime</h3>
          </span>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=create-or-update-user`)}>Create or update a user</h3>
          </span>
        </div>

        <div className="help__section">
          <h2 className="help__section-title">Troubleshooting</h2>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=report-system-issue`)}>Report system issue</h3>
          </span>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=report-app-issue`)}>Report app issue</h3>
          </span>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=errors`)}>Common errors</h3>
          </span>
        </div>

        <div className="help__section">
          <h2 className="help__section-title">Policies & Contact</h2>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=privacy-policy`)}>Privacy Policy</h3>
          </span>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=gdpr`)}>GDPR Statement</h3>
          </span>
          <span className="help__section-link-row">
            <img src={Page} alt="" className="help__section-link-svg" />
            <h3 className="help__section-link" onClick={() => history.push(`/help?page=contact`)}>Contact Us</h3>
          </span>
        </div>
      </div>
    </div>
  )
}