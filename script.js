function carregarRelogio() {
    const semanaDisplay = document.getElementById('semana')
    const horaDisplay = document.getElementById('hora')
    const minutoDisplay = document.getElementById('minuto')
    const segundoDisplay = document.getElementById('segundo')
    const diasSemana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-feira", "Quinta-Feira", "Sexta-Feira", "Sabado"]
    const now = new Date

    let semana = diasSemana[now.getDay()]
    let hora = now.getHours()
    let minutos = now.getMinutes()
    let segundos = now.getSeconds()
    const tela = document.getElementById('display')



    hora = hora < 10 ? '0' + hora : hora
    minutos = minutos < 10 ? '0' + minutos : minutos
    segundos = segundos < 10 ? '0' + segundos : segundos

    horaDisplay.textContent = hora
    minutoDisplay.textContent = minutos
    segundoDisplay.textContent = segundos
    semanaDisplay.textContent = semana

}

setInterval(carregarRelogio, 1000)

carregarRelogio()