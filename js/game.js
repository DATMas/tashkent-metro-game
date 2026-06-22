let stations = [];
const foundIds = new Set();

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

    // Update count
    document.getElementById('found').textContent = foundIds.size;

    // Add to list
    const li = document.createElement('li');
    li.textContent = station.name;
    li.style.color = getLineColor(station.line);
    document.getElementById('found-list').appendChild(li);

    // Flash feedback
    showFeedback(`✅ ${station.name}`);
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