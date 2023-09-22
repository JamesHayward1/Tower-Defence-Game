class bomb {
    
    constructor(x, y, assignedTower, stage) {
        this.x = x;
        this.y = y;
        this.assignedTower = assignedTower;
        this.stage = stage;
    }

    show() {
        imageMode(CENTER)
        fill(0, 0, 0)
        ellipse(this.x, this.y, 16)
        imageMode(CORNER)
    }
}