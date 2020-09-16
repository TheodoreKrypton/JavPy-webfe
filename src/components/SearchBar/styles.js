import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    maxWidth: 800,
    position: 'fixed',
    top: 8,
    zIndex: 1,
  },

  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },

  iconButton: {
    padding: 10,
  },
}));
