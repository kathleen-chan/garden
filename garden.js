const gameContainer = document.querySelector('.game-container');
const enter = document.getElementById('enter');
const menu = document.getElementById('menu');
const menuBack = document.getElementById('menu-back');
const newGarden = document.getElementById('new-garden');
const newGardenPg = document.getElementById('new-garden-pg');
const newGardenBack = document.getElementById('new-garden-back');
const growingGardens = document.getElementById('growing-gardens');
const growingGardensPg = document.getElementById('growing-gardens-pg');
const growingGardensBack = document.getElementById('growing-gardens-back');
const newWorldContainer = document.getElementById('new-world-container');
const worldForm = document.getElementById('world-form');
const worldNameInput = document.getElementById('world-name');
const worldsContainer = document.getElementById('worlds-container');
const createWorldBtn = document.getElementById('create-world');
const biomePrev = document.getElementById('biome-prev');
const biomeNext = document.getElementById('biome-next');
const biomeDisplay = document.getElementById('biome-display');
const removeGardenBtn = document.getElementById('remove');

enter.addEventListener('click', () => transition(gameContainer, menu));
menuBack.addEventListener('click', () => transition(menu, gameContainer));
newGarden.addEventListener('click', () => transition(menu, newGardenPg));
newGardenBack.addEventListener('click', () => transition(newGardenPg, menu));
growingGardens.addEventListener('click', () => transition(menu, growingGardensPg));
growingGardensBack.addEventListener('click', () => transition(growingGardensPg, menu));

const MAX_GARDENS = 5;
let gardens = JSON.parse(localStorage.getItem('gardens')) || [];
let currentBiomeIndex = 0;
let selectedGardenIndex = -1;

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

// Create new garden
function createNewWorld() {
    if (gardens.length >= MAX_GARDENS) {
        showAlert(`Maximum of ${MAX_GARDENS} gardens reached! Please remove one first.`);
        return;
    }

    const name = worldNameInput.value.trim();
    if (name === '') {
        showAlert('Please enter a garden name');
        return;
    }

    const newWorld = {
        name: name,
        biome: biomes[currentBiomeIndex].name,
        biomeImage: biomes[currentBiomeIndex].image
    };

    gardens.push(newWorld);
    saveGardens();
    renderGardens();
    worldNameInput.value = '';
    transition(newGardenPg, growingGardensPg);
}

// Created gardens in growing gardens
function renderGardens() {
    worldsContainer.innerHTML = '';

    if (gardens.length === 0) {
        worldsContainer.innerHTML = '<div class="empty-message">no gardens yet - create one!</div>';
        removeGardenBtn.style.display = 'none';
        return;
    }

    removeGardenBtn.style.display = 'block';
    const gridContainer = document.createElement('div');
    gridContainer.className = 'gardens-grid';

    gardens.forEach((world, index) => {
        const worldBox = document.createElement('div');
        worldBox.className = 'world-box';
        if (index === selectedGardenIndex) {
            worldBox.classList.add('selected');
        }
        worldBox.dataset.index = index;
        worldBox.innerHTML = `<img src="${world.biomeImage}" alt="${world.biome}" class="garden-image">
            <div class="world-info">
            <div class="world-title">${world.name}</div>
            <div class="world-biome">${world.biome}</div>
            </div>`;
        worldBox.addEventListener('click', function () {
            if (selectedGardenIndex === index) {
                this.classList.remove('selected');
                selectedGardenIndex = -1;
            } else {
                document.querySelectorAll('.world-box').forEach(box => {
                    box.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedGardenIndex = index;
            }
        });

        gridContainer.appendChild(worldBox);
    });

    worldsContainer.appendChild(gridContainer);

    document.querySelector('.garden-counter').textContent = `${gardens.length}/${MAX_GARDENS} gardens`;
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

// Remove selected garden
removeGardenBtn.addEventListener('click', function () {
    if (selectedGardenIndex === -1) {
        showAlert('Please select a garden first by clicking on it');
        return;
    }

    if (confirm('Are you sure you want to remove this garden?')) {
        gardens.splice(selectedGardenIndex, 1);
        saveGardens();
        renderGardens();
        selectedGardenIndex = -1;
    }
});

function saveGardens() {
    localStorage.setItem('gardens', JSON.stringify(gardens));
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
renderGardens();

