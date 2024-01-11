function convert() {
  // Retrieve values from the input fields and select elements
  const inputNumber = document.getElementById('inputNumber').value;
  const fromBase = parseInt(document.getElementById('fromBase').value, 10);
  const toBase = parseInt(document.getElementById('toBase').value, 10);

  // Convert the input number from the specified base to decimal
  const decimalNumber = parseInt(inputNumber, fromBase);

  // Convert the decimal number to the specified base
  const result = decimalNumber.toString(toBase).toUpperCase();

  // Display the result
  displayResult(result);
}

function displayResult(result) {
  const resultContainer = document.getElementById('resultContainer');

  // Clear previous results
  resultContainer.innerHTML = '';

  // Display the result in a beautiful way
  const resultElement = document.createElement('p');
  resultElement.textContent = `Result: ${result}`;
  resultContainer.appendChild(resultElement);
}

function displaySteps(steps) {
  const resultContainer = document.getElementById('resultContainer');

  // Display steps
  const stepsElement = document.createElement('div');
  stepsElement.classList.add('step');

  steps.forEach((step, index) => {
    const stepElement = document.createElement('p');
    stepElement.textContent = `${index + 1}. ${step}`;
    stepsElement.appendChild(stepElement);
  });

  resultContainer.appendChild(stepsElement);
}
