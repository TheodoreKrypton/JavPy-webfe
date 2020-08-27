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

export default withRouter(() => {
  const App = () => (
    <Switch>
      <Route path="/videoplayer">
        <VideoPlayer />
      </Route>
      <Route path="/iframe">
        <IFrame />
      </Route>
      <Route path="/">
        <ThemeProvider theme={theme}>
          <div>
            <Login />
            <TopArea />
            <div style={{ position: 'absolute', top: 70, width: '100%' }}>
              <Switch>
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
                <Redirect path="/" to="/new" />
              </Switch>
            </div>
          </div>
        </ThemeProvider>
      </Route>
    </Switch>
  );

  return <App />;
});
