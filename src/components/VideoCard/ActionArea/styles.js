import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  root: {
    width: 350,
    maxWidth: '80vw',
    margin: 8,
    background: 'rgba(255, 255, 255, 0.1)',
  },
  media: {
    height: 235,
    width: 'auto',
  },
  content: {
    poadding: 8,
    height: 120,
    // width: '100%',
    overflow: 'hidden',
  },
  bottom: {
    position: 'relative',
    height: 30,
  },
  date: {
    float: 'right',
  },
});
