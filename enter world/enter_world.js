document.addEventListener('DOMContentLoaded', function () {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPopup = document.getElementById('settings-popup');
    const closeSettings = document.querySelector('.close-settings');
    const saveSettings = document.querySelector('.settings-save-btn');
    const volumeControl = document.getElementById('volume-control');
    const worldData = JSON.parse(localStorage.getItem('currentWorld'));
    const worldContainer = document.querySelector('.world-container');

    if (worldData && worldData.biome) {
        loadWorldContent(worldData);
    }

    // Return button 
    const returnButton = document.getElementById('return-button');
    if (returnButton) {
        returnButton.addEventListener('click', function () {
            window.location.href = '../growing worlds/growing_worlds.html';
        });
    }

    // Settings open
    if (settingsBtn && settingsPopup) {
        settingsBtn.addEventListener('click', function () {
            settingsPopup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    // Settings close
    if (closeSettings) {
        closeSettings.addEventListener('click', function () {
            if (settingsPopup) {
                settingsPopup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Save settings
    if (saveSettings && settingsPopup && volumeControl) {
        saveSettings.addEventListener('click', function () {
            const volume = volumeControl.value;
            localStorage.setItem('gameVolume', volume);
            settingsPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
            showAlert('Settings saved!');
        });
    }
});

function loadWorldContent(worldData) {
    const worldContent = document.querySelector('.world-content');
    const body = document.body;

    if (!worldContent || !body) return;

    body.classList.remove('biome-field', 'biome-cherry', 'biome-desert', 'biome-snowy');
    
    const biomeClass = 'biome-' + worldData.biome.toLowerCase().replace(/\s+/g, '-');
    body.classList.add(biomeClass);

    const biomeImageSrc = `../biomes/${worldData.biome.toLowerCase().replace(/\s+/g, '')}.png`;
    const biomeAltText = `${worldData.biome} biome`;

    worldContent.innerHTML = `
        <div class="world-image-container">
            <img src="${biomeImageSrc}" alt="${biomeAltText}" class="img-fluid">
        </div>
    `;
    
    applyBiomeStyles(biomeClass);
}

function applyBiomeStyles(biomeClass) {
    const content = document.querySelector('.world-content');
    const bodyStyles = window.getComputedStyle(document.body);

    if (content) {
        content.style.backgroundColor = bodyStyles.getPropertyValue('--bg-color');
        content.style.color = bodyStyles.getPropertyValue('--text-color');
    }
}