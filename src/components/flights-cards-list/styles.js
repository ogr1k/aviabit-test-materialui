import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    marginTop: theme.spacing(3),
  },
  showMoreButton: {
    display: 'block',
    margin: '0 auto',
    marginTop: theme.spacing(5),
  },
}));

export default useStyles;
