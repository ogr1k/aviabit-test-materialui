const http = require('http');

const MockData = {
  flights: ['AB-3377', 'AB-3378', 'AB-3379'],
  plnType: ['A-320', 'B-757-200', 'B-757-300'],
  minTimeFlight: 3600,
  maxTimeFlight: 43200,
  timeFlightAndBlockDifference: 900,
  maxApproxNightDuration: 36000,
  minApproxNightDuration: 24000,
  timeExceptBlockTime: 10800,
  airports: [{
    name: 'Томск(Богашево)',
    lat: 56.38333333,
    long: 85.2,
  },
  {
    name: 'Нячанг(Камрань Интл)',
    lat: 11.99705555,
    long: 109.21944444,
  },
  {
    name: 'Москва(Шереметьево)',
    lat: 55.972778000000,
    long: 37.414722000000,
  },
  {
    name: 'Новосибирск(Толмачево)',
    lat: 55.010000000000,
    long: 82.650000000000,
  },
  {
    name: 'Санкт-Петербург(Пулково)',
    lat: 59.939039000000,
    long: 30.315785000000,
  }],
}

const PlaneNumber = {
  'A-320': 'XXXAK',
  'B-757-200': 'XXXAB',
  'B-757-300': 'XXXAC',
}

function getRandomArrayItem(array) {
  const rand = Math.random() * array.length;
  return array[Math.floor(rand)];
}

function getRandomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function getRandomDate(start) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const currentDatePlusYear = new Date(year + 2, month, day);

  return new Date(start.getTime() + Math.random()
      * (currentDatePlusYear.getTime() - start.getTime()));
}

function setIsPlanned(date) {
  return new Date() > date ? 0 : 1;
}

function getRandomLandingAirport(takeoff) {
  const index = MockData.airports.indexOf(takeoff);

  const airports = [...MockData.airports];
  airports.splice(index, 1);

  return getRandomArrayItem(airports);
}

const getData = () => {
  const data = [];

  for (let i = 0; i < 550; i++) {
    const plnType = getRandomArrayItem(MockData.plnType);
    const dateFlight = getRandomDate(new Date(2018, 0, 1));
    const timeFlight = getRandomInteger(MockData.minTimeFlight, MockData.maxTimeFlight);
    const timeBlock = timeFlight + MockData.timeFlightAndBlockDifference;
    const timeBiologicalNight = getRandomInteger(
      MockData.maxApproxNightDuration,
      MockData.minApproxNightDuration,
    );
    const takeoff = getRandomArrayItem(MockData.airports);

    data.push({
      dateFlight: dateFlight.toISOString(),
      flight: getRandomArrayItem(MockData.flights),
      plnType,
      pln: PlaneNumber[plnType],
      timeFlight,
      timeBlock,
      timeBiologicalNight,
      timeNight: getRandomInteger(0, timeBiologicalNight),
      timeWork: timeBlock + MockData.timeExceptBlockTime,
      type: setIsPlanned(dateFlight),
      takeoff,
      landing: getRandomLandingAirport(takeoff),
    })
  }

  return data
}

const data = getData();

http.createServer((request, res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/html; charset=utf-8',
  })

  res.end(JSON.stringify(data));
}).listen(3001, '127.0.0.1', () => {
  console.log('Сервер начал прослушивание запросов');
});
