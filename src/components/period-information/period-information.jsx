import React from 'react';
import { connect } from 'react-redux';
import {
  Container, Typography, Box, NativeSelect, FormControl, FormHelperText, Grid, Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { formatDate } from '../../util';
import { MONTHS } from '../../constants';
import FlightCard from '../flight-card/flight-card';
import {
  getAvailableYears, getFlightsData, getTimeData, getPeriodData,
} from '../../reducer/selector';
import Loader from '../loader/loader';

const DEFAULT_MAX_CARDS = 6;

const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(4),
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

const getFormattedData = (year, yearIndex, month, timeData, yearResults, timeType) => (Number(month)
  ? `${formatDate(timeData[timeType][year].flightTime[month])} 
          / ${formatDate(timeData[timeType][year].workTime[month])}`
  : `${formatDate(yearResults[timeType].flightTime[yearIndex])} 
          / ${formatDate(yearResults[timeType].workTime[yearIndex])}`)

const monthSelectChangeHandler = (e, history, pickedYear) => {
  const { value } = e.target;

  if (!value) {
    history.push(`/information/${pickedYear}`)
    return;
  }

  const index = MONTHS.findIndex((currentMonth) => currentMonth === value);

  history.push(`/information/${pickedYear}/${index}`)
}

const PeriodInformation = (props) => {
  const {
    match, flights, timeData: data, availableYears, flightsData,
  } = props;
  const { timeData, yearResults } = data;
  const { params: routeParams } = match;
  const history = useHistory();
  const classes = useStyles();
  const month = MONTHS[routeParams.month];

  const [doneMaxElements, setDoneMaxElements] = React.useState(DEFAULT_MAX_CARDS);
  const [planMaxElements, setPlanMaxElements] = React.useState(DEFAULT_MAX_CARDS);
  React.useEffect(() => {
    setDoneMaxElements(DEFAULT_MAX_CARDS);
    setPlanMaxElements(DEFAULT_MAX_CARDS);
  }, [routeParams.month, routeParams.year]);

  if (!flightsData.length) {
    return <Loader />;
  }

  const yearIndex = availableYears.findIndex((year) => Number(routeParams.year) === year)

  return (
    <Container maxWidth="md">
      <Box className={classes.selectorsContainer}>
        <FormControl>
          <NativeSelect
            className={classes.selector}
            value={
            routeParams.year
          }
            onChange={(e) => {
              history.push(`/information/${e.target.value}/${routeParams.month ? routeParams.month : ''}`)
            }}
            inputProps={{
              name: 'year',
              id: 'year-native-simple',
            }}
          >
            {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
          </NativeSelect>
          <FormHelperText>Год</FormHelperText>
        </FormControl>
        <FormControl>
          <NativeSelect
            value={
            month
          }
            inputProps={{
              name: 'month',
              id: 'month-native-simple',
            }}
            onChange={(e) => monthSelectChangeHandler(e, history, routeParams.year)}
          >
            <option aria-label="None" value="" />
            {MONTHS.map((currentMonth) => (
              <option key={currentMonth} value={currentMonth}>
                {currentMonth}
              </option>
            ))}
          </NativeSelect>
          <FormHelperText>Месяц</FormHelperText>
        </FormControl>
      </Box>
      <Container className={classes.commonDataContainer}>
        <Typography variant="h5" color="primary">
          Сводные данные за период:
        </Typography>
        <Typography color="textSecondary">
          Выполнено рейсов: {flights.done.length}
        </Typography>
        {flights.done.length ? (
          <Typography color="textSecondary">
            Налет/рабочее время по выполненным рейсам: {
            getFormattedData(
              routeParams.year, yearIndex, routeParams.month, timeData, yearResults, 'done',
            )
          }
          </Typography>
        ) : ''}
        <Typography color="textSecondary">
          Запланировано рейсов: {flights.plan.length}
        </Typography>
        {flights.plan.length ? (
          <Typography color="textSecondary">
            Налет/рабочее время по запланированным рейсам: {getFormattedData(
            routeParams.year, yearIndex, routeParams.month, timeData, yearResults, 'plan',
          )}
          </Typography>
        ) : ''}
      </Container>
      <Container className={classes.cardContainer} maxWidth="md">
        {flights.done.length
          ? (
            <Typography variant="h5">
              Выполненные:
            </Typography>
          )
          : ''}
        <Grid container spacing={1}>
          {flights.done.slice(0, doneMaxElements).map((flight) => (
            <Grid item xs={12} sm={6} lg={4} md={4} key={flight.timeFlight}>
              <FlightCard flightData={flight} />
            </Grid>
          ))}
        </Grid>
      </Container>
      {doneMaxElements >= flights.done.length
        ? null
        : (
          <Button
            variant="contained"
            className={classes.showMoreButton}
            onClick={
            () => setDoneMaxElements(doneMaxElements + DEFAULT_MAX_CARDS)
          }
          >
            Показать еще
          </Button>
        )}
      <Container className={classes.cardContainer} maxWidth="md">
        {flights.plan.length
          ? (
            <Typography variant="h5">
              Запланированные:
            </Typography>
          )
          : ''}
        <Grid container spacing={1}>
          {flights.plan.slice(0, planMaxElements).map((flight) => (
            <Grid item xs={12} sm={6} lg={4} md={4} key={flight.timeFlight}>
              <FlightCard flightData={flight} />
            </Grid>
          ))}
        </Grid>
      </Container>
      {planMaxElements >= flights.plan.length
        ? ''
        : (
          <Button
            variant="contained"
            className={classes.showMoreButton}
            onClick={
            () => setPlanMaxElements(planMaxElements + DEFAULT_MAX_CARDS)
          }
          >
            Показать еще
          </Button>
        )}
    </Container>
  )
};

const mapStateToProps = (state, ownProps) => ({
  timeData: getTimeData(state),
  flights: getPeriodData(state, ownProps.match.params.year, ownProps.match.params.month),
  availableYears: getAvailableYears(state),
  flightsData: getFlightsData(state),
})

export default connect(mapStateToProps)(PeriodInformation);
