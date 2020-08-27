import React from 'react';
import Connected from '@material-ui/icons/Link';
import Disconnected from '@material-ui/icons/LinkOff';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Config from '../Config';
import SearchBar from '../SearchBar';
import api from '../../api';

export default () => (
  <table style={{ position: 'fixed', top: 0, zIndex: 1 }}>
    <tbody>
      <tr>
        <td>
          <Config />
        </td>
        <td>
          <SearchBar />
        </td>
        <td>
          <Tooltip arrow title={api.ws.connectionStatus.server}>
            <span>
              <IconButton disabled>
                {api.ws.connectionStatus ? <Connected /> : <Disconnected />}
              </IconButton>
            </span>
          </Tooltip>
        </td>
      </tr>
    </tbody>
  </table>
);
