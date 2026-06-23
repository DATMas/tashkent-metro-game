let stations = [];
let mapData = null;
const foundIds = new Set();
let seconds = 0;
let timerInterval = null;

Promise.all([
    fetch('data/stations.json').then(r => r.json()),
    fetch('data/map.json').then(r => r.json())
]).then(([stationData, mapJson]) => {
    stations = stationData.stations;
    mapData = mapJson;
    document.getElementById('total').textContent = stations.length;
    buildMap(mapData, stations);
});

// 1. Load the data
fetch('data/stations.json')
    .then(r => r.json())
    .then(data => {
        stations = data.stations;
        document.getElementById('total').textContent = stations.length;
    });

// 2. Normalise text for comparison
function normalise(str) {
    return str
        .toLowerCase()
        .replace(/[''ʻʼ`]/g, "'") // treat all apostrophe variants as one
        .trim();
}

//  Check typed input against all station aliases
function checkGuess(input) {
    const guess = normalise(input);
    if (!guess) return null;

    return stations.find(st =>
        !foundIds.has(st.id) &&
        st.aliases.some(alias => normalise(alias) === guess)
    );
}

// --- Handle a correct guess ---
function markFound(station) {
    foundIds.add(station.id);

    // Start timer on first correct guess
    if (foundIds.size === 1) startTimer();

    // Update count
    document.getElementById('found').textContent = foundIds.size;

    // Update progress bar
    const pct = (foundIds.size / stations.length) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';

    // Light up the map
    lightUpStation(station.id, station.line);

    // Add to list
    const li = document.createElement('li');
    li.textContent = station.name;
    li.style.color = getLineColor(station.line);
    document.getElementById('found-list').appendChild(li);

    // Flash feedback
    showFeedback(`✅ ${station.name}`);
    // Check if finished
    if (foundIds.size === stations.length) {
        clearInterval(timerInterval);
        showFeedback(`🎉 Done in ${document.getElementById('timer').textContent}!`);
        document.getElementById('guess-input').disabled = true;
    }
}

// --- Show feedback message ---
function showFeedback(message) {
    const el = document.getElementById('feedback');
    el.textContent = message;
    setTimeout(() => el.textContent = '', 1500);
}

// --- Get line colour ---
function getLineColor(lineId) {
    const colors = {
        chilonzor: '#5C9DE8',
        uzbekiston: '#E05C5C',
        yunusobod: '#5BBF7A',
        circle: '#C97BE8'
    };
    return colors[lineId] || 'white';
}

// --- Listen to input ---
const input = document.getElementById('guess-input');

input.addEventListener('input', () => {
    const match = checkGuess(input.value);
    if (match) {
        markFound(match);
        input.value = ''; // clear the box on a correct guess
    }
});

// --- Timer ---
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        document.getElementById('timer').textContent =
            m + ':' + String(s).padStart(2, '0');
    }, 1000);
}

// --- Give up ---
function giveUp() {
    // Stop the timer
    clearInterval(timerInterval);

    // Disable input and button
    document.getElementById('guess-input').disabled = true;
    document.getElementById('give-up-btn').disabled = true;

    // Reveal all unfound stations dimmed
    const unfound = stations.filter(st => !foundIds.has(st.id));

    unfound.forEach(station => {
        const li = document.createElement('li');
        li.textContent = station.name;
        li.style.color = getLineColor(station.line);
        li.style.opacity = '0.35';
        document.getElementById('found-list').appendChild(li);
    });

    showFeedback(`You got ${foundIds.size} of ${stations.length}`);
}