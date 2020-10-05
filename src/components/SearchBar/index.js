import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import HomeIcon from '@material-ui/icons/Home';
import Paper from '@material-ui/core/Paper';
import { Link, useHistory } from 'react-router-dom';
import useStyles from './styles';
import Config from '../Config';
import FavouriteButton from '../FavouriteButton';
import SearchActressByImage from '../SearchActressByImage';

const getDestination = (kw) => {
  if (kw === '') {
    return '';
  }
  return /\d/.test(kw)
    ? `/search/video?code=${kw}`
    : `/search/actress?actress=${kw}`;
};

export default () => {
  const classes = useStyles();
  const history = useHistory();

  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <Paper className={classes.root}>
      <Config />
      <IconButton component={Link} to="/" className={classes.iconButton}>
        <HomeIcon />
      </IconButton>

      <FavouriteButton url={`${window.location.pathname}${window.location.hash}`} />
      <InputBase
        className={classes.input}
        placeholder="Search..."
        value={searchTerm}
        onChange={(event) => { setSearchTerm(event.target.value); }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            history.push(getDestination(searchTerm.trim()));
          }
        }}
      />
      <SearchActressByImage />
    </Paper>
  );
};
