let jogadoresRenderizados = false;

async function carregarDados() {
    try {
        const jogadores = await window.dataManager.loadData();
        
        // Ordena por pontuação
        const jogadoresOrdenados = jogadores.sort((a, b) => {
            const pontuacaoA = window.dataManager.calcularPontuacao(a.trofeus);
            const pontuacaoB = window.dataManager.calcularPontuacao(b.trofeus);
            
            return pontuacaoB - pontuacaoA;
        });
        
        renderizarJogadores(jogadoresOrdenados);
    } catch (error) {
        document.getElementById('jogadores-container').innerHTML = 
            '<p style="color: white; text-align: center;">Erro ao carregar os dados dos jogadores.</p>';
    }
}

function renderizarJogadores(jogadores) {
    if (jogadoresRenderizados) return;
    
    const container = document.getElementById('jogadores-container');
    const fragment = document.createDocumentFragment();
    
    jogadores.forEach(jogador => {
        const trofeusAgrupados = window.dataManager.agruparTrofeus(jogador.trofeus);
        
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-jogador';
        
        cardDiv.innerHTML = `
            <img src="${jogador.imagem_escudo}" alt="Escudo do ${jogador.nome}" class="escudo" loading="lazy">
            <div class="info-jogador">
                <h3>${jogador.nome}</h3>
                <div class="trofeus">
                    ${trofeusAgrupados.map(trofeu => `
                        <div class="trofeu-item">
                            <img src="figures/${trofeu.tipo}.png" alt="Troféu ${trofeu.tipo}" loading="lazy">
                            <span>${trofeu.ano}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        fragment.appendChild(cardDiv);
    });
    
    container.appendChild(fragment);
    jogadoresRenderizados = true;
}

// Funcionalidade do botão voltar ao topo com throttle
let scrollTimeout;
function iniciarBotaoTopo() {
    const btnTopo = document.getElementById('btn-topo');
    
    if (btnTopo) {
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    btnTopo.classList.add('show');
                } else {
                    btnTopo.classList.remove('show');
                }
                scrollTimeout = null;
            }, 10);
        }, { passive: true });
        
        btnTopo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        carregarDados();
        iniciarBotaoTopo();
    });
});