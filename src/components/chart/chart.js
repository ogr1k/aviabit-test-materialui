import React, { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { FormControl, Box } from '@material-ui/core';
import Select from '@material-ui/core/Select';

const TimeTypes = {
  flightTime: 'flightTime',
  workTime: 'workTime',
}

const doneDataTemplate = {
  label: 'Выполнено',
  backgroundColor: 'green',
  borderColor: 'black',
  borderWidth: 2,
}

const planDataTemplate = {
  label: 'Запланировано',
  backgroundColor: 'blue',
  borderColor: 'black',
  borderWidth: 2,
}

const formatDate = (seconds) => seconds.map((element) => Math.ceil(element / 3600))

const getDataSets = (pickedYear, timeData, flag, isYearChart) => {
  if (isYearChart) {
    return [
      {
        ...doneDataTemplate,
        data: formatDate(timeData.done[flag]),
      },
      {
        ...planDataTemplate,
        data: formatDate(timeData.plan[flag]),
      },
    ]
  }

  const doneData = {
    ...doneDataTemplate,
    data: formatDate([...timeData.done[pickedYear][flag]]),
  }

  const planData = {
    ...planDataTemplate,
    data: formatDate([...timeData.plan[pickedYear][flag]]),
  }

  const currentYear = new Date().getFullYear();

  switch (true) {
    case pickedYear === currentYear:
      return [doneData, planData];
    case pickedYear < currentYear:
      return [doneData];
    case pickedYear > currentYear:
      return [planData];
    default:
      break;
  }

  return null;
}

const Chart = memo((props) => {
  const {
    timeData, availableYears, labels, timeType, isYearChart,
  } = props;

  const [pickedYear, setPickedYear] = React.useState(availableYears[0]);

  const handleChange = (event) => {
    setPickedYear(Number(event.target.value));
  };

  const chartData = {
    labels,
    datasets: getDataSets(pickedYear, timeData, timeType, isYearChart),
  }

  const timeTypeText = timeType === TimeTypes.flightTime ? 'полетное время' : 'рабочее время'
  const monthTitleText = `Выполненное/запланированное ${timeTypeText} в часах за ${pickedYear} г.`;
  const yearTitleText = `Выполненное/запланированное ${timeTypeText} в часах по годам`;

  return (
    <div>
      { isYearChart
        ? null
        : (
          <Box>
            <FormControl>
              <Select
                native
                onChange={handleChange}
                defaultValue={pickedYear}
              >
                {availableYears.map(
                  (year) => (
                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>
                  ),
                )}
              </Select>
            </FormControl>
          </Box>
        )}
      <div style={{ height: '40vh' }}>
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: true,
              text: isYearChart ? yearTitleText : monthTitleText,
              fontSize: 11,
            },
            legend: {
              display: true,
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                },
              }],
            },
          }}
        />
      </div>
    </div>
  )
})

export default Chart;
