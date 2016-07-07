import _ from 'lodash';
const apiKey = 'a5b2a248c100aca6841ba26d2f1587b8';
const rootUrl = `http://api.openweathermap.org/data/2.5/weather?APPID=${apiKey}&units=metric`;

export default (latitude, longitude) => {
  const url = `${rootUrl}&lat=${latitude}&lon=${longitude}`;

  return fetch(url).then(response => {
    return response.json();
  }).then(json => {
    console.log(json);
    return {
      city: json.name,
      temperature: json.main ? json.main.temp : -1,
      description: json.weather ? _.capitalize(json.weather[0].description) : '',
    };
  });
};
