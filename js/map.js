const MAP_COORDS = {
    // Chilonzor — main N-S segment
    mingorik: { x: 140, y: 50 },
    novza: { x: 140, y: 100 },
    olmazor: { x: 140, y: 150 },
    milliy_bog: { x: 140, y: 200 },
    pushkin: { x: 140, y: 250 },
    amir_temur: { x: 140, y: 300 },
    hamid_olimjon: { x: 140, y: 340 },
    paxtakor: { x: 140, y: 380 },
    mustaqillik: { x: 140, y: 420 },
    // Chilonzor — east arm
    ozgarish: { x: 220, y: 470 },
    dostlik: { x: 280, y: 470 },
    chilonzor_st: { x: 340, y: 470 },
    mashinasozlar: { x: 390, y: 470 },
    buyuk_ipak: { x: 430, y: 470 },
    // Chilonzor — Sergeli branch SW
    choshtepa: { x: 110, y: 450 },
    yangihayot: { x: 80, y: 480 },
    uzbekiston_st: { x: 60, y: 510 },
    sergeli: { x: 50, y: 540 },

    // O'zbekiston — N to SE
    bodomzor: { x: 230, y: 70 },
    toshkent_st: { x: 230, y: 120 },
    beruniy: { x: 230, y: 170 },
    novshahr: { x: 230, y: 220 },
    tinchlik: { x: 230, y: 270 },
    amir_temur_uz: { x: 230, y: 300 },
    oybek: { x: 230, y: 320 },
    xalqlar: { x: 230, y: 380 },
    abdulla_qodiriy: { x: 270, y: 410 },
    alisher_navoi: { x: 280, y: 380 },
    gafur_gulom: { x: 310, y: 380 },

    // Yunusobod — N to S
    turkiston: { x: 310, y: 70 },
    yunusobod_st: { x: 310, y: 120 },
    yunus_rajabiy: { x: 310, y: 170 },
    mirzo_ulugbek: { x: 310, y: 220 },
    minor: { x: 310, y: 270 },
    chorsu: { x: 310, y: 320 },
    gafur_gulom_yu: { x: 310, y: 380 },

    // Circle — arc from Buyuk Ipak SE, curving north to Turkiston
    qoyliq: { x: 470, y: 450 },
    matonat: { x: 510, y: 420 },
    qiyot: { x: 540, y: 380 },
    tolariq: { x: 560, y: 330 },
    xonobod: { x: 565, y: 275 },
    quruvchilar: { x: 555, y: 220 },
    turon: { x: 535, y: 175 },
    qipchoq: { x: 505, y: 140 },
    chinor: { x: 470, y: 115 },
    texnopark: { x: 435, y: 100 },
    yashnobod: { x: 400, y: 90 },
    tuzel: { x: 360, y: 82 },
    olmos: { x: 330, y: 78 },
};

const LINE_COLORS = {
    chilonzor: '#5C9DE8',
    uzbekiston: '#E05C5C',
    yunusobod: '#5BBF7A',
    circle: '#C97BE8',
};

function buildMap(mapData, stations) {
    const svg = document.getElementById('metro-map');
    const ns = 'http://www.w3.org/2000/svg';

    // Draw lines first (so dots appear on top)
    mapData.lines.forEach(line => {
        const coords = line.stations
            .map(id => MAP_COORDS[id])
            .filter(Boolean);

        if (coords.length < 2) return;

        const d = coords
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');

        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', line.color);
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
    });

    // Draw station dots
    stations.forEach(station => {
        const pos = MAP_COORDS[station.id];
        if (!pos) return;

        const color = LINE_COLORS[station.line];

        // Outer ring (always visible, dim)
        const ring = document.createElementNS(ns, 'circle');
        ring.setAttribute('cx', pos.x);
        ring.setAttribute('cy', pos.y);
        ring.setAttribute('r', '6');
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', color);
        ring.setAttribute('stroke-width', '2');
        ring.setAttribute('opacity', '0.25');
        ring.setAttribute('id', `ring-${station.id}`);
        svg.appendChild(ring);

        // Inner dot (fills when found)
        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', pos.x);
        dot.setAttribute('cy', pos.y);
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', '#0f0f1a');
        dot.setAttribute('stroke', color);
        dot.setAttribute('stroke-width', '2');
        dot.setAttribute('opacity', '0.3');
        dot.setAttribute('id', `dot-${station.id}`);
        svg.appendChild(dot);

          // Label (hidden until found)
  const label = document.createElementNS(ns, 'text');
  label.setAttribute('x', pos.labelX ?? pos.x + 8);
  label.setAttribute('y', pos.labelY ?? pos.y + 4);
  label.setAttribute('font-size', '9');
  label.setAttribute('font-family', 'sans-serif');
  label.setAttribute('fill', color);
  label.setAttribute('opacity', '0');
  label.setAttribute('id', `label-${station.id}`);
  label.setAttribute('pointer-events', 'none');
  label.textContent = station.name;
  svg.appendChild(label);
    });
}

function lightUpStation(stationId, lineId) {
    const dot = document.getElementById(`dot-${stationId}`);
    const ring = document.getElementById(`ring-${stationId}`);
    const color = LINE_COLORS[lineId];

    if (dot) {
        dot.setAttribute('fill', color);
        dot.setAttribute('opacity', '1');
    }
    if (ring) {
        ring.setAttribute('opacity', '0.4');
    }
    // Show the label
    const label = document.getElementById(`label-${stationId}`);
    if (label) {
        label.setAttribute('opacity', '1');
    }
}