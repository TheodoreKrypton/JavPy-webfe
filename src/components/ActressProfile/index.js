import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
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
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
          </CardContent>
        </div>
        <CardMedia
          className={classes.cover}
        >
          <Skeleton variant="rect" />
        </CardMedia>
      </Card>
    );
  }

  if (!profile) {
    return <></>;
  }

  return (
    <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {actress}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Birthdate:
            {formatDate(profile.birth_date)}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Height:
            {profile.height}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Weight:
            {profile.weight}
          </Typography>
        </CardContent>
      </div>
      <CardMedia
        component="img"
        className={classes.cover}
        image={profile.img}
      />
    </Card>
  );
};
