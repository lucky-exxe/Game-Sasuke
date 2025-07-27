const sasuke = document.querySelector('.sasuke');
const kunai = document.querySelector('.kunai');
const sasukeMorte = document.querySelector('.sasuke_morte');
const nuvem = document.querySelector('.nuvem');
const nuvem2 = document.querySelector('.nuvem2');
const jumpCountElement = document.getElementById('jump-count');
const scoreModal = document.getElementById('score-modal');
const finalScoreElement = document.getElementById('final-score');
const maxJumpsElement = document.getElementById('max-jumps');
const playAgainBtn = document.getElementById('play-again-btn');

sasuke.src = './images/sasuke.gif';

let bgPosition = 900; // Variável para controlar a posição do background
let isGameRunning = true; // Variável para controlar se o jogo está em execução
let jumpCount = 0; // Variável para rastrear o número de pulos
let maxJumpCount = 0; // Variável para rastrear o máximo de pulos
let totalPulosAcumulados = 0; // Nova variável para rastrear o total de pulos acumulados
let score = 0; // Nova variável para rastrear quantas vezes passou por kunai
let ultimaKunai = 0; // Variável para rastrear a última kunai
let kunaiJaContada = false; // Nova variável para controlar se já contamos esta kunai
let chidoriAtivo = false; // Nova variável para controlar se o chidori está ativo

// Função para atualizar o contador na tela
function atualizarContador() {
    jumpCountElement.textContent = jumpCount; // Atualiza o contador na tela
    
    // Atualiza o total de pulos acumulados
    totalPulosAcumulados++;
    
    // Atualiza o máximo de pulos se necessário (baseado no total acumulado)
    if (totalPulosAcumulados > maxJumpCount) {
        maxJumpCount = totalPulosAcumulados;
    }
    
    if (jumpCount >= 10 && !chidoriAtivo) {
        // Ativa o modo chidori apenas uma vez quando chegar a 10
        chidoriAtivo = true;
        // Troca para o gif do chidori quando alcançar 10 pulos
        sasuke.src = './images/chidori.gif';
        sasuke.classList.add('chidori-active'); // Adiciona classe CSS
        // Reset do contador após um tempo
        setTimeout(() => {
            jumpCount = 0;
            sasuke.src = './images/sasuke.gif';
            sasuke.classList.remove('chidori-active'); // Remove classe CSS
            chidoriAtivo = false; // Desativa o modo chidori
        }, 5000); // Volta ao normal após 5 segundos
    }
}
const jump = () => {
    if (chidoriAtivo) return; // Impede pular com chidori ativo
    sasuke.classList.add('jump');

    setTimeout(() =>{
        sasuke.classList.remove('jump');
    }, 500);
}


// Função para mostrar o score
function mostrarScore() {
    finalScoreElement.textContent = score;
    maxJumpsElement.textContent = maxJumpCount;
    scoreModal.style.display = 'flex';

// Função para iniciar o loop do jogo    
}
function startGameLoop() {
    const loop = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(loop);
            return;
        }

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

        // Se a kunai está na posição do Sasuke (pulando ou correndo)
        if (kunaiNaPosicao && !kunaiJaContada) {
            // Só conta se for uma kunai nova
            if (posicaoKunai != ultimaKunai) {
                // Se está pulando, conta como pulo
                if (sasukePulando > 0) {
                    jumpCount = jumpCount + 1;
                    atualizarContador();
                }
                
                // Sempre conta como score (passou pela kunai)
                score++;
                ultimaKunai = posicaoKunai;
                kunaiJaContada = true; // Marca que já contamos esta kunai
                console.log('Passou pela kunai! Score: ' + score + ', Pulos: ' + jumpCount);
            }
        }

        // Reset da flag quando a kunai sair da posição do Sasuke
        if (!kunaiNaPosicao) {
            kunaiJaContada = false;
        }

        // Se estiver colidindo (batendo na kunai)...
        if (colidindo && !chidoriAtivo) { // Não morre se o chidori estiver ativo
            // Pausa a animação do background IMEDIATAMENTE
            document.querySelector('.game').style.animationPlayState = 'paused';


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
            
            // Mostra o score após a animação de morte
            setTimeout(() => {
                mostrarScore();
            }, 1620); // Mostra o score 3 segundos após a morte
        }
    }, 100);
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    // Esconde o modal
    scoreModal.style.display = 'none';
    
    // Reseta as variáveis
    jumpCount = 0;
    maxJumpCount = 0;
    totalPulosAcumulados = 0;
    score = 0;
    isGameRunning = true;
    chidoriAtivo = false;
    kunaiJaContada = false;
    ultimaKunai = 0;
    bgPosition = 900;
    
    // Reseta o contador na tela
    jumpCountElement.textContent = '0';
    
    // Reseta o Sasuke
    sasuke.style.display = 'block';
    sasuke.src = './images/sasuke.gif';
    sasuke.classList.remove('chidori-active');
    
    // Esconde a morte
    sasukeMorte.style.display = 'none';
    
    // Reseta a kunai
    kunai.style.animation = 'kunai_animacao 1.5s linear infinite';
    kunai.style.left = '';
    kunai.style.position = '';
    
    // Reseta as nuvens
    nuvem.style.animation = 'nuvem_animacao 10s linear infinite';
    nuvem.style.left = '';
    nuvem.style.display = '';
    
    nuvem2.style.animation = 'nuvem_animacao2 10s linear infinite';
    nuvem2.style.left = '';
    nuvem2.style.display = '';
    
    // Retoma a animação do background
    document.querySelector('.game').style.animationPlayState = 'running';
    
    // Reinicia o loop do jogo
    startGameLoop();
}

// Inicia o loop do jogo
startGameLoop();

// Adiciona evento para o botão "Jogar Novamente"
playAgainBtn.addEventListener('click', reiniciarJogo);

document.addEventListener('keydown', jump);