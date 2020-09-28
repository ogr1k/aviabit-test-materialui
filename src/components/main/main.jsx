import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { Container, Grid } from '@material-ui/core';
import {
  getAvailableYears, getFlightsData, getTimeData,
} from '../../reducer/selector';
import Select from '../select/select';
import Chart from '../chart/chart';
import { formatDate } from '../../util';
import { MONTHS } from '../../constants'
import Loader from '../loader/loader';
import useStyles from './styles';

const TimeTypes = {
  flightTime: 'flightTime',
  workTime: 'workTime',
}

const getCellTimeData = (timeData, type, year, isPlanned, index) => {
  const currentYear = new Date().getFullYear();

  if (currentYear === year && !isPlanned) {
    return formatDate(timeData.done[year][type][index])
  }

  if (currentYear === year && isPlanned) {
    return formatDate(timeData.plan[year][type][index])
  }

  return formatDate(
    timeData.done[year][type][index],
  ) || formatDate(timeData.plan[year][type][index])
}

function Main(props) {
  const { availableYears, data } = props;
  const { timeData, yearResults } = data;
  const [isPlanned, setIsPlanned] = React.useState(false);
  const history = useHistory();
  const classes = useStyles();

  const redirectToPathMemoized = useCallback((e) => {
    const { year, monthindex } = e.target.dataset;
    if (year) {
      history.push(`/information/${year}`)
    } else {
      history.push(`/information/${availableYears[0]}/${monthindex}`)
    }
  }, [history, availableYears])

  if (!availableYears.length) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg">
      <div>
        <TableContainer
          component={Paper}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.timeCell} rowSpan={2} />
                {availableYears.map((year) => (
                  <TableCell className={classes.timeCell} key={year} colSpan={2}>
                    <Button
                      variant="contained"
                      data-year={year}
                      onClick={redirectToPathMemoized}
                    >
                      { year }
                    </Button>
                    <Select year={year} isPlanned={isPlanned} setIsPlanned={setIsPlanned} />
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {availableYears.map((year) => (
                  <React.Fragment key={year}>
                    <TableCell className={classes.timeCell}>Налет</TableCell>
                    <TableCell className={classes.timeCell}>Рабочее время</TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {MONTHS.map((month, index) => (
                <TableRow key={month}>
                  <TableCell className={classes.timeCell}>
                    <Button variant="contained" data-monthindex={index} onClick={redirectToPathMemoized}>{month}</Button>
                  </TableCell>
                  {availableYears.map((year) => (
                    <React.Fragment key={year}>
                      <TableCell className={classes.timeCell}>
                        {getCellTimeData(timeData, TimeTypes.flightTime, year, isPlanned, index)}
                      </TableCell>
                      <TableCell className={classes.timeCell}>
                        {getCellTimeData(timeData, TimeTypes.workTime, year, isPlanned, index)}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Container className={classes.chartContainer} maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <Chart
                availableYears={availableYears}
                timeData={timeData}
                labels={MONTHS}
                timeType={TimeTypes.flightTime}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <Chart
                availableYears={availableYears}
                timeData={timeData}
                labels={MONTHS}
                timeType={TimeTypes.workTime}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <Chart
                availableYears={availableYears}
                timeData={yearResults}
                labels={availableYears}
                isYearChart
                timeType={TimeTypes.flightTime}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={6} md={6}>
              <Chart
                availableYears={availableYears}
                timeData={yearResults}
                labels={availableYears}
                isYearChart
                timeType={TimeTypes.workTime}
              />
            </Grid>
          </Grid>
        </Container>
      </div>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  flightsData: getFlightsData(state),
  availableYears: getAvailableYears(state),
  data: getTimeData(state),
})

export default connect(mapStateToProps)(Main);
export { MONTHS };
