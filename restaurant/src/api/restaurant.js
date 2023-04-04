const axios = require('axios');

const id = '30WH4GN1BNP2VME2Z40CNM4S3W3TVHXGNCT5Y5UAAN522BCK';
const secret = 'ZLEDFY2I0WYN3NSRRGZOCJRKYHELOFSEZTUKHUZRCG13UBQ4';

const get = async ({ query }) => {
  if (!query.city)
    return { status: 400, data: { message: 'No city provided' } };
  const url = `https://api.foursquare.com/v2/venues/search?client_id=${id}&client_secret=${secret}&v=20180323&locale=fr&categoryId=4d4b7105d754a06374d81259&near=${query.city}`;
  const response = await axios.get(url);

  if (!response?.data.response?.venues)
    return { status: 404, data: { message: 'Aucun restaurant trouvé' } };

  const restaurants = response.data.response.venues.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    address: `${restaurant.location.address} ${restaurant.location.postalCode} ${restaurant.location.city}`,
    lat: restaurant.location.lat,
    lng: restaurant.location.lng,
  }));

  return { status: 200, data: { restaurants } };
};

module.exports = {
  get,
};
