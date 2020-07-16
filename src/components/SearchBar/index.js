import React from 'react';
import useStyles from './styles'
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';

export default () => {
  const classes = useStyles();

  function handleSearch() {
    const kw = input.trim();
    if (kw === "") {
      return
    }
    window.location.href = /\d/.test(kw) ?
      `/#/search/video?code=${kw}` :
      `/#/search/actress?actress=${kw}&history_name=true`;
  }

  function handleGoHome() {
    window.location.href = "/"
  }

  const [input, setInput] = React.useState("");

  return (
    <Paper className={classes.root}>
      <IconButton
        aria-label="home"
        component="span"
        className={classes.iconButton}
        onClick={() => { handleGoHome() }}
      >
        <HomeIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search..."
        value={input}
        onChange={event => { setInput(event.target.value); }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      <IconButton className={classes.iconButton} aria-label="search" onClick={() => handleSearch()}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}