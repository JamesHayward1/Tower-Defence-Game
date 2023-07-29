class tower {
    
    constructor(x, y, placed, type, radius, level, placable, selected, damage, cooldown) {
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
    }

    show() {
        imageMode(CENTER)
        if (this.placable) {
            fill(128, 128, 128, 100)
        } else {
            fill(170, 74, 68, 128)
        }
        if (this.type == "Archer") {
            if (this.placed == false) {
                ellipse(this.x, this.y, this.radius)
                image(archer1, this.x, this.y, 32, 64)
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