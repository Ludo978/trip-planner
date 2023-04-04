const axios = require('axios');

const id = '30WH4GN1BNP2VME2Z40CNM4S3W3TVHXGNCT5Y5UAAN522BCK';
const secret = 'ZLEDFY2I0WYN3NSRRGZOCJRKYHELOFSEZTUKHUZRCG13UBQ4';

const get = async ({ query }) => {
  if (!query.city)
    return { status: 400, data: { message: 'No city provided' } };
  const url = `https://api.foursquare.com/v2/venues/search?client_id=${id}&client_secret=${secret}&v=20180323&locale=fr&categoryId=4d4b7105d754a06379d81259&near=${query.city}`;
  const response = await axios.get(url);

  if (!response?.data.response?.venues)
    return { status: 404, data: { message: 'Aucun transport trouvé' } };

  const transports = response.data.response.venues.map((transport) => ({
    id: transport.id,
    name: transport.name,
    address: `${transport.location.address} ${transport.location.postalCode} ${transport.location.city}`,
    lat: transport.location.lat,
    lng: transport.location.lng,
  }));

  return { status: 200, data: { transports } };
};

module.exports = {
  get,
};
