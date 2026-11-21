// ---------- CENA, CÂMERA E RENDERER ----------
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 1.5, 13)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // alpha: deixa o degradê do CSS aparecer
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// ---------- CONTROLES: girar (arrastar) e zoom (scroll / pinça) ----------
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.target.set(0, 1.2, 0)
controls.enableDamping = true // movimento com "inércia"
controls.minDistance = 4      // zoom mínimo
controls.maxDistance = 30     // zoom máximo
controls.update()

// ---------- LUZES ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.7))
const luz = new THREE.DirectionalLight(0xffffff, 0.8)
luz.position.set(5, 8, 10)
scene.add(luz)

// ---------- PEÇAS 3D ----------
// Cria uma "placa" (caixa com espessura)
function criarPlaca(largura, altura, profundidade, cor, x, y) {
    const placa = new THREE.Mesh(
        new THREE.BoxGeometry(largura, altura, profundidade),
        new THREE.MeshStandardMaterial({ color: cor, roughness: 0.6 })
    )
    placa.position.set(x, y, 0)
    scene.add(placa)
    return placa
}

// Cria um plano com texto desenhado em canvas (usa a mesma fonte do seu CSS)
// e devolve uma função desenhar(texto) para trocar o texto depois
const PX = 128 // pixels de canvas por unidade 3D (mais = mais nítido)

function criarTexto({ largura, altura, fonte, cor, x, y, z }) {
    const canvas = document.createElement('canvas')
    canvas.width = largura * PX
    canvas.height = altura * PX
    const ctx = canvas.getContext('2d')
    const textura = new THREE.CanvasTexture(canvas)
    textura.anisotropy = renderer.capabilities.getMaxAnisotropy()

    const material = new THREE.MeshBasicMaterial({ map: textura, transparent: true })
    const plano = new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), material)
    plano.position.set(x, y, z)
    scene.add(plano)

    let ultimo = ''
    function desenhar(texto, forcar = false) {
        if (texto === ultimo && !forcar) return // só redesenha se mudou
        ultimo = texto
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = cor
        ctx.font = `700 ${fonte * PX}px Montserrat, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(texto, canvas.width / 2, canvas.height / 2)
        textura.needsUpdate = true
    }

    return { desenhar, material }
}

// Placa preta principal (o <main> do seu CSS) e placa clara do dia da semana
criarPlaca(9.4, 3.2, 0.8, 0x000000, 0, 0)
criarPlaca(5.2, 1.0, 0.6, 0xf4f4f4, 0, 2.5)

const zMain = 0.41 // um pouquinho na frente da placa principal
const zSemana = 0.31

const semanaTela = criarTexto({ largura: 5.2, altura: 1.0, fonte: 0.5, cor: '#000000', x: 0, y: 2.5, z: zSemana })
const horaTela = criarTexto({ largura: 2.6, altura: 2.2, fonte: 1.6, cor: '#e6e6e6', x: -2.9, y: 0, z: zMain })
const minutoTela = criarTexto({ largura: 2.6, altura: 2.2, fonte: 1.6, cor: '#e6e6e6', x: 0, y: 0, z: zMain })
const segundoTela = criarTexto({ largura: 2.6, altura: 2.2, fonte: 1.6, cor: '#e6e6e6', x: 2.9, y: 0, z: zMain })

// separadores ":" (texto branco; a cor real vem do material, para poder animar o pulse)
const sep1 = criarTexto({ largura: 0.8, altura: 1.5, fonte: 1.0, cor: '#ffffff', x: -1.45, y: 0, z: zMain })
const sep2 = criarTexto({ largura: 0.8, altura: 1.5, fonte: 1.0, cor: '#ffffff', x: 1.45, y: 0, z: zMain })
sep1.desenhar(':')
sep2.desenhar(':')

// ---------- A LÓGICA DO RELÓGIO (a mesma de antes) ----------
const diasSemana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-feira", "Quinta-Feira", "Sexta-Feira", "Sabado"]

function carregarRelogio(forcar = false) {
    const now = new Date

    let semana = diasSemana[now.getDay()]
    let hora = now.getHours()
    let minutos = now.getMinutes()
    let segundos = now.getSeconds()

    hora = hora < 10 ? '0' + hora : hora
    minutos = minutos < 10 ? '0' + minutos : minutos
    segundos = segundos < 10 ? '0' + segundos : segundos

    // antes: horaDisplay.textContent = hora  →  agora: redesenha a textura 3D
    horaTela.desenhar(String(hora), forcar)
    minutoTela.desenhar(String(minutos), forcar)
    segundoTela.desenhar(String(segundos), forcar)
    semanaTela.desenhar(semana, forcar)
}

setInterval(carregarRelogio, 1000)
carregarRelogio()

// quando a fonte terminar de carregar, redesenha tudo com ela
document.fonts.load('700 40px Montserrat').then(() => {
    carregarRelogio(true)
    sep1.desenhar(':', true)
    sep2.desenhar(':', true)
})

// ---------- PULSE dos separadores (era a animação @keyframes pulse do CSS) ----------
const corA = new THREE.Color('#2b2b2b')
const corB = new THREE.Color('#0a0a0a')

// ---------- LOOP DE RENDERIZAÇÃO ----------
const relogioTempo = new THREE.Clock()

function animar() {
    requestAnimationFrame(animar)

    const t = (Math.sin(relogioTempo.getElapsedTime() * (2 * Math.PI) / 3) + 1) / 2 // ciclo de 3s
    sep1.material.color.copy(corA).lerp(corB, t)
    sep2.material.color.copy(corA).lerp(corB, t)

    controls.update()
    renderer.render(scene, camera)
}
animar()

// ---------- RESPONSIVO ----------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
