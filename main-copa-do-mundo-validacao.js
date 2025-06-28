// --- JS para SPA/CMS - Copa do Mundo de Clubes ---
// Atualizado em 11:08 às 28/06/25


// Função para aguardar elemento aparecer no DOM
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Elemento ${selector} não encontrado em ${timeout}ms`));
    }, timeout);
  });
}

// Função para toggle dos termos
function toggleTerms() {
  const content = document.getElementById('terms-content');
  const icon = document.getElementById('terms-icon');
  const chevron = document.getElementById('chevron-icon');
  if (content && icon && chevron) {
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      icon.textContent = '−';
      chevron.style.transform = 'rotate(180deg)';
    } else {
      content.classList.add('hidden');
      icon.textContent = '+';
      chevron.style.transform = 'rotate(0deg)';
    }
  }
}

// API dos artilheiros
const ARTILHEIROS_API_URL = 'https://cdn.jsdelivr.net/gh/mu-costa/artilheiros@refs/heads/main/artilheiros.json';

// Função para buscar artilheiros da API
async function fetchArtilheiros() {
  try {
    console.log('🔄 Buscando dados dos artilheiros...');
    const response = await fetch(ARTILHEIROS_API_URL);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const artilheiros = await response.json();
    console.log('✅ Dados dos artilheiros carregados:', artilheiros.length, 'jogadores');
    return artilheiros;
  } catch (error) {
    console.warn('⚠️ Erro ao buscar artilheiros:', error.message);
    
    // Fallback com dados mockados
    return [
      {
        "jogador-foto": "https://s.sde.globo.com/media/person_role/2024/06/14/photo_140x140_jGREsGd.png",
        "jogador-escudo": "https://s.sde.globo.com/media/organizations/2017/09/22/Bayer-Munique-65.png",
        "jogador-nome": "Musiala",
        "jogador-posicao": "Meio-campo",
        "jogador-gols": "3"
      },
      {
        "jogador-foto": "https://s.sde.globo.com/media/person_role/2019/03/13/e3906271f3caccb8796dc63477b6a451_140x140.png",
        "jogador-escudo": "https://s.sde.globo.com/media/organizations/2017/09/22/Bayer-Munique-65.png",
        "jogador-nome": "Coman",
        "jogador-posicao": "Atacante",
        "jogador-gols": "2"
      },
      {
        "jogador-foto": "https://s.sde.globo.com/media/person_role/2022/11/01/photo_140x140_yB5pM4u.png",
        "jogador-escudo": "https://s.sde.globo.com/media/organizations/2025/06/09/Juventus-65x65.png",
        "jogador-nome": "Kolo Muani",
        "jogador-posicao": "Atacante",
        "jogador-gols": "2"
      },
      {
        "jogador-foto": "https://s.sde.globo.com/media/person_role/2019/04/16/2144ecb394516ea16dcf9b465a1bdefe_140x140.png",
        "jogador-escudo": "https://s.sde.globo.com/media/organizations/2023/07/25/inter-miami-65x65-62396.png",
        "jogador-nome": "Messi",
        "jogador-posicao": "Atacante",
        "jogador-gols": "1"
      },
      {
        "jogador-foto": "https://s.sde.globo.com/media/person_role/2020/06/13/7f7d74c23caddf25e45fc48416ddc6d7_140x140.png",
        "jogador-escudo": "https://s.sde.globo.com/media/organizations/2021/03/31/65_Inter_de_Milão_2021.png",
        "jogador-nome": "Lautaro Martínez",
        "jogador-posicao": "Atacante",
        "jogador-gols": "1"
      }
    ];
  }
}

// Renderização dinâmica dos artilheiros (top scorers) - Aguarda elemento e busca da API
async function renderArtilheiros() {
  try {
    const artilheirosDiv = await waitForElement('#artilheiros-copa', 5000);
    
    // Busca dados da API
    const artilheiros = await fetchArtilheiros();
    
    // Ordena por gols (decrescente) e pega os top 10
    const topArtilheiros = artilheiros
      .sort((a, b) => parseInt(b['jogador-gols']) - parseInt(a['jogador-gols']))
      .slice(0, 10);
    
    artilheirosDiv.innerHTML = '';
    
    topArtilheiros.forEach((artilheiro, idx) => {
      const gols = parseInt(artilheiro['jogador-gols']) || 0;
      const posicao = artilheiro['jogador-posicao'] || 'N/A';
      
      artilheirosDiv.insertAdjacentHTML('beforeend', `        <div class="flex-shrink-0 w-36 sm:w-40 md:w-48 lg:w-56 rounded-lg bg-gradient-to-b from-neutral-900 to-neutral-800 shadow-lg overflow-hidden flex flex-col items-center justify-between border border-amber-500/20">
          <div class="flex flex-col items-center justify-center bg-gradient-to-r from-amber-600 to-amber-500 p-3 sm:p-4 w-full">
            <div class="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">#${idx + 1}</div>
            <img src="${artilheiro['jogador-foto']}" alt="${artilheiro['jogador-nome']}" class="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white mb-1 sm:mb-2 object-cover shadow-md bg-white" onerror="this.src='https://via.placeholder.com/64x64/cccccc/666666?text=?'">
            <div class="flex items-center gap-1 mb-1 sm:mb-2">
              <img src="${artilheiro['jogador-escudo']}" alt="Escudo" class="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-white object-cover" onerror="this.src='https://via.placeholder.com/32x32/cccccc/666666?text=?'">
              <span class="block text-xs font-semibold text-white/80 truncate max-w-[80px] sm:max-w-[100px]">${posicao}</span>
            </div>
            <span class="block text-xl sm:text-2xl font-bold text-white">${gols} <span class='text-sm sm:text-base font-normal'>gol${gols !== 1 ? 's' : ''}</span></span>
          </div>
          <div class="p-2 sm:p-3 w-full text-center">
            <h4 class="text-sm sm:text-base font-semibold text-amber-300 break-words leading-tight">${artilheiro['jogador-nome']}</h4>
          </div>
        </div>
      `);
    });
    
    console.log('✅ Artilheiros renderizados com sucesso:', topArtilheiros.length, 'jogadores');
  } catch (error) {
    console.warn('⚠️ Container de artilheiros não encontrado:', error.message);
  }
}

// Função para garantir que os artilheiros sejam renderizados também na variável global window.artilheiros (compatibilidade)
async function setupArtilheirosGlobal() {
  try {
    const artilheiros = await fetchArtilheiros();
    
    // Converte formato da API para formato usado anteriormente
    window.artilheiros = artilheiros
      .sort((a, b) => parseInt(b['jogador-gols']) - parseInt(a['jogador-gols']))
      .slice(0, 10)
      .map(artilheiro => ({
        name: artilheiro['jogador-nome'],
        logo: artilheiro['jogador-foto'],
        team: artilheiro['jogador-posicao'],
        goals: parseInt(artilheiro['jogador-gols']) || 0
      }));
    
    console.log('✅ window.artilheiros configurado com', window.artilheiros.length, 'jogadores');
  } catch (error) {
    console.warn('⚠️ Erro ao configurar artilheiros globais:', error.message);
    window.artilheiros = [];
  }
}

// Função para renderizar ranking completo dos artilheiros em tabela
async function renderRankingArtilheiros() {
  try {
    const rankingDiv = await waitForElement('#ranking-artilheiros', 5000);
    
    // Busca dados da API
    const artilheiros = await fetchArtilheiros();
    
    // Ordena por gols (decrescente)
    const rankingCompleto = artilheiros
      .sort((a, b) => parseInt(b['jogador-gols']) - parseInt(a['jogador-gols']));
    
    rankingDiv.innerHTML = `
      <div class='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow mt-4'>
        <h3 class='text-lg font-bold text-amber-600 mb-2 px-4 pt-4'>🏆 Ranking de Artilheiros - Copa do Mundo de Clubes</h3>
        <table class='min-w-[600px] w-full bg-white rounded-lg'>
          <thead class='bg-gradient-to-r from-amber-50 to-amber-100'>
            <tr>
              <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>Pos</th>
              <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider text-left'>Jogador</th>
              <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider text-left'>Posição</th>
              <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>Gols</th>
            </tr>
          </thead>
          <tbody class='bg-white divide-y divide-gray-200'>
            ${rankingCompleto.map((artilheiro, idx) => {
              const gols = parseInt(artilheiro['jogador-gols']) || 0;
              const posicao = artilheiro['jogador-posicao'] || 'N/A';
              
              return `                <tr class='hover:bg-amber-50 transition ${idx < 3 ? 'bg-amber-25' : ''}'>
                  <td class='px-2 sm:px-3 py-1 sm:py-2 text-center font-bold ${idx === 0 ? 'text-amber-600' : idx < 3 ? 'text-amber-500' : 'text-gray-700'}'>${idx + 1}</td><td class='px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-2 sm:gap-3'>
                    <img src='${artilheiro['jogador-foto']}' alt='${artilheiro['jogador-nome']}' class='w-6 h-6 sm:w-8 sm:h-8 rounded-full border object-cover bg-white' onerror="this.src='https://via.placeholder.com/32x32/cccccc/666666?text=?'" />
                    <div class='flex flex-col'>
                      <span class='font-semibold text-gray-900 text-sm sm:text-base'>${artilheiro['jogador-nome']}</span>
                      <div class='flex items-center gap-1'>
                        <img src='${artilheiro['jogador-escudo']}' alt='Escudo' class='w-3 h-3 sm:w-4 sm:h-4 rounded object-cover' onerror="this.src='https://via.placeholder.com/16x16/cccccc/666666?text=?'" />
                        <span class='text-xs text-gray-500'>Clube</span>
                      </div>
                    </div>
                  </td>                  <td class='px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600'>${posicao}</td>
                  <td class='px-2 sm:px-3 py-1 sm:py-2 text-center'>
                    <span class='inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${idx === 0 ? 'bg-amber-100 text-amber-800' : idx < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}'>
                      ${gols} gol${gols !== 1 ? 's' : ''}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    console.log('✅ Ranking de artilheiros renderizado:', rankingCompleto.length, 'jogadores');
  } catch (error) {
    console.warn('⚠️ Container de ranking de artilheiros não encontrado:', error.message);
  }
}

// Função para renderizar o ranking completo na seção Topscore rankings
async function renderTopscoreRankings() {
  try {
    const rankingContainer = await waitForElement('#topscore-rankings', 5000);
    
    // Busca dados da API
    const artilheiros = await fetchArtilheiros();
    
    // Ordena por gols (decrescente) e pega os top 15
    const topArtilheiros = artilheiros
      .sort((a, b) => parseInt(b['jogador-gols']) - parseInt(a['jogador-gols']))
      .slice(0, 15);      // Cria o cabeçalho
    const headerHTML = `
      <div class="w-full max-w-4xl flex flex-col justify-start items-start gap-1 sm:gap-2">
        <div class="w-full h-8 sm:h-10 py-2 sm:py-2.5 border-t border-b border-white inline-flex justify-start items-center gap-2">
          <div class="flex-1 justify-center text-white text-sm sm:text-base font-normal font-['Inter'] uppercase leading-tight">ranking</div>
          <div class="text-right justify-center text-white text-sm sm:text-base font-normal font-['Inter'] uppercase leading-tight">gols</div>
        </div>
      </div>
    `;
      // Cria o conteúdo da lista
    const playersHTML = topArtilheiros.map((artilheiro, idx) => {
      const gols = parseInt(artilheiro['jogador-gols']) || 0;
      const posicao = artilheiro['jogador-posicao'] || 'N/A';
      const nomeCompleto = artilheiro['jogador-nome'] || 'Nome não disponível';
      const isTop3 = idx < 3;
        return `        <div class="w-full py-2 sm:py-3.5 border-b border-white inline-flex justify-start items-center gap-2 sm:gap-4 hover:bg-white/5 transition-colors duration-200">
          <div class="w-6 sm:w-8 h-7 justify-center ${isTop3 ? 'text-amber-400' : 'text-white/50'} text-2xl sm:text-3xl font-normal font-['Open_Sans']">${idx + 1}</div>
          <div class="flex justify-start items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
            <img class="w-10 h-10 sm:w-12 sm:h-12 relative rounded-[80px] ${isTop3 ? 'border-2 border-amber-400' : 'border border-white/20'} object-cover bg-white" 
                 src="${artilheiro['jogador-foto']}" 
                 alt="${nomeCompleto}"
                 onerror="this.src='https://via.placeholder.com/48x48/374151/9CA3AF?text=${encodeURIComponent(nomeCompleto.charAt(0))}'" />
            <img class="w-5 h-5 sm:w-6 sm:h-6 relative object-cover rounded" 
                 src="${artilheiro['jogador-escudo']}" 
                 alt="Escudo do time"
                 onerror="this.src='https://via.placeholder.com/24x24/374151/9CA3AF?text=?'" />
          </div>
          <div class="flex-1 min-w-0 inline-flex flex-col justify-start items-start">
            <div class="w-full justify-start text-white text-lg sm:text-xl font-normal font-['Inter'] overflow-hidden whitespace-nowrap text-ellipsis">${nomeCompleto}</div>
            <div class="w-full justify-start text-white/50 text-[9px] sm:text-[10px] font-bold font-['Inter'] uppercase overflow-hidden whitespace-nowrap text-ellipsis">${posicao}</div>
          </div>
          <div class="w-12 sm:w-16 text-right justify-center ${isTop3 ? 'text-amber-400' : 'text-white'} text-xl sm:text-2xl font-bold font-['Inter'] leading-relaxed">${gols}</div>
        </div>
      `;
    }).join('');    // Monta o HTML completo
    const containerHTML = `
      ${headerHTML}
      <div class="w-full max-w-4xl flex-1 border-b border-white flex flex-col justify-start items-start overflow-y-auto max-h-[300px] sm:max-h-[400px] scrollbar-thin">
        ${playersHTML}
      </div>
    `;
    
    rankingContainer.innerHTML = containerHTML;
    
    console.log('✅ Topscore rankings renderizado:', topArtilheiros.length, 'jogadores');
  } catch (error) {
    console.warn('⚠️ Container de topscore rankings não encontrado:', error.message);
    
    // Se não encontrar o container, tenta criar uma versão simplificada
    try {
      const fallbackContainer = document.createElement('div');
      fallbackContainer.id = 'topscore-rankings-fallback';
      fallbackContainer.className = 'p-4 text-white bg-red-900/20 rounded mx-4 my-2';
      fallbackContainer.innerHTML = '<p>⚠️ Seção de artilheiros não encontrada no HTML. Verifique se o elemento #topscore-rankings existe.</p>';
      
      // Tenta inserir próximo ao elemento artilheiros-copa se existir
      const artilheirosContainer = document.getElementById('artilheiros-copa');
      if (artilheirosContainer && artilheirosContainer.parentElement) {
        artilheirosContainer.parentElement.appendChild(fallbackContainer);
      } else {
        document.body.appendChild(fallbackContainer);
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback do topscore:', fallbackError);
    }
  }
}

// Mapeamento de bandeiras por clube
const TEAM_FLAGS = {
  'Palmeiras': 'br',
  'Botafogo': 'br',
  'Benfica': 'pt',
  'Chelsea': 'gb-eng',
  'Internazionale': 'it',
  'Fluminense': 'br',
  'Manchester City': 'gb-eng',
  'Al-Hilal': 'sa',
  'Paris Saint-Germain': 'fr',
  'Inter Miami': 'us',
  'Flamengo': 'br',
  'Bayern de Munique': 'de',
  'Borussia Dortmund': 'de',
  'Monterrey': 'mx',
  'Real Madrid': 'es',
  'Juventus': 'it'
};

function getTeamFlag(teamName) {
  const code = TEAM_FLAGS[teamName];
  return code ? `https://flagcdn.com/20x15/${code}.png` : 'https://via.placeholder.com/20x15/cccccc/666666?text=?';
}

// --- Dados essenciais do chaveamento (oitavas de final) ---
const BRACKET_OITAVAS = [
  // Chave A
  {
    chave: 'Chave A',
    jogos: [
      {
        mandante: { nome: 'Palmeiras', escudo: 'https://s.sde.globo.com/media/organizations/2019/07/06/Palmeiras.svg' },
        visitante: { nome: 'Botafogo', escudo: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg' },
        data: '28/06', hora: '13:00', local: 'Filadélfia'
      },
      {
        mandante: { nome: 'Benfica', escudo: 'https://s.sde.globo.com/media/teams/2018/03/11/benfica.svg' },
        visitante: { nome: 'Chelsea', escudo: 'https://s.sde.globo.com/media/teams/2018/03/11/chelsea.svg' },
        data: '28/06', hora: '17:00', local: 'Charlotte'
      },
      {
        mandante: { nome: 'Internazionale', escudo: 'https://s.sde.globo.com/media/organizations/2021/03/31/Inter_de_Milão_2021.svg' },
        visitante: { nome: 'Fluminense', escudo: 'https://s.sde.globo.com/media/organizations/2018/03/11/fluminense.svg' },
        data: '30/06', hora: '16:00', local: 'Charlotte'
      },
      {
        mandante: { nome: 'Manchester City', escudo: 'https://s.sde.globo.com/media/organizations/2018/03/11/manchester-city.svg' },
        visitante: { nome: 'Al-Hilal', escudo: 'https://s.sde.globo.com/media/organizations/2023/02/07/al_hilal_defesa.svg' },
        data: '30/06', hora: '22:00', local: 'Camping World Stadium'
      }
    ]
  },
  // Chave B
  {
    chave: 'Chave B',
    jogos: [
      {
        mandante: { nome: 'Paris Saint-Germain', escudo: 'https://s.sde.globo.com/media/teams/2018/03/12/paris-saint-germain.svg' },
        visitante: { nome: 'Inter Miami', escudo: 'https://s.sde.globo.com/media/organizations/2023/07/25/inter-miami-svg-62393.svg' },
        data: '29/06', hora: '13:00', local: 'Atlanta'
      },
      {
        mandante: { nome: 'Flamengo', escudo: 'https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg' },
        visitante: { nome: 'Bayern de Munique', escudo: 'https://s.sde.globo.com/media/organizations/2018/03/11/bayern-de-munique.svg' },
        data: '29/06', hora: '17:00', local: 'Miami'
      },
      {
        mandante: { nome: 'Borussia Dortmund', escudo: 'https://s.sde.globo.com/media/teams/2018/03/11/borussia-dortmund.svg' },
        visitante: { nome: 'Monterrey', escudo: 'https://s.sde.globo.com/media/organizations/2025/05/20/Monterrey.svg' },
        data: '01/07', hora: '22:00', local: 'Atlanta'
      },
      {
        mandante: { nome: 'Real Madrid', escudo: 'https://s.sde.globo.com/media/teams/2018/03/12/real-madrid.svg' },
        visitante: { nome: 'Juventus', escudo: 'https://s.sde.globo.com/media/organizations/2025/06/27/Juventus.svg' },
        data: '01/07', hora: '16:00', local: 'Miami'
      }
    ]
  }
];

// Função para renderizar o chaveamento das oitavas de final
function renderBracketOitavas() {
  const bracketDiv = document.getElementById('bracket-dinamico');
  if (!bracketDiv) return;
  
  // Monta o HTML do chaveamento
  let html = BRACKET_OITAVAS.map(chave => {
    const jogosHTML = chave.jogos.map(jogo => {
      return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div class="text-xs text-gray-500 mb-2 flex justify-between">
            <span>${jogo.data} • ${jogo.hora}</span>
            <span>${jogo.local}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
              <img src="${jogo.mandante.escudo}" alt="${jogo.mandante.nome}" class="w-12 h-12 object-contain rounded-sm bg-white border border-gray-100" onerror="this.src='https://via.placeholder.com/48x48/cccccc/666666?text=?'">
              <div class="flex flex-col">
                <div class="text-black font-semibold text-base font-sans">${jogo.mandante.nome}</div>
                <img src="${getTeamFlag(jogo.mandante.nome)}" alt="Bandeira ${jogo.mandante.nome}" class="w-5 h-4 object-cover rounded-sm">
              </div>
            </div>
            <div class="px-4">
              <span class="text-[#E9C043] font-bold text-xl">VS</span>
            </div>
            <div class="flex items-center gap-3 flex-1 justify-end">
              <div class="flex flex-col items-end">
                <div class="text-black font-semibold text-base font-sans">${jogo.visitante.nome}</div>
                <img src="${getTeamFlag(jogo.visitante.nome)}" alt="Bandeira ${jogo.visitante.nome}" class="w-5 h-4 object-cover rounded-sm">
              </div>
              <img src="${jogo.visitante.escudo}" alt="${jogo.visitante.nome}" class="w-12 h-12 object-contain rounded-sm bg-white border border-gray-100" onerror="this.src='https://via.placeholder.com/48x48/cccccc/666666?text=?'">
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="mb-8">
        <h3 class="text-lg font-bold text-black text-center font-sans mb-4 bg-[#E9C043] text-[#070300] py-2 rounded-lg">${chave.chave}</h3>
        ${jogosHTML}
      </div>
    `;
  }).join('');
  
  bracketDiv.innerHTML = html;
}

// Inicialização principal - Aguarda DOM ou executa imediatamente se já carregado
async function initializePage() {
  // Configura dados globais primeiro
  await setupArtilheirosGlobal();
  // Renderiza apenas as seções necessárias
  renderArtilheiros();
  renderRankingArtilheiros();
  renderTopscoreRankings();
  renderBracketOitavas(); // <-- garante que o chaveamento aparece
}

// Executa quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  // DOM já carregado, executa imediatamente
  initializePage();
}

// Drag-to-scroll para odds turbinadas
(function () {
  const oddsScroll = document.querySelector('.odds-scroll');
  let isDown = false;
  let startX;
  let scrollLeft;
  if (oddsScroll) {
    oddsScroll.addEventListener('mousedown', (e) => {
      isDown = true;
      oddsScroll.classList.add('active');
      startX = e.pageX - oddsScroll.offsetLeft;
      scrollLeft = oddsScroll.scrollLeft;
    });
    oddsScroll.addEventListener('mouseleave', () => {
      isDown = false;
      oddsScroll.classList.remove('active');
    });
    oddsScroll.addEventListener('mouseup', () => {
      isDown = false;
      oddsScroll.classList.remove('active');
    });
    oddsScroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - oddsScroll.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll-fast
      oddsScroll.scrollLeft = scrollLeft - walk;
    });
    // Touch support
    oddsScroll.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - oddsScroll.offsetLeft;
      scrollLeft = oddsScroll.scrollLeft;
    });
    oddsScroll.addEventListener('touchend', () => {
      isDown = false;
    });
    oddsScroll.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - oddsScroll.offsetLeft;
      const walk = (x - startX) * 1.5;
      oddsScroll.scrollLeft = scrollLeft - walk;
    });
  }
})();

// Betslip remover
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const containerRight = document.querySelector(".view-widget-container-right");
    const betslipDesktop = document.querySelector(".betslip-desktop");
    if (containerRight && betslipDesktop) {
      document.body.appendChild(betslipDesktop);
      containerRight.style.display = "none";
      betslipDesktop.style.position = "fixed";
      betslipDesktop.style.bottom = "0";
      betslipDesktop.style.right = "0";
      betslipDesktop.style.zIndex = "9999";
      betslipDesktop.style.maxHeight = "90vh";
      betslipDesktop.style.overflowY = "auto";
      betslipDesktop.style.display = "block";
      betslipDesktop.style.background = "white";
      betslipDesktop.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
      observer.disconnect();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
