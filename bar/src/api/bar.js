const axios = require('axios');

const id = '30WH4GN1BNP2VME2Z40CNM4S3W3TVHXGNCT5Y5UAAN522BCK';
const secret = 'ZLEDFY2I0WYN3NSRRGZOCJRKYHELOFSEZTUKHUZRCG13UBQ4';

const get = async ({ query }) => {
  if (!query.city)
    return { status: 400, data: { message: 'No city provided' } };
  const url = `https://api.foursquare.com/v2/venues/search?client_id=${id}&client_secret=${secret}&v=20180323&locale=fr&categoryId=4bf58dd8d48988d116941735&near=${query.city}`;
  const response = await axios.get(url);

  if (!response?.data.response?.venues)
    return { status: 404, data: { message: 'Aucun bar trouvé' } };

  const bars = response.data.response.venues.map((bar) => ({
    id: bar.id,
    name: bar.name,
    address: `${bar.location.address} ${bar.location.postalCode} ${bar.location.city}`,
    lat: bar.location.lat,
    lng: bar.location.lng,
  }));

  return { status: 200, data: { bars } };
};

module.exports = {
  get,
};
