// --- JS extraído de copa_do_mundo_clubes_v1.html ---

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

// Renderização dinâmica dos artilheiros (top scorers)
(function () {
  const artilheirosDiv = document.getElementById('artilheiros-copa');
  if (!artilheirosDiv) return;
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
})();

// Standings API
const STANDINGS_API_URL = 'https://v3.football.api-sports.io/standings?league=15&season=2025';
const API_KEY = '6ab9fabfb32d18cad9adb9525d1076ac';
let standingsGroupsData = [];

async function getStandings() {
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
    }
  } else {
    document.getElementById('standings-groups').innerHTML = '<p class="text-red-600">Erro ao buscar os dados da classificação!</p>';
  }
}

function renderGroupSelect(groups) {
  const select = document.getElementById('group-select');
  if (!select) {
    console.error('Element with id "group-select" not found');
    return;
  }
  select.innerHTML = '';
  groups.forEach((groupArr, idx) => {
    if (!groupArr.length) return;
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
  container.innerHTML = '';
  const groupArr = standingsGroupsData[idx];
  if (!groupArr || !groupArr.length) return;
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
      <td class='px-2 py-1 flex items-center gap-2'><img src='${team.team.logo}' alt='${team.team.name}' class='w-6 h-6 inline-block rounded-full border' />${team.team.name}</td>
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

document.addEventListener('DOMContentLoaded', () => {
  getStandings();
});

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
