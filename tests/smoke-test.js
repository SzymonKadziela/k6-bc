import http from 'k6/http';
// POPRAWKA TUTAJ: group jest wewnątrz nawiasów klamrowych
import { check, sleep, group } from 'k6'; 
import { SharedArray } from 'k6/data';
import { getRandomItem, randomSleep } from '../modules/utils.js';

// Wczytywanie danych z pliku (symulacja)
const users = new SharedArray('users', function () {
  return [
    { user: 'user1', password: 'pass1' },
    { user: 'user2', password: 'pass2' },
    { user: 'user3', password: 'pass3' }
  ];
});

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'; 

export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '10s', target: 5 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<4000'], 
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
    // Pobieramy dane dla konkretnego VU
    const userData = users[__VU % users.length];
    let authToken = null;

    // KROK 1: Logowanie
    group('01_User_Login', function () {
        const loginUrl = `${BASE_URL}/api/login`;
        
        const payload = JSON.stringify({
            username: userData.user,
            password: userData.password,
        });

        const params = {
            headers: { 'Content-Type': 'application/json' },
            tags: { name: 'Login' }
        };

        const res = http.post(loginUrl, payload, params);

        check(res, {
            'Login Status 200': (r) => r.status === 200,
            'Token received': (r) => r.json('token') !== undefined,
        });

        // Wyciągamy token z odpowiedzi
        try {
            authToken = res.json('token');
        } catch (e) {
            authToken = null;
        }
        
        sleep(randomSleep(1, 2));
    });

    // KROK 2: Użycie Tokena
    group('02_Slow_Endpoint', function () {
        if (!authToken) {
            console.log(`VU ${__VU} - Brak tokena, pomijam krok 2`);
            return;
        }

        const slowUrl = `${BASE_URL}/api/slow`;
        const params = {
            headers: { 'Authorization': `Bearer ${authToken}` },
            tags: { name: 'Slow_Endpoint' }
        };

        const res = http.get(slowUrl, params);

        check(res, {
            'Slow Status 200': (r) => r.status === 200,
        });

        sleep(randomSleep(1, 3));
    });
}