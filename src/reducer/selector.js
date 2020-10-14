import { createSelector } from 'reselect';

const MONTHS_QUANTITY = 12;

export const getFlightsData = (state) => state.flightsData;

export const getAvailableYears = createSelector(
  getFlightsData,
  (flightsData) => {
    const dateSet = new Set();

    flightsData.forEach((flight) => {
      dateSet.add(new Date(flight.dateFlight).getFullYear())
    })

    return [...dateSet].sort((a, b) => a - b);
  },
)

export const getTimeData = createSelector(
  getFlightsData,
  getAvailableYears,
  (flightsData, availableYears) => {
    const timeData = {
      done: {},
      plan: {},
    };

    const yearResults = {
      done: {
        flightTime: Array(availableYears.length).fill(0),
        workTime: Array(availableYears.length).fill(0),
      },
      plan: {
        flightTime: Array(availableYears.length).fill(0),
        workTime: Array(availableYears.length).fill(0),
      },
    };

    const emptyMonthsArray = Array(MONTHS_QUANTITY).fill(0);

    availableYears.forEach((year) => {
      timeData.done[year] = {
        flightTime: [...emptyMonthsArray],
        workTime: [...emptyMonthsArray],
      };
      timeData.plan[year] = {
        flightTime: [...emptyMonthsArray],
        workTime: [...emptyMonthsArray],
      };
    });

    flightsData.forEach((element) => {
      const year = new Date(element.dateFlight).getFullYear();
      const month = new Date(element.dateFlight).getMonth();
      const index = availableYears.findIndex((item) => item === year);

      if (element.type) {
        yearResults.plan.flightTime[index] += element.timeFlight;
        yearResults.plan.workTime[index] += element.timeWork;
        timeData.plan[year].flightTime[month] += element.timeFlight;
        timeData.plan[year].workTime[month] += element.timeWork;
      } else {
        yearResults.done.flightTime[index] += element.timeFlight;
        yearResults.done.workTime[index] += element.timeWork;
        timeData.done[year].flightTime[month] += element.timeFlight;
        timeData.done[year].workTime[month] += element.timeWork;
      }
    })

    return {
      yearResults, timeData,
    };
  },
)

const getMonthAndYear = (state, year, month) => ({ year, month })

export const getPeriodData = createSelector(
  getFlightsData,
  getMonthAndYear,
  (flightsData, monthAndYear) => {
    const { year, month } = monthAndYear;

    let interimResult;

    if (month) {
      interimResult = flightsData
        .filter((element) => {
          const date = new Date(element.dateFlight)
          return date
            .getFullYear() === Number(year) && date.getMonth() === Number(month)
        })
    } else {
      interimResult = flightsData
        .filter((element) => {
          const date = new Date(element.dateFlight)
          return date
            .getFullYear() === Number(year)
        })
    }

    const result = {
      done: [],
      plan: [],
    }

    interimResult
      .sort((a, b) => new Date(a.dateFlight) - new Date(b.dateFlight))
      .forEach((element) => (
        element.type
          ? result.plan.push(element)
          : result.done.push(element)));

    return result;
  },
)
