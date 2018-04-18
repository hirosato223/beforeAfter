// Limited/protected array with getter/setter functions
const LimitedArray = () => {
  let storage = [];
  let limitedArray = {};
  limitedArray.get = index => {
    return storage[index];
  };
  limitedArray.set = (index, value) => {
    storage[index] = value;
  };
  return limitedArray;
};

// Hashing function
const getIndexBelowMaxForKey = (str, max) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
    hash = Math.abs(hash);
  }
  return hash % max;
};

// HashTable class
module.exports = class HashTable {
  constructor() {
    this._limit = 8;
    this._storage = LimitedArray(this._limit);
    this._currMemory = 0;
    this._resizingNow = false;
  }

  insert(k, v) {
    let index = getIndexBelowMaxForKey(k, this._limit);
    let bucket = this._storage.get(index) || [];
    let updatedKey = false;

    bucket.push([k, v]);
    this._currMemory++;

    // Update appropriate index with modified bucket
    this._storage.set(index, bucket);

    // Double hash table size if current memory >= 75%
    if (!this._resizingNow && this._currMemory / this._limit >= 0.75) {
      this.doubleSize();
    }
  }

  retrieve(k) {
    let index = getIndexBelowMaxForKey(k, this._limit);
    let bucket = this._storage.get(index) || [];
    let values = [];

    // Iterate through bucket and return desired key/value pair(s)
    if (bucket.length > 0) {
      for (let i = 0; i < this._storage.get(index).length; i++) {
        if (this._storage.get(index)[i][0] === k) {
          values.push(this._storage.get(index)[i][1]);
        }
      }
    }
    return values;
  }

  remove(k) {
    let index = getIndexBelowMaxForKey(k, this._limit);
    let bucket = this._storage.get(index) || [];

    // Iterate through bucket and removing desired key/value pair
    if (bucket.length > 0) {
      let idx = 0;
      while (idx < bucket.length) {
        if (bucket[idx][0] === k) {
          bucket.splice(idx, 1);
          this._currMemory -= 1;
          idx = 0;
        } else {
          idx++;
        }
      }
    }

    // Halve hash table size if current memory is <= 25%
    if (
      !this._resizingNow &&
      this._limit > 8 &&
      this._currMemory / this._limit <= 0.25
    ) {
      this.halveSize();
    }
  }

  doubleSize() {
    this._resizingNow = true;
    let oldLimit = this._limit;
    this._limit *= 2;
    this._currMemory = 0;

    // Copy old limitedArray
    let oldArr = [];
    for (let i = 0; i < oldLimit; i++) {
      oldArr[i] = this._storage.get(i);
    }

    // Initialize new LimitedArray
    this._storage = LimitedArray();

    // Place tuples at new indices in hash table
    for (let i = 0; i < oldLimit; i++) {
      if (oldArr[i] !== undefined) {
        for (let j = 0; j < oldArr[i].length; j++) {
          this.insert(oldArr[i][j][0], oldArr[i][j][1]);
        }
      }
    }
    this._resizingNow = false;
  }

  halveSize() {
    this._resizingNow = true;
    let oldLimit = this._limit;
    this._limit = this._limit / 2;
    this._currMemory = 0;

    // Copy old LimitedArray
    let oldArr = [];
    for (let i = 0; i < oldLimit; i++) {
      oldArr[i] = this._storage.get(i);
    }

    // Initialize new LimitedArray
    this._storage = LimitedArray(this._limit);

    // Place tuples at new indices in hash table
    for (let i = 0; i < oldLimit; i++) {
      if (oldArr[i] !== undefined) {
        for (let j = 0; j < oldArr[i].length; j++) {
          this.insert(oldArr[i][j][0], oldArr[i][j][1]);
        }
      }
    }
    this._resizingNow = false;
  }
};
