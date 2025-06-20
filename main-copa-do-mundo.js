// --- JS para SPA/CMS - Copa do Mundo de Clubes ---

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

// Renderização dinâmica dos artilheiros (top scorers) - Aguarda elemento
async function renderArtilheiros() {
  try {
    const artilheirosDiv = await waitForElement('#artilheiros-copa', 5000);
    artilheirosDiv.innerHTML = '';
    (window.artilheiros || []).forEach((artilheiro, idx) => {
      artilheirosDiv.insertAdjacentHTML('beforeend', `
        <div class="flex-shrink-0 w-40 sm:w-48 md:w-56 rounded-lg bg-gradient-to-b from-neutral-900 to-neutral-800 shadow-lg overflow-hidden flex flex-col items-center justify-between border border-amber-500/20">
          <div class="flex flex-col items-center justify-center bg-gradient-to-r from-amber-600 to-amber-500 p-4 w-full">
            <div class="text-white text-2xl font-bold mb-2">#${idx + 1}</div>
            <img src="${artilheiro.logo}" alt="${artilheiro.name}" class="w-16 h-16 rounded-full border-2 border-white mb-2 object-cover shadow-md">
            <span class="block text-sm font-semibold text-white/80">${artilheiro.team}</span>
            <span class="block text-2xl font-bold text-white">${artilheiro.goals} <span class='text-base font-normal'>gols</span></span>
          </div>
          <div class="p-3 w-full text-center">
            <h4 class="text-base font-semibold text-amber-300">${artilheiro.name}</h4>
          </div>
        </div>
      `);
    });
    console.log('✅ Artilheiros renderizados com sucesso');
  } catch (error) {
    console.warn('⚠️ Container de artilheiros não encontrado:', error.message);
  }
}

// Standings API - Adaptado para SPA
const STANDINGS_API_URL = 'https://v3.football.api-sports.io/standings?league=15&season=2025';
const API_KEY = '6ab9fabfb32d18cad9adb9525d1076ac';
let standingsGroupsData = [];

async function getStandings() {
  try {
    console.log('🔄 Iniciando busca de standings...');
    
    // Aguarda elementos estarem disponíveis
    await waitForElement('#group-select', 5000);
    await waitForElement('#standings-groups', 5000);
    
    const response = await fetch(STANDINGS_API_URL, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_KEY
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.response && data.response[0] && data.response[0].league.standings) {
        standingsGroupsData = data.response[0].league.standings;
        renderGroupSelect(standingsGroupsData);
        renderStandingsGroup(0);
        console.log('✅ Standings carregados com sucesso');
      }
    } else {
      throw new Error(`Erro na API: ${response.status}`);
    }
  } catch (error) {
    console.warn('⚠️ Erro ao carregar standings:', error.message);
    
    // Fallback com dados mockados
    standingsGroupsData = [
      [
        { team: { name: 'Manchester City', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png' }, points: 9, rank: 1, all: { played: 3, win: 3, draw: 0, lose: 0, goals: { for: 8, against: 2 } }, goalsDiff: 6 },
        { team: { name: 'Juventus', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Juventus-Logo.png' }, points: 6, rank: 2, all: { played: 3, win: 2, draw: 0, lose: 1, goals: { for: 5, against: 3 } }, goalsDiff: 2 },
        { team: { name: 'Wydad AC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Wydad_AC_logo.svg/1200px-Wydad_AC_logo.svg.png' }, points: 3, rank: 3, all: { played: 3, win: 1, draw: 0, lose: 2, goals: { for: 3, against: 5 } }, goalsDiff: -2 },
        { team: { name: 'Al Ain FC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Al_Ain_FC_logo.svg/1200px-Al_Ain_FC_logo.svg.png' }, points: 0, rank: 4, all: { played: 3, win: 0, draw: 0, lose: 3, goals: { for: 1, against: 7 } }, goalsDiff: -6 }
      ],
      [
        { team: { name: 'Real Madrid', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png' }, points: 9, rank: 1, all: { played: 3, win: 3, draw: 0, lose: 0, goals: { for: 7, against: 1 } }, goalsDiff: 6 },
        { team: { name: 'Borussia Dortmund', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Borussia-Dortmund-Logo.png' }, points: 6, rank: 2, all: { played: 3, win: 2, draw: 0, lose: 1, goals: { for: 4, against: 3 } }, goalsDiff: 1 },
        { team: { name: 'Pachuca', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Pachuca_logo.svg/1200px-Pachuca_logo.svg.png' }, points: 3, rank: 3, all: { played: 3, win: 1, draw: 0, lose: 2, goals: { for: 2, against: 4 } }, goalsDiff: -2 },
        { team: { name: 'Al Hilal', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Al_Hilal_FC_logo.svg/1200px-Al_Hilal_FC_logo.svg.png' }, points: 0, rank: 4, all: { played: 3, win: 0, draw: 0, lose: 3, goals: { for: 1, against: 6 } }, goalsDiff: -5 }
      ]
    ];
    
    try {
      renderGroupSelect(standingsGroupsData);
      renderStandingsGroup(0);
      
      const container = document.getElementById('standings-groups');
      if (container) {
        container.insertAdjacentHTML('afterbegin', '<p class="text-yellow-600 mb-4">⚠️ Dados de demonstração (API indisponível)</p>');
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError);
    }
  }
}

function renderGroupSelect(groups) {
  const select = document.getElementById('group-select');
  if (!select) {
    console.error('Element with id "group-select" not found');
    return;
  }
  
  select.innerHTML = '';
  if (!groups || !Array.isArray(groups)) {
    select.innerHTML = '<option value="-1">Nenhum grupo disponível</option>';
    return;
  }
  
  groups.forEach((groupArr, idx) => {
    if (!groupArr || !groupArr.length) return;
    const groupName = groupArr[0].group || `Grupo ${String.fromCharCode(65 + idx)}`;
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = groupName;
    select.appendChild(option);
  });
  
  select.onchange = function () {
    renderStandingsGroup(Number(this.value));
  };
}

function renderStandingsGroup(idx) {
  const container = document.getElementById('standings-groups');
  if (!container) {
    console.error('Element with id "standings-groups" not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (!standingsGroupsData || !Array.isArray(standingsGroupsData) || 
      !standingsGroupsData[idx] || !standingsGroupsData[idx].length) {
    container.innerHTML = '<p class="text-gray-500 p-4">Nenhum dado disponível para este grupo.</p>';
    return;
  }
  
  const groupArr = standingsGroupsData[idx];
  const groupName = groupArr[0].group || `Grupo ${String.fromCharCode(65 + idx)}`;
  let table = `<div class='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow mt-4'>
    <h3 class='text-lg font-bold text-green-700 mb-2 px-4 pt-4'>${groupName}</h3>
    <table class='min-w-[600px] w-full bg-white rounded-lg'>
      <thead class='bg-gradient-to-r from-gray-50 to-gray-100'>
        <tr>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>Pos</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider text-left'>Time</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>Pts</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>J</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>V</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>E</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>D</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>GP</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>GC</th>
          <th class='px-3 py-2 text-xs font-bold text-gray-700 uppercase tracking-wider'>SG</th>
        </tr>
      </thead>
      <tbody class='bg-white divide-y divide-gray-200'>`;
  
  groupArr.forEach(team => {
    table += `<tr class='hover:bg-green-50 transition'>
      <td class='px-2 py-1 text-center font-semibold'>${team.rank}</td>
      <td class='px-2 py-1 flex items-center gap-2'><img src='${team.team.logo}' alt='${team.team.name}' class='w-6 h-6 inline-block rounded-full border' onerror="this.src='https://via.placeholder.com/24x24/cccccc/666666?text=?'" />${team.team.name}</td>
      <td class='px-2 py-1 text-center font-bold text-green-700'>${team.points}</td>
      <td class='px-2 py-1 text-center'>${team.all.played}</td>
      <td class='px-2 py-1 text-center'>${team.all.win}</td>
      <td class='px-2 py-1 text-center'>${team.all.draw}</td>
      <td class='px-2 py-1 text-center'>${team.all.lose}</td>
      <td class='px-2 py-1 text-center'>${team.all.goals.for}</td>
      <td class='px-2 py-1 text-center'>${team.all.goals.against}</td>
      <td class='px-2 py-1 text-center'>${team.goalsDiff}</td>
    </tr>`;
  });
  table += '</tbody></table></div>';
  container.insertAdjacentHTML('beforeend', table);
}

// Inicialização principal - Aguarda DOM ou executa imediatamente se já carregado
function initializePage() {
  getStandings();
  renderArtilheiros();
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
