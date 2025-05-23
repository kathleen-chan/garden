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

enter.addEventListener('click', function () {
    gameContainer.style.opacity = '0';
    menu.style.display = 'flex';

    setTimeout(() => {
        gameContainer.style.display = 'none';
        menu.style.display = 'flex';
        setTimeout(() => {
            menu.style.opacity = '1';
        }, 10);
    }, 500);
});

newGarden.addEventListener('click', function () {
    menu.style.opacity = '0';
    newGardenPg.style.display = 'flex';

    setTimeout(() => {
        menu.style.display = 'none';
        newGardenPg.style.display = 'flex';
        setTimeout(() => {
            newGardenPg.style.opacity = '1';
        }, 10);
    }, 500);
});

newGardenBack.addEventListener('click', function () {
    newGardenPg.style.opacity = '0';
    menu.style.display = 'flex';

    setTimeout(() => {
        newGardenPg.style.display = 'none';
        menu.style.display = 'flex';
        setTimeout(() => {
            menu.style.opacity = '1';
        }, 10);
    }, 500);
});   

growingGardens.addEventListener('click', function () {
    menu.style.opacity = '0';
    growingGardensPg.style.display = 'flex';

    setTimeout(() => {
        menu.style.display = 'none';
        growingGardensPg.style.display = 'flex';
        setTimeout(() => {
            growingGardensPg.style.opacity = '1';
        }, 10);
    }, 500);
});

growingGardensBack.addEventListener('click', function () {
    growingGardensPg.style.opacity = '0';
    menu.style.display = 'flex';

    setTimeout(() => {
        growingGardensPg.style.display = 'none';
        menu.style.display = 'flex';
        setTimeout(() => {
            menu.style.opacity = '1';
        }, 10);
    }, 500);
});

menuBack.addEventListener('click', function () {
    menu.style.opacity = '0';
    gameContainer.style.display = 'flex';

    setTimeout(() => {
        menu.style.display = 'none';
        gameContainer.style.display = 'flex';
                
        setTimeout(() => {
            gameContainer.style.opacity = '1';
        }, 10);
    }, 500);
});