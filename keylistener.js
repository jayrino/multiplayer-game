class KeyPressListener {
  constructor(keyCode, callback) {
    let intervalId = null;

    // Event listener for keydown
    document.addEventListener("keydown", (event) => {
      if (event.code === keyCode && !intervalId) {
        intervalId = setInterval(callback, 100); // Adjust the interval as needed
      }
    });

    // Event listener for keyup
    document.addEventListener("keyup", (event) => {
      if (event.code === keyCode && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });
  }

  unbind() {
    // No need to remove event listeners since they are anonymous functions
  }
}
