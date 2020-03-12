'use strict';
import { schedule } from './main-module';
import { stopId } from './stops-module';

const apiUrl = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

const getStopData = (id) => {
  return `{
    stop(id: "HSL:${id}") {
      name
      stoptimesWithoutPatterns {
        scheduledArrival
        realtimeArrival
        arrivalDelay
        scheduledDeparture
        realtimeDeparture
        departureDelay
        realtime
        realtimeState
        serviceDay
        headsign
        trip {
          routeShortName
          tripHeadsign
        }
      }
    }
  }`;
};

const getTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) - (hours * 60);
  // add leading zero to minutes string if needed
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

// make an array out of received data
const makeArray = async (result) => {

  const stop = await result.data.stop;
  console.log('stops', stop);
  for (let i = 0; i < 4; i++) {
    const ride = await stop.stoptimesWithoutPatterns[i];
    let row = {
      time: getTime(ride.scheduledDeparture),
      line: ride.trip.routeShortName,
      destination: ride.headsign !== null ? ride.headsign : ride.trip.tripHeadsign,
      stop: stop.name
    };
    schedule.push(row);
  };
  schedule.sort((a, b) => (a.time > b.time) ? 1 : -1);
};

// Fetch data from HSL
const fetchData = async (i) => {
  let response;
  response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/graphql',
    },
    body: getStopData(stopId[i])
  });
  let data = await response.json();

  makeArray(data);
  return data;
};

export { fetchData };