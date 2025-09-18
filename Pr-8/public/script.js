let counterDisplay = document.getElementById('counter');

async function fetchCounter() {
  try {
    const res = await fetch('/count');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    counterDisplay.innerText = data.count;
  } catch (error) {
    console.error('Error fetching counter:', error);
    counterDisplay.innerText = 'Error';
    showError('Failed to load counter');
  }
}

async function updateCount(change) {
  try {
    const res = await fetch('/count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    counterDisplay.innerText = data.count;

    // Add visual feedback
    counterDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => {
      counterDisplay.style.transform = 'scale(1)';
    }, 200);

  } catch (error) {
    console.error('Error updating counter:', error);
    showError('Failed to update counter');
  }
}

async function resetCount() {
  try {
    const res = await fetch('/reset', { method: 'POST' });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    counterDisplay.innerText = data.count;

    // Add visual feedback for reset
    counterDisplay.style.color = '#e74c3c';
    setTimeout(() => {
      counterDisplay.style.color = '#2c3e50';
    }, 500);

  } catch (error) {
    console.error('Error resetting counter:', error);
    showError('Failed to reset counter');
  }
}

function showError(message) {
  // Create or update error display
  let errorDiv = document.getElementById('error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.style.cssText = `
      background: #e74c3c;
      color: white;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      text-align: center;
      display: none;
    `;
    document.querySelector('.container').appendChild(errorDiv);
  }

  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  // Hide error after 3 seconds
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 3000);
}

// Add connection status indicator
async function checkConnection() {
  try {
    const res = await fetch('/health');
    if (res.ok) {
      document.body.classList.remove('offline');
      document.body.classList.add('online');
    } else {
      throw new Error('Server not responding');
    }
  } catch (error) {
    document.body.classList.remove('online');
    document.body.classList.add('offline');
    showError('Connection lost. Check server status.');
  }
}

// Load counter on page load
document.addEventListener('DOMContentLoaded', function () {
  fetchCounter();
  checkConnection();

  // Check connection every 30 seconds
  setInterval(checkConnection, 30000);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function (event) {
  if (event.key === '+' || event.key === '=') {
    updateCount(1);
  } else if (event.key === '-') {
    updateCount(-1);
  } else if (event.key === 'r' || event.key === 'R') {
    resetCount();
  }
});

// Load on page load (keeping for backward compatibility)
fetchCounter();
