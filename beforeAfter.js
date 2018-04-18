const HashTable = require('./hashTable.js');

let input = [
  // Basic examples
  'clutter will help you clean',
  'clean your room!',
  'hole in the wall',
  'wall street journal',

  // Multiple matching phrases
  'just saw some flying fish',
  'fish tacos are yummy',
  'fish are some interesting critters',

  // Circular reference
  'last will be first',
  'first will be last'
];

const beforeAfter = phrases => {
  // Create storage hashtable
  const storage = new HashTable();
  let joinedPhrases = [];

  // For each phrase, populate hash table with keys (first word) and values (remainder of phrase)
  for (let phrase of phrases) {
    let splitPhrase = phrase.split(' ');
    storage.insert(splitPhrase[0], splitPhrase.slice(1).join(' '));
  }

  // Check for valid before/after phrase pairs and add to joinedPhrases array
  for (let phrase of phrases) {
    let splitPhrase = phrase.split(' ');
    let lastWord = splitPhrase[splitPhrase.length - 1];
    let values = storage.retrieve(lastWord);
    if (values.length) {
      for (let value of values) {
        let newPhrase = phrase + ' ' + value;
        joinedPhrases = [...joinedPhrases, newPhrase];
      }
    }
  }

  return joinedPhrases;
};

console.log(beforeAfter(input));
