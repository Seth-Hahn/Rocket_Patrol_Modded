//
// Name              : Seth Hahn
// Title             : Rocket Patrol 2 Electric Boogaloo
// Hours to complete : TO ADD
// Mod List: TO ADD








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
let keyFIRE, keyRESET, keyLEFT, keyRIGHT