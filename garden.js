const gameContainer = document.querySelector('.game-container');
const enter = document.getElementById('enter');
const menu = document.getElementById('menu');
const menuBack = document.getElementById('menu-back');
const newWorld = document.getElementById('new-world');
const newWorldPg = document.getElementById('new-world-pg');
const newWorldBack = document.getElementById('new-world-back');
const growingWorlds = document.getElementById('growing-worlds');
const growingWorldsPg = document.getElementById('growing-worlds-pg');
const growingWorldsBack = document.getElementById('growing-worlds-back');
const newWorldContainer = document.getElementById('new-world-container');
const worldForm = document.getElementById('world-form');
const worldNameInput = document.getElementById('world-name');
const worldsContainer = document.getElementById('worlds-container');
const createWorldBtn = document.getElementById('create-world');
const biomePrev = document.getElementById('biome-prev');
const biomeNext = document.getElementById('biome-next');
const biomeDisplay = document.getElementById('biome-display');
const removeWorldBtn = document.getElementById('remove');

enter.addEventListener('click', () => transition(gameContainer, menu));
menuBack.addEventListener('click', () => transition(menu, gameContainer));
newWorld.addEventListener('click', () => transition(menu, newWorldPg));
newWorldBack.addEventListener('click', () => transition(newWorldPg, menu));
growingWorlds.addEventListener('click', () => transition(menu, growingWorldsPg));
growingWorldsBack.addEventListener('click', () => transition(growingWorldsPg, menu));

const MAX_WORLDS = 3;
let worlds = JSON.parse(localStorage.getItem('worlds')) || [];
let currentBiomeIndex = 0;
let selectedWorldIndex = -1;

const biomes = [
    { name: "field", image: "field.png" },
    { name: "cherry blossom", image: "cherry_blossom.png" },
    { name: "dessert", image: "dessert.png" },
    { name: "snowy mountain", image: "snowy_mountain.png" }
];

// Page transitions
function transition(fromScreen, toScreen) {
    fromScreen.style.opacity = '0';

    setTimeout(() => {
        fromScreen.style.display = 'none';
        toScreen.style.display = 'flex';

        setTimeout(() => {
            toScreen.style.opacity = '1';
        }, 10);
    }, 500);
}

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
    transition(newWorldPg, growingWorldsPg);
}

// Created worlds in growing worlds
function renderWorlds() {
    worldsContainer.innerHTML = '';

    if (worlds.length === 0) {
        worldsContainer.innerHTML = '<div class="empty-message">no worlds yet - create one!</div>';
        removeWorldBtn.style.display = 'none';
        return;
    }

    removeWorldBtn.style.display = 'block';
    const gridContainer = document.createElement('div');
    gridContainer.className = 'worlds-grid';

    worlds.forEach((world, index) => {
        const worldBox = document.createElement('div');
        worldBox.className = 'world-box';
        if (index === selectedWorldIndex) {
            worldBox.classList.add('selected');
        }
        worldBox.dataset.index = index;
        worldBox.innerHTML = `<img src="${world.biomeImage}" alt="${world.biome}" class="world-image">
            <div class="world-info">
            <div class="world-title">${world.name}</div>
            <div class="world-biome">${world.biome}</div>
            <button type="submit" class="enter-world" id="enter-world">enter world</button>
            </div>`;
        worldBox.addEventListener('click', function () {
            if (selectedWorldIndex === index) {
                this.classList.remove('selected');
                selectedWorldIndex = -1;
            } else {
                document.querySelectorAll('.world-box').forEach(box => {
                    box.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedWorldIndex = index;
            }
        });

        gridContainer.appendChild(worldBox);
    });

    worldsContainer.appendChild(gridContainer);

    document.querySelector('.world-counter').textContent = `${worlds.length}/${MAX_WORLDS} worlds`;
}

function showAlert(message) {
    let alertBox = document.querySelector('.custom-alert');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';
        document.body.appendChild(alertBox);
    }

    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 2000);
}

// Remove selected world
removeWorldBtn.addEventListener('click', function () {
    if (selectedWorldIndex === -1) {
        showAlert('Please select a world first by clicking on it');
        return;
    }

    if (confirm('Are you sure you want to remove this world?')) {
        worlds.splice(selectedWorldIndex, 1);
        saveWorlds();
        renderWorlds();
        selectedWorldIndex = -1;

        renderWorlds();
        
        if (worlds.length === 0) {
            document.querySelector('.world-counter').textContent = '';
        }
    }
});

function saveWorlds() {
    localStorage.setItem('worlds', JSON.stringify(worlds));
}

createWorldBtn.addEventListener('click', createNewWorld);
worldNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') createNewWorld();
});

biomePrev.addEventListener('click', () => {
    currentBiomeIndex = (currentBiomeIndex - 1 + biomes.length) % biomes.length;
    updateBiomeDisplay();
});

biomeNext.addEventListener('click', () => {
    currentBiomeIndex = (currentBiomeIndex + 1) % biomes.length;
    updateBiomeDisplay();
});

updateBiomeDisplay();
renderWorlds();

