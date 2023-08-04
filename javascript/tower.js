class tower {
    
    constructor(x, y, placed, type, radius, level, placable, selected, damage, cooldown, cost, enemyX, enemyY, active, counter, assignedEnemy) {
        this.x = x;
        this.y = y;
        this.placed = placed;
        this.type = type;
        this.radius = radius;
        this.level = level
        this.placable = placable;
        this.selected = selected;
        this.damage = damage;
        this.cooldown = cooldown;
        this.cost = cost;
        this.enemyX = enemyX;
        this.enemyY = enemyY;
        this.active = active; // becomes false when the tower is in its cooldown
        this.counter = counter; // counts up to the cooldownn of the tower
        this.assignedEnemy = assignedEnemy;
    }

    show() {
        imageMode(CENTER)
        if (this.placable && this.cost <= currency) {
            fill(128, 128, 128, 100)
        } else {
            fill(170, 74, 68, 128)
        }
        if (this.type == "Archer") {
            if (this.placed == false) {
                ellipse(this.x, this.y, this.radius)
                image(archer1, this.x, this.y, 32, 64)
                fill(255, 255, 255)
                textAlign(CENTER, CENTER); 
                textSize(25)
                text("Press escape to cancel", width/2, 570)
            } else if (this.placed) {
                if (this.level == 1) {
                    image(archer1, this.x, this.y, 32, 64)
                } else if (this.level == 2) {
                    image(archer2, this.x, this.y, 32, 64)
                } else if (this.level == 3) {
                    image(archer3, this.x, this.y, 32, 64)
                }
            }
        }
    }
}