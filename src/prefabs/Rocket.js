//Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)


        //add object to existing scene
        scene.add.existing(this) //add to existing, displayList, updateList
        this.isFiring = false    //track rocket's firing status
        this.moveSpeed = 2       // speed in px/f

        this.sfxShot = scene.sound.add('sfx-shot')
    }

    update() {
        // left / right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize - this.width) {
                this.x -= this.moveSpeed
            } else if(keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed
            } else if (isMouseInWindow) {
                this.x = mousePosition
            }
        }
        isMouseInWindow = false

        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyFIRE) || wasLeftClickPressed) {
            this.isFiring = true
            this.sfxShot.play()
            numRocketsFired++
            wasLeftClickPressed = false
        }

        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed
        }

        //reset on miss
        if(this.y <= borderUISize * 3 + borderPadding)
        {
            this.reset()
            didRocketMiss = true;
            
        }
    }

    //reset rocket to ground
    reset() {
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
        //set proper color for two player mode
        if(isTwoPlayer &&
            numRocketsFired % 2 == 1) {
            this.setTint(0x0000ff) //player two (blue)
        } else
        if (isTwoPlayer) {
            this.setTint(0xff0000) //player one (red)
        }
    }
}