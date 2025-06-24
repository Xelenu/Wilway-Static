const discoverButton = document.getElementById("discover");
const searchInput = document.getElementById("search");

function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  } else {
    alert("Please enter a search term.");
  }
}

discoverButton.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

async function searchMovies(query) {
  try {
    const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
    alert("Failed to fetch movies. Please try again later.");
  }
}

function displayMovies(movies) {
  resultsContainer.innerHTML = ""; // Clear previous results

  movies.forEach((movie, index) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    // Add fadeIn animation and delay (0.1s * index)
    movieDiv.style.opacity = 0; // start hidden for smooth fade in
    movieDiv.style.animation = `fadeIn 0.4s forwards`;
    movieDiv.style.animationDelay = `${index * 0.1}s`;

    const movieImage = document.createElement("img");
movieImage.src = movie.poster_path
  ? `${IMAGE_BASE_URL}${movie.poster_path}`
  : "https://via.placeholder.com/200x300?text=No+Image";
movieImage.alt = movie.title;
movieImage.draggable = false;

const movieTitle = document.createElement("h2");
movieTitle.textContent = movie.title;

const watchButton = document.createElement("button");
watchButton.textContent = "Watch now!";
watchButton.classList.add("watch-btn");
watchButton.addEventListener("click", () => {
  window.location.href = `player.html?tmdbid=${movie.id}`;
});

    movieDiv.appendChild(movieImage);
    movieDiv.appendChild(movieTitle);
    movieDiv.appendChild(watchButton);

    resultsContainer.appendChild(movieDiv);
  });
}
