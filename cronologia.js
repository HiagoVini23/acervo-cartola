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
    
    // Agrupa troféus por ano
    const trofeusPorAno = {};
    
    for (const trofeu of todosTrofeus) {
        if (!trofeusPorAno[trofeu.ano]) {
            trofeusPorAno[trofeu.ano] = [];
        }
        trofeusPorAno[trofeu.ano].push(trofeu);
    }
    
    // Ordena os anos (mais recente primeiro) e ordena troféus dentro de cada ano
    const anosOrdenados = Object.keys(trofeusPorAno)
        .sort((a, b) => b - a)
        .map(ano => ({
            ano: parseInt(ano),
            trofeus: trofeusPorAno[ano].sort((a, b) => {
                // Ordena por tipo: liga primeiro, depois liga-corridos, depois copa
                const ordem = { 'liga': 1, 'liga-corridos': 2, 'copa': 3 };
                return (ordem[a.tipo] || 4) - (ordem[b.tipo] || 4);
            })
        }));
    
    renderizarCronologia(anosOrdenados);
}

function renderizarCronologia(dadosPorAno) {
    const container = document.getElementById('timeline-container');
    const fragment = document.createDocumentFragment();
    
    dadosPorAno.forEach(({ ano, trofeus }) => {
        // Container do ano
        const anoDiv = document.createElement('div');
        anoDiv.className = 'ano-container';
        
        // Cabeçalho do ano
        const anoHeader = document.createElement('div');
        anoHeader.className = 'ano-header';
        anoHeader.innerHTML = `
            <h2 class="ano-titulo">${ano}</h2>
            <div class="ano-contador">${trofeus.length} troféu${trofeus.length > 1 ? 's' : ''}</div>
        `;
        anoDiv.appendChild(anoHeader);
        
        // Container dos troféus do ano
        const trofeusContainer = document.createElement('div');
        trofeusContainer.className = 'trofeus-ano';
        
        trofeus.forEach(trofeu => {
            const tipoFormatado = window.dataManager.formatarTipo(trofeu.tipo);
            
            const trofeuDiv = document.createElement('div');
            trofeuDiv.className = 'trofeu-item-timeline';
            
            trofeuDiv.innerHTML = `
                <div class="trofeu-icon">
                    <img src="figures/${trofeu.tipo}.png" alt="Troféu ${trofeu.tipo}" loading="lazy">
                </div>
                
                <div class="trofeu-info">
                    <div class="tipo-badge">${tipoFormatado}</div>
                    <div class="campeao-info">
                        <img src="${trofeu.campeao.escudo}" alt="Escudo ${trofeu.campeao.nome}" class="campeao-escudo-mini" loading="lazy">
                        <span class="campeao-nome-mini">${trofeu.campeao.nome}</span>
                    </div>
                </div>
            `;
            
            trofeusContainer.appendChild(trofeuDiv);
        });
        
        anoDiv.appendChild(trofeusContainer);
        fragment.appendChild(anoDiv);
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