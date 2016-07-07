import _ from 'lodash';
const apiKey = 'AIzaSyCgmd99-7ZlYrAnKD7GpwMMsR48W8fqVdQ';
const rootUrl = `http://api.openweathermap.org/data/2.5/weather?APPID=${apiKey}&units=metric`;

export default (latitude, longitude) => {
  const url = `${rootUrl}&lat=${latitude}&lon=${longitude}`;

  return fetch(url).then(response => {
    return response.json();
  }).then(json => {
    return {
      city: json.name,
      temperature: json.main.temp,
      description: _.capitalize(json.weather[0].description),
    };
  });
};
