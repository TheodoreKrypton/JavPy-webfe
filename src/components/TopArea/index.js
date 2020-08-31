import React from 'react';
import Config from '../Config';
import SearchBar from '../SearchBar';
import FavouriteButton from '../FavouriteButton';

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
          <FavouriteButton url={`${window.location.pathname}${window.location.hash}`} />
        </td>
      </tr>
    </tbody>
  </table>
);
