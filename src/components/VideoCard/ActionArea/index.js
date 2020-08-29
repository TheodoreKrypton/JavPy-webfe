import React from 'react';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import LazyLoad from 'react-lazyload';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';
import useStyles from './styles';

export default (props) => {
  const classes = useStyles();

  const { video } = props;

  const html = (
    <>
      <LazyLoad>
        <CardMedia
          component="img"
          className={classes.media}
          image={video.preview_img_url}
        />
      </LazyLoad>
      <CardContent className={classes.content}>
        <Typography gutterBottom variant="h5" component="h2">
          {video.code}
          <Chip size="small" label={video.release_date} className={classes.date} />
        </Typography>
        <Typography variant="body2" component="p">
          {video.title}
        </Typography>
      </CardContent>
    </>
  );

  return (
    <CardActionArea component={Link} to={`/search/video?code=${video.code}`}>
      {html}
    </CardActionArea>
  );
};
