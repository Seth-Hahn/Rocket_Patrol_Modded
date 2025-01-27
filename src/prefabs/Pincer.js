class Pincer extends Spaceship {

    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue)

        //this ship moves faster than the default ship
        this.moveSpeed = game.settings.spaceshipSpeed * 2
    }


    update() {

        //move ship left
        this.x -= this.moveSpeed

        //wrap from left to right edge
        if(this.x <= 0 - this.width) {
            this.x = game.config.width
        }
    }

    reset() {
        this.x = game.config.width
    }


}