const propositionInput = document.getElementById('proposition');
propositionInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const proposition = propositionInput.value;
    if (validateProposition(proposition)) {
      const truthTable = generateTruthTable(proposition);
      updateTruthTable(truthTable);
}}})
function addSymbol(symbol) {
  const propositionInput = document.getElementById('proposition');
  propositionInput.value += symbol;
}
function generateTruthTable(proposition) {
  console.log('Generating truth table for proposition:', proposition);
  const variables = extractVariables(proposition);
  console.log("Operator: " + extractOperators(proposition));
  // Generate all possible combinations of truth values for variables
  const truthValuesCombinations = generateTruthValuesCombinations(variables.length);
  // Evaluate the proposition for each combination of truth values
  const truthTable = truthValuesCombinations.map(truthValues => {
    const row = {};
    variables.forEach((variable, index) => {
      row[variable] = truthValues[index];
    });
    const result = evaluateManualResult(proposition, variables, truthValues);
    row['Result'] = result;


    return row;
  });

  return truthTable;
}
function evaluateManualResult(proposition, variables, truthValues) {
  const operators = proposition.match(/[∧∨→⇒↔¬⊕⊨]/g) || [];
  console.log("Operators: " + operators);

  const evaluateOperation = (left, operator, right) => {
    switch (operator) {
      case '∧':
        return left && right;
      case '∨':
        return left || right;
      case '→':
      case '⇒':
        return !left || right;
      case '↔':
        return left === right;
      case '¬':
        return !left;
      case '⊕':
        return (left || right) && !(left && right);
      case '⊨':
        return left && right;
      default:
        return left && right;
    }
  };

  let result = truthValues[0];
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    const nextValue = truthValues[i + 1];
    result = evaluateOperation(result, operator, nextValue);
  }

  return result;
}



// Helper function to extract variables from the proposition
function extractVariables(proposition) {
  const variableRegex = /[A-Z]/g;
  const variables = Array.from(new Set(proposition.match(variableRegex)));
  return variables;
}

// Helper function to extract operators from the proposition
function extractOperators(proposition) {
  const operatorRegex = /[\^v∨∧→⇒⇔]|\([^\(\)]*\)/g;
  const operators = proposition.match(operatorRegex);
  return operators || [];
}

// Helper function to generate all possible combinations of truth values
function generateTruthValuesCombinations(numVariables) {
  const combinations = [];
  for (let i = 0; i < Math.pow(2, numVariables); i++) {
    const truthValues = [];
    for (let j = 0; j < numVariables; j++) {
      truthValues.push(Boolean((i & Math.pow(2, j)) >> j));
    }
    combinations.push(truthValues);
  }
  return combinations;
}

function evaluateProposition(proposition, variables, truthValues) {
  const variableMap = Object.fromEntries(variables.map((variable, index) => [variable, truthValues[index]]));
  const parsedExpression = parseExpression(proposition, variableMap);
  const result = evaluateExpression(parsedExpression, variableMap);
  console.log("Result:     " + result)
  return result;
}

// Define a simple expression tree structure
class ExpressionNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

// Parse the logical proposition into an expression tree
function parseExpression(proposition, variableMap) {
  const tokens = tokenize(proposition);
  console.log("Tokens: " + JSON.stringify(tokens));

  console.log("Tokens:    " + tokens)
  const stack = [];

  for (const token of tokens) {
    console.log('Processing Token:', token);
    if (token in {'∧': 1, '∨': 1, '→': 1, '⇒': 1, '⇔': 1}) {
      const right = stack.pop();
      const left = stack.pop();
      stack.push(new ExpressionNode(token, left, right));
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      let top = stack.pop();
      const subTree = [];

      while (top !== '(') {
        subTree.unshift(top);
        top = stack.pop();
      }

      stack.push(buildSubTree(subTree, variableMap));
    } else {
      stack.push(new ExpressionNode(token));
    }
  }

  return buildSubTree(stack, variableMap);
}
function tokenize(proposition) {
  return proposition.match(/([A-Z]+|[∧∨→⇒⇔()])/g) || [];
}
function buildSubTree(tokens, variableMap) {
  const stack = [];

  for (const token of tokens) {
    console.log('Current Token:', token);
    if (token in {'∧': 1, '∨': 1, '→': 1, '⇒': 1, '⇔': 1, '¬': 1}) {
      if (token === '¬') {
        const operand = stack.pop();
        stack.push(new ExpressionNode(token, operand));
      } else {
        const right = stack.pop();
        console.log(right + "right tree value");
        const left = stack.pop();
        console.log(left + "left tree value")
        stack.push(new ExpressionNode(token, left, right));
      }
    } else {
      stack.push(new ExpressionNode(token.value in variableMap ? variableMap[token.value] : false));
    }
  }

  // Correct handling of conjunctions
  if (stack.length > 1) {
    const right = stack.pop();
    const left = stack.pop();
    stack.push(new ExpressionNode('∧', left, right));
  }

  console.log('Expression Stack:', stack);

  return stack[0];
}

// Evaluate the expression tree
// Evaluate the expression tree
function evaluateExpression(node, variableMap) {
  if (!node) {
    return false;
  }

  if (node.value !== undefined) {
    const leftResult = evaluateExpression(node.left, variableMap);
    const rightResult = evaluateExpression(node.right, variableMap);

    switch (node.value) {
      case '∧':
        return leftResult && rightResult;
      case '∨':
        return leftResult || rightResult;
      case '→':
      case '⇒':
        return !leftResult || rightResult;
      case '⇔':
        return leftResult === rightResult;
      case '¬':
        return !leftResult;
      default:
        return false;
    }
  } else {
    const nodeValue = variableMap[node.value !== undefined ? node.value : ''];
    return nodeValue !== undefined ? nodeValue : false;
  }
}

function updateTruthTable(truthTable) {
  console.log('Updating truth table:', truthTable);
  const tableElement = document.getElementById('truthTable');

  // Clear existing table rows
  while (tableElement.firstChild) {
    tableElement.removeChild(tableElement.firstChild);
  }

  // Create header row
  const headerRow = document.createElement('tr');
  Object.keys(truthTable[0]).forEach(key => {
    const th = document.createElement('th');
    th.textContent = key;
    headerRow.appendChild(th);
  });
  tableElement.appendChild(headerRow);

  // Create data rows
  truthTable.forEach(rowData => {
    const row = document.createElement('tr');
    Object.values(rowData).forEach(value => {
      const td = document.createElement('td');
      td.textContent = value.toString();
      row.appendChild(td);
    });
    tableElement.appendChild(row);
  });
}
function validateProposition(proposition) {
  console.log('Validating proposition:', proposition);
  const isValid = isValidCharacters(proposition) && isBalancedParentheses(proposition);

  if (!isValid) {
    alert('Invalid logical proposition. Please check your input.');
  }

  return isValid;
}
function isValidCharacters(proposition) {
  const validCharactersRegex = /^[A-Z∧∨→⇒⇔()¬⊕⊨ ]+$/u;

  // Allow single uppercase letters without logical operators
  if (proposition.length === 1 && /[A-Z]/.test(proposition)) {
    return true;
  }

  const isValid = validCharactersRegex.test(proposition);
  const invalidCharacters = proposition.match(/[^A-Z∧∨→⇒⇔()¬⊕⊨ ]/gu);

  console.log("Proposition:", proposition);
  console.log("Regex Test Result:", isValid);
  console.log("Invalid Characters:", invalidCharacters);

  return isValid;
}
function isBalancedParentheses(proposition) {
  const stack = [];

  for (const char of proposition) {
    if (char === '(') {
      stack.push(char);
    } else if (char === ')') {
      if (stack.length === 0) {
        return false; // Unmatched closing parenthesis
      }
      stack.pop();
    }
  }

  return stack.length === 0; // Check if all opening parentheses are closed
}




