document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const state = document.getElementById('state').value.trim().toLowerCase();
  
  if (!isValidState(state)) {
    displayError('Please enter a valid US state.');
    return;
  }
  
  clearResults();
  displayLoadingIndicator();
  fetchData(state);
});

document.getElementById('close-modal').addEventListener('click', function() {
  hideModal();
});

function fetchData(state) {
  const results = agents
    .filter(agent => agent.states.some(s => s.toLowerCase() === state))
    .sort((a, b) => {
      const lastNameA = a.name.split(' ').slice(-1)[0].toLowerCase();
      const lastNameB = b.name.split(' ').slice(-1)[0].toLowerCase();
      return lastNameA.localeCompare(lastNameB);
    });

  removeLoadingIndicator();
  if (results.length === 0) {
    displayMessage('No agents found for the specified state.');
  } else {
    displayResults(results);
  }
  showModal();
}

function isValidState(state) {
  const states = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
    "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
    "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana",
    "maine", "maryland", "massachusetts", "michigan", "minnesota",
    "mississippi", "missouri", "montana", "nebraska", "nevada",
    "new hampshire", "new jersey", "new mexico", "new york",
    "north carolina", "north dakota", "ohio", "oklahoma", "oregon",
    "pennsylvania", "rhode island", "south carolina", "south dakota",
    "tennessee", "texas", "utah", "vermont", "virginia", "washington",
    "west virginia", "wisconsin", "wyoming"
  ];
  
  return states.includes(state);
}

function clearResults() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
}

function displayLoadingIndicator() {
  const resultsDiv = document.getElementById('results');
  const loadingIndicator = document.createElement('p');
  loadingIndicator.className = 'loading text-gray-600';
  loadingIndicator.textContent = 'Loading...';
  resultsDiv.appendChild(loadingIndicator);
}

function removeLoadingIndicator() {
  const loadingIndicator = document.querySelector('.loading');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

function displayMessage(message) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p class="text-red-500">${message}</p>`;
}

function displayError(errorMessage) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p id="error-message" class="text-red-500">${errorMessage}</p>`;
  showModal();
}

function clearError() {
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  data.forEach(agent => {
    const agentElement = document.createElement('div');
    agentElement.className = 'agent p-4 border-b border-gray-300';
    
    let contactLink = '';
    if (agent.agent_email) {
      contactLink = `<a href="mailto:${agent.agent_email}" class="block mt-2 text-indigo-600 hover:underline bg-indigo-100 py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">Contact Agent</a>`;
    } else if (agent.agent_page) {
      contactLink = `<a href="${agent.agent_page}" target="_blank" class="block mt-2 text-indigo-600 hover:underline bg-indigo-100 py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">Contact Agent</a>`;
    }
    
    agentElement.innerHTML = `
      <h2 class="text-xl font-bold">${agent.name}</h2>
      ${contactLink}
    `;
    resultsDiv.appendChild(agentElement);
  });
}

function showModal() {
  const modal = document.getElementById('results-modal');
  modal.classList.remove('hidden');
}

function hideModal() {
  const modal = document.getElementById('results-modal');
  modal.classList.add('hidden');
}
