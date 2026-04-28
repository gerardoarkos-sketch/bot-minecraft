const mineflayer = require('mineflayer')

function crearBot() {
  console.log('🔄 Intentando conectar...')

  const bot = mineflayer.createBot({
    host: 'badum-XYzx.aternos.me',
    port: 45997,
    username: 'Bogao_waton',
    version: false
  })

  bot.on('spawn', () => {
    console.log('✅ Bot conectado')

    // Saltar cada 30s
    setInterval(() => {
      if (!bot.entity) return
      bot.setControlState('jump', true)
      setTimeout(() => bot.setControlState('jump', false), 500)
    }, 30000)

    // Mover cabeza cada 15s
    setInterval(() => {
      if (!bot.entity) return
      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * Math.PI / 2
      bot.look(yaw, pitch, true)
    }, 15000)
  })

  bot.on('end', () => {
    console.log('❌ Desconectado, reintentando en 5s...')
    setTimeout(crearBot, 5000)
  })

  bot.on('error', (err) => {
    console.log('⚠️ Error:', err.message)
  })
}

crearBot()