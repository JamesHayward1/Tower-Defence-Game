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
// tower images
let archer1;
let archer2;
let archer3;
let frost1;
let frost2;
let frost3;
let missile1;
let missile2;
let missile3;
let bomb1;
let bomb2;
let bomb3;

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
let bulletArray = [];
let bombArray = [];
let infoScreen = false;
let levels;
let spawning = false;
let spawnCountdown = 0;
let levelChange = true;
let end = false;
let levelComplete = false;
let pause = false;

// upgrade arrays
// damage, cooldown, range
let archerUpgrades = [1, 60, 300, 1, 30, 300];
let bombUpgrades = [1, 90, 220, 2, 90, 220];
let frostUpgrades = [null, null, 250, null, null, 280];
let missileUpgrades = [2, 120, 550, 3, 120, 550];

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
  // frost tower
  frost1 = loadImage("Images/Frost/frost1.png")
  frost2 = loadImage("Images/Frost/frost2.png")
  frost3 = loadImage("Images/Frost/frost3.png")
  // missile tower
  missile1 = loadImage("Images/Missile/missile1.png")
  missile2 = loadImage("Images/Missile/missile2.png")
  missile3 = loadImage("Images/Missile/missile3.png")
  // bomb tower
  bomb1 = loadImage("Images/Bomb/bomb1.png")
  bomb2 = loadImage("Images/Bomb/bomb2.png")
  bomb3 = loadImage("Images/Bomb/bomb3.png")
}

function setup() {
  createCanvas(1200, 600);
}

function draw() {
  // setup
  textAlign(CENTER, CENTER);
  imageMode(CORNER)
  rectMode(CORNER)

  // draws background corresponding to what menu you are in
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
  if (enemyArray.length == 0 && !spawning) {
    levelUnderway = false
    if (!levelChange) {
      if (level != 50) {
        level++
        levelChange = true
        currency += 50
        levelComplete = true
        for (let i = 0; i < towerArray.length; i++) {
          let towerID = towerArray[i]
          towerID.active = true
          towerID.counter = 0
          towerID.enemyX = null
          towerID.enemyY = null
          towerID.assignedEnemy = null
        }
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

  if (toggles.outputs) {
    outputs()
  }
  if (toggles.processes) {
    processes()
  }

  if (levelComplete) {
    levelCompleteMessage()
  } else if (pause) {
    pauseGame()
  }
}

function mouseClicked() {
  if (toggles.inputs) {
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
        if (mouseX > 1015.25 && mouseX < 1015.25 + 32 && mouseY > 138 && mouseY < 138 + 64 && unplaced == false) {
          towerArray.push(new tower(mouseX, mouseY, false, "Archer", 220, 1, false, true, 1, 60, 50, null, null, true, 0, null, 50)) // archer tower
        } else if (mouseX > 1071.5 && mouseX < 1071.5 + 32 && mouseY > 138 && mouseY < 138 + 64 && unplaced == false) {
          towerArray.push(new tower(mouseX, mouseY, false, "Frost", 220, 1, false, true, null, null, 75, null, null, true, 0, null, 75)) // Frost tower
        } else if (mouseX > 1127.75 && mouseX < 1127.75 + 32 && mouseY > 138 && mouseY < 138 + 64 && unplaced == false) {
          towerArray.push(new tower(mouseX, mouseY, false, "Missile", 500, 1, false, true, 2, 150, 75, null, null, true, 0, null, 75)) // missile tower
        } else if (mouseX > 1015.25 && mouseX < 1015.25 + 32 && mouseY > 228 && mouseY < 228 + 64 && unplaced == false) {
          towerArray.push(new tower(mouseX, mouseY, false, "Bomb", 220, 1, false, true, 1, 120, 100, null, null, true, 0, null, 100)) // bomb tower
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

      // selling towers and upgrading towers 
      let sellable = false
      let sellableTower;
      let towerArrayPosition;
      // checks whether sell button is currently on screen
      for (let i = 0; i < towerArray.length; i++) {
        let towerID = towerArray[i]
        if (towerID.selected &&  towerID.placed && !levelUnderway) {
          sellable = true
          sellableTower = towerID
          towerArrayPosition = i
          break
        }
      }
      // if whether to sell or upgrade
      if (sellable) {
        if (mouseX > 37.5 && mouseX < 37.5 + 150 && mouseY > 530 && mouseY < 530 + 45) {
          let money = Math.floor(sellableTower.totalCost / 2) // makes sure number is an integer
          currency += money
          towerArray.splice(towerArrayPosition, 1)
        } else if (mouseX > 37.5 && mouseX < 37.5 + 150 && mouseY > 470 && mouseY < 470 + 45) {
          let towerID = towerArray[towerArrayPosition]
          if (towerID.level != 3) {
            if (towerID.type == "Archer") {
              // upgrading archer tower
              if (towerID.level == 1) {
                if (currency >= towerID.cost) {
                  towerID.damage = archerUpgrades[0]
                  towerID.cooldown = archerUpgrades[1]
                  towerID.radius = archerUpgrades[2]
                  towerID.level++
                  currency -= towerID.cost
                  towerID.totalCost += towerID.cost
                }
              } else if (towerID.level == 2) {
                if (currency >= (towerID.cost * 2)) {
                  towerID.damage = archerUpgrades[3]
                  towerID.cooldown = archerUpgrades[4]
                  towerID.radius = archerUpgrades[5]  
                  towerID.level++ 
                  currency -= (towerID.cost * 2)
                  towerID.totalCost += (towerID.cost * 2)      
                }
              }
            } else if (towerID.type == "Bomb") {
              if (towerID.level == 1) {
                if (currency >= towerID.cost) {
                  towerID.damage = bombUpgrades[0]
                  towerID.cooldown = bombUpgrades[1]
                  towerID.radius = bombUpgrades[2]
                  towerID.level++
                  currency -= towerID.cost
                  towerID.totalCost += towerID.cost
                }
              } else if (towerID.level == 2) {
                if (currency >= (towerID.cost * 2)) {
                  towerID.damage = bombUpgrades[3]
                  towerID.cooldown = bombUpgrades[4]
                  towerID.radius = bombUpgrades[5]
                  towerID.level++
                  currency -= (towerID.cost * 2)
                  towerID.totalCost += (towerID.cost * 2)  
                }
              }
            } else if (towerID.type == "Missile") {
              if (towerID.level == 1) {
                if (currency >= towerID.cost) {
                  towerID.damage = missileUpgrades[0]
                  towerID.cooldown = missileUpgrades[1]
                  towerID.radius = missileUpgrades[2]
                  towerID.level++
                  currency -= towerID.cost
                  towerID.totalCost += towerID.cost
                }
              } else if (towerID.level == 2) {
                if (currency >= (towerID.cost * 2)) {
                  towerID.damage = missileUpgrades[3]
                  towerID.cooldown = missileUpgrades[4]
                  towerID.radius = missileUpgrades[5]
                  towerID.level++
                  currency -= (towerID.cost * 2)
                  towerID.totalCost += (towerID.cost * 2)  
                }
              }
            } else if (towerID.type == "Frost") {
              if (towerID.level == 1) {
                if (currency >= towerID.cost) {
                  towerID.damage = frostUpgrades[0]
                  towerID.cooldown = frostUpgrades[1]
                  towerID.radius = frostUpgrades[2]
                  towerID.level++
                  currency -= towerID.cost
                  towerID.totalCost += towerID.cost
                }
              } else if (towerID.level == 2) {
                if (currency >= (towerID.cost * 2)) {
                  towerID.damage = frostUpgrades[3]
                  towerID.cooldown = frostUpgrades[4]
                  towerID.radius = frostUpgrades[5]
                  towerID.level++
                  currency -= (towerID.cost * 2)
                  towerID.totalCost += (towerID.cost * 2)  
                }
              }
            }
          }
        }
      }
    }
  }
  else {
    // closing level complete menu
    if (levelComplete) {
      if (mouseX > 525 && mouseX < 525 + 150 && mouseY > 310 && mouseY < 310 + 40) {
        levelComplete = false
        toggles = {
          inputs: true,
          processes: true,
          outputs: true,
        }
      }
    }
    // closing pause menu
    if (pause) {
      if (mouseX > 525 && mouseX < 525 + 150 && mouseY > 380 && mouseY < 380 + 40) {
        pause = false
        toggles = {
          inputs: true,
          processes: true,
          outputs: true,
        }
      }
    }
  }
}

function keyPressed() {
  if (toggles.inputs) {
    // spacebar input to start game
    if (start == false && infoScreen == false) {
      if (keyCode == 32) {
        start = true
      } else if (keyCode == 73) {
        infoScreen = true
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
    
    let pausable = true
    for (let i = 0; i < towerArray.length; i++) {
      let identifier = towerArray[i]
      // press escape to cancel placing towers
      if (identifier.placed == false) {
        if (keyCode == 27) {
          towerArray.splice(i, 1)
          pausable = false
        }
      } else if (identifier.placed && identifier.selected) {
        // pressing escape to close tower menu
        if (keyCode == 27) {
          identifier.selected = false
          pausable = false
        }
      }
    }

    if (!start || mapSelection) {
      pausable = false
    }

    if (keyCode == 27) {
      if (pausable) {
        // open pause menu
        pause = true
      }
    }

  } else {
    // closing level complete menu
    if (levelComplete) {
      if (keyCode == 27) {
        levelComplete = false
        toggles = {
          inputs: true,
          processes: true,
          outputs: true,
        }
      }
    }
    // closing pause menu
    if (pause) {
      if (keyCode == 27) {
        pause = false
        toggles = {
          inputs: true,
          processes: true,
          outputs: true,
        }
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

  // moving enemies
  if (map == 1) {
    for (let i = 0; i < enemyArray.length; i++) {
      let identifier = enemyArray[i]
      if (identifier.stage == 1) {
        if (identifier.frost) {
          identifier.y += (identifier.speed / 2)
        } else {
          identifier.y += identifier.speed
        }
        identifier.show()
        if (identifier.y >= 103) {
          identifier.stage = 2
        }
      } else if (identifier.stage == 2) {
        if (identifier.frost) {
          identifier.x += (identifier.speed / 2)
        } else {
          identifier.x += identifier.speed
        }
        identifier.show()
        if (identifier.x >= 705) {
          identifier.stage = 3
        }
      } else if (identifier.stage == 3) {
        if (identifier.frost) {
          identifier.y += (identifier.speed / 2)
        } else {
          identifier.y += identifier.speed
        }
        identifier.show()
        if (identifier.y >= 223) {
          identifier.stage = 4
        }
      } else if (identifier.stage == 4) {
        if (identifier.frost) {
          identifier.x -= (identifier.speed / 2)
        } else {
          identifier.x -= identifier.speed
        }
        identifier.show()
        if (identifier.x <= 555) {
          identifier.stage = 5
        }
      } else if (identifier.stage == 5) {
        if (identifier.frost) {
          identifier.y += (identifier.speed / 2)
        } else {
          identifier.y += identifier.speed
        }
        identifier.show()
        if (identifier.y >= 343) {
          identifier.stage = 6
        }
      } else if (identifier.stage == 6) {
        if (identifier.frost) {
          identifier.x -= (identifier.speed / 2)
        } else {
          identifier.x -= identifier.speed
        }
        identifier.show()
        if (identifier.x <= 435) {
          identifier.stage = 7
        }
      } else if (identifier.stage == 7) {
        if (identifier.frost) {
          identifier.y += (identifier.speed / 2)
        } else {
          identifier.y += identifier.speed
        }
        identifier.show()
        if (identifier.y >= 493) {
          identifier.stage = 8
        }
      } else if (identifier.stage == 8) {
        if (identifier.frost) {
          identifier.x += (identifier.speed / 2)
        } else {
          identifier.x += identifier.speed
        }
        identifier.show()
        if (identifier.x >= 735) {
          identifier.stage = 9
        }
      } else if (identifier.stage == 9) {
        if (identifier.frost) {
          identifier.y += (identifier.speed / 2)
        } else {
          identifier.y += identifier.speed
        }
        identifier.show()
        if (identifier.y >= 650) {
          enemyArray.splice(i, 1)
          health = health - identifier.health
        }
      }
    }
  }

  // detecting enemies in attack radius
  for (let i = 0; i < towerArray.length; i++) {
    let towerID = towerArray[i]
    for (let j = 0; j < enemyArray.length; j++) {
      let enemyID = enemyArray[j]
      let distance = dist(towerID.x, towerID.y, enemyID.x, enemyID.y)
      if ((distance <= towerID.radius / 2) && towerID.enemyX == null && towerID.enemyY == null && towerID.assignedEnemy == null && enemyID.y > 0 && enemyID.y < 600 && towerID.active && towerID.type != "Bomb") {
        if (towerID.type == "Frost") {
          enemyID.frost = true
        } else {
          let towerDamage = 0;
          for (let k = 0; k < towerArray.length; k++) {
            let identifier = towerArray[k]
            if (identifier.assignedEnemy == enemyID) {
              towerDamage += identifier.damage
            }
          }
          if (towerDamage < enemyID.health) {
            towerID.enemyX = enemyID.x
            towerID.enemyY = enemyID.y
            towerID.assignedEnemy = enemyID
            // calculations for different tower types
            if (towerID.type == "Archer" || towerID.type == "Missile") {
              let xChange = towerID.enemyX - towerID.x
              let yChange = towerID.enemyY - towerID.y
              let bulletSpeed = 20
              let scaleFactor = sqrt((bulletSpeed ** 2) / ((xChange ** 2) + (yChange ** 2)))
              xChange = xChange * scaleFactor
              yChange = yChange * scaleFactor
              bulletArray.push(new bullet(towerID.x, towerID.y, xChange, yChange, towerID))
              towerID.active = false
            }
          }
        }
      } else {
        if (towerID.type == "Frost") {
          enemyID.frost = false
        }
      }
    }
  }

  // calculations for heat seaking missile
  for (let i = 0; i < towerArray.length; i++) {
    let towerID = towerArray[i]
    if (towerID.type == "Missile" && towerID.assignedEnemy != null) {
      let bulletID
      for (let j = 0; j < bulletArray.length; j++) {
        let identifier = bulletArray[j]
        if (identifier.assignedTower == towerID) {
          bulletID = identifier
          break
        }
      }
      let enemyID = towerID.assignedEnemy
      towerID.enemyX = enemyID.x
      towerID.enemyY = enemyID.y

      let xChange = towerID.enemyX - bulletID.x
      let yChange = towerID.enemyY - bulletID.y
      let bulletSpeed = 10
      let scaleFactor = sqrt((bulletSpeed ** 2) / ((xChange ** 2) + (yChange ** 2)))
      xChange = xChange * scaleFactor
      yChange = yChange * scaleFactor
      bulletID.xChange = xChange
      bulletID.yChange = yChange
    }
  }

  // attacking enemies
  for (let i = 0; i < towerArray.length; i++) {
    let towerID = towerArray[i]
    if (towerID.enemyX != null && towerID.enemyY != null) {
      // archer tower and missile tower
      if (towerID.type == "Archer" || towerID.type == "Missile") {
        for (let j = 0; j < bulletArray.length; j++) {
          let bulletID = bulletArray[j]
          bulletID.show()
          bulletID.x += bulletID.xChange
          bulletID.y += bulletID.yChange
        }
      }
    }
  }

  // bullet and enemy collision
  let bulletDeleted = 0;
  let bulletLength = bulletArray.length;
  for (let i = 0; i < bulletLength; i++) {
    let bulletID = bulletArray[i - bulletDeleted]
    let towerID = bulletID.assignedTower
    let enemyID = towerID.assignedEnemy
    if (dist(bulletID.x, bulletID.y, enemyID.x, enemyID.y) < 21) {
      enemyID.health -= towerID.damage
      if (enemyID.health <= 0) {
        let num = 0
        for (let j = 0; j < enemyArray.length; j++) {
          let identifier = enemyArray[j]
          if (identifier == enemyID) {
            num = j
          }
        }
        enemyArray.splice(num, 1)
      }
      bulletArray.splice(i - bulletDeleted, 1)
      bulletDeleted++
      towerID.enemyX = null
      towerID.enemyY = null
      towerID.assignedEnemy = null
    }
  }

  // delete bullets that go off screen
  for (let i = 0; i < bulletArray.length; i++) {
    let bulletID = bulletArray[i]
    if (bulletID.x < 225 || bulletID.x > 975 || bulletID.y < 0 || bulletID.y > 600) {
      let towerID = bulletID.assignedTower
      towerID.enemyX = null
      towerID.enemyY = null
      towerID.assignedEnemy = null
      bulletArray.splice(i, 1)
    }
  }

  // bombs
  if (levelUnderway) {
    for (let i = 0; i < towerArray.length; i++) {
      let towerID = towerArray[i]
      if (towerID.type == "Bomb" && towerID.active) {
        let coordinateArray = []
        let point = {
            x: 465,
            y: 0,
            stage: 1
        }
        // checking if the point is in the towers radius
        for (let j = 1; j < 1411; j++) {
          let distance = dist(towerID.x, towerID.y, point.x, point.y)
          if (distance <= towerID.radius / 2) {
              coordinateArray.push(point.x)
              coordinateArray.push(point.y)
              coordinateArray.push(point.stage)
          }
      
          if (point.stage == 1) {
              point.y += 1
              if (point.y >= 103) {
                  point.stage = 2
              }
          } else if (point.stage == 2) {
              point.x += 1
              if (point.x >= 705) {
                  point.stage = 3
              }
          } else if (point.stage == 3) {
              point.y += 1
              if (point.y >= 223) {
                  point.stage = 4
              }
          } else if (point.stage == 4) {
              point.x -= 1
              if (point.x <= 555) {
                  point.stage = 5
              }
          } else if (point.stage == 5) {
              point.y += 1
              if (point.y >= 343) {
                  point.stage = 6
              }
          } else if (point.stage == 6) {
              point.x -= 1
              if (point.x <= 435) {
                  point.stage = 7
              }
          } else if (point.stage == 7) {
              point.y += 1
              if (point.y >= 493) {
                  point.stage = 8
              }
          } else if (point.stage == 8) {
              point.x += 1
              if (point.x >= 735) {
                  point.stage = 9
              }
          } else if (point.stage == 9) {
              point.y += 1
          }
        }
        // spawning in a bomb in towers range
        let bombX;
        let bombY;
        let bombStage;
        let upperRange = coordinateArray.length - 1
        let index = Math.floor((Math.random() * upperRange))
        if ((index % 3) == 1) {
          index -= 1
        } else if ((index % 3) == 2) {
          index -= 2
        }
        bombX = coordinateArray[index]
        bombY = coordinateArray[index + 1]
        bombStage = coordinateArray[index + 2]
        bombArray.push(new bomb(bombX, bombY, towerID, bombStage))
        towerID.active = false
      }
    }
  }
  // showing bombs
  for (let i = 0; i < bombArray.length; i++) {
    let bombID = bombArray[i]
    bombID.show()
  }

  // moving bombs
  for (let i = 0; i < bombArray.length; i++) {
    let identifier = bombArray[i]
    let speed = 3
    if (identifier.stage == 1) {
      identifier.y -= speed
      if (identifier.y <= 0) {
        bombArray.splice(i, 1)
      }
    } else if (identifier.stage == 2) {
      identifier.x -= speed
      if (identifier.x <= 465) {
        identifier.stage = 1
      }
    } else if (identifier.stage == 3) {
      identifier.y -= speed
      if (identifier.y <= 103) {
        identifier.stage = 2
      }
    } else if (identifier.stage == 4) {
      identifier.x += speed
      if (identifier.x >= 705) {
        identifier.stage = 3
      }
    } else if (identifier.stage == 5) {
      identifier.y -= speed
      if (identifier.y <= 223) {
        identifier.stage = 4
      }
    } else if (identifier.stage == 6) {
      identifier.x += speed
      if (identifier.x >= 555) {
        identifier.stage = 5
      }
    } else if (identifier.stage == 7) {
      identifier.y -= speed
      if (identifier.y <= 343) {
        identifier.stage = 6
      }
    } else if (identifier.stage == 8) {
      identifier.x -= speed
      if (identifier.x <= 435) {
        identifier.stage = 7
      }
    } else if (identifier.stage == 9) {
      identifier.y -= speed
      if (identifier.y <= 493) {
        identifier.stage = 8
      }
    }
  }

  // bomb and enemy collision
  for (let i = 0; i < bombArray.length; i++) {
    let bombID = bombArray[i]
    for (let j = 0; j < enemyArray.length; j++) {
      let enemyID = enemyArray[j]
      let distance = dist(bombID.x, bombID.y, enemyID.x, enemyID.y)
      if (distance <= 10) {
        let towerID = bombID.assignedTower
        enemyID.health -= towerID.damage
        if (enemyID.health <= 0) {
          enemyArray.splice(j, 1)
        }
        bombArray.splice(i, 1)
      }
    }
  }

  // tower cooldown 
  for (let i = 0; i < towerArray.length; i++) {
    let towerID = towerArray[i]
    if (!towerID.active) {
      towerID.counter++
      if (towerID.counter >= towerID.cooldown) {
        towerID.active = true
        towerID.counter = 0
      }
    }
  }
}

function outputs() {
  for (let i = 0; i < towerArray.length; i++) {
    let identifier = towerArray[i]
    // showing tower menu if tower is selected
    if (identifier.selected) {
      if (identifier.placed) {
        fill(128, 128, 128, 100)
        ellipse(identifier.x, identifier.y, identifier.radius)
      }
      towerMenu()
    }
  }

  // showing tower display
  if (start == true && mapSelection == false) {
    textAlign(CENTER, CENTER);
    towerDisplay()
  }

  for (let i = 0; i < towerArray.length; i++) {
    let identifier = towerArray[i]
    if (identifier.selected) {
      identifier.show()
    }
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
  } else if (selectedTower.type == "Missile") {
    if (selectedTower.level == 1) {
      image(missile1, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 2) {
      image(missile2, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 3) {
      image(missile3, 112.5, 120, 64, 128)
    }
  } else if (selectedTower.type == "Frost") {
    if (selectedTower.level == 1) {
      image(frost1, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 2) {
      image(frost2, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 3) {
      image(frost3, 112.5, 120, 64, 128)
    }
  } else if (selectedTower.type == "Bomb") {
    if (selectedTower.level == 1) {
      image(bomb1, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 2) {
      image(bomb2, 112.5, 120, 64, 128)
    } else if (selectedTower.level == 3) {
      image(bomb3, 112.5, 120, 64, 128)
    }
  }
  rectMode(CENTER)
  fill(228, 194, 144)
  if (selectedTower.type == "Frost") { //special case where frost tower doesnt have cooldown/damage
    rect(112.5, 228.75, 205, 67.5, 10)
    fill(256, 256, 256)
    textAlign(LEFT, CENTER);
    text("Range: " + selectedTower.radius, 20, 210)
    text("Level: " + selectedTower.level, 20, 240)
    // tower explaination
    fill(228, 194, 144)
    rect(112.5, 327.5, 205, 112.5, 10)
    fill(256, 256, 256)
    textAlign(CENTER, CENTER);
    text("The frost tower", 112.5, 287.5)
    text("slows enemies", 112.5, 312.5)
    text("movement", 112.5, 337.5)
    text("in its radius", 112.5, 362.5)
    textAlign(LEFT, CENTER);
  } else if (selectedTower.type == "Bomb") {
    rect(112.5, 243.75, 205, 97.5, 10)
    fill(256, 256, 256)
    textAlign(LEFT, CENTER);
    text("Damage: " + selectedTower.damage, 20, 210)
    text("Cooldown: " + (selectedTower.cooldown / 60), 20, 240)
    text("Level: " + selectedTower.level, 20, 270)
    // tower explaination
    fill(228, 194, 144)
    rect(112.5, 329, 205, 59.5, 10)
    fill(256, 256, 256)
    textAlign(CENTER, CENTER);
    text("Spawns bombs in", 112.5, 312.5)
    text("its radius", 112.5, 337.5)
    textAlign(LEFT, CENTER);
  } else {
    rect(112.5, 257.5, 205, 125, 10)
    fill(256, 256, 256)
    textAlign(LEFT, CENTER);
    text("Damage: " + selectedTower.damage, 20, 210)
    text("Cooldown: " + (selectedTower.cooldown / 60), 20, 240)
    text("Range: " + selectedTower.radius, 20, 270)
    text("Level: " + selectedTower.level, 20,300)
  }
  if (selectedTower.level != 3 && selectedTower.placed) {
    if (selectedTower.type == "Frost") {
      text("Upgrade to level: " + (selectedTower.level + 1), 20, 410)
      if (selectedTower.level == 1) {
        text("Range: " + frostUpgrades[2], 20, 440)
      } else {
        text("Range: " + frostUpgrades[5], 20, 440)
      }
    } else if (selectedTower.type == "Bomb") {
      text("Upgrade to level: " + (selectedTower.level + 1), 20, 380)
      if (selectedTower.level == 1) {
        text("Damage: " + bombUpgrades[0], 20, 410)
        text("Cooldown: " + (bombUpgrades[1] / 60), 20, 440)
      } else {
        text("Damage: " + bombUpgrades[3], 20, 410)
        text("Cooldown: " + (bombUpgrades[4] / 60), 20, 440)
      }
    } else if (selectedTower.type == "Archer") {
      text("Upgrade to level: " + (selectedTower.level + 1), 20, 350)
      if (selectedTower.level == 1) {
        text("Damage: " + archerUpgrades[0], 20, 380)
        text("Cooldown: " + (archerUpgrades[1] / 60), 20, 410)
        text("Range: " + archerUpgrades[2], 20, 440)
      } else {
        text("Damage: " + archerUpgrades[3], 20, 380)
        text("Cooldown: " + (archerUpgrades[4] / 60), 20, 410)
        text("Range: " + archerUpgrades[5], 20, 440)
      }
    } else if (selectedTower.type == "Missile") {
      text("Upgrade to level: " + (selectedTower.level + 1), 20, 350)
      if (selectedTower.level == 1) {
        text("Damage: " + missileUpgrades[0], 20, 380)
        text("Cooldown: " + (missileUpgrades[1] / 60), 20, 410)
        text("Range: " + missileUpgrades[2], 20, 440)
      } else {
        text("Damage: " + missileUpgrades[3], 20, 380)
        text("Cooldown: " + (missileUpgrades[4] / 60), 20, 410)
        text("Range: " + missileUpgrades[5], 20, 440)
      }
    }

    textAlign(CENTER, CENTER);
    fill(228, 194, 144)
    rect(112.5, 492.5, 150, 45, 10)
    fill(256, 256, 256)
    if (selectedTower.level == 1) {
      text("Upgrade: £" + selectedTower.cost, 112.5, 490)
    } else if (selectedTower.level == 2) {
      text("Upgrade: £" + (selectedTower.cost * 2), 112.5, 490)
    }
  } 
  if (selectedTower.placed) {
    textAlign(CENTER, CENTER);
    fill(228, 194, 144)
    rect(112.5, 552.5, 150, 45, 10)
    fill(256, 256, 256)
    let money = Math.floor(selectedTower.totalCost / 2)
    text("Sell: £" + money, 112.5, 550)
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
      enemyArray.push(new enemy(465, -50, health, 1, 3, false))
    }
  }
  if (!pause) {
    spawnCountdown++
  }
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

function levelCompleteMessage() {
  toggles = {
    inputs: false,
    processes: false,
    outputs: false,
  } 

  let selected = false
  let selectedTower;
  for (let i = 0; i < towerArray.length; i++) {
    let towerID = towerArray[i]
    if (towerID.selected) {
      selected = true
      selectedTower = towerID
    } else {
      towerID.show()
    }
  }
  if (selected) {
    towerMenu()
    fill(128, 128, 128, 100)
    ellipse(selectedTower.x, selectedTower.y, selectedTower.radius)
    selectedTower.show()
  }
  towerDisplay()

  fill(128, 128, 128, 150)
  rect(-50, -50, 1300, 700)
  
  rectMode(CENTER)
  textSize(25)
  fill(85, 142, 153)
  rect(width/2, height/2, 400, 200, 20)
  fill(256, 256, 256)
  text("You completed level " + (level - 1) + "!", width/2, 250)

  fill(228, 194, 144)
  textSize(25)
  rectMode(CENTER)
  rect(width/2, 330, 150, 40, 10)
  fill(256, 256, 256)
  text("Continue", width/2, 327)

  rectMode(CORNER)

  // deleting bombs at the end of the level
  for (let i = 0; i < bombArray.length; i++) {
    bombArray.splice(i, 1)
  }
}

function towerDisplay() {
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
  // frost tower
  image(frost1, ((1200 - 975) / 2) + 975, 170, 32, 64)
  text("£75", ((1200 - 975) / 2) + 975, 210)
  // missile tower
  image(missile1, (((1200 - 975) / 4) * 3) + 975, 170, 32, 64)
  text("£75", (((1200 - 975) / 4) * 3) + 975, 210)
  // bomb tower
  image(bomb1, ((1200 - 975) / 4) + 975, 260, 32, 64)
  text("£100", ((1200 - 975) / 4) + 975, 300)
}

function pauseGame() {
  toggles = {
    inputs: false,
    processes: false,
    outputs: false,
  } 

  // shows towers
  let selected = false
  let selectedTower;
  for (let i = 0; i < towerArray.length; i++) {
    let towerID = towerArray[i]
    if (towerID.selected) {
      selected = true
      selectedTower = towerID
    } else {
      towerID.show()
    }
  }
  // shows any selected towers
  if (selected) {
    towerMenu()
    fill(128, 128, 128, 100)
    ellipse(selectedTower.x, selectedTower.y, selectedTower.radius)
    selectedTower.show()
  }
  towerDisplay()
  // shows enemies and bullets
  for (let i = 0; i < enemyArray.length; i++) {
    let enemyID = enemyArray[i]
    enemyID.show()
  }
  for (let i = 0; i < bulletArray.length; i++) {
    let bulletID = bulletArray[i]
    bulletID.show()
  }

  // showing any bombs
  for (let i = 0; i < bombArray.length; i++) {
    let bombID = bombArray[i]
    bombID.show()
  }

  fill(128, 128, 128, 150)
  rect(-50, -50, 1300, 700)
  
  rectMode(CENTER)
  textSize(40)
  fill(85, 142, 153)
  rect(width/2, height/2, 400, 350, 20)
  fill(256, 256, 256)
  text("Game paused", width/2, 175)

  // stats
  textSize(25)
  text("Level: " + level, width/2, 250)
  text("Health: " + health + "/100", width/2, 285)
  text("Currency: £" + currency, width/2, 320)

  fill(228, 194, 144)
  textSize(25)
  rectMode(CENTER)
  rect(width/2, 400, 150, 40, 10)
  fill(256, 256, 256)
  text("Continue", width/2, 397)

  rectMode(CORNER)
}