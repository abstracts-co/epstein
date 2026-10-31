const list = document.querySelector('#events');
const status = document.querySelector('#status');
const period = document.querySelector('#period');
const key = document.querySelector('#key');
const format = event => {
  const date = new Date(`${event.date}T12:00:00Z`);
  const options = event.precision === 'year' ? {year:'numeric'} : event.precision === 'month' ? {year:'numeric',month:'long'} : {year:'numeric',month:'short',day:'numeric'};
  return date.toLocaleDateString('en-US', {...options,timeZone:'UTC'});
};
try {
  const response = await fetch('./events.json');
  if (!response.ok) throw new Error('Data unavailable');
  const events = await response.json();
  function render() {
    list.replaceChildren();
    const visible = events.filter(event => {
      const year = Number(event.date.slice(0,4));
      return (!key.checked || event.key) && (period.value === 'all' || (period.value === 'early' && year < 2019) || (period.value === 'case' && year >= 2019 && year <= 2022) || (period.value === 'records' && year >= 2023));
    });
    for (const event of visible) {
      const li = document.createElement('li');
      li.className = `event${event.key ? ' key' : ''}`;
      const time = document.createElement('time');
      time.dateTime = event.precision === 'year' ? event.date.slice(0,4) : event.precision === 'month' ? event.date.slice(0,7) : event.date;
      time.textContent = format(event);
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = event.label;
      const note = document.createElement('p'); note.textContent = event.note;
      details.append(summary,note);
      for (const source of event.sources) {
        const a = document.createElement('a'); a.href = source.url; a.textContent = source.title; a.target = '_blank'; a.rel = 'noopener noreferrer'; details.append(a);
      }
      li.append(time,details); list.append(li);
    }
    status.textContent = `${visible.length} of ${events.length} events · checked October 30, 2026`;
  }
  period.addEventListener('change',render); key.addEventListener('change',render); render();
} catch {
  status.textContent = 'The timeline could not load. Open events.json or Sources & scope below.';
  status.classList.add('error');
}
