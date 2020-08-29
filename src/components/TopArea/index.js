import React from 'react';
import Config from '../Config';
import SearchBar from '../SearchBar';

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
      </tr>
    </tbody>
  </table>
);
