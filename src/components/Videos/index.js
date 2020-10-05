import React from 'react';
import Box from '@material-ui/core/Box';
import useStyles from './styles';
import VideoCard from '../VideoCard';

export default (props) => {
  const classes = useStyles();

  const { videos } = props;

  const renderPage = () => (
    <Box
      className={classes.root}
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
    >
      {videos.map((video) => <VideoCard key={video.code} video={video} />)}
    </Box>
  );

  return renderPage();
};
