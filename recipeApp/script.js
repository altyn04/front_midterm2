const apiKey = "0f2045c0a5a843c6973321fca63a94d1"; 

async function search() {
    // Get a value in the search bar
    const searchFor = document.getElementById("searchBox").value;
    searchFor
        ? generateRecipeList(await fetchRecipes(searchFor)) // Create list of recipes -> if there is search value
        : alert("Please enter your needs=)"); // Show warning if no request is available
}

// Function to get recipes via API
async function fetchRecipes(input) {
    try {// Sends request to get recipes from API
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${input}&number=10`);
        const data = await response.json();  // Gets response in JSON
             return data.results || []; // Return recipe list
    } catch (error) {
            console.error(error);
        return []; // Return an empty list in case of error
    }

    
}
// Extract list of recipes
function generateRecipeList(recipes) {
    const container = document.getElementById("recipeContainer");
    container.innerHTML = '';
    if (recipes.length === 0) {
        container.innerHTML = '<p>Oops! No recipes found.</p>';
                          return; // Issue a message if there are no recipes
    
    }

    // Create elements for each recipe
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeBox = document.createElement('div');
        recipeBox.classList.add('recipeBox');
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = recipe.title;

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.title;



        const viewButton = document.createElement('button');
        viewButton.textContent = "Read Recipe";
        viewButton.onclick = () => displayRecipeDetails(recipe.id);

        recipeBox.appendChild(recipeImage); // Add image
        recipeBox.appendChild(recipeTitle); // Add recipe name
        recipeBox.appendChild(viewButton);  // Add View button
        container.appendChild(recipeBox); 
    }
}

// ID of currently selected recipe
let currentRecipeId = null;
// Show full recipe information
async function displayRecipeDetails(recipeId) {
    currentRecipeId = recipeId;
    const recipeDetails = document.getElementById("recipeDetails");
    const recipeInfo = document.getElementById("recipeInfo");

    recipeDetails.style.display = "block"; 

    const recipeData = await fetchRecipeDetails(recipeId); // Get full recipe details
    if (recipeData) {
        recipeInfo.innerHTML = `
            <h2>${recipeData.title}</h2>
            <img src="${recipeData.image}" alt="${recipeData.title}">
            <p><strong>Ingredients:</strong> ${recipeData.extendedIngredients.map(ing => ing.original).join(', ')}</p>
            
            <p><strong>Step-by-step instructions:</strong> ${recipeData.instructions || "Instructions missing."}</p>
        `;
    }
}

async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


function addToFavorites() {
    if (!currentRecipeId) {
        alert("Please choose your recipe first!");
        return;
    }

    let favorites = getFavorites(); // Get previous favorite recipes
   // If this recipe is not in the favorite
    if (!favorites.includes(currentRecipeId)) {
        favorites.push(currentRecipeId); // Add it to your favorite
        // Save updated favorite list to localStorage
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("This recipe is now in your favorites!");
        returnFavorites(); // Re-show your favorite recipes
    }
}

function getFavorites() {
    // get your favorite recipes from localStorage
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Reissue of favorite recipes
function returnFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    const favorites = getFavorites();
    favoritesContainer.innerHTML = '';  // Clean previous favorite recipes

    favorites.forEach(async (recipeId) => {
        try {
            // Get full details of each favorite recipe
            const recipeData = await fetchRecipeDetails(recipeId);
            if(recipeData) {
                const favoriteBox = document.createElement('div');
                favoriteBox.classList.add('favoriteBox');
                favoriteBox.innerHTML = `
                    <img src="${recipeData.image}" alt="${recipeData.title}">
                    <h3>${recipeData.title}</h3>
                `;
                favoritesContainer.appendChild(favoriteBox);  // Add favorite recipe to the box
            }
        } catch (error) {
            console.error( error);
        }
    });
}

// Show favorite recipes when loading the page
window.addEventListener('load', returnFavorites);

