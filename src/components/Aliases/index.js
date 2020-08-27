import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import api from '../../api';

const aliasByActress = {};

export default (props) => {
  const { actress } = props;

  const aliasesCached = React.useMemo(() => aliasByActress[actress.toLowerCase()], [actress]);
  const [aliases, setAliases] = React.useState(aliasesCached || []);

  React.useEffect(() => {
    setAliases(aliasesCached || []);
    api.ws.getAliases({ actress }).onArrival((rsp) => {
      setAliases((al) => [...new Set([...al, ...rsp])].sort());
    });
  }, [actress, aliasesCached]);

  React.useEffect(() => {
    const set = new Set(aliases);
    const sorted = [...set].sort();
    set.forEach((alias) => {
      if (!aliasByActress[alias.toLowerCase()]) {
        aliasByActress[alias.toLowerCase()] = sorted;
      } else {
        aliasByActress[alias.toLowerCase()] = [
          ...(new Set([...set, ...aliasByActress[alias.toLowerCase()]])),
        ].sort();
      }
    });
  }, [aliases]);

  return (
    <div style={{
      display: 'table',
      margin: '0 auto',
    }}
    >
      <Breadcrumbs>
        {aliases.map((name) => (
          <Button
            component={Link}
            to={`/search/actress?actress=${name}`}
            key={name}
            color="secondary"
          >
            {name}
          </Button>
        ))}
      </Breadcrumbs>
    </div>
  );
};
