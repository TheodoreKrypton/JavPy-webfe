import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import ActionArea from './ActionArea';

export default (props) => {
  const classes = useStyles();
  const { video } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMultipleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMultipleClose = () => {
    setAnchorEl(null);
  };

  const renderActress = (actress) => {
    if (!actress || actress.length === 0) {
      return (
        <Button size="small" color="secondary" disabled>
          Unknown
        </Button>
      );
    } if (actress.length === 1) {
      return (
        <Button
          component={Link}
          to={`/search/actress?actress=${video.actress}`}
          size="small"
          color="secondary"
          target="_blank"
        >
          {video.actress}
        </Button>
      );
    }
    return (
      <>
        <Button size="small" color="secondary" onClick={handleMultipleClick}>
          Expand
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMultipleClose}
        >
          {actress.map(
            (x) => {
              const xx = x.trim();
              return <Button component={Link} to={`/search/actress?actress=${xx}`} target="_blank" style={{ display: 'block' }} key={xx}>{xx}</Button>;
            },
          )}
        </Menu>
      </>
    );
  };

  return (
    <Card className={classes.root}>
      <ActionArea video={video} />
      <CardActions className={classes.bottom}>
        {renderActress(video.actress)}
        <Button component={Link} to={`/search/magnet?code=${video.code}`} target="_blank" size="small" color="secondary">
          MAGNET
        </Button>
      </CardActions>
    </Card>
  );
};
