import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: '0px',
  },
  content: {
    marginTop: theme.spacing(8),
  },
  selector: {
    marginRight: theme.spacing(2),
  },
  selectorsContainer: {
    marginTop: theme.spacing(5),
  },
  container: {
    margin: '30px auto',
  },
  showMoreButton: {
    display: 'block',
    margin: '0 auto',
    marginTop: theme.spacing(5),
  },
  dataContainer: {
    border: '1px solid black',
  },
  cardContainer: {
    marginTop: theme.spacing(3),
  },
  commonDataContainer: {
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;
