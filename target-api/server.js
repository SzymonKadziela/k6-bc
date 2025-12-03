const apm = require('elastic-apm-node').start({
  serviceName: 'k6-target-service',
  serverUrl: 'http://localhost:8200', // Port APM Server z Docker Compose
  captureBody: 'all',
});

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

function simulateSlowDatabaseCall() {
    // Celowe opóźnienie 1.5 sekundy, symulujące wolne zapytanie SQL/API
    console.log("-> Opóźnienie uruchomione...");
    return new Promise(resolve => setTimeout(resolve, 1500));
}

app.post('/api/login', (req, res) => {
    // Rozpoczynamy transakcję APM
    const transaction = apm.startTransaction('POST /api/login', 'request');
    
    // Weryfikacja 
    const { username, password } = req.body;
    
    if (username && password) {
        // W realnej aplikacji byłoby sprawdzanie hasła w bazie
        // Zwraca token dla korelacji
        const token = `mock-jwt-token-for-${username}-${Date.now()}`; 
        
        res.status(200).json({ 
            message: 'Login successful', 
            token: token
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }

    if (transaction) {
        transaction.end();
    }
});

app.get('/api/slow', async (req, res) => {
    // Sprawdzamy, czy jest nagłówek autoryzacji
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
    }
    // Token jest obecny, kontynuujemy

    // Rozpoczęcie transakcji
    const transaction = apm.startTransaction('GET /api/slow', 'request');
    
    // 2. Symulacja wolnej operacji (Wąskie Gardło)
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