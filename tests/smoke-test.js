import http from 'k6/http';
import { check, sleep } from 'k6';

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

// 3. SCENARIUSZ TESTOWY (MAIN FUNCTION)
// To jest to, co wykonuje każdy wirtualny użytkownik (VU)
export default function () {
  // Wykonujemy zapytanie
  const res = http.get('https://test.k6.io');

  // 4. ASERCJE (CHECKS)
  // Sprawdzamy, czy odpowiedź jest poprawna (nie przerywa testu, tylko raportuje)
  check(res, {
    'status is 200': (r) => r.status === 200,
    'protocol is HTTP/2': (r) => r.proto === 'h2',
  });

  // Symulacja myślenia użytkownika (pacing) - 1 sekunda przerwy
  sleep(1);
}