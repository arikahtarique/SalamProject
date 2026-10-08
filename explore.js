const places = [

    {
        name: "Hunza Valley",
        location: "Gilgit-Baltistan",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1000&q=85",
        text: "A peaceful valley surrounded by some of Pakistan's most beautiful mountains."
    },

    {
        name: "Skardu",
        location: "Gilgit-Baltistan",
        image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1000&q=85",
        text: "A spectacular destination famous for lakes, mountains and beautiful scenery."
    },

    {
        name: "Islamabad",
        location: "Capital Territory",
        image: "https://images.unsplash.com/photo-1594235048794-fae8583a4b4b?auto=format&fit=crop&w=1000&q=85",
        text: "A modern and peaceful capital surrounded by the Margalla Hills."
    },

    {
        name: "Lahore",
        location: "Punjab",
        image: "https://images.unsplash.com/photo-1585670149966-b3e8d1d5e4a6?auto=format&fit=crop&w=1000&q=85",
        text: "A city rich in history, food, architecture and cultural heritage."
    },

    {
        name: "Naran Kaghan",
        location: "Khyber Pakhtunkhwa",
        image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85",
        text: "Beautiful valleys, rivers and lakes make Naran a popular destination."
    },

    {
        name: "Swat Valley",
        location: "Khyber Pakhtunkhwa",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=85",
        text: "Known for its green mountains, rivers and peaceful natural environment."
    }

];


const grid =
    document.getElementById("exploreGrid");


places.forEach(function(place, index) {

    grid.innerHTML += `

        <article class="explore-card">

            <img
                src="${place.image}"
                alt="${place.name}"
                onerror="this.src='https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85'"
            >

            <div class="explore-card-content">

                <h3>
                    ${place.name}
                </h3>

                <div class="explore-location">

                    <i class="fa-solid fa-location-dot"></i>

                    ${place.location}

                </div>

                <p>
                    ${place.text}
                </p>

                <a
                    href="detail.html?id=${index}"
                    class="detail-btn">

                    View Details
                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </div>

        </article>

    `;

});