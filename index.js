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
const enemySpeed = 2

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

const player = new Player(center.x, center.y, 10, playerColor)

const projectiles = []

const enemies = []

const getRandom = (max = 100, min = 0) => {
    return Math.random() * (max - min) + min
}
const getDistance = (object1, object2) => {
    return Math.hypot(object1.x - object2.x, object1.y - object2.y)
}
const getVelocity = (postion1, postion2) => {
    const angle = Math.atan2(postion1.y - postion2.y, postion1.x - postion2.x)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    }
    return velocity
}

let enemiesSpawner
const spawnEnemies = () => {
    enemiesSpawner = setInterval(() => {
        const raduis = getRandom(30, 10)
        const enemyColor = `hsl(${getRandom(250)},50%,50%)`

        const postion = {
            x: 0,
            y: 0,
        }
        if (getRandom() < 50) {
            postion.x = getRandom() < 50 ? 0 - raduis : canvas.width + raduis
            postion.y = getRandom(0, canvas.height)
        } else {
            postion.x = getRandom(0, canvas.width)
            postion.y = getRandom() < 50 ? 0 - raduis : canvas.height + raduis
        }
        const velocity = getVelocity(center, { ...postion })
        enemies.push(
            new Enemy(
                postion.x,
                postion.y,
                raduis,
                enemyColor,
                velocity,
                enemySpeed
            )
        )
    }, 1000)
}

let animationId
const animate = () => {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0,0,0,.2)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((projectile, projectileIndex, projectileArray) => {
        projectile.update()

        const distance = getDistance(player, projectile)
        if (distance > canvas.width || distance > canvas.height)
            setTimeout(() => {
                projectileArray.splice(projectileIndex, 1)
            }, 0)
    })

    enemies.forEach((enemy, enemyIndex, enemyArray) => {
        enemy.update()
        const distance = getDistance(player, enemy)

        if (distance - enemy.raduis - player.raduis < 0) {
            cancelAnimationFrame(animationId)
            clearInterval(enemiesSpawner)
        } else if (distance > canvas.width || distance > canvas.height)
            setTimeout(() => {
                enemyArray.splice(enemyIndex, 1)
            }, 0)

        projectiles.forEach((projectile, projectileIndex, projectileArray) => {
            const distance = getDistance(projectile, enemy)

            if (distance - enemy.raduis - projectile.raduis < 0) {
                setTimeout(() => {
                    enemyArray.splice(enemyIndex, 1)
                    projectileArray.splice(projectileIndex, 1)
                }, 0)
            }
        })
    })

    player.update()
}

addEventListener('dblclick', (e) => {})

addEventListener('click', (e) => {
    const velocity = getVelocity({ x: e.clientX, y: e.clientY }, center)
    const projectile = new Projectile(
        center.x,
        center.y,
        10,
        projectileColor,
        velocity,
        projectileSpeed
    )
    projectiles.push(projectile)
})

animate()
spawnEnemies()
