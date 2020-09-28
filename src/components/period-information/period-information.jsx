import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  Container, Typography, Box, NativeSelect, FormControl, FormHelperText,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { formatDate } from '../../util';
import { MONTHS } from '../../constants';
import {
  getAvailableYears, getFlightsData, getTimeData, getPeriodData,
} from '../../reducer/selector';
import Loader from '../loader/loader';
import useStyles from './styles';
import FlightsCardsList from '../flights-cards-list/flights-cards-list';

const getFormattedData = (year, yearIndex, month, timeData, yearResults, timeType) => (Number(month)
  ? `${formatDate(timeData[timeType][year].flightTime[month])} 
          / ${formatDate(timeData[timeType][year].workTime[month])}`
  : `${formatDate(yearResults[timeType].flightTime[yearIndex])} 
          / ${formatDate(yearResults[timeType].workTime[yearIndex])}`)

const PeriodInformation = (props) => {
  const {
    match, flights, timeData: data, availableYears, flightsData,
  } = props;
  const { timeData, yearResults } = data;
  const { params: routeParams } = match;
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const month = MONTHS[routeParams.month];

  const yearSelectHandlerMemoized = useCallback((e) => {
    history.push(`/information/${e.target.value}/${routeParams.month ? routeParams.month : ''}`)
  }, [history, routeParams])

  const monthSelectChangeHandlerMemoized = useCallback((e) => {
    const { value } = e.target;
    const pickedYear = routeParams.year;

    if (!value) {
      history.push(`/information/${pickedYear}`)
      return;
    }

    const index = MONTHS.findIndex((currentMonth) => currentMonth === value);

    history.push(`/information/${pickedYear}/${index}`)
  }, [history, routeParams])

  const yearIndex = useMemo(() => availableYears.findIndex(
    (year) => Number(routeParams.year) === year,
  ), [availableYears, routeParams])

  if (!flightsData.length) {
    return <Loader />;
  }

  return (
    <Container maxWidth="md" className={isSmall ? classes.mainContainer : null}>
      <Container className={classes.commonDataContainer}>
        <Box>
          <FormControl>
            <NativeSelect
              className={classes.selector}
              value={
                  routeParams.year
                }
              onChange={yearSelectHandlerMemoized}
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
              onChange={monthSelectChangeHandlerMemoized}
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
        <Typography variant="h5" color="primary">
          Сводные данные за период:
        </Typography>
        <Typography color="textSecondary">
          Выполнено рейсов: {flights.done.length}
        </Typography>
        {!!flights.done.length
          && (
          <Typography color="textSecondary">
            Налет/рабочее время по выполненным рейсам: {
            getFormattedData(
              routeParams.year, yearIndex, routeParams.month, timeData, yearResults, 'done',
            )
          }
          </Typography>
          )}
        <Typography color="textSecondary">
          Запланировано рейсов: {flights.plan.length}
        </Typography>
        {!!flights.plan.length
          && (
          <Typography color="textSecondary">
            Налет/рабочее время по запланированным рейсам: {getFormattedData(
            routeParams.year, yearIndex, routeParams.month, timeData, yearResults, 'plan',
          )}
          </Typography>
          )}
      </Container>
      <FlightsCardsList flights={flights.done} type="Выполненные" pickedMonth={routeParams.month} pickedYear={routeParams.year} />
      <FlightsCardsList flights={flights.plan} type="Запланированные" pickedMonth={routeParams.month} pickedYear={routeParams.year} />
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
