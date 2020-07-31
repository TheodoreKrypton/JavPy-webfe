import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Clipboard from 'clipboard';
import styles from './styles';
import utils from '../../utils';
import api from '../../api';

// eslint-disable-next-line no-new
new Clipboard('.btn');

export default () => {
  const query = utils.useQuery();

  const [magnets, setMagnets] = React.useState([]);

  const renderTable = () => {
    if (!magnets) {
      return <Alert severity="error">Sorry. Cannot find the requested resources.</Alert>;
    }
    return (
      <TableContainer
        component={Paper}
        style={{
          width: 300, left: 0, right: 0, position: 'relative', margin: 'auto',
        }}
      >
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <styles.StyledTableCell align="left">Total Size</styles.StyledTableCell>
              <styles.StyledTableCell align="left">Magnet Link</styles.StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {magnets.map((row) => (
              <styles.StyledTableRow key={row.name}>
                <styles.StyledTableCell align="left">{row.description}</styles.StyledTableCell>
                <styles.StyledTableCell align="left">
                  <Button className="btn" size="small" color="secondary" data-clipboard-text={row.magnet}>
                    COPY LINK
                  </Button>
                </styles.StyledTableCell>
              </styles.StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  React.useEffect(() => {
    const code = query.get('code');
    api.ws.searchMagnet({ code }).onArrival((rsp) => {
      setMagnets(rsp);
    });
  });

  return renderTable();
};
