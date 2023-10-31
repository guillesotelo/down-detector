import { AppProvider } from './AppContext';
import ReactGA from 'react-ga4';
import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Header from './components/Header/Header';
import './scss/app.scss'
import { verifyToken } from './services';
import Sidebar from './components/Sidebar/Sidebar';
import History from './pages/History/History';
import AppLogs from './pages/AppLogs/AppLogs';
import Systems from './pages/Systems/Systems';
import Users from './pages/Users/Users';
import Help from './pages/Help/Help';
import Account from './pages/Account/Account';

function App() {
  const isMobile = window.screen.width <= 768
  const [search, setSearch] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSuper, setIsSuper] = useState(false)
  const [item, setItem] = useState('/')
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname
    })

    verifyUser()
  }, [location, window.location.pathname])

  const verifyUser = async () => {
    const verified = await verifyToken()
    if (verified) {
      setIsLoggedIn(true)
      setIsSuper(verified.isSuper)
    }
  }

  return (
    <AppProvider
      search={search}
      setSearch={setSearch}
      isMobile={isMobile}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      isSuper={isSuper}
      setIsSuper={setIsSuper}
      item={item}
      setItem={setItem}
    >
      <Switch>
        <Route exact path="/">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <Home />
            </div>
          </div>
        </Route>
        <Route exact path="/history">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <History />
            </div>
          </div>
        </Route>
        <Route exact path="/applogs">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <AppLogs />
            </div>
          </div>
        </Route>
        <Route exact path="/systems">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <Systems />
            </div>
          </div>
        </Route>
        <Route exact path="/users">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <Users />
            </div>
          </div>
        </Route>
        <Route exact path="/help">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <Help />
            </div>
          </div>
        </Route>
        <Route exact path="/login">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <Login />
          </div>
        </Route>
        <Route exact path="/account">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <Account />
            </div>
          </div>
        </Route>
        <Route>
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <div className="page__row">
              {isLoggedIn ? <Sidebar /> : ''}
              <Home />
            </div>
          </div>
        </Route>
      </Switch>
    </AppProvider>
  )
}

export default App;
