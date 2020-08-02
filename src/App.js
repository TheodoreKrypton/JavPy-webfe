import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { withRouter } from 'react-router';
import New from './pages/New';
import './App.css';
import theme from './theme';
import SearchVideo from './pages/SearchVideo';
import SearchActress from './pages/SearchActress';
import SearchMagnet from './pages/SearchMagnet';
import Login from './pages/Login';
import VideoPlayer from './pages/VideoPlayer';
import IFrame from './pages/IFrame';
import TopArea from './components/TopArea';

const App = () => (
  <Switch>
    <Route exact path="/videoplayer">
      <VideoPlayer />
    </Route>
    <Route exact path="/iframe">
      <IFrame />
    </Route>
    <Route>
      <ThemeProvider theme={theme}>
        <div>
          <Login />
          <TopArea />
          <div style={{ position: 'absolute', top: 70, width: '100%' }}>
            <Switch>
              <Redirect exact path="/" to="/new" />
              <Route path="/new">
                <New />
              </Route>
              <Route path="/search/video">
                <SearchVideo />
              </Route>
              <Route path="/search/actress">
                <SearchActress />
              </Route>
              <Route path="/search/magnet">
                <SearchMagnet />
              </Route>
            </Switch>
          </div>
        </div>
      </ThemeProvider>
    </Route>
  </Switch>
);

export default withRouter(App);
