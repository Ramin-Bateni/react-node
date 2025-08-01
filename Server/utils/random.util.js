/**
 * Returns an array of random elements from the given array, without duplicates.
 * If count is greater than the array length, returns a shuffled copy of the entire array.
 *
 * // Example usage:
 * const fruits = ["apple", "banana", "cherry", "date", "elderberry"];
 * console.log(getRandomItems(fruits, 3)); // e.g. ['date', 'apple', 'cherry']
 * console.log(getRandomItems(fruits, 10)); // returns all fruits in random order
 *
 * @param {Array} arr - The input array.
 * @param {number} count - Number of random elements to return.
 * @returns {Array} - Array of random elements.
 */
function getRandomItems(arr, count) {
  if (!Array.isArray(arr) || arr.length === 0 || count <= 0) {
    return [];
  }

  // Create a shallow copy and shuffle it
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return the first `count` items (or the whole array if count > length)
  return shuffled.slice(0, count);
}

module.exports = {
  getRandomItems,
};
