const growingWorldsPg = document.getElementById('growing-worlds-pg');
const growingWorldsBack = document.getElementById('growing-worlds-back');
const worldsContainer = document.getElementById('worlds-container');
const removeWorldBtn = document.getElementById('remove');

let selectedWorldIndex = -1;

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

growingWorldsBack.addEventListener('click', () => transition(growingWorldsPg, menu));

//Initializing
renderWorlds();