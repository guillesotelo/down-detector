import { AppContext } from './AppContext';
import ReactGA from 'react-ga4';
import { Switch, Route, useLocation } from "react-router-dom";
import React, { useContext, useEffect } from 'react';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Header from './components/Header/Header';
import './scss/app.scss'
import Sidebar from './components/Sidebar/Sidebar';
import History from './pages/History/History';
import AppLogs from './pages/AppLogs/AppLogs';
import Systems from './pages/Systems/Systems';
import Users from './pages/Users/Users';
import Help from './pages/About/About';
import Account from './pages/Account/Account';
import Unsubscribe from './pages/Unsubscribe/Unsubscribe';
import Subscriptions from './pages/Subscriptions/Subscriptions';

function App() {
  const location = useLocation()
  const { isLoggedIn, darkMode } = useContext(AppContext)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname
    })
  }, [location, window.location.pathname])

  return (
    <Switch>
      <Route exact path="/">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Home />
          </div>
        </div>
      </Route>
      <Route exact path="/history">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <History />
          </div>
        </div>
      </Route>
      <Route exact path="/applogs">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <AppLogs />
          </div>
        </div>
      </Route>
      <Route exact path="/subscriptions">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Subscriptions />
          </div>
        </div>
      </Route>
      <Route exact path="/systems">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Systems />
          </div>
        </div>
      </Route>
      <Route exact path="/users">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Users />
          </div>
        </div>
      </Route>
      <Route exact path="/about">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Help />
          </div>
        </div>
      </Route>
      <Route exact path="/login">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <Login />
        </div>
      </Route>
      <Route exact path="/account">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Account />
          </div>
        </div>
      </Route>
      <Route exact path="/unsubscribe">
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Unsubscribe />
          </div>
        </div>
      </Route>
      <Route>
        <div className={`page__wrapper${darkMode ? '--dark' : ''}`}>
          <Header />
          <div className={`page__row${darkMode ? '--dark' : ''}`} style={{ marginLeft: isLoggedIn ? '' : 0 }}>
            {isLoggedIn ? <Sidebar /> : ''}
            <Home />
          </div>
        </div>
      </Route>
    </Switch>
  )
}

export default React.memo(App)
