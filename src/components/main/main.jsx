import React from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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

const TimeTypes = {
  flightTime: 'flightTime',
  workTime: 'workTime',
}

const TableCellStyled = withStyles({
  root: {
    border: '1px solid',
    textAlign: 'center',
  },
})(TableCell);

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    marginTop: theme.spacing(10),
  },
}));

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
                <TableCellStyled />
                {availableYears.map((year) => (
                  <TableCellStyled align="center" key={year} colSpan={2} style={{}}>
                    <Button
                      variant="contained"
                      onClick={() => history.push(`/information/${year}`)}
                    >
                      { year }
                    </Button>
                    <Select year={year} isPlanned={isPlanned} setIsPlanned={setIsPlanned} />
                  </TableCellStyled>
                ))}
              </TableRow>
              <TableRow>
                <TableCellStyled />
                {availableYears.map((year) => (
                  <React.Fragment key={year}>
                    <TableCellStyled> Налет </TableCellStyled>
                    <TableCellStyled> Рабочее время </TableCellStyled>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {MONTHS.map((month, index) => (
                <TableRow key={month}>
                  <TableCellStyled align="center">
                    <Button variant="contained" onClick={() => history.push(`/information/${availableYears[0]}/${index}`)}>{month}</Button>
                  </TableCellStyled>
                  {availableYears.map((year) => (
                    <React.Fragment key={year}>
                      <TableCellStyled align="center">
                        {getCellTimeData(timeData, TimeTypes.flightTime, year, isPlanned, index)}
                      </TableCellStyled>
                      <TableCellStyled align="center">
                        {
                          getCellTimeData(timeData, TimeTypes.workTime, year, isPlanned, index)
                                            }
                      </TableCellStyled>
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
