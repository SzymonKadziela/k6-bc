import http from 'k6/http';
import { check, sleep } from 'k6';
// Importujemy funkcje z modułu, który stworzyliśmy
import { getRandomItem, randomSleep } from '../modules/utils.js';

// Adres API jest pobierany ze zmiennej środowiskowej (CLI lub GitHub Actions)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'; 

// Lista podstron (dla symulacji, w tym przypadku używamy tylko jednego endpointu /api/slow)
const API_ENDPOINTS = [
    '/api/slow',
];

// 1. KONFIGURACJA TESTU (OPTIONS)
export const options = {
  stages: [
    { duration: '5s', target: 5 },  // Rozgrzewka: wejdź na 5 użytkowników w 5 sek
    { duration: '10s', target: 5 }, // Utrzymanie: trzymaj 5 użytkowników przez 10 sek
    { duration: '5s', target: 0 },  // Wygaszanie: zejdź do 0 w 5 sek
  ],

  // 2. KRYTERIA SUKCESU (THRESHOLDS) - CELOWO Ustawiamy nisko, aby test FAILED!
  thresholds: {
    // Wiemy, że API zajmuje 1500ms, więc 1000ms MUSI zwrócić błąd (exit code 1)
    http_req_duration: ['p(95)<4000'], 
    http_req_failed: ['rate<0.9'],
  },
};

// 3. SCENARIUSZ TESTOWY (MAIN FUNCTION)
export default function () {
  // Losujemy endpoint z naszej listy
  const randomEndpoint = getRandomItem(API_ENDPOINTS);
  
  // Budujemy pełny URL
  const currentUrl = `${BASE_URL}${randomEndpoint}`;

  // Logujemy do konsoli, żeby wiedzieć, co testujemy
  console.log(`VU ${__VU} odwiedza: ${randomEndpoint}`);

  // Wykonujemy zapytanie do aplikacji z wąskim gardłem
  const res = http.get(currentUrl);

  // 4. ASERCJE (CHECKS)
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Losowy czas myślenia (pacing) - 1-3 sekundy
  sleep(randomSleep(1, 3));
}