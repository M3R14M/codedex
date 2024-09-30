// Helper function to randomize the order of the questions and answers
function shuffle(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// Calculate percentage of answers for each element
function calculatePercentage(obj, value) {
  const highest = Math.max(...Object.values(obj));
  const highestKeys = [];

  // Collect all keys with the highest value, in case of a tie
  for (const key in obj) {
    if (obj[key] === highest) {
      highestKeys.push(key);
    }
  }
  // Randomly select one of the keys with the highest value
  const randomKey = highestKeys[Math.floor(Math.random() * highestKeys.length)];
  // Calculate the percentage for the selected key
  const percentageObj = {
    [randomKey]: Math.round((obj[randomKey] / value) * 100),
  };

  return percentageObj;
}

export { shuffle, calculatePercentage };
