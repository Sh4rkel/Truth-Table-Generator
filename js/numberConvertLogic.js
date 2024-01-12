function convert() {
  const inputNumber = document.getElementById('inputNumber').value;
  const fromBase = parseInt(document.getElementById('fromBase').value, 10);
  const toBase = document.getElementById('toBase').value;

  if (isNaN(inputNumber) || inputNumber === "") {
    alert("Please enter a valid number.");
    return;
  }

  let result;
  if (toBase === '2c') {
    result = convertToTwosComplement(inputNumber, fromBase);
  } else {
    const decimalNumber = parseInt(inputNumber, fromBase);
    result = decimalNumber.toString(toBase).toUpperCase();
  }

  displayResult(result);
}

// Implement a undo conversion logic for later





// Implement an AI that can explain the conversion process



function displayResult(result) {
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = '';

  const resultElement = document.createElement('p');
  resultElement.textContent = `Result: ${result}`;
  resultContainer.appendChild(resultElement);
}

// Create a step by step visual representation for the conversion process
function convertToTwosComplement(inputNumber, fromBase) {
  // Convert the input number to binary and get its length
  const binaryNumber = parseInt(inputNumber, fromBase).toString(2);
  const length = binaryNumber.length;

  // Calculate the 2's complement by inverting bits and adding 1
  const inverted = parseInt(binaryNumber, 2) ^ (Math.pow(2, length) - 1);
  const twosComplement = (inverted + 1) & (Math.pow(2, length) - 1);

  return twosComplement.toString(2).padStart(length, '0');
}
