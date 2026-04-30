const mineflayer = require('mineflayer')

// ====== PROTECCIÓN GLOBAL ======
process.on('uncaughtException', (err) => {
  console.log('💥 ERROR GLOBAL:', err)
})

process.on('unhandledRejection', (err) => {
  console.log('💥 PROMESA FALLÓ:', err)
})

// ====== RANDOM ======
function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

let reconectando = false

function crearBot() {
  console.log('🔄 Intentando conectar...')

  const bot = mineflayer.createBot({
    host: 'badum-XYzx.aternos.me',
    port: 45997,
    username: 'Bogao_waton',
    version: false
  })

  let activo = false

  // ====== SPAWN ======
  bot.once('spawn', () => {
    console.log('✅ Bot conectado')
    activo = true
    comportamientoHumano()
  })

  // ====== COMPORTAMIENTO HUMANO ======
  async function comportamientoHumano() {
    while (activo) {

      await new Promise(r => setTimeout(r, random(3000, 20000)))

      if (!bot.entity) continue

      const accion = random(0, 6)

      switch (accion) {

        case 0: // mirar
          const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2
          const pitch = bot.entity.pitch + (Math.random() - 0.5)
          await bot.look(yaw, pitch, true)
          break

        case 1: // moverse
          const moves = ['forward', 'back', 'left', 'right']
          const move = moves[random(0, moves.length)]

          bot.setControlState(move, true)
          await new Promise(r => setTimeout(r, random(1000, 4000)))
          bot.setControlState(move, false)
          break

        case 2: // click
          bot.swingArm()
          break

        case 3: // salto
          bot.setControlState('jump', true)
          setTimeout(() => bot.setControlState('jump', false), 300)
          break

        case 4: // chat
          if (Math.random() < 0.3) bot.chat("...")
          break

        case 5: // nada (importante)
          break
      }
    }
  }

  // ====== COMANDOS POR PRIVADO ======
  bot.on('whisper', (username, message) => {
    if (username === bot.username) return

    console.log(`📩 ${username}: ${message}`)

    const args = message.split(' ')
    const comando = args[0]

    if (comando === 'cmd') {
      bot.chat(args.slice(1).join(' '))
    }

    if (comando === 'say') {
      bot.chat(args.slice(1).join(' '))
    }
  })

  // ====== RECONEXIÓN ======
  function reconectar() {
    if (reconectando) return
    reconectando = true

    console.log('🔄 Reintentando en 5s...')
    setTimeout(() => {
      reconectando = false
      crearBot()
    }, 5000)
  }

  bot.on('end', () => {
    console.log('❌ Desconectado')
    activo = false
    reconectar()
  })

  bot.on('kicked', (reason) => {
    console.log('🚫 Kickeado:', reason)
  })

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err.code || err.message)
    reconectar()
  })
}

// ====== INICIO ======
crearBot()
