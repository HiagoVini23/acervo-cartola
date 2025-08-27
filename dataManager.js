class DataManager {
    constructor() {
        this.cache = null;
        this.isLoading = false;
        this.listeners = [];
    }

    async loadData() {
        // Se já está carregando, espera o carregamento atual
        if (this.isLoading) {
            return new Promise((resolve) => {
                this.listeners.push(resolve);
            });
        }

        // Se já tem cache, retorna imediatamente
        if (this.cache) {
            return this.cache;
        }

        this.isLoading = true;

        try {
            const response = await fetch('./database.json');
            const jogadores = await response.json();
            
            this.cache = jogadores;
            
            // Notifica todos os listeners esperando
            this.listeners.forEach(listener => listener(this.cache));
            this.listeners = [];
            
            return this.cache;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.listeners.forEach(listener => listener(null));
            this.listeners = [];
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Métodos utilitários compartilhados
    calcularPontuacao(trofeus) {
        let pontuacao = 0;
        
        for (const trofeu of trofeus) {
            switch (trofeu.tipo) {
                case 'liga':
                    pontuacao += 3;
                    break;
                case 'liga-corridos':
                    pontuacao += 2;
                    break;
                case 'copa':
                    pontuacao += 1;
                    break;
            }
        }
        
        return pontuacao;
    }

    agruparTrofeus(trofeus) {
        const ligas = [];
        const copas = [];
        const ligasCorridos = [];
        
        for (const trofeu of trofeus) {
            switch (trofeu.tipo) {
                case 'liga':
                    ligas.push(trofeu);
                    break;
                case 'copa':
                    copas.push(trofeu);
                    break;
                case 'liga-corridos':
                    ligasCorridos.push(trofeu);
                    break;
            }
        }
        
        // Ordena por ano
        ligas.sort((a, b) => a.ano - b.ano);
        copas.sort((a, b) => a.ano - b.ano);
        ligasCorridos.sort((a, b) => a.ano - b.ano);
        
        return [...ligas, ...copas, ...ligasCorridos];
    }

    formatarTipo(tipo) {
        const tipos = {
            'liga': 'Liga Clássica',
            'copa': 'Copa',
            'liga-corridos': 'Liga de Pontos'
        };
        
        return tipos[tipo] || tipo;
    }
}

// Instância global compartilhada
window.dataManager = new DataManager();