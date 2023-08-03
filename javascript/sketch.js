// setup
"use strict";	
p5.disableFriendlyErrors = true;

// toggles
let toggles = {
	inputs: true,
	processes: true,
	outputs: true,
} 
// images
let mapOne;
let mainMenuBG;
let mapSelectionBG;
let mapOnePreview;
let archer1;
let archer2;
let archer3;

// font
let gameFont;
let gameFont1;

// global variables
let map = 1;
let start = false;
let mapSelection = true;
let health = 100;
let level = 1;
let currency = 50;
let levelUnderway = false;
let towerArray = [];
let enemyArray = [];
let infoScreen = false;
let levels;
let spawning = false;
let spawnCountdown = 0;
let levelChange = true;
let end = false;

function preload() {
  mapOne = loadImage("Images/mapOne.png")
  mainMenuBG = loadImage("Images/mainMenuBG.png")
  mapSelectionBG = loadImage("Images/mapSelectionBG.png")
  mapOnePreview = loadImage("Images/mapOnePreview.png")
  gameFont = loadFont("Fonts/gameFont.ttf")
  gameFont1 = loadFont("Fonts/gameFont1.ttf")
  levels = loadStrings("levels.txt")
  // archer tower
  archer1 = loadImage("Images/Archer/archer1.png")
  archer2 = loadImage("Images/Archer/archer2.png")
  archer3 = loadImage("Images/Archer/archer3.png")
}

function setup() {
  createCanvas(1200, 600);
}

function draw() {
  // setup
  textAlign(CENTER, CENTER);
  imageMode(CORNER)
  rectMode(CORNER)

  // draws background correcsponding to what menu you are in
  if (start == false) {
    background(mainMenuBG)
    mainMenu()
    if (infoScreen) {
      background(mapSelectionBG)
      infoMenu()
    }
  } else {
    if (mapSelection) {
      background(mapSelectionBG)
      mapSelectionScreen()
    } else if (map == 1) {
      background(mapOne);
    } else if (map == 2) {
      // display map 2
    } else if (map == 3) {
      // display map 3
    }
  }
  if (spawning) {
    spawnEnemies()
  }
  // checks whether a level is underway
  if (enemyArray.length == 0) {
    levelUnderway = false
    if (!levelChange) {
      if (level != 50) {
        level++
        levelChange = true
        currency += 50
      } else {
        end = true
      }
    }
  } else {
    levelUnderway = true
  }
  if (health <= 0) {
    end = true
  }
  if (end) {
    endMenu()
  }
  imageMode(CENTER);

  if (toggles.inputs) {
    inputs()
  }
  if (toggles.outputs) {
    outputs()
  }
  if (toggles.processes) {
    processes()
  }
}

function mouseClicked() {
  // mouse input to start game
  if (start == false) {
    if (mouseX > 25 && mouseX < 25 + 50 && mouseY > 525 && mouseY < 525 + 50) {
      infoScreen = true
    }
  } else if (mapSelection) {
    // input to select map
    if (mouseX > 200 && mouseX < 200 + 200 && mouseY > 162.5 && mouseY < 162.5 + 275) {
      mapSelection = false
      map = 1
    } else if (mouseX > 500 && mouseX < 500 + 200 && mouseY > 162.5 && mouseY < 162.5 + 275) {
      mapSelection = false
      console.log("Map 2")
    } else if (mouseX > 800 && mouseX < 800 + 200 && mouseY > 162.5 && mouseY < 162.5 + 275) {
      mapSelection = false
      console.log("Map 3")
    }
  } else if (mapSelection == false) {
    // level start
    if (mouseX > 1012.5 && mouseX < 1012.5 + 140 && mouseY > 545 && mouseY < 545 + 40) {
      if (levelUnderway == false) {
        let notPlayable = false
        for (let i = 0; i < towerArray.length; i++) {
          let identifier = towerArray[i]
          if (!identifier.placed) {
            notPlayable = true
            break;
          }
        }
        if (!notPlayable) {
          spawning = true
          levelChange = false
        }
      }
    }

    // placing towers
    for (let i = 0; i < towerArray.length; i++) {
      let identifier = towerArray[i]
      if (identifier.placable) {
        if (identifier.placed == false) {
          if (identifier.cost <= currency) {
            identifier.placed = true
            currency = currency - identifier.cost
          }
        }
      }
    }
    // purchasing towers
    if (levelUnderway == false) {
      // checks whether you currently are placing a tower
      let unplaced = false;
      for (let i = 0; i < towerArray.length; i++) {
        let identifier = towerArray[i]
        if (identifier.placed == false) {
          unplaced = true
          break
        }
      }
      // archer tower
      if (mouseX > 1015.25 && mouseX < 1015.25 + 32 && mouseY > 138 && mouseY < 138 + 64 && unplaced == false) {
        towerArray.push(new tower(mouseX, mouseY, false, "Archer", 220, 1, false, true, 1, 1, 50))
      }
    }
   
    for (let i = 0; i < towerArray.length; i++) {
      let identifier = towerArray[i]
      // deselecting towers
      if (identifier.selected) {
        if (!(mouseX > identifier.x - 16 && mouseX < identifier.x + 16 && mouseY > identifier.y - 32 && mouseY < identifier.y + 32)) {
          if (mouseX > 0 && mouseX < 1200 && mouseY > 0 && mouseY < 600 && mouseX > 225 && mouseX < 975) {
            identifier.selected = false
          }
        }
      }
      // reselecting towers 
      if (mouseX > identifier.x - 16 && mouseX < identifier.x + 16 && mouseY > identifier.y - 32 && mouseY < identifier.y + 32) {
        for (let j = 0; j < towerArray.length; j++) {
          let identifier2 = towerArray[j]
          identifier2.selected = false
        }
        identifier.selected = true
      }
    }
  }
}

function keyPressed() {
  // spacebar input to start game
  if (start == false && infoScreen == false) {
    if (keyCode == 32) {
      start = true
    }
  } else if (infoScreen) {
    if (keyCode == 27) {
      infoScreen = false
    }
  }

  // back to main menu from end screen
  if (end) {
    if (keyCode == 32) {
      restart()
    }
  }
  
  for (let i = 0; i < towerArray.length; i++) {
    let identifier = towerArray[i]
    // press escape to cancel placing towers
    if (identifier.placed == false) {
      if (keyCode == 27) {
        towerArray.splice(i, 1)
      }
    }
    // pressing escape to close tower menu
    if (identifier.placed && identifier.selected) {
      if (keyCode == 27) {
        identifier.selected = false
      }
    }
  }
}

function mainMenu() {
  // title text
  textSize(45)
  textFont(gameFont)
  fill(85, 142, 153)
  strokeWeight(3)
  noStroke()
  text("Tower Titans", width/2, 160)
  fill(131, 189, 202)
  text("Tower Titans", (width/2) + 1.5, 160 + 5)

  // start game
  textFont(gameFont1)
  fill(255, 255, 255);
  stroke(0, 0, 0)
  textSize(35)
  textStyle(BOLD)
  text("Press spacebar to play", width/2, 425)

  // instructions button
  fill(85, 142, 153)
  rect(25, 525, 50, 50, 10)
  fill(255, 255, 255)
  text("i", 50, 545)
}

function mapSelectionScreen() {
  // select map text
  textFont(gameFont1)
  fill(255, 255, 255);
  stroke(0, 0, 0)
  textSize(35)
  textStyle(BOLD)
  text("Select your map", width/2, 100)

  // boxes to hold content
  rectMode(CENTER)
  fill(180, 129, 74)
  rect(width/4, height/2, 200, 275, 20)
  rect(width/2, height/2, 200, 275, 20)
  rect((width/4) * 3, height/2, 200, 275, 20)
  fill(255, 255, 255)
  textSize(25)

  // map names
  text("Meadow", width/4, (height/2) - 115)
  text("Map 2", width/2, (height/2) - 115)
  text("Map 3", (width/4) * 3, (height/2) - 115)

  // play map text
  text("Play map", width/4, (height/2) + 105)

  // map images
  imageMode(CENTER)
  image(mapOnePreview, width/4, (height/2), 170, 170)

  // image borders
  fill(0, 0, 0, 0)
  rect(width/4, height/2, 170, 170)
}

function processes() {
  // show all towers
  for (let i = 0; i < towerArray.length; i++) {
    let identifier = towerArray[i]
    if (identifier.placed == false) {
      identifier.x = mouseX
      identifier.y = mouseY
    }
    if (identifier.x >= 1200 - 16) {
      identifier.x = 1200 - 16
    } else if (identifier.x <= 0 + 16) {
      identifier.x = 0 + 16
    } else if (identifier.y >= 600 - 32) {
      identifier.y = 600 - 32
    } else if (identifier.y <= 0 + 32) {
      identifier.y = 0 + 32
    }
    // whether the tower can be placed or not
    if (identifier.x <= 361) { 
      identifier.placable = false
    } else if (identifier.x >= 814) {
      identifier.placable = false
    } else {
      identifier.placable = true
    }
    for (let j = 0; j < towerArray.length; j++) {
      let identifier2 = towerArray[j]
      if (i != j) {
        if (identifier.x > identifier2.x - 32 && identifier.x < identifier2.x + 32 && identifier.y > identifier2.y - 64 && identifier.y < identifier2.y + 64) {
          identifier.placable = false
          break;
        }
      }
    }
    // collision of towers and enemies path
    if (map == 1) {
      if (identifier.x + 16 > 440 && identifier.x - 16 < 440 + 50 && identifier.y + 32 > 0 && identifier.y - 32 < 128) {
        identifier.placable = false
      } else if (identifier.x + 16 > 440 && identifier.x - 16 < 440 + 290 && identifier.y + 32 > 78 && identifier.y - 32 < 78 + 50) {
        identifier.placable = false
      } else if (identifier.x + 16 > 680 && identifier.x - 16 < 680 + 50 && identifier.y + 32 > 78 && identifier.y - 32 < 78 + 170) {
        identifier.placable = false
      } else if (identifier.x + 16 > 530 && identifier.x - 16 < 530 + 200 && identifier.y + 32 > 198 && identifier.y - 32 < 198 + 50) {
        identifier.placable = false
      } else if (identifier.x + 16 > 530 && identifier.x - 16 < 530 + 50 && identifier.y + 32 > 198 && identifier.y - 32 < 198 + 170) {
        identifier.placable = false
      } else if (identifier.x + 16 > 410 && identifier.x - 16 < 410 + 170 && identifier.y + 32 > 318 && identifier.y - 32 < 318 + 50) {
        identifier.placable = false
      } else if (identifier.x + 16 > 410 && identifier.x - 16 < 410 + 50 && identifier.y + 32 > 318 && identifier.y - 32 < 318 + 200) {
        identifier.placable = false
      } else if (identifier.x + 16 > 410 && identifier.x - 16 < 410 + 350 && identifier.y + 32 > 468 && identifier.y - 32 < 468 + 50) {
        identifier.placable = false
      } else if (identifier.x + 16 > 710 && identifier.x - 16 < 710 + 50 && identifier.y + 32 > 468 && identifier.y - 32 < 468 + 132) {
        identifier.placable = false
      }
    }
    // showing tower
    if (identifier.selected == false) {
      identifier.show()
    }
  }
  for (let i = 0; i < towerArray.length; i++) {
    let identifier = towerArray[i]
    // showing tower menu if tower is selected
    if (identifier.selected) {
      towerMenu()
      if (identifier.placed) {
        fill(128, 128, 128, 100)
        ellipse(identifier.x, identifier.y, identifier.radius)
      }
    }
    if (identifier.selected) {
      identifier.show()
    }
  }

  // moving enemies
  if (map == 1) {
    for (let i = 0; i < enemyArray.length; i++) {
      let identifier = enemyArray[i]
      if (identifier.stage == 1) {
        identifier.y += identifier.speed
        identifier.show()
        if (identifier.y >= 103) {
          identifier.stage = 2
          identifier.direction = "right"
        }
      } else if (identifier.stage == 2) {
        identifier.x += identifier.speed
        identifier.show()
        if (identifier.x >= 705) {
          identifier.stage = 3
          identifier.direction = "down"
        }
      } else if (identifier.stage == 3) {
        identifier.y += identifier.speed
        identifier.show()
        if (identifier.y >= 223) {
          identifier.stage = 4
          identifier.direction = "left"
        }
      } else if (identifier.stage == 4) {
        identifier.x -= identifier.speed
        identifier.show()
        if (identifier.x <= 555) {
          identifier.stage = 5
          identifier.direction = "down"
        }
      } else if (identifier.stage == 5) {
        identifier.y += identifier.speed
        identifier.show()
        if (identifier.y >= 343) {
          identifier.stage = 6
          identifier.direction = "right"
        }
      } else if (identifier.stage == 6) {
        identifier.x -= identifier.speed
        identifier.show()
        if (identifier.x <= 435) {
          identifier.stage = 7
          identifier.direction = "down"
        }
      } else if (identifier.stage == 7) {
        identifier.y += identifier.speed
        identifier.show()
        if (identifier.y >= 493) {
          identifier.stage = 8
          identifier.direction = "right"
        }
      } else if (identifier.stage == 8) {
        identifier.x += identifier.speed
        identifier.show()
        if (identifier.x >= 735) {
          identifier.stage = 9
          identifier.direction = "down"
        }
      } else if (identifier.stage == 9) {
        identifier.y += identifier.speed
        identifier.show()
        if (identifier.y >= 650) {
          enemyArray.splice(i, 1)
          health = health - identifier.health
        }
      }
    }
  }
}

function inputs() {

}

function outputs() {
  if (start == true && mapSelection == false) {
    // towers display
    textSize(25)
    rectMode(CORNER)
    fill(180, 129, 74)
    rect(975, 0, 500, 600, 20)

    // health bar
    fill(255, 255, 255)
    if (health <= 0) {
      text("Health: 0/100", 1087.5, 30)
    } else {
      text("Health: " + health + "/100", 1087.5, 30)
    }
    // level
    text("Level: " + level, 1087.5, 110)
    // currency 
    text("Currency: £" + currency, 1087.5, 70)

    // start level button
    fill(228, 194, 144)
    textSize(20)
    rectMode(CENTER)
    rect(1087.5, 565, 150, 40, 10)
    fill(256, 256, 256)
    text("Start level", 1087.5, 562.5)
    rectMode(CORNER)

    // towers 
    textSize(15)
    // archer tower
    image(archer1, ((1200 - 975) / 4) + 975, 170, 32, 64)
    text("£50", ((1200 - 975) / 4) + 975, 210)
  }
}

function towerMenu() {
  textSize(25)
  rectMode(CORNER)
  fill(180, 129, 74)
  rect(-275, 0, 500, 600, 20)
  
  // find out which tower is selected
  let selectedTower;
  for (let i = 0; i < towerArray.length; i++) {
    let identifier = towerArray[i]
    if (identifier.selected) {
      selectedTower = identifier
      break;
    }
  }
  // display selected tower information
  fill(255, 255, 255)
  text(selectedTower.type, 112.5, 30)
  textSize(20)
  //image
  if (selectedTower.type == "Archer") {
    if (selectedTower.level == 1) {
      image(archer1, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 2) {
      image(archer2, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 3) {
      image(archer3, 112.5, 120, 64, 128)
    }
  }
  rectMode(CENTER)
  fill(228, 194, 144)
  rect(112.5, 257.5, 205, 125, 10)
  fill(256, 256, 256)
  textAlign(LEFT, CENTER);
  text("Damage: " + selectedTower.damage, 20, 210)
  text("Cooldown: " + selectedTower.cooldown, 20, 240)
  text("Range: " + selectedTower.radius, 20, 270)
  text("Level: " + selectedTower.level, 20,300)
  if (selectedTower.level != 3 && selectedTower.placed) {
    text("Upgrade to level: " + (selectedTower.level + 1), 20, 350)
    text("Range: ", 20, 380)
    text("Damage: ", 20, 410)
    text("Cooldown: ", 20, 440)
    textAlign(CENTER, CENTER);
    fill(228, 194, 144)
    rect(112.5, 492.5, 150, 45, 10)
    fill(256, 256, 256)
    text("Upgrade: £xx", 112.5, 490)
  } 
  if (selectedTower.placed) {
    textAlign(CENTER, CENTER);
    fill(228, 194, 144)
    rect(112.5, 552.5, 150, 45, 10)
    fill(256, 256, 256)
    text("Sell: £xx", 112.5, 550)
  }
}

function infoMenu() {
  // title
  rectMode(CENTER)
  textSize(40)
  fill(85, 142, 153)
  rect(width/2, 60, 275, 75, 20)
  fill(255, 255, 255)
  text("Instructions", width/2, 55)
  rectMode(CORNER)

  // instructions
  textSize(20)
  text("In this game, enemies will come along the path once you press start level", width/2, 150)
  text("Inbetween levels, you can spend your money in order to purchase new towers, or upgrade existing towers", width/2, 180)
  text("Towers automatically attack enemies with special attacks or powers depending on what type of tower it is", width/2, 230)
  text("These towers can also be sold for half their buy price", width/2, 260)
  text("You start with 100 health, and lose health when enemies reach the end of the path without being killed by the towers", width/2, 310)
  text("When you reach zero health, you lose the game", width/2, 340)
  text("You start the game with enough currency to buy one tower", width/2, 390)
  text("You gain curreny by killing enemies, and get a bonus at the end of each level", width/2, 420)
  text("There are 50 levels which scale in difficulty. If you complete the 50th level without losing all your health, you win the game", width/2, 470)
  textSize(30)
  text("Press escape to close this menu", width/2, 530)
}

function spawnEnemies() {
  let data = levels[level - 1]
  if (spawnCountdown % 30 == 0) {
    let health = data.substring(spawnCountdown / 30, (spawnCountdown / 30) + 1)
    // spawn ememy
    if (map == 1) {
      enemyArray.push(new enemy(465, -50, health, 1, 1, 3, "down"))
    }
  }
  spawnCountdown++
  // stops spawning enemies once all spawned
  if (spawnCountdown / 30 == data.length) {
    spawning = false
    spawnCountdown = 0
  }
}

function endMenu() {
  toggles = {
    inputs: false,
    processes: false,
    outputs: false,
  } 
  background(mapSelectionBG)
  
  rectMode(CENTER)
  textSize(50)
  fill(85, 142, 153)
  rect(width/2, 75, 350, 90, 20)
  fill(255, 255, 255)
  text("Game Over", width/2, 65)
  rectMode(CORNER)

  textSize(35)
  if (health <= 0) {
    text("Your health reached zero", width / 2, 200)
  } else {
    text("You completed the game!", width / 2, 200)
  }
  textSize(25)
  text("Level: " + level, width/2, 270)
  if (health <= 0) {
    text("Health: 0/100", width/2, 305)
  } else {
    text("Health: " + health + "/100", width/2, 305)
  }
  text("Currency: £" + currency, width/2, 340)
  text("Press spacebar to go back to the main menu", width/2, 420)
}  

function restart() {
  // reset all variables to go back to main menu
  console.log("Main menu")
}
