const newWorldPg = document.getElementById('new-world-pg');
const newWorldBack = document.getElementById('new-world-back');
const newWorldContainer = document.getElementById('new-world-container');
const worldForm = document.getElementById('world-form');
const worldNameInput = document.getElementById('world-name');
const createWorldBtn = document.getElementById('create-world');
const biomePrev = document.getElementById('biome-prev');
const biomeNext = document.getElementById('biome-next');
const biomeDisplay = document.getElementById('biome-display');

let currentBiomeIndex = 0;
const biomes = [
    { name: "field", image: "field.png" },
    { name: "cherry blossom", image: "cherry_blossom.png" },
    { name: "dessert", image: "dessert.png" },
    { name: "snowy mountain", image: "snowy_mountain.png" }
];

//Biome image slider
biomePrev.addEventListener('click', () => {
    currentBiomeIndex = (currentBiomeIndex - 1 + biomes.length) % biomes.length;
    updateBiomeDisplay();
});

biomeNext.addEventListener('click', () => {
    currentBiomeIndex = (currentBiomeIndex + 1) % biomes.length;
    updateBiomeDisplay();
});

// Update biome pictures
function updateBiomeDisplay() {
    biomeDisplay.src = biomes[currentBiomeIndex].image;
    biomeDisplay.alt = biomes[currentBiomeIndex].name;
}

// Create new world
function createNewWorld() {
    if (worlds.length >= MAX_WORLDS) {
        showAlert(`Maximum of ${MAX_WORLDS} worlds reached! Please remove one first.`);
        return;
    }

    const name = worldNameInput.value.trim();
    if (name === '') {
        showAlert('Please enter a world name');
        return;
    }

    const newWorld = {
        name: name,
        biome: biomes[currentBiomeIndex].name,
        biomeImage: biomes[currentBiomeIndex].image
    };

    worlds.push(newWorld);
    saveWorlds();
    renderWorlds();
    worldNameInput.value = '';
    currentBiomeIndex = 0;
    updateBiomeDisplay();
    transition(newWorldPg, growingWorldsPg);
}

createWorldBtn.addEventListener('click', createNewWorld);
worldNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') createNewWorld();
});

newWorldBack.addEventListener('click', () => transition(newWorldPg, menu));

//Initializing
updateBiomeDisplay();