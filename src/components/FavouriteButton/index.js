import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import utils from '../../utils';

export default (props) => {
  const { url } = props;

  const [ticked, setTicked] = React.useState(utils.favourites.contains(url));

  return (
    <IconButton
      onClick={() => {
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
