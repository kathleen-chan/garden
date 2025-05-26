const gameContainer = document.querySelector('.game-container');
const enter = document.getElementById('enter');
const menu = document.getElementById('menu');
const menuBack = document.getElementById('menu-back');
const settingsBtn = document.getElementById('settings-btn');
const settingsPopup = document.getElementById('settings-popup');
const closeSettings = document.querySelector('.close-settings');
const saveSettings = document.querySelector('.settings-save-btn');
const newWorld = document.getElementById('new-world');
const growingWorlds = document.getElementById('growing-worlds');

document.addEventListener('DOMContentLoaded', function() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  document.body.classList.add('custom-cursor-enabled');
  
  // Track mouse movement
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = (e.clientX - 5) + 'px'; 
    cursor.style.top = (e.clientY - 5) + 'px';
  });
});

enter.addEventListener('click', () => transition(gameContainer, menu));
menuBack.addEventListener('click', () => transition(menu, gameContainer));
newWorld.addEventListener('click', () => transition(menu, newWorldPg));
growingWorlds.addEventListener('click', () => transition(menu, growingWorldsPg));

const MAX_WORLDS = 3;
let worlds = JSON.parse(localStorage.getItem('worlds')) || [];

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

// Settings popup
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

function saveWorlds() {
    localStorage.setItem('worlds', JSON.stringify(worlds));
}

// Birb animation
const characters = {
    birb: {
        wingStates: ["characters/birb-wings-middle.png", "characters/birb-wings-high.png"],
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
    const deltaTime = Math.min(timestamp - lastTimestamp, 1000);
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
    requestAnimationFrame(animateCharacters);
});

window.addEventListener('resize', function() {
    activeCharacters.forEach(char => {
        if (char.y > window.innerHeight * characters.birb.maxHeight) {
            char.y = window.innerHeight * characters.birb.maxHeight;
            char.element.style.bottom = `${char.y}px`;
        }
    });
});

