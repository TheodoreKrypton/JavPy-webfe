import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import useStyles from './styles';
import api from '../../api';

const formatDate = (date) => {
  if (!date) {
    return '';
  }
  const d = new Date(date);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${ye}/${mo}/${da}`;
};

const profileByActress = {};

export default (props) => {
  const classes = useStyles();

  const { actress } = props;

  const [profile, setProfile] = React.useState(profileByActress[actress.toLowerCase()] || null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    api.ws.getActressProfile({ actress })
      .onArrival((rsp) => {
        profileByActress[actress.toLowerCase()] = rsp;
        setProfile(rsp);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [actress]);

  if (loading) {
    return (
      <Grid container justify="center">
        <Grid container className={classes.root}>
          <Grid container direction="column" xs={6}>
            {([...new Array(4)]).map(() => (
              <Grid item>
                <Skeleton variant="text" width={100} />
              </Grid>
            ))}
          </Grid>
          <Grid xs={6}>
            <Skeleton variant="text" width={100} />
          </Grid>
        </Grid>
      </Grid>
    );
  }

  if (!profile) {
    return <></>;
  }

  return (
    <Grid container justify="center">
      <Grid container className={classes.root}>
        <Grid container direction="column" xs={6}>
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
        <Grid xs={6}>
          <Box
            border={3}
            borderColor="secondary.main"
            borderRadius={7}
            className={classes.cover}
          >
            <Avatar variant="rounded" src={profile.img} className={classes.cover} />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
