import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../api';

export default () => {
  const [input, setInput] = React.useState('');
  const open = React.useMemo(() => !api.hasUserpass(), []);

  const handleProceed = React.useCallback((password) => {
    if (api.hasUserpass()) {
      return;
    }
    api.authByPassword({ password });
  }, []);

  React.useEffect(() => {
    handleProceed(null);
  }, [handleProceed]);

  const dialog = React.useMemo(() => (
    <Dialog open={open} onClose={handleProceed(input)}>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Leave it blank if you did not set a password.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="password"
          type="password"
          color="secondary"
          value={input}
          onChange={(ev) => { setInput(ev.target.value); }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProceed} color="secondary">
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  ), [handleProceed, input, open]);

  return dialog;
};
