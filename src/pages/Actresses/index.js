import React from 'react';
import Box from '@material-ui/core/Box';
import utils from '../../utils';
import ActressProfile from '../../components/ActressProfile';
import useStyles from './styles';

export default () => {
  const classes = useStyles();

  const query = utils.useQuery();
  const actresses = JSON.parse(decodeURIComponent(query.get('actresses')));

  return (
    <Box
      className={classes.root}
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
    >
      {actresses.map((actress) => <ActressProfile actress={actress} key={actress} />)}
    </Box>
  );
};
