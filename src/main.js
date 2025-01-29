//
// Name : Seth Hahn
// Title : Super Rocket Patrol 2 Turbo Championship Edition
// Hours to complete : 5
// Mod List: 
//          - create a new enemy spaceship type... (5 points)
//          - Implement an alternating two-player mode (5 points)
//          - Implement a new timing/scoring mechanism
//            that adds time to the clock for successful hits
//            and subtracts time for misses (5 points)
//          - Implement mouse control for player 
//            movement and left mouse click to fire (5 points)

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play],
    physics: {
        default: "arcade",
    }
}

let game = new Phaser.Game(config)

//set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3


//reserve key bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT, keyDOWN

//reserve mouse control variables
let wasLeftClickPressed = false
let mousePosition
let isMouseInWindow = false

//two player variables
let isTwoPlayer = false
let numRocketsFired = 0;

//flag for if a rocket missed a ship
//used for tracking time updates on hit/ss
let didRocketMiss = false