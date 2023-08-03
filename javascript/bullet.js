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
        fill(0, 0, 0)
        ellipse(this.x, this.y, 12)
        imageMode(CORNER)
    }
}