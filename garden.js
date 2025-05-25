const gameContainer = document.querySelector('.game-container');
const enter = document.getElementById('enter');
const menu = document.getElementById('menu');
const menuBack = document.getElementById('menu-back');
const settingsBtn = document.getElementById('settings-btn');
const settingsPopup = document.getElementById('settings-popup');
const closeSettings = document.querySelector('.close-settings');
const saveSettings = document.querySelector('.settings-save-btn');
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

        if (toScreen === menu) {
            spawnOpeningCharacters();
        }

        else if (fromScreen === menu) {
            activeCharacters.forEach(char => char.element.remove());
            activeCharacters = [];
        }

        setTimeout(() => {
            toScreen.style.opacity = '1';
        }, 10);
    }, 500);
}

//Settings popup
document.querySelectorAll('.settings-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        settingsPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

closeSettings.addEventListener('click', function () {
    settingsPopup.style.display = 'none';
    document.body.style.overflow = 'auto';
});

saveSettings.addEventListener('click', function () {
    const volume = document.getElementById('volume-control').value;
    localStorage.setItem('gameVolume', volume);

    settingsPopup.style.display = 'none';
    document.body.style.overflow = 'auto';

    showAlert('Settings saved!');
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

// User's created worlds w/ max 3 worlds
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

//Biome image slider
biomePrev.addEventListener('click', () => {
    currentBiomeIndex = (currentBiomeIndex - 1 + biomes.length) % biomes.length;
    updateBiomeDisplay();
});

biomeNext.addEventListener('click', () => {
    currentBiomeIndex = (currentBiomeIndex + 1) % biomes.length;
    updateBiomeDisplay();
});

//Character Animation System
const characters = {
    birb: {
        wingStates: ["characters/birb-wings-middle.png", "characters/birb-wings-high.png", "characters/birb-jump.png"],
        frameWidth: 150,
        frameHeight: 150,
        minSpeed: 0.5,
        maxSpeed: 3,
        changeDirectionInterval: 1000,
        flightHeightVariation: 200,
        minHeight: 0, // from bottom
        maxHeight: 0.7,  // 70% from bottom (near top)
        wingFlapInterval:300
    }
};

let activeCharacters = [];
let lastTimestamp = 0;

function createCharacter(type, startX, startY = null) {
    const character = document.createElement('div');
    character.className = 'character';
    
    // Available height range
    const minY = window.innerHeight * characters[type].minHeight;
    const maxY = window.innerHeight * characters[type].maxHeight;
    
    // Random starting position
    const baseY = startY !== null ? startY : minY + Math.random() * (maxY - minY);
    
    character.style.position = 'fixed';
    character.style.left = `${startX}px`;
    character.style.bottom = `${baseY}px`;
    character.style.zIndex = '10';
    character.style.pointerEvents = 'none';

    // Initialize with random wing state
    const initialWingState = Math.round(Math.random());
    character.style.backgroundImage = `url('${characters[type].wingStates[initialWingState]}')`;
    character.style.width = `${characters[type].frameWidth}px`;
    character.style.height = `${characters[type].frameHeight}px`;
    character.style.backgroundSize = 'contain';
    character.style.backgroundRepeat = 'no-repeat';

    document.body.appendChild(character);
    
    const newChar = {
        element: character,
        type: type,
        direction: Math.random() > 0.5 ? 1 : -1,
        x: startX,
        y: baseY,
        targetY: baseY,
        speed: characters[type].minSpeed + 
               Math.random() * (characters[type].maxSpeed - characters[type].minSpeed),
        lastDirectionChange: 0,
        minY: minY,
        maxY: maxY,
        wingState: initialWingState, // Track current wing state
        lastWingFlap: 0 // Track last wing flap time
    };
    
    activeCharacters.push(newChar);
    return newChar;
}

function animateCharacters(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = Math.min(timestamp - lastTimestamp, 100);
    lastTimestamp = timestamp;

    activeCharacters.forEach(char => {
        if (char.type === 'birb') {
            // Random direction changes
            if (timestamp - char.lastDirectionChange > characters.birb.changeDirectionInterval) {
                if (Math.random() < 0.3) {
                    char.direction *= -1;
                }
                
                char.speed = characters.birb.minSpeed + 
                            Math.random() * (characters.birb.maxSpeed - characters.birb.minSpeed);
                
                char.targetY = char.minY + Math.random() * (char.maxY - char.minY);
                char.lastDirectionChange = timestamp;
            }
            
             if (Math.abs(char.speed) > 0) {
                if (!char.lastWingFlap) char.lastWingFlap = timestamp;
                if (timestamp - char.lastWingFlap > characters.birb.wingFlapInterval) {
                    char.wingState = char.wingState === 0 ? 1 : 0;
                    char.element.style.backgroundImage = `url('${characters.birb.wingStates[char.wingState]}')`;
                    char.lastWingFlap = timestamp;
                }
            }

            char.x += char.speed * char.direction * (deltaTime / 16);
            char.y += (char.targetY - char.y) * 0.05 * (deltaTime / 16);
            
            char.element.style.left = `${char.x}px`;
            char.element.style.bottom = `${char.y}px`;
            
            // Flip sprite and apply animation
            char.element.style.transform = `scaleX(${char.direction})`;
            char.element.classList.toggle('flying', Math.abs(char.speed) > 0);
            
            // Screen edge handling w/ bounce
            if (char.x > window.innerWidth - char.element.offsetWidth) {
                char.direction = -1;
                char.targetY = char.minY + Math.random() * (char.maxY - char.minY);
                char.x = window.innerWidth - char.element.offsetWidth;
            } else if (char.x < 0) {
                char.direction = 1;
                char.targetY = char.minY + Math.random() * (char.maxY - char.minY);
                char.x = 0;
            }
        }
    });

    requestAnimationFrame(animateCharacters);
}

function spawnOpeningCharacters() {
    // Clear existing characters
    activeCharacters.forEach(char => {
        if (char.element && char.element.parentNode) {
            char.element.remove();
        }
    });
    activeCharacters = [];
    
    // Create 3-4 birbs at random positions
    const birbCount = 3 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < birbCount; i++) {
        const startX = Math.random() * (window.innerWidth - 100);
        createCharacter('birb', startX);
    }
}

// Initialize animation on load
window.addEventListener('load', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fly {
            0%, 100% { transform: translateY(0) scaleX(var(--dir, 1)); }
            50% { transform: translateY(-5px) scaleX(var(--dir, 1)); }
        }
        .character {
            transition: transform 0.2s ease;
        }
        .flying {
            animation: fly 0.6s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        requestAnimationFrame(animateCharacters);
    }, 500);
});

window.addEventListener('resize', function() {
    activeCharacters.forEach(char => {
        if (char.y > window.innerHeight * characters.birb.maxHeight) {
            char.y = window.innerHeight * characters.birb.maxHeight;
            char.element.style.bottom = `${char.y}px`;
        }
    });
});

//Initializing
updateBiomeDisplay();
renderWorlds();

