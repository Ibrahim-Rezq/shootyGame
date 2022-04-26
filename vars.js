const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const center = {
    x: canvas.width / 2,
    y: canvas.height / 2,
}

const playerColor = 'white'
const projectileColor = 'white'
const projectileSpeed = 10
const projectileSize = 7.5
const enemySpeed = 2
const friction = 0.98

class Player {
    constructor(x, y, raduis, color) {
        this.x = x
        this.y = y
        this.raduis = raduis
        this.color = color
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
    }
}

class Projectile extends Player {
    constructor(x, y, raduis, color, velocity, speed) {
        super(x, y, raduis, color)
        this.velocity = velocity
        this.speed = speed
    }
    update() {
        this.draw()
        this.x += this.velocity.x * this.speed
        this.y += this.velocity.y * this.speed
    }
}

class Enemy extends Projectile {}
class Particle extends Projectile {
    constructor(x, y, raduis, color, velocity, speed) {
        super(x, y, raduis, color, velocity, speed)
        this.alpha = 1
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }
    update() {
        this.velocity.x *= friction
        this.velocity.y *= friction
        super.update()
        this.alpha -= 0.03
    }
}
