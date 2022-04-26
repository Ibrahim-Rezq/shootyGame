const scoreEl = document.querySelector('#score')
let score = 0
const endScoreEl = document.querySelector('#endScore')
const startBtn = document.querySelector('#start')
const modal = document.querySelector('#modal')

let player = new Player(center.x, center.y, 10, playerColor)
let projectiles = []

let enemies = []
let particles = []

const init = () => {
    player = new Player(center.x, center.y, 10, playerColor)
    projectiles = []
    enemies = []
    particles = []
    score = 0
    startBtn.textContent = 'Restart Game'
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
    ctx.fillStyle = 'rgba(0,0,0,.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((projectile, projectileIndex, projectileArray) => {
        projectile.update()

        const distance = getDistance(player, projectile)
        if (distance > canvas.width || distance > canvas.height)
            projectileArray.splice(projectileIndex, 1)
    })
    particles.forEach((particle, particleIndex, particleArray) => {
        particle.update()
        if (particle.alpha <= 0.1)
            setTimeout(() => {
                particleArray.splice(particleIndex, 1)
            }, 0)
    })

    enemies.forEach((enemy, enemyIndex, enemyArray) => {
        enemy.update()
        const distance = getDistance(player, enemy)

        if (distance - enemy.raduis - player.raduis < 0) {
            cancelAnimationFrame(animationId)
            clearInterval(enemiesSpawner)
            endScoreEl.textContent = score
            modal.style.display = 'flex'
        } else if (distance > canvas.width || distance > canvas.height)
            setTimeout(() => {
                enemyArray.splice(enemyIndex, 1)
            }, 0)

        projectiles.forEach((projectile, projectileIndex, projectileArray) => {
            const distance = getDistance(projectile, enemy)

            if (distance - enemy.raduis - projectile.raduis < 0) {
                for (let i = 0; i < enemy.raduis * 2; i++) {
                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
                            getRandom(5),
                            enemy.color,
                            {
                                x: getRandom(0.5, -0.5) * getRandom(8, 4),
                                y: getRandom(0.5, -0.5) * getRandom(8, 4),
                            },
                            getRandom(4)
                        )
                    )
                }
                if (enemy.raduis - 10 > 10) {
                    gsap.to(enemy, {
                        raduis: enemy.raduis - 10,
                    })
                    score += 100
                    setTimeout(() => {
                        projectileArray.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        projectileArray.splice(projectileIndex, 1)
                        enemyArray.splice(enemyIndex, 1)
                    }, 0)
                    score += 250
                }
            }
        })
    })

    player.update()
    scoreEl.textContent = score
}

addEventListener('click', (e) => {
    const velocity = getVelocity({ x: e.clientX, y: e.clientY }, center)
    const projectile = new Projectile(
        center.x,
        center.y,
        projectileSize,
        projectileColor,
        velocity,
        projectileSpeed
    )
    projectiles.push(projectile)
})
addEventListener('keydown', (e) => {
    console.log(e.key)
})

startBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modal.style.display = 'none'
})
