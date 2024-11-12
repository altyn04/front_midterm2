const apiKey = 'd809aae8e795bfe6e2bbe8da7043b905';

// to get elements in HTML -> to enter the name of the city, to display result,  button.
const input = document.querySelector('.input_text');
const main = document.querySelector('#name');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const cloudiness = document.querySelector('.cloudiness');
const icon = document.querySelector('.icon');
const button = document.querySelector('.submit');
const forecastBox = document.querySelector('.forecast');


//When the button is pressed, we get the name of the city, call the function to get the weather
button.addEventListener('click', () => {
  const city = input.value;
  fetchWeather(city);
  input.value = ""; //clear input
});
// Weather data extraction function -> via API
async function fetchWeather(city) {
    try {
        // Get weather data by city via API
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      const data = await response.json();
  
      if (data.cod !== 200) {
        alert("City not found!");
        return;
      }
  // convert the temperature to Celsius,
  // get the name of the city, description, cloudiness percentage
      const temperatureData = (data.main.temp - 273.15).toFixed(1); 
      const cityName = data.name;
      const descData = data.weather[0].description;
      const iconUrl = data.weather[0].icon;
      const cloudPercentage = data.clouds.all;
  // Add weather data to HTML''
      main.innerHTML = cityName;
      description.innerHTML = `Description: ${descData}`;
      temperature.innerHTML = `Temperature: ${temperatureData} °C`;
      cloudiness.innerHTML = `Cloud Percentage: ${cloudPercentage}%`;

      icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconUrl}@2x.png" alt="Weather icon">`;
  // Get coordinates to get  -> Forecast
      const  latitude = data.coord.lat;
      const longitude = data.coord.lon;
      fetchForecast( latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  }
  
// 5-day forecast extraction function -> via API
function fetchForecast( latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${ latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
       .then(data => {
        forecastBox.innerHTML = ''; 
  // Get the data for each day according to -> Forecast data
         data.list.forEach((forecast, index) => {

          if (index % 8 === 0) { 
            const dailyForecast = document.createElement('div');
             dailyForecast.classList.add('forecast-day');
  // Format the date and get the temperature, description, and icon
            const date = new Date(forecast.dt * 1000).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'short'
            });


            const dayTemp = forecast.main.temp.toFixed(1);
            const desc = forecast.weather[0].description;
            const icons = forecast.weather[0].icon;
  //    add the forecast for each day to HTML''
            dailyForecast.innerHTML = 
            ` <p>${date}</p>
              <img src="http://openweathermap.org/img/wn/${icons}@2x.png" alt="${desc} icon">
              <p class="tempDay">${dayTemp} °C</p>
              <p>${desc}</p>
            `;
            forecastBox.appendChild(dailyForecast);
          }
        });
      })


      .catch(error => {
        console.error(error);
      });
  }
  