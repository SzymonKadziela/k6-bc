// modules/utils.js

// Funkcja pomocnicza do losowania elementu z tablicy
export function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Funkcja generująca losowy czas myślenia (pacing) między min a max sekund
export function randomSleep(min, max) {
    const time = Math.random() * (max - min) + min;
    return time; 
}