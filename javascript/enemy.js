class enemy {
    
    constructor(x, y, health, stage, speed, frost) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.stage = stage;
        this.speed = speed;
        this.frost = frost;
    }

    show() {
        rectMode(CENTER)
        // change colour depending on health
        if (this.health == 1) {
            fill(233, 227, 86)
        } else if (this.health == 2) {
            fill(218, 176, 71)
        } else if (this.health == 3) {
            fill(205, 127, 57)
        } else if (this.health == 4) {
            fill(194, 79, 43)
        } else if (this.health == 5) {
            fill(188, 33, 32)
        } else if (this.health == 6) {
            fill(159, 68, 75)
        } else if (this.health == 7) {
            fill(135, 103, 121)
        } else if (this.health == 8) {
            fill(119, 140, 168)
        } else if (this.health == 9) {
            fill(116, 177, 218)
        }
        rect(this.x, this.y, 30, 30, 5)
        rectMode(CORNER)
        fill(256, 256, 256)
    }
}