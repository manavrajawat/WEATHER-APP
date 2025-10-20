const userTab = document.querySelector("[data-userWeather]"); 
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector("[weather-container]");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingscreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//intially kin variable ki need

let oldTab = userTab;
const  API_KEY = "65815e618876855a2b226c5b8e0cc028";
oldTab.classList.add("current-tab"); 
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
           //main pahela search vala tab par tha 
           searchForm.classList.remove("active");
           userInfoContainer.classList.remove("active");
           getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingscreen.classList.add("active");

    //API CALL
    try{
        const response = await fetch(
           //`https://api.weatherapi.com/v1/current.json?key=b74f0aa7b9ae43e2a52103029252102&q=${lat},${lon}&aqi=yes`
            //`http://api.weatherapi.com/v1/current.json?key=b74f0aa7b9ae43e2a52103029252102&q=q=48.8567,2.3508&aqi=yes`
             `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json(); 

        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingscreen.classList.remove("active");
        //HW
    }
}
function renderWeatherInfo(weatherInfo) {
    //firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object put in UI element
 //cityName.textContent = weatherInfo.location.name;
//countryIcon.textContent = weatherInfo.location.country;  // Assuming you want the country name
//desc.textContent = weatherInfo.current.condition.text;
//weatherIcon.src = weatherInfo.current.condition.icon;
//temp.textContent = `${weatherInfo.current.temp_c}°C`;
//humidity.textContent = `${weatherInfo.current.humidity}%`;
//cloudness.textContent = `${weatherInfo.current.cloud}%`;
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudness.innerText = weatherInfo?.clouds?.all; 

} 


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw
    }
}
function showPosition(position) {
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-serchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
   let cityName = searchInput.value.trim();

   if(cityName === "")
    return;
else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingscreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch( 
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);    
        
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
         renderWeatherInfo(data);
    }
    catch(err){

    }
}
