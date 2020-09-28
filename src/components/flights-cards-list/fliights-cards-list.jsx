import React, {
  memo, useCallback, useState, useEffect,
} from 'react';
import {
  Button, Container, Grid, Typography,
} from '@material-ui/core';
import useStyles from './styles';
import FlightCard from '../flight-card/flight-card';

const DEFAULT_MAX_CARDS = 6;

const FlightsCardsList = memo((props) => {
  const {
    flights, type, pickedMonth, pickedYear,
  } = props;

  const classes = useStyles();

  const [maxElements, setMaxElements] = useState(DEFAULT_MAX_CARDS);

  useEffect(() => {
    setMaxElements(DEFAULT_MAX_CARDS);
  }, [pickedMonth, pickedYear]);

  const incrementMaxElementsMemoized = useCallback(() => {
    setMaxElements(maxElements + DEFAULT_MAX_CARDS)
  }, [setMaxElements, maxElements])

  if (!flights.length) {
    return null;
  }

  return (
    <>
      <Container className={classes.cardContainer} maxWidth="md">
        <Typography variant="h5">
          {type}:
        </Typography>
        <Grid container spacing={1}>
          {flights.slice(0, maxElements).map((flight) => (
            <Grid item xs={12} sm={6} lg={4} md={4} key={flight.timeFlight}>
              <FlightCard flightData={flight} />
            </Grid>
          ))}
        </Grid>
      </Container>
      {maxElements < flights.length
        && (
        <Button
          variant="contained"
          className={classes.showMoreButton}
          onClick={incrementMaxElementsMemoized}
        >
          Показать еще
        </Button>
        )}
    </>
  )
});

export default FlightsCardsList;
