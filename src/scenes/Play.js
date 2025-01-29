class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {

        //mouse controls
        this.input.on('pointerdown', (pointer) => {
            if(pointer.button === 0) {
                wasLeftClickPressed = true
            }
        })

        this.input.on('pointermove', (pointer) => {
            mousePosition = pointer.x
            isMouseInWindow = true
        })


        //time tracking 
        this.startTime = this.time.now;
        this.totalGameTime = game.settings.gameTimer
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        this.starfield.depth = -1
        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0)

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0,0)

        //add 2 player mode rockets if needed
        if(isTwoPlayer) {
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
            this.p1Rocket.setTint(0xff0000)
        } else {
        //add 1 player rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        }
        this.p1Rocket.setInteractive()
        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        //add pincer ships (x2)
        this.pincer01 = new Pincer(this, game.config.width + borderUISize*8, borderUISize*3 + borderPadding*2, 'pincer', 0, 60).setOrigin(0, 0)
        this.pincer02 = new Pincer(this, game.config.width + borderUISize * 4, borderUISize * 8 + borderPadding, 'pincer', 0, 60).setOrigin(0,0)
        this.pincer01.depth = -1
        this.pincer02.depth = -1
        //define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        //initialize score
        this.p1Score = 0
        this.p2Score = 0

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        
        //add two player score if applicable
        if(isTwoPlayer) {
            this.scoreRight = this.add.text(borderUISize*15 + borderPadding, borderUISize + borderPadding*2, this.p2Score, scoreConfig)
        }
        //GAME OVER flag
        this.gameOver = false

        //60 second clock
        scoreConfig.fixedWidth = 0
        this.createTimer(game.settings.gameTimer)
    }

    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            numRocketsFired = 0
            this.scene.restart()
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            isTwoPlayer = false
            this.scene.start("menuScene")
        }
        this.starfield.tilePositionX -= 4

        if(!this.gameOver) {
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
            this.pincer01.update()
            this.pincer02.update()

        }

        if(didRocketMiss) {
            this.adjustTime(-7000)
            let timeLost = this.add.text(borderUISize*7 + borderPadding, borderUISize + borderPadding*2, '-7 seconds', this.scoreConfig)
            this.time.delayedCall(1000, () => { //show time added 
            timeLost.destroy();
            })
            didRocketMiss = false
        }
        //collision check
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if(this.checkCollision(this.p1Rocket, this.pincer01)){
            this.p1Rocket.reset()
            this.shipExplode(this.pincer01)
        }
        if(this.checkCollision(this.p1Rocket, this.pincer02)){
            this.p1Rocket.reset()
            this.shipExplode(this.pincer02)
        }
    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if(rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {

                return true
            } else {
                return false
            }
    }

    shipExplode(ship) {
        //increase time on hit
        this.adjustTime(5000) //+5 seconds
        let timeAdded = this.add.text(borderUISize*7 + borderPadding, borderUISize + borderPadding*2, '+5 seconds', this.scoreConfig)
        this.time.delayedCall(1000, () => { //show time added 
            timeAdded.destroy();
        })
        //temporarily hide ship
        ship.alpha = 0

        //explosion at ship position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0)
        
        boom.anims.play('explode')                  //play explode animation
        boom.on('animationcomplete', () => {        //callback on end of anim
            ship.reset()                            //reset the ship position
            ship.alpha = 1                           //make ship visible
            boom.destroy()                          //remove explosion sprite
        })

        //score add and text update

        if(isTwoPlayer && numRocketsFired % 2 == 0) //update player 2 score if applicable
        {
            this.p2Score += ship.points
            this.scoreRight.text = this.p2Score
        } else { //update player one score
            this.p1Score += ship.points
            this.scoreLeft.text = this.p1Score
        }

        this.sound.play('sfx-explosion')
    }

    adjustTime(timeChange) {
        let elapsedTime = this.time.now - this.startTime
        let remainingTime = this.totalGameTime - elapsedTime

        let newTime = Math.max(0, remainingTime + timeChange) //time cant be negative

        //destroy old timer
        this.clock.remove();

        //set new duration
        this.totalGameTime = elapsedTime + newTime;

        //create new timer
        console.log(newTime)
        this.createTimer(newTime)

    }

    createTimer(time) {
        this.clock = this.time.delayedCall(time, () => {
            this.scoreConfig.fixedWidth = 0
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', this.scoreConfig).setOrigin(0.5)
            
            //show which player wins if two player
            if(isTwoPlayer && this.p1Score > this.p2Score) { //player 1 victory
                this.add.text(game.config.width/2, game.config.height/2 + 128, `Red wins! Score: ${this.p1Score}`, this.scoreConfig).setOrigin(0.5)
            } else 
            if (this.p2Score > this.p1Score) { //player 2 victory
                this.add.text(game.config.width/2, game.config.height/2 + 128, `Blue wins! Score: ${this.p2Score}`, this.scoreConfig).setOrigin(0.5)
            } else
            if (isTwoPlayer && this.p1Score == this.p2Score) //draw
            {
                this.add.text(game.config.width/2, game.config.height/2 + 128, `Draw`, this.scoreConfig).setOrigin(0.5)
            }
            this.gameOver = true
        }, null, this)  
    }

    scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
        top: 5,
        bottom: 5,
        },
        fixedWidth: 100
    }

}

