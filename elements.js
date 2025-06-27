class SeedType {
    constructor(img, timeToGrow) {
        this.img = img;
        this.timeToGrow = timeToGrow;
    }
}

class Garden {
    constructor(img, seed) {
        this.img = img;
        this.seed = seed;
        this.timePlanted = Date.now();
        this.watered = false;
        this.harvested = false;
    }

    constructor() {
        this.img = "defaultGarden.png"
        this.watered = false;
        this.harvested = false;
    }

    getTimeLeft() {
        const timeLeft = this.seed.timeToGrow - (Date.now() - this.time);
        return Math.max(0, timeLeft);
    }

    getPercent() {
        const percent = (this.seed.timeToGrow - this.timeLeft) / this.seed.timeToGrow;
        return Math.min(1, Math.max(0, percent));
    }

    setGardenImage(img) {
        this.img = img;
    }

    setGardenDefault() {
        this.img = "defaultGarden.png";
    }

    printTL(){
        console.log(`Time left: ${this.timeLeft} ms`);
    }

    printP(){
        console.log(`percentage: ${this.percent}`);
    }
}

const greenBeens = new SeedType('green-beans.png', 10000);


