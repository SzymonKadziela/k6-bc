# 🚀 K6 Performance Framework & CI/CD Demo

Ten projekt demonstruje nowoczesne podejście do **Performance Engineering** w oparciu o filozofię **"Performance as Code"**.

Repozytorium przedstawia kompletny, zautomatyzowany cykl testowania wydajności, od napisania kodu testowego do automatycznego uruchamiania go w środowisku Continuous Integration (CI).

## 🛠️ Architektura i Stack

Projekt jest zbudowany z naciskiem na modułowość, skalowalność i pełną obserwowalność.

| Kategoria | Narzędzia / Technologie | Rola w Projekcie |
| :--- | :--- | :--- |
| **Generator Obciążenia** | **k6** (JavaScript ES6) | Definicja zaawansowanych scenariuszy i Quality Gate. |
| **Aplikacja Docelowa** | Node.js (Express) | Symulowany cel testów (zawiera celowe wąskie gardło). |
| **Automatyzacja (CI/CD)** | **GitHub Actions** (YAML) | Uruchamianie testów dymnych po każdym `git push` (Shift-Left). |
| **APM & RCA** | **Elastic APM Stack** | Zbieranie śladów i metryk na poziomie kodu (diagnostyka). |
| **Monitoring Live** | **Grafana + InfluxDB** | Wizualizacja wyników testów obciążeniowych w czasie rzeczywistym. |
| **Konteneryzacja** | **Docker Compose** | Łatwe i powtarzalne uruchamianie środowisk APM/Monitoringu. |

### Struktura Katalogów

* **`tests/`**: Zawiera główne scenariusze testowe, np. `smoke-test.js`.
* **`modules/`**: Zawiera funkcje pomocnicze i reusable code (np. `utils.js` do losowania elementów lub generatorów danych), które są importowane do głównych skryptów.
* **`config/`**: Docelowo przeznaczone na pliki konfiguracyjne specyficzne dla środowisk (np. JSON/YAML).
* **`data/`**: Docelowo przeznaczone na pliki danych wejściowych (np. CSV z danymi logowania).
* **`.github/workflows/`**: Zawiera pliki YAML dla GitHub Actions (`performance.yml`), definiujące, kiedy i jak testy mają być uruchamiane.

## ⚙️ Uruchamianie Testów

### 1. Uruchamianie lokalne (CLI)

Testy mogą być uruchamiane bezpośrednio z terminala przy użyciu lokalnej instalacji k6.

Uruchom API, które będzie celem testów.

'cd target-api'
'npm start'

| Akcja | Komenda |
| :--- | :--- |
| **Z domyślnym URL** | `k6 run tests/smoke-test.js` |
| **Z własnym URL** | `k6 run -e BASE_URL=https://twoja-aplikacja.pl tests/smoke-test.js` |

### 2. Uruchamianie w chmurze (CI/CD)

Testy są w pełni zautomatyzowane. Nie jest wymagana żadna ręczna komenda, aby uruchomić testy zdalnie.

* **Trigger:** Test uruchamia się automatycznie po każdym `git push` do gałęzi `main`.
* **Środowisko:** Test jest uruchamiany na runnerze GitHub Actions (maszyna wirtualna Ubuntu).
* **Weryfikacja:** Wynik Joba (zielony/czerwony znacznik) jest widoczny w zakładce **Actions** na GitHubie.

## 🎯 Kluczowe Funkcjonalności (Umiejętności Senior Performance Engineer)

Ten projekt demonstruje praktyczną znajomość zaawansowanych kompetencji:

### 1. Zaawansowana Symulacja Użytkownika (Korelacja Danych)

* **Wdrożenie Testów Złożonych Transakcji:** Symulacja pełnej ścieżki użytkownika (User Journey), w tym Logowanie oraz Akcja Chroniona.
* **Korelacja Danych (JWT Token):** Implementacja mechanizmu przechwytywania **Tokena JWT** z odpowiedzi JSON po logowaniu (`POST /api/login`) i używania go w nagłówku autoryzacyjnym (`Authorization: Bearer <token>`) w kolejnych żądaniach.
* **Parametryzacja Danych:** Użycie **`SharedArray`** do ładowania danych logowania z CSV, zapewniając unikalność danych dla każdego Wirtualnego Użytkownika (`__VU`).

### 2. Obserwowalność i Diagnostyka (APM & RCA)

* **Real-Time Monitoring:** Integracja stacku **Grafana + InfluxDB** w Dockerze do tworzenia dynamicznych dashboardów. Umożliwia to natychmiastowe śledzenie krytycznych metryk (p95, błędy, przepustowość) podczas trwania testu.
* **Root Cause Analysis (RCA):** Użycie **Elastic APM** (Kibana) do głębokiej analizy śladów (`traces`) aplikacji w trakcie obciążenia. Pozwala to na **dokładne zidentyfikowanie** wąskiego gardła na poziomie kodu (np. funkcja `simulateSlowDatabaseCall` generująca opóźnienie 1.5s).

### 3. Automatyzacja i Quality Gate (CI/CD)

* **Performance as Code:** Tworzenie modularnych i sparametryzowanych skryptów obciążeniowych za pomocą k6.
* **Quality Gate Automation:** Ustanowienie automatycznej Bramki Jakości (**Thresholds k6**) w potoku **GitHub Actions**, która zatrzymuje wdrożenie (FAIL), gdy naruszone zostaną kryteria SLA (np. `p(95) < 500ms`).

## 🚦 Quality Gate (Bramka Jakości)

Ten framework wykorzystuje **Thresholds** k6 jako bramkę jakości w pipeline CI/CD:

* **Cel:** Zapewnienie, że nowo wprowadzony kod nie powoduje regresji wydajności.
* **Mechanizm:** Jeśli test przekroczy zdefiniowane progi (SLA), Job na GitHub Actions **automatycznie zwraca błąd (exit code 1)**, przerywając lub oznaczając build jako nieudany.

### Zdefiniowane Progi (przykładowe)

Aktualnie ustawione progi w `tests/smoke-test.js` to:

* **`http_req_duration`**: `p(95) < 500ms` (95% zapytań musi być szybszych niż 500 milisekund).
* **`http_req_failed`**: `rate < 0.01` (Wskaźnik błędów musi być niższy niż 1%).

## 🎓 Podsumowanie Projektu: Cykl Inżynierii Wydajności

To repozytorium demonstruje pełen **cykl życia inżynierii wydajności (Performance Engineering Lifecycle)**, obejmujący zarówno automatyzację (Shift-Left), jak i głęboką diagnostykę (Root Cause Analysis).

Projekt dowodzi praktycznej znajomości poniższych kluczowych kompetencji, typowych dla **Senior Performance Engineer**:

### I. 💻 Faza Wytwarzania (Shift-Left & CI/CD)
* **Performance as Code:** Tworzenie modularnych i sparametryzowanych skryptów obciążeniowych za pomocą **k6** w JavaScript ES6.
* **Quality Gate Automation:** Ustanowienie automatycznej Bramki Jakości (Quality Gate) w **GitHub Actions**, która zatrzymuje wdrożenie (FAIL), gdy naruszone zostaną kryteria SLA.

### II. 🔬 Faza Diagnozy (APM & Root Cause Analysis)
* **Obserwowalność:** Konfiguracja **Elastic APM Stack** (Elasticsearch, Kibana, APM Server) do zbierania śladów i metryk z aplikacji pod obciążeniem.
* **Lokalizacja Błędu:** Użycie narzędzi APM do **znalezienia i zidentyfikowania konkretnej funkcji (Span)** w kodzie aplikacji (`simulateSlowDatabaseCall`), która generowała opóźnienie 1.5 sekundy (Root Cause Analysis). 

### III. ☁️ Faza Skalowalności (LaaS)
* **Skalowanie Obciążenia:** Uruchomienie testu o wysokiej wolumenie (do 100+ VU) za pomocą **k6 Cloud (LaaS)**, demonstrując umiejętność konfiguracji testów rozproszonych.
* **Zaawansowana Analiza:** Wykorzystanie panelu k6 Cloud do analizy trendów wydajnościowych i generowania raportów.

===================================
MAPA POŁĄCZEŃ I ZALEŻNOŚCI PROJEKTU
(Performance Engineering Stack)
===================================

### 1. Centralny Proces (Load Test Run)

| Źródło                 | ->  | Cel                        | Protokół / Mechanizm         | Rola
| ------------------------ | --- | -------------------------- | ---------------------------- | ----------------------------------------------------
| K6 Test Engine           | ->  | Target API (Node.js)       | HTTP/S (POST, GET)           | Generowanie Obciążenia (Testowanie Funkcjonalne/Wydajnościowe).
| K6 Test Engine           | ->  | InfluxDB                   | --out influxdb (Port 8086)   | Eksport Metryk w czasie rzeczywistym.
| Target API               | ->  | APM Server                 | Elastic APM Agent            | Diagnostyka (Zbieranie Śladów/Traces).

-----------------------------------------------

### 2. Monitoring i Wizualizacja

| Źródło                   | ->  | Cel                        | Protokół / Mechanizm         | Rola
| -------------------------- | --- | -------------------------- | ---------------------------- | ----------------------------------------------------
| InfluxDB                   | ->  | Grafana                    | Datasource Query             | Wizualizacja Metryk k6 (Dashboardy Live).
| APM Server                 | ->  | Elasticsearch              | Indexing                     | Przechowywanie danych APM.
| Elasticsearch              | ->  | Kibana                     | User Interface               | Analiza RCA (Przeglądanie Traces i Logów).

-----------------------------------------------

### 3. Kontrola i Automatyzacja

| Źródło                   | ->  | Cel                        | Protokół / Mechanizm         | Rola
| -------------------------- | --- | -------------------------- | ---------------------------- | ----------------------------------------------------
| Git Push                   | ->  | GitHub Actions             | YAML Trigger                 | Automatyczny Start testów (CI/CD).
| GitHub Actions             | ->  | K6 Test Engine             | Runner Environment           | Uruchomienie Quality Gate.
