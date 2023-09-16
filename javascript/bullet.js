class bullet {
    
    constructor(x, y, xChange, yChange, assignedTower) {
        this.x = x;
        this.y = y;
        this.xChange = xChange;
        this.yChange = yChange;
        this.assignedTower = assignedTower;
    }

    show() {
        imageMode(CENTER)
        if (this.assignedTower.type == "Archer") {
            fill(150, 75, 0)
        } else if (this.assignedTower.type == "Missile") {
            if (this.assignedTower.level == 1) {
                fill(103, 146, 170)
            } else if (this.assignedTower.level == 2) {
                fill(196, 106, 61)
            } else if (this.assignedTower.level == 3) {
                fill(127, 194, 76)
            }
        }
        ellipse(this.x, this.y, 12)
        imageMode(CORNER)
    }
}