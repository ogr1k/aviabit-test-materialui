import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from './style';

const Loader = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <CircularProgress />
    </div>
  )
}

export default Loader;
