
//Set  API-key and URL to connect to the API
const API_KEY = '8f02a7856551d49121bbc98f10c6cd91';

const SOURCE_URL = 'https://api.themoviedb.org/3';
const GENRE_API_URL = `${SOURCE_URL}/genre/movie/list?api_key=${API_KEY}`;
const TRENDING_MOVIES_URL = `${SOURCE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

const IMG_SRC_URL = 'https://image.tmdb.org/t/p/w500';

//Select the necessary items -> movie grid search bar etc.
const movieBox = document.getElementById("movie-grid");
const searchInput = document.getElementById("search");
const genresBox = document.getElementById("genres");
const ratingSection = document.getElementById("rating");
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const displayPage = document.getElementById("page-number");


//Save current page and selected genres or categories
let pageActivate = 1;
let selectedGenres = [];

// Download genres and movies
loadGenres();
loadMovies(TRENDING_MOVIES_URL);

// Get genres from API
function loadGenres() {
    fetch(GENRE_API_URL)   // Gets a list of genres from the API
        .then(response => response.json()) // Translates the answer to JSON format
        .then(data => {
            showGenres(data.genres);
        });
}

// Bring genres to the page
function showGenres(genres) {
    // Repetition of each genre
    for (let i = 0; i < genres.length; i++) {  
        const genre = genres[i];
        const genreComponent = document.createElement("span");
        genreComponent.classList.add("genre");  // genre class added
        genreComponent.innerText = genre.name;   // Show genre name


        //Select / Remove genre
        genreComponent.addEventListener("click", () => {
            // If the genre is selected
            if (selectedGenres.includes(genre.id)) { 
                selectedGenres = selectedGenres.filter(id => id !== genre.id); // Removing the genre
                genreComponent.classList.remove("selected");
            } else {
                selectedGenres.push(genre.id);
                genreComponent.classList.add("selected"); // Genre selection
            }
            filterMovies();
        });
        // Add to genres area
        genresBox.appendChild(genreComponent);
    }
}


// Download movies from URL
function loadMovies(url) {
    fetch(url)  // Get movies by-> URL
        .then(response => response.json())   // Translates answer to JSON
        .then(data => {
            displayMovies(data.results);
        });
}


function displayMovies(movies) {
    movieBox.innerHTML = ''; // Clean old movies

    // Show each movie
    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        movieElement.innerHTML = `
            <img src="${poster_path ? IMG_SRC_URL + poster_path : 'https://via.placeholder.com/200x300'}" alt="${title}">
            <h3>${title}</h3>
            <span>Rating: <p>${vote_average}</p></span>
            <p class="overview">${overview}</p>
            <button onclick="showTrailer(${id})">Watch Trailer</button>
        `;

        movieBox.appendChild(movieElement);
    });
}


function showTrailer(id) {
    fetch(`${SOURCE_URL}/movie/${id}/videos?api_key=${API_KEY}`) // Gett movie trailer
        .then(response => response.json())
        .then(data => {
            //find trailers from YouTube 
            const video = data.results.find(video => video.site === 'YouTube');

            // Open a trailer if available or send message if not
            video ? window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank') : alert("Trailer not available");
        })
        .catch(error => console.error(error));
}

// Show outout when type a word in the search field
searchInput.addEventListener("input", async () => {
    const query = searchInput.value;
    if (query) {
        // Download search outputs
        await loadMovies(`${SOURCE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    } else {
        filterMovies();
    }
});


// Filter movies depending on selected genres and rating
ratingSection.addEventListener("change", () => filterMovies());


function filterMovies() {
    let url = `${TRENDING_MOVIES_URL}&page=${pageActivate}`;
    if (selectedGenres.length > 0) { // If genres are selected
        // Add genres to URL
        url += `&with_genres=${selectedGenres.join(',')}`;
    }
    const selectedRating = ratingSection.value;// Get selected rating
    if (selectedRating) { // If the rating is selected
        url += `&vote_average.gte=${selectedRating}`; // Add rating to URL
    }
    // Download movies with new filters
    loadMovies(url);
}

nextBtn.addEventListener("click", () => {
    displayPage.innerText = ++pageActivate;// Show next page
    filterMovies(); // Download movies for a new page
});


previousBtn.addEventListener("click", () => {
    if (pageActivate > 1) {
        displayPage.innerText = --pageActivate; // Show prevoius page
        filterMovies();
    }
});


