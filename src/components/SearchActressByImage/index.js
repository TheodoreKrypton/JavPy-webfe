import React from 'react';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import api from '../../api';

export default () => {
  const [loading, setLoading] = React.useState(false);

  const onChange = React.useCallback(async (e) => {
    setLoading(true);
    const image = e.target.files[0];
    if (!image) {
      return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;
      api.ws.searchActressByImage({ image: base64 }).onArrival((rsp) => {
        if (rsp && rsp.length > 0) {
          window.open(`/#/actresses?actresses=${encodeURIComponent(JSON.stringify(rsp))}`);
        }
      }).finally(() => {
        setLoading(false);
      });
    };

    reader.readAsDataURL(image);
  }, []);

  return (
    <label htmlFor="icon-button-file">
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="icon-button-file"
        type="file"
        onChange={onChange}
      />
      <IconButton component="span">
        {loading ? <CircularProgress color="secondary" size={25} /> : <PhotoCameraIcon />}
      </IconButton>
    </label>
  );
};
