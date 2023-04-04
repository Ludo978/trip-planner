const axios = require('axios');

const key = 'EPD522M1PPpfMxU4wpRBIuNpB4EZJugF';
const id = '30WH4GN1BNP2VME2Z40CNM4S3W3TVHXGNCT5Y5UAAN522BCK';
const secret = 'ZLEDFY2I0WYN3NSRRGZOCJRKYHELOFSEZTUKHUZRCG13UBQ4';

const getEvents = async (req) => {
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${key}&locale=fr-fr`;
  if (req._parsedUrl.query) url += '&' + req._parsedUrl.query;
  const response = await axios.get(url);

  if (!response?.data._embedded?.events)
    return { status: 404, data: { message: 'Aucun événement trouvé' } };

  const events = response.data._embedded.events.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    url: event.url,
    image: event.images[0].url,
    date: event.dates.start.dateTime,
    location: {
      name: event._embedded.venues[0].name,
      address: `${event._embedded.venues[0].address.line1} ${event._embedded.venues[0].postalCode} ${event._embedded.venues[0].city.name}`,
      lat: parseFloat(event._embedded.venues[0].location?.latitude),
      lng: parseFloat(event._embedded.venues[0].location?.longitude),
    },
    price: {
      min: event.priceRanges[0].min,
      max: event.priceRanges[0].max,
    },
  }));

  return { status: 200, data: { events } };
};

const getPlaces = async ({ query }) => {
  if (!query.city)
    return { status: 400, data: { message: 'No city provided' } };
  const url = `https://api.foursquare.com/v2/venues/search?client_id=${id}&client_secret=${secret}&v=20180323&locale=fr&categoryId=4d4b7104d754a06370d81259&near=${query.city}`;
  const response = await axios.get(url);

  if (!response?.data.response?.venues)
    return {
      status: 404,
      data: { message: 'Aucune activitée trouvée' },
    };

  const places = response.data.response.venues.map((place) => ({
    id: place.id,
    name: place.name,
    address: `${place.location.address} ${place.location.postalCode} ${place.location.city}`,
    lat: place.location.lat,
    lng: place.location.lng,
  }));

  return { status: 200, data: { places } };
};

const getSimilar = async ({ params }) => {
  const url = `https://api.foursquare.com/v2/venues/${params.id}/similar?client_id=${id}&client_secret=${secret}&v=20180323&locale=fr`;

  let response;
  try {
    response = await axios.get(url);
  } catch (error) {}

  if (!response?.data?.response?.similarVenues?.items)
    return {
      status: 404,
      data: { message: 'Aucun lieu trouvé' },
    };

  const places = response.data.response.similarVenues.items.map((place) => ({
    id: place.id,
    name: place.name,
    address: `${place.location.address} ${place.location.postalCode} ${place.location.city}`,
    lat: place.location.lat,
    lng: place.location.lng,
  }));

  return { status: 200, data: { places } };
};

module.exports = {
  getEvents,
  getPlaces,
  getSimilar,
};
