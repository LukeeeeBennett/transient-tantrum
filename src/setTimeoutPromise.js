function setTimeoutPromise(duration = 0) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

module.exports = setTimeoutPromise;
