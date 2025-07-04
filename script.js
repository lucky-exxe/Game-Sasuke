const sasuke = document.querySelector('.sasuke');
const kunai = document.querySelector('.kunai');
const sasukeMorte = document.querySelector('.sasuke_morte');
const nuvem = document.querySelector('.nuvem');
const nuvem2 = document.querySelector('.nuvem2');
const jumpCountElement = document.getElementById('jump-count');

sasuke.src = './images/sasuke.gif';
sasukeMorte.src = './images/Death.gif';

let bgPosition = 900;
let isGameRunning = true;
let jumpCount = 0;
let ultimaKunai = 0;
let kunaiJaContada = false; // Nova variável para controlar se já contamos esta kunai

// Função para atualizar o contador na tela
function atualizarContador() {
    jumpCountElement.textContent = jumpCount;
    if (jumpCount >= 10) {
        jumpCount = 0;
    }
}

function moveBackground() {
    if (!isGameRunning) return;

    bgPosition -= 1;
    document.querySelector('.game').style.backgroundPositionX = bgPosition + 'px';

    requestAnimationFrame(moveBackground);
}
moveBackground();

const jump = () => {
    sasuke.classList.add('jump');

    setTimeout(() =>{
        sasuke.classList.remove('jump');
    }, 500);
}

const loop = setInterval(() => {

    // Pega a posição da kunai
    const posicaoKunai = kunai.offsetLeft;
    
    // Pega a posição do Sasuke
    const posicaoSasuke = window.getComputedStyle(sasuke).bottom;
    const sasukePulando = parseInt(posicaoSasuke.replace('px', ''));

    // Verifica se está colidindo
    const kunaiRect = kunai.getBoundingClientRect();
    const sasukeRect = sasuke.getBoundingClientRect();

    const colidindo = (
        kunaiRect.left < sasukeRect.right &&
        kunaiRect.right > sasukeRect.left &&
        kunaiRect.top < sasukeRect.bottom &&
        kunaiRect.bottom > sasukeRect.top
    );

    // Verifica se a kunai está na posição do Sasuke
    const kunaiNaPosicao = (
        kunaiRect.left < sasukeRect.right &&
        kunaiRect.right > sasukeRect.left
    );

    // Se está pulando e a kunai está na posição
    if (sasukePulando > 0 && kunaiNaPosicao && !kunaiJaContada) {
        // Só conta se for uma kunai nova
        if (posicaoKunai != ultimaKunai) {
            jumpCount = jumpCount + 1;
            ultimaKunai = posicaoKunai;
            kunaiJaContada = true; // Marca que já contamos esta kunai
            atualizarContador();
            console.log('Pulo sobre kunai! Total: ' + jumpCount);
        }
    }

    // Reset da flag quando não está mais pulando
    if (sasukePulando <= 0) {
        kunaiJaContada = false;
    }

    // Se estiver colidindo (batendo na kunai)...
    if (colidindo) {
        isGameRunning = false;

        // Para a animação da kunai
        const kunaiLeft = kunai.offsetLeft;
        kunai.style.animation = 'none';
        kunai.style.left = kunaiLeft + 'px';
        kunai.style.position = 'absolute';

        // Mostra a morte do Sasuke
        sasuke.style.display = 'none';
        sasukeMorte.style.display = 'block';
        sasukeMorte.src = './images/death.gif'

        const deathImage = new Image();
        deathImage.src = './images/death_image.gif';

        setTimeout(() => {
            if (deathImage.complete) {
                sasukeMorte.src = './images/death_image.gif';
            } 
            else {
                deathImage.onload = () => {
                    sasukeMorte.src = './images/death_image.gif';
                };
            }
        }, 1620);

        // Para as nuvens
        const nuvemLeft = nuvem.offsetLeft;
        nuvem.style.animation = 'none';
        nuvem.style.left = nuvemLeft + 'px';
        nuvem.style.display = 'block';

        const nuvem2Left = nuvem2.offsetLeft;
        nuvem2.style.animation = 'none';
        nuvem2.style.left = nuvem2Left + 'px';
        nuvem2.style.display = 'block';

        clearInterval(loop);
    }
}, 100)

document.addEventListener('keydown', jump);