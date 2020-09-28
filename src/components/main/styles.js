import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    marginTop: theme.spacing(10),
  },
  timeCell: {
    border: '1px solid',
    textAlign: 'center',
  },
}));

export default useStyles;
