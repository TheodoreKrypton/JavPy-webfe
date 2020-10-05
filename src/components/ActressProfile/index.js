import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import api from '../../api';

const formatDate = (date) => {
  if (!date) {
    return '';
  }
  const d = new Date(date);
  const yr = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
  const dy = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${yr}/${mo}/${dy}`;
};

export default (props) => {
  const classes = useStyles();

  const { actress } = props;

  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    api.ws.getActressProfile({ actress })
      .onArrival(setProfile)
      .finally(() => {
        setLoading(false);
      });
  }, [actress]);

  const html = React.useMemo(() => {
    if (loading) {
      return (
        <Grid container justify="center">
          <Grid container className={classes.root}>
            <Grid container direction="column">
              <Grid item xs={6}>
                {actress}
              </Grid>
              {([...new Array(3)]).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid item key={i} xs={6}>
                  <Skeleton variant="text" width={100} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="text" width={100} />
            </Grid>
          </Grid>
        </Grid>
      );
    } if (!profile) {
      return <></>;
    }
    return (
      <Grid container className={classes.root}>
        <Grid item xs={6}>
          <Grid container direction="column">
            <Grid item>
              <Typography component="h5" variant="h5" color="textPrimary">
                {actress}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" color="textSecondary">
                Birthdate:
                {formatDate(profile.birth_date)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" color="textSecondary">
                Height:
                {profile.height}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" color="textSecondary">
                Weight:
                {profile.weight}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Box
            border={3}
            borderColor="secondary.main"
            borderRadius={7}
            className={classes.cover}
          >
            <Avatar
              variant="rounded"
              src={profile.img}
              className={classes.cover}
              component={Link}
              to={`/search/actress?actress=${actress}`}
              target="_blank"
            />
          </Box>
        </Grid>
      </Grid>
    );
  }, [actress, classes.cover, classes.root, loading, profile]);

  return html;
};
