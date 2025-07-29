let counterDisplay = document.getElementById('counter');

async function fetchCounter() {
  const res = await fetch('/count');
  const data = await res.json();
  counterDisplay.innerText = data.count;
}

async function updateCount(change) {
  const res = await fetch('/count', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ change })
  });
  const data = await res.json();
  counterDisplay.innerText = data.count;
}

async function resetCount() {
  const res = await fetch('/reset', { method: 'POST' });
  const data = await res.json();
  counterDisplay.innerText = data.count;
}

fetchCounter(); // Load on page load
