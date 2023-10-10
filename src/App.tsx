import { AppProvider } from './AppContext';
import ReactGA from 'react-ga4';
import { Switch, Route, useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Header from './components/Header/Header';
import './scss/app.scss'

function App() {
  const isMobile = window.screen.width <= 768
  const [search, setSearch] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname
    })
  }, [location, window.location.pathname])

  return (
    <AppProvider
      search={search}
      setSearch={setSearch}
      isMobile={isMobile}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    >
      <Switch>
        <Route exact path="/">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <Home />
          </div>
        </Route>
        <Route exact path="/login">
          <div className='page__wrapper'>
            <Header search={search} setSearch={setSearch} />
            <Login />
          </div>
        </Route>
      </Switch>
    </AppProvider>
  )
}

export default App;
