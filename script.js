async function carregarDados() {
    try {
        const response = await fetch('./database.json');
        const jogadores = await response.json();
        
        // Ordena por pontuação (liga vale mais que copa)
        const jogadoresOrdenados = jogadores.sort((a, b) => {
            const pontuacaoA = calcularPontuacao(a.trofeus);
            const pontuacaoB = calcularPontuacao(b.trofeus);
            
            return pontuacaoB - pontuacaoA; // Decrescente
        });
        
        renderizarJogadores(jogadoresOrdenados);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        document.getElementById('jogadores-container').innerHTML = 
            '<p style="color: white; text-align: center;">Erro ao carregar os dados dos jogadores.</p>';
    }
}

function calcularPontuacao(trofeus) {
    let pontuacao = 0;
    
    trofeus.forEach(trofeu => {
        if (trofeu.tipo === 'liga') {
            pontuacao += 3; // Liga vale 3 pontos
        } else if (trofeu.tipo === 'copa') {
            pontuacao += 1; // Copa vale 1 ponto
        }
    });
    
    return pontuacao;
}

function renderizarJogadores(jogadores) {
    const container = document.getElementById('jogadores-container');
    
    jogadores.forEach(jogador => {
        const cardHTML = `
            <div class="card-jogador">
                <img src="${jogador.imagem_escudo}" alt="Escudo do ${jogador.nome}" class="escudo">
                <div class="info-jogador">
                    <h3>${jogador.nome}</h3>
                    <div class="trofeus">
                        ${jogador.trofeus.map(trofeu => `
                            <div class="trofeu-item">
                                <img src="figures/${trofeu.tipo}.png" alt="Troféu ${trofeu.tipo}">
                                <span>${trofeu.ano}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    });
}

document.addEventListener('DOMContentLoaded', carregarDados);