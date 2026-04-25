const players = ["Kibet Aron", "Bralyn Kipkirui", "Manu Kheed", "Lino", "Holyplug", "Manu Josh", "Blamek", "Ian Too"];
let fixtures = [
    // ROUND 1
    { r: 1, p1: "Kibet Aron", p2: "Ian Too", s1: null, s2: null },
    { r: 1, p1: "Bralyn Kipkirui", p2: "Blamek", s1: null, s2: null },
    { r: 1, p1: "Manu Kheed", p2: "Manu Josh", s1: null, s2: null },
    { r: 1, p1: "Lino", p2: "Holyplug", s1: null, s2: null },
    // ROUND 2
    { r: 2, p1: "Ian Too", p2: "Holyplug", s1: null, s2: null },
    { r: 2, p1: "Manu Josh", p2: "Lino", s1: null, s2: null },
    { r: 2, p1: "Blamek", p2: "Manu Kheed", s1: null, s2: null },
    { r: 2, p1: "Kibet Aron", p2: "Bralyn Kipkirui", s1: null, s2: null },
    // ROUND 3
    { r: 3, p1: "Bralyn Kipkirui", p2: "Ian Too", s1: null, s2: null },
    { r: 3, p1: "Manu Kheed", p2: "Kibet Aron", s1: null, s2: null },
    { r: 3, p1: "Lino", p2: "Blamek", s1: null, s2: null },
    { r: 3, p1: "Holyplug", p2: "Manu Josh", s1: null, s2: null },
    // ROUND 4
    { r: 4, p1: "Ian Too", p2: "Manu Josh", s1: null, s2: null },
    { r: 4, p1: "Blamek", p2: "Holyplug", s1: null, s2: null },
    { r: 4, p1: "Kibet Aron", p2: "Lino", s1: null, s2: null },
    { r: 4, p1: "Bralyn Kipkirui", p2: "Manu Kheed", s1: null, s2: null },
    // ROUND 5
    { r: 5, p1: "Manu Kheed", p2: "Ian Too", s1: null, s2: null },
    { r: 5, p1: "Lino", p2: "Bralyn Kipkirui", s1: null, s2: null },
    { r: 5, p1: "Holyplug", p2: "Kibet Aron", s1: null, s2: null },
    { r: 5, p1: "Manu Josh", p2: "Blamek", s1: null, s2: null },
    // ROUND 6
    { r: 6, p1: "Ian Too", p2: "Blamek", s1: null, s2: null },
    { r: 6, p1: "Kibet Aron", p2: "Manu Josh", s1: null, s2: null },
    { r: 6, p1: "Bralyn Kipkirui", p2: "Holyplug", s1: null, s2: null },
    { r: 6, p1: "Manu Kheed", p2: "Lino", s1: null, s2: null },
    // ROUND 7
    { r: 7, p1: "Lino", p2: "Ian Too", s1: null, s2: null },
    { r: 7, p1: "Holyplug", p2: "Manu Kheed", s1: null, s2: null },
    { r: 7, p1: "Manu Josh", p2: "Bralyn Kipkirui", s1: null, s2: null },
    { r: 7, p1: "Blamek", p2: "Kibet Aron", s1: null, s2: null }
];

let isAdmin = false;
const ADMIN_PASSWORD = "EliteAdmin2026"; // CHANGE THIS TO YOUR PASSWORD

function unlockAdmin() {
    let pw = prompt("Enter Password to update scores:");
    if (pw === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById('saveBtn').classList.remove('hidden');
        renderFixtures();
        alert("Logged in as Admin");
    }
}

function renderFixtures() {
    const container = document.getElementById('fixtureContainer');
    container.innerHTML = '';
    let currentRound = 0;

    fixtures.forEach((f, index) => {
        if (f.r !== currentRound) {
            currentRound = f.r;
            container.innerHTML += `<div class="round-header">ROUND ${currentRound}</div>`;
        }
        container.innerHTML += `
            <div class="match">
                <span style="text-align:right">${f.p1}</span>
                <div class="score-inputs">
                    <input type="number" value="${f.s1 !== null ? f.s1 : ''}" ${!isAdmin ? 'readonly' : ''} onchange="updateScore(${index}, 's1', this.value)">
                    <input type="number" value="${f.s2 !== null ? f.s2 : ''}" ${!isAdmin ? 'readonly' : ''} onchange="updateScore(${index}, 's2', this.value)">
                </div>
                <span>${f.p2}</span>
            </div>`;
    });
}

function updateScore(index, key, val) {
    fixtures[index][key] = val === "" ? null : parseInt(val);
    calculateTable();
}

function calculateTable() {
    let stats = {};
    players.forEach(p => stats[p] = { p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 });

    fixtures.forEach(f => {
        if (f.s1 !== null && f.s2 !== null) {
            stats[f.p1].p++; stats[f.p2].p++;
            stats[f.p1].gf += f.s1; stats[f.p1].ga += f.s2;
            stats[f.p2].gf += f.s2; stats[f.p2].ga += f.s1;
            if (f.s1 > f.s2) { stats[f.p1].w++; stats[f.p1].pts += 3; stats[f.p2].l++; }
            else if (f.s1 < f.s2) { stats[f.p2].w++; stats[f.p2].pts += 3; stats[f.p1].l++; }
            else { stats[f.p1].d++; stats[f.p2].d++; stats[f.p1].pts += 1; stats[f.p2].pts += 1; }
            stats[f.p1].gd = stats[f.p1].gf - stats[f.p1].ga;
            stats[f.p2].gd = stats[f.p2].gf - stats[f.p2].ga;
        }
    });

    const sorted = Object.entries(stats).sort((a,b) => b[1].pts - a[1].pts || b[1].gd - a[1].gd);
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    sorted.forEach((item, i) => {
        const [name, s] = item;
        tbody.innerHTML += `<tr><td>${i+1}</td><td>${name}</td><td>${s.p}</td><td>${s.gd}</td><td style="color:#d4af37; font-weight:bold">${s.pts}</td></tr>`;
    });
}

function saveData() {
    // For now, this saves to your browser. 
    // To make players see it, I'll show you how to host it on a 'Live' server.
    localStorage.setItem('efl_scores', JSON.stringify(fixtures));
    alert("Scores Saved! Table Updated.");
}

// Initialization
const savedScores = localStorage.getItem('efl_scores');
if (savedScores) fixtures = JSON.parse(savedScores);
renderFixtures();
calculateTable();
      
