import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import styles from './styles';
import utils from '../../utils';

const regexes = {
  code: new RegExp(/(?:\?|$)code=(.+?)(?:$|&)/i),
  actress: new RegExp(/(?:\?|$)actress=(.+?)(?:$|&)/i),
};

const comprehendUrl = (url) => {
  try {
    if (url.startsWith('/#/')) {
      const main = url.slice(2);
      if (main.startsWith('/search/video')) {
        return [`video:   ${decodeURI(main.match(regexes.code)[1])}`, main];
      }
      if (main.startsWith('/search/actress')) {
        return [`actress: ${decodeURI(main.match(regexes.actress)[1])}`, main];
      }
      if (main.startsWith('/search/magnet')) {
        return [`magnet:  ${decodeURI(main.match(regexes.code)[1])}`, main];
      }
      return [main, main];
    }
    return [url, url];
  } catch {
    return [url, url];
  }
};

export default () => {
  const [urls, setUrls] = React.useState(Object.keys(utils.favourites.cache.values));
  const sortedUrls = React.useMemo(() => urls.sort(
    (k1, k2) => urls[k1] - urls[k2],
  ), [urls]);

  return (
    <TableContainer
      component={Paper}
      style={{
        maxWidth: 500, left: 0, right: 0, position: 'relative', margin: 'auto',
      }}
    >
      <Table aria-label="customized table" size="small">
        <TableBody>
          {sortedUrls.map(
            (u) => {
              const [text, url] = comprehendUrl(u);
              return (
                <styles.StyledTableRow key={url}>
                  <styles.StyledTableCell align="left">
                    <Button className="btn" size="small" color="secondary" component={Link} to={url}>
                      {text}
                    </Button>
                  </styles.StyledTableCell>
                  <styles.StyledTableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        utils.favourites.remove(u);
                        setUrls(Object.keys(utils.favourites.cache.values));
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </styles.StyledTableCell>
                </styles.StyledTableRow>
              );
            },
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
