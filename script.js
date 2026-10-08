const menuBtn = document.getElementById("menuBtn");
const menuDropdown = document.getElementById("menuDropdown");

menuBtn.addEventListener("click", function (event) {

    event.stopPropagation();

    menuDropdown.classList.toggle("show");

});


document.addEventListener("click", function () {

    menuDropdown.classList.remove("show");

});

const slides = document.querySelectorAll(".hero-slide");

const heroTitle = document.getElementById("heroTitle");

const heroText = document.getElementById("heroText");

const heroDots = document.getElementById("heroDots");

const heroPrev = document.getElementById("heroPrev");

const heroNext = document.getElementById("heroNext");


const heroData = [

    {
        title: "Salam from untamed vistas",
        text: "Discover the extraordinary beauty of Pakistan."
    },

    {
        title: "Where mountains meet the sky",
        text: "Explore breathtaking landscapes and unforgettable adventures."
    },

    {
        title: "Discover the heart of Pakistan",
        text: "Experience culture, heritage, food and natural beauty."
    }

];


let currentSlide = 0;


/* CREATE DOTS */

slides.forEach(function (_, index) {

    const dot = document.createElement("button");

    if (index === 0) {

        dot.classList.add("active");

    }

    dot.addEventListener("click", function () {

        showSlide(index);

    });

    heroDots.appendChild(dot);

});


function showSlide(index) {

    currentSlide = index;

    slides.forEach(function (slide, i) {

        slide.classList.toggle(
            "active",
            i === index
        );

    });


    heroTitle.textContent =
        heroData[index].title;

    heroText.textContent =
        heroData[index].text;


    document
        .querySelectorAll(".hero-dots button")
        .forEach(function (dot, i) {

            dot.classList.toggle(
                "active",
                i === index
            );

        });

}


/* NEXT */

heroNext.addEventListener("click", function () {

    currentSlide++;

    if (currentSlide >= slides.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

});


/* PREVIOUS */

heroPrev.addEventListener("click", function () {

    currentSlide--;

    if (currentSlide < 0) {

        currentSlide = slides.length - 1;

    }

    showSlide(currentSlide);

});


/* AUTO SLIDER */

setInterval(function () {

    currentSlide++;

    if (currentSlide >= slides.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

}, 6000);


document
    .getElementById("heroExplore")
    .addEventListener("click", function () {

        window.location.href = "explore.html";

    });


const weatherData = {

    Islamabad: {
        temp: 26,
        condition: "Partly Cloudy"
    },

    Karachi: {
        temp: 31,
        condition: "Sunny"
    },

    Lahore: {
        temp: 29,
        condition: "Clear"
    },

    Skardu: {
        temp: 18,
        condition: "Cool & Clear"
    },

    Quetta: {
        temp: 21,
        condition: "Sunny"
    },

    Peshawar: {
        temp: 28,
        condition: "Cloudy"
    }

};


const citySelect =
    document.getElementById("citySelect");

const weatherCity =
    document.getElementById("weatherCity");

const temperature =
    document.getElementById("temperature");

const weatherCondition =
    document.getElementById("weatherCondition");

const topWeatherText =
    document.getElementById("topWeatherText");


citySelect.addEventListener("change", function () {

    const city = citySelect.value;

    const data = weatherData[city];

    weatherCity.textContent = city;

    temperature.textContent =
        data.temp + "°C";

    weatherCondition.textContent =
        data.condition;

    topWeatherText.textContent =
        city + " " + data.temp + "°C";

});


const destinations = [

    {
        name: "Hunza Valley",
        location: "Gilgit-Baltistan",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=900&q=85",
        description: "A beautiful valley surrounded by majestic mountains."
    },

    {
        name: "Skardu",
        location: "Gilgit-Baltistan",
        image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=900&q=85",
        description: "Discover lakes, mountains and unforgettable landscapes."
    },

    {
        name: "Islamabad",
        location: "Capital Territory",
        image: "https://images.unsplash.com/photo-1594235048794-fae8583a4b4b?auto=format&fit=crop&w=900&q=85",
        description: "A peaceful city surrounded by beautiful green hills."
    },

    {
        name: "Lahore",
        location: "Punjab",
        image: "https://images.unsplash.com/photo-1585670149966-b3e8d1d5e4a6?auto=format&fit=crop&w=900&q=85",
        description: "Experience history, culture, food and Mughal heritage."
    },

    {
        name: "Naran Kaghan",
        location: "Khyber Pakhtunkhwa",
        image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85",
        description: "A stunning destination filled with mountains and lakes."
    },

    {
        name: "Swat Valley",
        location: "Khyber Pakhtunkhwa",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=85",
        description: "Known for its green valleys, rivers and scenic beauty."
    }

];


const destinationGrid =
    document.getElementById("destinationGrid");


destinations.forEach(function (place, index) {

    destinationGrid.innerHTML += `

        <article class="destination-card">

            <img
                src="${place.image}"
                alt="${place.name}"
                onerror="this.src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85'"
            >

            <div class="destination-info">

                <h3>
                    ${place.name}
                </h3>

                <p>
                    ${place.description}
                </p>

                <a
                    href="detail.html?id=${index}"
                    class="card-link">

                    Explore ${place.name}
                    →
                    
                </a>

            </div>

        </article>

    `;

});


document
    .getElementById("searchBtn")
    .addEventListener("click", function () {

        window.location.href = "explore.html";

    });

document
    .getElementById("favoriteBtn")
    .addEventListener("click", function () {

        window.location.href =
            "explore.html#favourites";

    });

document
    .getElementById("currencyBtn")
    .addEventListener("click", function () {

        alert(
            "Currency options: PKR, USD, EUR, GBP"
        );

    });


document
    .getElementById("accountBtn")
    .addEventListener("click", function () {

        alert(
            "Sign In feature coming soon."
        );

    });