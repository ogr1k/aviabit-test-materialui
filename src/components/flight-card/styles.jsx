import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 14,
  },
  cardContainer: {
    border: '1px solid black',
    padding: '0px',
  },
  box: {
    padding: '5px',
    textAlign: 'center',
  },
  destinationBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  flight: {
    marginRight: theme.spacing(3),
  },
  cardHeader: {
    backgroundColor: '#E7E7E7',
    color: '#002F5D',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  root: {
    padding: '0px',
  },
}));

export default useStyles;
