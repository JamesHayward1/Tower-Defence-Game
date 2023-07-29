class enemy {
    
    constructor(x, y, health, initialHealth, stage, speed, direction) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.stage = stage;
        this.speed = speed;
        this.initialHealth = initialHealth;
        this.direction = direction;
    }

    show() {
        rectMode(CENTER)
        fill(256, 256, 256)
        rect(this.x, this.y, 30, 30)
        rectMode(CORNER)
    }
}