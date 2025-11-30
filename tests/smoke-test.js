import http from 'k6/http';
import { check, sleep } from 'k6';
import { getRandomItem, randomSleep } from '../modules/utils.js';

const BASE_URL = __ENV.BASE_URL || 'https://test.k6.io';

// 1. KONFIGURACJA TESTU (OPTIONS)
// Tutaj definiujemy, jak test ma wyglądać (zamiast klikać Thread Group w JMeter)
export const options = {
  // Definiujemy etapy testu (Ramp-up, Hold, Ramp-down)
  stages: [
    { duration: '5s', target: 5 },  // Rozgrzewka: wejdź na 5 użytkowników w 5 sek
    { duration: '10s', target: 5 }, // Utrzymanie: trzymaj 5 użytkowników przez 10 sek
    { duration: '5s', target: 0 },  // Wygaszanie: zejdź do 0 w 5 sek
  ],

  // 2. KRYTERIA SUKCESU (THRESHOLDS) - To jest "Quality Gate"
  // Jeśli te warunki nie zostaną spełnione, k6 zwróci błąd (exit code 1)
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% zapytań musi być szybszych niż 500ms
    http_req_failed: ['rate<0.01'],   // Mniej niż 1% błędów
  },
};

// Lista podstron dostępnych na test.k6.io
const PAGES = [
    '/contacts.php',
    '/news.php',
    '/flip_coin.php',
    '/browser.php'
];

export default function () {
  // 1. Losujemy podstronę używając naszej funkcji z modułu
  const randomPage = getRandomItem(PAGES);
  
  // 2. Budujemy pełny URL
  // Używamy "backticks" (`) do łączenia stringów - to standard w JS
  const currentUrl = `${BASE_URL}${randomPage}`;

  // Logujemy do konsoli, żebyś widział, że to działa (nie rób tego przy dużym teście!)
  console.log(`VU ${__VU} odwiedza: ${randomPage}`);

  const res = http.get(currentUrl);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // 3. Losowy czas myślenia (1-3 sekundy) z naszego modułu
  sleep(randomSleep(1, 3));
}