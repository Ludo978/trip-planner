const axios = require('axios');

const id = '30WH4GN1BNP2VME2Z40CNM4S3W3TVHXGNCT5Y5UAAN522BCK';
const secret = 'ZLEDFY2I0WYN3NSRRGZOCJRKYHELOFSEZTUKHUZRCG13UBQ4';

const get = async ({ query }) => {
  if (!query.city)
    return { status: 400, data: { message: 'No city provided' } };
  const url = `https://api.foursquare.com/v2/venues/search?client_id=${id}&client_secret=${secret}&v=20180323&locale=fr&categoryId=4bf58dd8d48988d1ee931735&near=${query.city}`;
  const response = await axios.get(url);

  if (!response?.data.response?.venues)
    return { status: 404, data: { message: 'Aucun hotel trouvé' } };

  const hotels = response.data.response.venues.map((hotel) => ({
    id: hotel.id,
    name: hotel.name,
    address: `${hotel.location.address} ${hotel.location.postalCode} ${hotel.location.city}`,
    lat: hotel.location.lat,
    lng: hotel.location.lng,
  }));

  return { status: 200, data: { hotels } };
};

module.exports = {
  get,
};
