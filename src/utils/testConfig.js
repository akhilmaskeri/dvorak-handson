export let testConfig = {
  duration: 30,
  
  wordCount: 100,
  minWordLength: 3,
  maxWordLength: 8,
  
  countdownDelay: 3,
  allowRestart: true,
  
  consistencyWindow: 5,
};

export const updateConfig = (updates) => {
  testConfig = {
    ...testConfig,
    ...updates
  };
};