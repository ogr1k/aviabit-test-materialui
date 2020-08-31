import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { formatDate } from '../../util';

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

const getDateWithEnoughSymbols = (data) => data.toString().padStart(2, 0)

const getFormattedData = (date) => {
  const dt = new Date(date);

  return `${getDateWithEnoughSymbols(dt.getDate())}.${getDateWithEnoughSymbols(dt.getMonth() + 1)}.${dt.getFullYear()}
  ${getDateWithEnoughSymbols(dt.getHours())}:${getDateWithEnoughSymbols(dt.getMinutes())}`;
}

const getFormattedDestination = (name, airport) => {
  const result = name.split('(');

  return result[airport ? 1 : 0].replace(/[)]/g, '');
}

const FlightCard = (props) => {
  const classes = useStyles();
  const { flightData } = props;

  if (!flightData) {
    return null;
  }

  const {
    pln, dateFlight, flight, plnType, takeoff, landing,
    timeFlight, timeBlock, timeNight, timeBiologicalNight, timeWork,
  } = flightData;
  const { name: takeoffName, lat: takeoffLat, long: takeoffLong } = takeoff;
  const { name: landingName, lat: landingLat, long: landingLong } = landing;

  return (
    <Card className={classes.cardContainer}>
      <CardContent className={classes.root}>
        <Typography variant="h6" gutterBottom className={classes.cardHeader}>
          {`${getFormattedData(dateFlight)}`}
        </Typography>
        <Box className={classes.box}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            <Tooltip title="Тип самолета">
              <span>{plnType}</span>
            </Tooltip>
          </Typography>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            <Tooltip title="Бортовой номер">
              <span>{pln}</span>
            </Tooltip>
          </Typography>
          <Typography className={classes.title} color="primary" gutterBottom>
            <Tooltip title="Номер рейса">
              <span>{flight}</span>
            </Tooltip>
          </Typography>
        </Box>
        <Divider />
        <Box className={clsx(classes.destinationBox, classes.box)}>
          <Box className={classes.flight}>
            <Typography color="textSecondary">Вылет:</Typography>
            <Tooltip title={`${takeoffLat} / ${takeoffLong}`}>
              <Typography color="textSecondary">
                {getFormattedDestination(takeoffName)}
              </Typography>
            </Tooltip>
            <Typography color="textSecondary">
              {getFormattedDestination(takeoffName, true)}
            </Typography>
          </Box>
          <Box>
            <Typography color="textSecondary">Посадка:</Typography>
            <Tooltip title={`${landingLat} / ${landingLong}`}>
              <Typography color="textSecondary">
                {getFormattedDestination(landingName)}
              </Typography>
            </Tooltip>
            <Typography color="textSecondary">
              {getFormattedDestination(landingName, true)}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box className={classes.box}>
          <Typography color="textSecondary">
            Время налета: {formatDate(timeFlight)}
          </Typography>
          <Typography color="textSecondary">
            Полетное время: {formatDate(timeBlock)}
          </Typography>
          <Typography color="textSecondary">
            Ночное летное время: {formatDate(timeNight)}
          </Typography>
          <Typography color="textSecondary">
            Биологическая ночь: {formatDate(timeBiologicalNight)}
          </Typography>
          <Typography color="textSecondary">
            Рабочее время: {formatDate(timeWork)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FlightCard;
