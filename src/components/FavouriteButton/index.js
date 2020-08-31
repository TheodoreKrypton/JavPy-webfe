import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import { useHistory } from 'react-router-dom';
import utils from '../../utils';

export default (props) => {
  const { url } = props;
  const history = useHistory();

  const [ticked, setTicked] = React.useState(utils.favourites.contains(url));

  return (
    <IconButton
      onClick={() => {
        if (window.location.hash === '#/favourites') {
          return;
        }
        if (window.location.hash === '#/new') {
          history.push('/favourites');
          return;
        }
        if (ticked) {
          setTicked(false);
          utils.favourites.remove(url);
        } else {
          setTicked(true);
          utils.favourites.add(url);
        }
      }}
    >
      {ticked ? <Favorite /> : <FavoriteBorder />}
    </IconButton>
  );
};
