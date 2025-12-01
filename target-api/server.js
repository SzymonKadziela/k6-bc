// --- 1. Konfiguracja Agentu APM (MUSI być na samej górze!) ---
const apm = require('elastic-apm-node').start({
  serviceName: 'k6-target-service',
  serverUrl: 'http://localhost:8200', // Port APM Server z Docker Compose
  captureBody: 'all',
});

const express = require('express');
const app = express();
const port = 3000;

// --- FUNKCJA Z BŁĘDEM WYDAJNOŚCIOWYM (Wąskie Gardło) ---
function simulateSlowDatabaseCall() {
    // Celowe opóźnienie 1.5 sekundy, symulujące wolne zapytanie SQL/API
    console.log("-> Opóźnienie uruchomione...");
    return new Promise(resolve => setTimeout(resolve, 1500));
}

app.get('/api/slow', async (req, res) => {
  // Rozpoczęcie transakcji
  const transaction = apm.startTransaction('GET /api/slow', 'request');
  
  // 1. Logowanie - szybki krok
  console.log('Otrzymano żądanie /api/slow');
  
  // 2. Symulacja wolnej operacji (Znajdź mnie w APM!)
  await simulateSlowDatabaseCall();
  
  // 3. Zakończenie
  res.json({ message: 'Request processed after delay.' });

  if (transaction) {
    transaction.end();
  }
});

app.listen(port, () => {
  console.log(`Target API listening at http://localhost:${port}`);
});