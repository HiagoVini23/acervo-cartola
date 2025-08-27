async function carregarCronologia() {
    try {
        const jogadores = await window.dataManager.loadData();
        processarCronologia(jogadores);
    } catch (error) {
        document.getElementById('timeline-container').innerHTML = 
            '<p style="color: white; text-align: center;">Erro ao carregar a cronologia dos troféus.</p>';
    }
}

function processarCronologia(jogadores) {
    const todosTrofeus = [];
    
    for (const jogador of jogadores) {
        for (const trofeu of jogador.trofeus) {
            todosTrofeus.push({
                ...trofeu,
                campeao: {
                    nome: jogador.nome,
                    escudo: jogador.imagem_escudo
                }
            });
        }
    }
    
    todosTrofeus.sort((a, b) => b.ano - a.ano);
    renderizarCronologia(todosTrofeus);
}

function renderizarCronologia(trofeus) {
    const container = document.getElementById('timeline-container');
    const fragment = document.createDocumentFragment();
    
    trofeus.forEach(trofeu => {
        const tipoFormatado = window.dataManager.formatarTipo(trofeu.tipo);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';
        
        itemDiv.innerHTML = `
            <div class="timeline-year">${trofeu.ano}</div>
            <div class="timeline-trofeu">
                <img src="figures/${trofeu.tipo}.png" alt="Troféu ${trofeu.tipo}" loading="lazy">
            </div>
            <div class="timeline-campeao">
                <img src="${trofeu.campeao.escudo}" alt="Escudo ${trofeu.campeao.nome}" class="campeao-escudo" loading="lazy">
                <span class="campeao-nome">${trofeu.campeao.nome}</span>
            </div>
            <div class="tipo-badge">${tipoFormatado}</div>
        `;
        
        fragment.appendChild(itemDiv);
    });
    
    container.appendChild(fragment);
}

// Funcionalidade do botão voltar ao topo
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
        carregarCronologia();
        iniciarBotaoTopo();
    });
});