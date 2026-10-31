const status = document.querySelector('#status');
const list = document.querySelector('#places');
function content(properties) {
  const box = document.createElement('div');
  const title = document.createElement('h2'); title.textContent = properties.name;
  const note = document.createElement('p'); note.textContent = properties.note;
  box.append(title,note);
  for (const source of properties.sources) {
    const a = document.createElement('a'); a.href = source.url; a.textContent = source.title; a.target = '_blank'; a.rel = 'noopener noreferrer'; box.append(a);
  }
  return box;
}
try {
  const response = await fetch('./places.geojson');
  if (!response.ok) throw new Error('Data unavailable');
  const data = await response.json();
  for (const feature of data.features) {
    const entry = content(feature.properties); entry.className = 'place'; list.append(entry);
  }
  if (!window.L) {
    status.textContent = 'The map library could not load. All four places and sources are listed below.';
  } else {
    const map = L.map('map', {scrollWheelZoom:false,maxZoom:11});
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom:11, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);
    const layer = L.geoJSON(data, {
      pointToLayer:(feature,latlng) => L.circleMarker(latlng,{radius:9,color:'#C2410C',fillColor:'#C2410C',fillOpacity:0.7,weight:2}),
      onEachFeature:(feature,marker) => marker.bindPopup(content(feature.properties))
    }).addTo(map);
    map.fitBounds(layer.getBounds(), {padding:[30,30]});
    status.textContent = '4 places · approximate markers · checked October 30, 2026';
    tiles.on('tileerror',() => { status.textContent = 'Some map tiles could not load. All places and sources remain available below.'; });
  }
} catch {
  status.textContent = 'Place data could not load. Open places.geojson or Sources & scope below.';
  status.classList.add('error');
}
