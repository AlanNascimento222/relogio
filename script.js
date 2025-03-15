function carregarRelogio() {

    const now = new Date

    let hora = now.getHours()
    let minutos = now.getMinutes()
    let segundos = now.getSeconds()
    const tela = document.getElementById('display')

    hora = hora < 10 ? '0' + hora : hora
    minutos = minutos < 10 ? '0' + minutos : minutos
    segundos = segundos < 10 ? '0' + segundos : segundos

    tela.textContent = `${hora}:${minutos}:${segundos}`

}

setInterval(carregarRelogio, 1000)

carregarRelogio()