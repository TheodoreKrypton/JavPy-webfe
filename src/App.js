import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid';
import New from './pages/New';
import './App.css';
import theme from './theme';
import SearchVideo from './pages/SearchVideo';
import SearchActress from './pages/SearchActress';
import SearchMagnet from './pages/SearchMagnet';
import Login from './pages/Login';
import VideoPlayer from './pages/VideoPlayer';
import IFrame from './pages/IFrame';
import SearchBar from './components/SearchBar';
import Favourites from './pages/Favourites';
import Actresses from './pages/Actresses';

export default withRouter(() => {
  const App = React.useMemo(() => (
    <Switch>
      <Route path="/videoplayer">
        <VideoPlayer />
      </Route>
      <Route path="/iframe">
        <IFrame />
      </Route>
      <Route path="/">
        <ThemeProvider theme={theme}>
          <Login />
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <SearchBar />
          </Grid>
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
              <Route path="/favourites">
                <Favourites />
              </Route>
              <Route path="/actresses">
                <Actresses />
              </Route>
              <Redirect path="/" to="/new" />
            </Switch>
          </div>
        </ThemeProvider>
      </Route>
    </Switch>
  ), []);

  return <>{App}</>;
});
