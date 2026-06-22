fetch('data/stations.json')
  .then(response => response.json())
  .then(data => {
    console.log('Lines loaded:', data.lines.length);
    console.log('Stations loaded:', data.stations.length);
  });