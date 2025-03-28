document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const doorsContainer = document.getElementById("doors");
  const challengeModal = document.getElementById("challenge-modal");
  const challengeTitle = document.getElementById("challenge-title");
  const challengeDescription = document.getElementById("challenge-description");
  const codeInput = document.getElementById("code-input");
  const submitCodeButton = document.getElementById("submit-code");
  const codeResult = document.getElementById("code-result");
  const closeModal = document.getElementById("close-modal");
  const timerDisplay = document.getElementById("time");
  const timerContainer = document.getElementById("timer");
  const hintButton = document.getElementById("hint-button");
  const hintContainer = document.getElementById("hint-container");
  const hintText = document.getElementById("hint-text");
  const leaderboardModal = document.getElementById("leaderboard-modal");
  const closeLeaderboardModal = document.getElementById("close-leaderboard-modal");
  const leaderboardTableBody = document.querySelector("#leaderboard-table tbody");
  const totalTimeDisplay = document.getElementById("total-time");
  const logoutButton = document.getElementById("logout-button");

  // Game State Variables
  let timeRemaining;
  let timerInterval;
  let currentDoor = 1;
  let currentQuestionIndex = 0;
  const doors = [];
  let isTimerRunning = false;
  let startTime;
  let doorTimes = [];
  let doorStartTime;
  let currentTopic = "javascript";
  let isButtonDisabled = false;

  // Timer Functions
  function startTimer(timeLimit) {
    if (!isTimerRunning) {
      isTimerRunning = true;
      timeRemaining = timeLimit;
      timerContainer.style.display = "block";
      timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          isTimerRunning = false;
          alert("Time's up! You failed to answer the question.");
          resetGame();
        }
      }, 1000);
    }
  }

  function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerContainer.style.display = "none";
  }

  function resetTimer() {
    timeRemaining = 0;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function resetGame() {
    stopTimer();
    resetTimer();
    currentDoor = 1;
    currentQuestionIndex = 0;
    doorTimes = [];
    createDoors();
  }

  // Challenge Data - JavaScript
  const javascriptChallenges = [
    // Door 1: JavaScript Basics
    {
      title: "Door 1: Level 1 - Variables",
      description: "What is the correct way to declare a constant in JavaScript?",
      type: "mcq",
      options: ["const x = 5;", "let x = 5;", "var x = 5;", "constant x = 5;"],
      correctAnswer: "const x = 5;",
      timeLimit: 60,
      hint: "ES6 introduced this keyword for immutable variables."
    },
    {
      title: "Door 1: Level 2 - Debug Output",
      description: "Fix this code to correctly log 'Hello':\n\nconsole.log(Hello);",
      type: "debug",
      correctAnswer: "console.log('Hello');",
      timeLimit: 60,
      hint: "String values need to be wrapped in quotes."
    },
    {
      title: "Door 1: Level 3 - Arithmetic",
      description: "Complete the code to calculate the remainder:\n\nconst remainder = 10 ___ 3;",
      type: "fillInTheBlank",
      correctAnswer: "%",
      timeLimit: 60,
      hint: "This operator returns the division remainder."
    },
    {
      title: "Door 1: Level 4 - Type Conversion",
      description: "What does Number('5') return?",
      type: "mcq",
      options: ["5", "'5'", "NaN", "undefined"],
      correctAnswer: "5",
      timeLimit: 60,
      hint: "Number() explicitly converts strings to numbers."
    },
    {
      title: "Door 1: Level 5 - String Concatenation",
      description: "Complete the string concatenation:\n\nconst result = 'Hello' + ___ + 'World';",
      type: "fillInTheBlank",
      correctAnswer: "' '",
      timeLimit: 60,
      hint: "You need to add a space between the words."
    },
  
    // Door 2: Control Flow
    {
      title: "Door 2: Level 1 - Conditional",
      description: "Which operator checks both value and type equality?",
      type: "mcq",
      options: ["===", "==", "=", "!=="],
      correctAnswer: "===",
      timeLimit: 90,
      hint: "Strict equality operator with three equal signs."
    },
    {
      title: "Door 2: Level 2 - Debug If Statement",
      description: "Fix this if statement:\n\nif x > 5 {\n  console.log('Big');\n}",
      type: "debug",
      correctAnswer: "if (x > 5) {\n  console.log('Big');\n}",
      timeLimit: 90,
      hint: "Condition needs to be wrapped in parentheses."
    },
    {
      title: "Door 2: Level 3 - Ternary Operator",
      description: "Complete the ternary expression:\n\nconst result = age >= 18 ? ___ : 'minor';",
      type: "fillInTheBlank",
      correctAnswer: "'adult'",
      timeLimit: 90,
      hint: "First part executes when condition is true."
    },
    {
      title: "Door 2: Level 4 - Switch Case",
      description: "What will 'switch(2){case 1: 'A'; case 2: 'B';}' return?",
      type: "mcq",
      options: ["'B'", "undefined", "'A'", "Error"],
      correctAnswer: "'B'",
      timeLimit: 90,
      hint: "Switch executes the matching case statement."
    },
    {
      title: "Door 2: Level 5 - Logical Operator",
      description: "Complete the null check:\n\nconst value = inputValue ___ defaultValue;",
      type: "fillInTheBlank",
      correctAnswer: "||",
      timeLimit: 90,
      hint: "This operator returns the right operand when left is falsy."
    },
  
    // Door 3: Functions
    {
      title: "Door 3: Level 1 - Function Declaration",
      description: "Which is a function declaration (not expression)?",
      type: "mcq",
      options: ["function foo() {}", "const foo = function() {}", "let foo = () => {}", "var foo = function foo() {}"],
      correctAnswer: "function foo() {}",
      timeLimit: 120,
      hint: "Starts with the 'function' keyword."
    },
    {
      title: "Door 3: Level 2 - Debug Arrow Function",
      description: "Fix this arrow function:\n\nconst add = a, b => a + b;",
      type: "debug",
      correctAnswer: "const add = (a, b) => a + b;",
      timeLimit: 120,
      hint: "Multiple parameters need parentheses."
    },
    {
      title: "Door 3: Level 3 - Default Parameters",
      description: "Complete the default parameter:\n\nfunction greet(name = ___) {\n  return `Hello ${name}`;\n}",
      type: "fillInTheBlank",
      correctAnswer: "'Guest'",
      timeLimit: 120,
      hint: "Provide a fallback value when no argument is passed."
    },
    {
      title: "Door 3: Level 4 - Scope",
      description: "What logs when 'var x = 1; function test(){console.log(x); var x = 2;}' is called?",
      type: "mcq",
      options: ["undefined", "1", "2", "Error"],
      correctAnswer: "undefined",
      timeLimit: 120,
      hint: "Variable hoisting affects the result."
    },
    {
      title: "Door 3: Level 5 - IIFE",
      description: "Complete the Immediately Invoked Function:\n\n(function() {\n  console.log('IIFE');\n})___;",
      type: "fillInTheBlank",
      correctAnswer: "()",
      timeLimit: 120,
      hint: "The function needs to be called immediately."
    },
  
    // Door 4: Arrays
    {
      title: "Door 4: Level 1 - Array Creation",
      description: "Which creates an array with three elements?",
      type: "mcq",
      options: ["[1, 2, 3]", "new Array(3)", "Array.of(3)", "{1, 2, 3}"],
      correctAnswer: "[1, 2, 3]",
      timeLimit: 150,
      hint: "Literal syntax with square brackets."
    },
    {
      title: "Door 4: Level 2 - Debug Array Method",
      description: "Fix this array push:\n\nconst arr = [1, 2];\narr.push(3);",
      type: "debug",
      correctAnswer: "const arr = [1, 2];\narr.push(3);",
      timeLimit: 150,
      hint: "This code is actually correct as is."
    },
    {
      title: "Door 4: Level 3 - Array Spread",
      description: "Complete the array concatenation:\n\nconst combined = [...arr1, ___ arr2];",
      type: "fillInTheBlank",
      correctAnswer: "...",
      timeLimit: 150,
      hint: "Spread operator expands arrays into elements."
    },
    {
      title: "Door 4: Level 4 - Array Method",
      description: "Which method creates a new array by transforming elements?",
      type: "mcq",
      options: ["map()", "forEach()", "filter()", "reduce()"],
      correctAnswer: "map()",
      timeLimit: 150,
      hint: "Takes a callback that returns transformed values."
    },
    {
      title: "Door 4: Level 5 - Destructuring",
      description: "Complete the array destructuring:\n\nconst [first, ___] = ['a', 'b', 'c'];",
      type: "fillInTheBlank",
      correctAnswer: "second",
      timeLimit: 150,
      hint: "Variable name for the second element."
    },
  
    // Door 5: Objects
    {
      title: "Door 5: Level 1 - Object Creation",
      description: "Which creates an object with property 'name'?",
      type: "mcq",
      options: ["{name: 'John'}", "new Object('name':'John')", "Object.create('name')", "[name: 'John']"],
      correctAnswer: "{name: 'John'}",
      timeLimit: 180,
      hint: "Literal syntax with curly braces."
    },
    {
      title: "Door 5: Level 2 - Debug Object Access",
      description: "Fix this property access:\n\nconst obj = {key: 'value'};\nconsole.log(obj[key]);",
      type: "debug",
      correctAnswer: "const obj = {key: 'value'};\nconsole.log(obj['key']);",
      timeLimit: 180,
      hint: "String keys need quotes when using bracket notation."
    },
    {
      title: "Door 5: Level 3 - Object Spread",
      description: "Complete the object merge:\n\nconst merged = {...obj1, ___ obj2};",
      type: "fillInTheBlank",
      correctAnswer: "...",
      timeLimit: 180,
      hint: "Spread operator copies properties between objects."
    },
    {
      title: "Door 5: Level 4 - Object Method",
      description: "Which method returns object's own property names?",
      type: "mcq",
      options: ["Object.keys()", "Object.values()", "Object.entries()", "Object.properties()"],
      correctAnswer: "Object.keys()",
      timeLimit: 180,
      hint: "Returns an array of string property names."
    },
    {
      title: "Door 5: Level 5 - Destructuring",
      description: "Complete the object destructuring:\n\nconst {name, ___} = {name: 'John', age: 30};",
      type: "fillInTheBlank",
      correctAnswer: "age",
      timeLimit: 180,
      hint: "Property name to extract from the object."
    },
  
    // Door 6: ES6+ Features
    {
      title: "Door 6: Level 1 - Template Literals",
      description: "Which syntax allows string interpolation?",
      type: "mcq",
      options: ["`Hello ${name}`", "'Hello ' + name", "'Hello ${name}'", "`Hello $name`"],
      correctAnswer: "`Hello ${name}`",
      timeLimit: 210,
      hint: "Uses backticks and ${} for variables."
    },
    {
      title: "Door 6: Level 2 - Debug Class",
      description: "Fix this class method:\n\nclass Person {\n  constructor(name) { this.name = name; }\n  greet { return `Hello ${this.name}`; }\n}",
      type: "debug",
      correctAnswer: "class Person {\n  constructor(name) { this.name = name; }\n  greet() { return `Hello ${this.name}`; }\n}",
      timeLimit: 210,
      hint: "Method definition needs parentheses."
    },
    {
      title: "Door 6: Level 3 - Modules",
      description: "Complete the import:\n\nimport ___ from './module.js';",
      type: "fillInTheBlank",
      correctAnswer: "Component",
      timeLimit: 210,
      hint: "Name of the exported value being imported."
    },
    {
      title: "Door 6: Level 4 - Promises",
      description: "Which method handles promise fulfillment?",
      type: "mcq",
      options: ["then()", "catch()", "finally()", "resolve()"],
      correctAnswer: "then()",
      timeLimit: 210,
      hint: "Chainable method that receives the resolved value."
    },
    {
      title: "Door 6: Level 5 - Async/Await",
      description: "Complete the async function:\n\nasync function fetchData() {\n  const data = ___ fetch('url');\n  return data;\n}",
      type: "fillInTheBlank",
      correctAnswer: "await",
      timeLimit: 210,
      hint: "Keyword that waits for promise resolution."
    },
  
    // Door 7: Advanced Concepts
    {
      title: "Door 7: Level 1 - Closure",
      description: "What is a closure in JavaScript?",
      type: "mcq",
      options: [
        "A function with access to its outer scope",
        "A function that returns another function",
        "A private method",
        "An immediately invoked function"
      ],
      correctAnswer: "A function with access to its outer scope",
      timeLimit: 240,
      hint: "Remembers variables from where it was created."
    },
    {
      title: "Door 7: Level 2 - Debug This Binding",
      description: "Fix this context issue:\n\nconst obj = {\n  name: 'John',\n  greet: function() { console.log(this.name); }\n};\nsetTimeout(obj.greet, 1000);",
      type: "debug",
      correctAnswer: "const obj = {\n  name: 'John',\n  greet: function() { console.log(this.name); }\n};\nsetTimeout(obj.greet.bind(obj), 1000);",
      timeLimit: 240,
      hint: "Need to explicitly bind the context."
    },
    {
      title: "Door 7: Level 3 - Prototype",
      description: "Complete the prototype method:\n\nArray.___.last = function() { return this[this.length-1]; };",
      type: "fillInTheBlank",
      correctAnswer: "prototype",
      timeLimit: 240,
      hint: "Property that contains methods shared by all instances."
    },
    {
      title: "Door 7: Level 4 - Event Loop",
      description: "Which runs first: setTimeout(fn, 0) or Promise.resolve().then(fn)?",
      type: "mcq",
      options: ["Promise callback", "setTimeout callback", "They run simultaneously", "Random"],
      correctAnswer: "Promise callback",
      timeLimit: 240,
      hint: "Microtasks have priority over macrotasks."
    },
    {
      title: "Door 7: Level 5 - Currying",
      description: "Complete the curried function:\n\nconst add = a => b => ___;",
      type: "fillInTheBlank",
      correctAnswer: "a + b",
      timeLimit: 240,
      hint: "Returns the sum of both arguments."
    },
  
    // Door 8: Error Handling
    {
      title: "Door 8: Level 1 - Try/Catch",
      description: "Which block handles errors in try/catch?",
      type: "mcq",
      options: ["catch", "finally", "error", "except"],
      correctAnswer: "catch",
      timeLimit: 270,
      hint: "Executes when an error occurs in the try block."
    },
    {
      title: "Door 8: Level 2 - Debug Error Handling",
      description: "Fix this error handling:\n\ntry {\n  riskyOperation();\n} catch {\n  console.log('Error');\n}",
      type: "debug",
      correctAnswer: "try {\n  riskyOperation();\n} catch (e) {\n  console.log('Error');\n}",
      timeLimit: 270,
      hint: "Catch block needs an error parameter."
    },
    {
      title: "Door 8: Level 3 - Custom Error",
      description: "Complete the error throwing:\n\nif (!valid) { throw new ___('Invalid input'); }",
      type: "fillInTheBlank",
      correctAnswer: "Error",
      timeLimit: 270,
      hint: "Built-in constructor for error objects."
    },
    {
      title: "Door 8: Level 4 - Promise Error",
      description: "Which method handles promise rejections?",
      type: "mcq",
      options: ["catch()", "then()", "finally()", "reject()"],
      correctAnswer: "catch()",
      timeLimit: 270,
      hint: "Chainable method that receives the rejection reason."
    },
    {
      title: "Door 8: Level 5 - Async Error",
      description: "Complete the async error handling:\n\nasync function run() {\n  try { await risky(); }\n  ___ (e) { console.error(e); }\n}",
      type: "fillInTheBlank",
      correctAnswer: "catch",
      timeLimit: 270,
      hint: "Same as synchronous try/catch syntax."
    },
  
    // Door 9: Functional Programming
    {
      title: "Door 9: Level 1 - Pure Functions",
      description: "What makes a function pure?",
      type: "mcq",
      options: [
        "No side effects and same output for same input",
        "Uses only ES6 features",
        "Doesn't accept parameters",
        "Returns undefined"
      ],
      correctAnswer: "No side effects and same output for same input",
      timeLimit: 300,
      hint: "Relies only on its input to produce output."
    },
    {
      title: "Door 9: Level 2 - Debug Higher-Order Function",
      description: "Fix this filter:\n\nconst evens = [1,2,3].filter(x => { x % 2 === 0 });",
      type: "debug",
      correctAnswer: "const evens = [1,2,3].filter(x => x % 2 === 0);",
      timeLimit: 300,
      hint: "Arrow function with concise body doesn't need curly braces."
    },
    {
      title: "Door 9: Level 3 - Reduce",
      description: "Complete the sum calculation:\n\nconst sum = [1,2,3].reduce((acc, x) => ___, 0);",
      type: "fillInTheBlank",
      correctAnswer: "acc + x",
      timeLimit: 300,
      hint: "Accumulator pattern for summing values."
    },
    {
      title: "Door 9: Level 4 - Immutability",
      description: "Which method returns a new array without mutating?",
      type: "mcq",
      options: ["concat()", "push()", "pop()", "splice()"],
      correctAnswer: "concat()",
      timeLimit: 300,
      hint: "Returns new array rather than modifying existing."
    },
    {
      title: "Door 9: Level 5 - Composition",
      description: "Complete the function composition:\n\nconst compose = (f, g) => x => ___(g(x));",
      type: "fillInTheBlank",
      correctAnswer: "f",
      timeLimit: 300,
      hint: "Output of g becomes input of f."
    },
  
    // Door 10: Advanced Patterns
    {
      title: "Door 10: Level 1 - Singleton",
      description: "Which pattern ensures single instance creation?",
      type: "mcq",
      options: ["Singleton", "Factory", "Observer", "Decorator"],
      correctAnswer: "Singleton",
      timeLimit: 300,
      hint: "Restricts class instantiation to one object."
    },
    {
      title: "Door 10: Level 2 - Debug Proxy",
      description: "Fix this Proxy:\n\nconst handler = {\n  get: function(target, prop) { return target[prop] || 'N/A'; }\n};\nconst p = Proxy(obj, handler);",
      type: "debug",
      correctAnswer: "const handler = {\n  get: function(target, prop) { return target[prop] || 'N/A'; }\n};\nconst p = new Proxy(obj, handler);",
      timeLimit: 300,
      hint: "Proxy constructor requires 'new' keyword."
    },
    {
      title: "Door 10: Level 3 - Generator",
      description: "Complete the generator function:\n\nfunction* idMaker() {\n  let id = 0;\n  while(true) { ___ id++; }\n}",
      type: "fillInTheBlank",
      correctAnswer: "yield",
      timeLimit: 300,
      hint: "Keyword that pauses and resumes generator."
    },
    {
      title: "Door 10: Level 4 - Decorator",
      description: "Which syntax applies decorators to classes?",
      type: "mcq",
      options: ["@decorator", "#decorator", "$decorator", "decorator()"],
      correctAnswer: "@decorator",
      timeLimit: 300,
      hint: "Uses the @ symbol prefix."
    },
    {
      title: "Door 10: Level 5 - WeakMap",
      description: "Complete the WeakMap usage:\n\nconst wm = new ___();\nwm.set(obj, 'value');",
      type: "fillInTheBlank",
      correctAnswer: "WeakMap",
      timeLimit: 300,
      hint: "Collection with object keys that don't prevent garbage collection."
    }
  ];

    // Challenge Data - HTML
    const htmlChallenges = [
      // Door 1: HTML Fundamentals
      {
        title: "Door 1: Level 1 - Basic Structure",
        description: "Which HTML element contains the visible page content?",
        type: "mcq",
        options: ["<body>", "<head>", "<html>", "<main>"],
        correctAnswer: "<body>",
        timeLimit: 60,
        hint: "This element wraps all content shown in the browser window."
      },
      {
        title: "Door 1: Level 2 - Paragraph Element",
        description: "Fix this HTML paragraph:\n\n<pThis is a paragraph</p>",
        type: "debug",
        correctAnswer: "<p>This is a paragraph</p>",
        timeLimit: 60,
        hint: "Check the opening tag syntax."
      },
      {
        title: "Door 1: Level 3 - Image Element",
        description: "Complete the HTML for an image with alternative text:\n\n<___ src='photo.jpg' ___='A beautiful sunset'>",
        type: "fillInTheBlank",
        correctAnswer: "img alt",
        timeLimit: 60,
        hint: "First blank is the element name, second is the accessibility attribute."
      },
      {
        title: "Door 1: Level 4 - Link Target",
        description: "Which attribute opens a link in a new tab?",
        type: "mcq",
        options: ["target='_blank'", "new='tab'", "open='new'", "target='new'"],
        correctAnswer: "target='_blank'",
        timeLimit: 60,
        hint: "The value begins with an underscore."
      },
      {
        title: "Door 1: Level 5 - Basic Form",
        description: "Complete the form input for an email field:\n\n<input type='___' name='user_email'>",
        type: "fillInTheBlank",
        correctAnswer: "email",
        timeLimit: 60,
        hint: "HTML5 has specific input types for form validation."
      },
    
      // Door 2: HTML Structure
      {
        title: "Door 2: Level 1 - Document Type",
        description: "What is the correct DOCTYPE for HTML5?",
        type: "mcq",
        options: ["<!DOCTYPE html>", "<!HTML>", "<DOCTYPE html5>", "<!HTML5>"],
        correctAnswer: "<!DOCTYPE html>",
        timeLimit: 90,
        hint: "HTML5 simplified the DOCTYPE declaration."
      },
      {
        title: "Door 2: Level 2 - List Structure",
        description: "Fix this ordered list:\n\n<ol>\n<li>First item<li>\n<li>Second item</li>\n<ol>",
        type: "debug",
        correctAnswer: "<ol>\n<li>First item</li>\n<li>Second item</li>\n</ol>",
        timeLimit: 90,
        hint: "Check all closing tags."
      },
      {
        title: "Door 2: Level 3 - Table Structure",
        description: "Complete the table header cell:\n\n<table>\n<tr>\n<___>Name</___>\n</tr>\n</table>",
        type: "fillInTheBlank",
        correctAnswer: "th th",
        timeLimit: 90,
        hint: "This element defines a header cell in a table."
      },
      {
        title: "Door 2: Level 4 - Semantic HTML",
        description: "Which element represents independent, self-contained content?",
        type: "mcq",
        options: ["<article>", "<section>", "<div>", "<content>"],
        correctAnswer: "<article>",
        timeLimit: 90,
        hint: "Think of newspaper articles or blog posts."
      },
      {
        title: "Door 2: Level 5 - Form Structure",
        description: "Complete the form submission method:\n\n<form action='/submit' ___='POST'>",
        type: "fillInTheBlank",
        correctAnswer: "method",
        timeLimit: 90,
        hint: "This attribute defines how form data is sent."
      },
    
      // Door 3: HTML5 Features
      {
        title: "Door 3: Level 1 - Media Elements",
        description: "Which element embeds audio content?",
        type: "mcq",
        options: ["<audio>", "<sound>", "<music>", "<mp3>"],
        correctAnswer: "<audio>",
        timeLimit: 120,
        hint: "HTML5 introduced this media element."
      },
      {
        title: "Door 3: Level 2 - Video Attributes",
        description: "Fix this video element:\n\n<video controls autoplay='false' loop>\n<source src='movie.mp4' type='video/mp4'>\n</video>",
        type: "debug",
        correctAnswer: "<video controls loop>\n<source src='movie.mp4' type='video/mp4'>\n</video>",
        timeLimit: 120,
        hint: "Boolean attributes don't need explicit 'false' values."
      },
      {
        title: "Door 3: Level 3 - Input Types",
        description: "Complete the range input:\n\n<input type='___' min='0' max='100' value='50'>",
        type: "fillInTheBlank",
        correctAnswer: "range",
        timeLimit: 120,
        hint: "This creates a slider control."
      },
      {
        title: "Door 3: Level 4 - Semantic Navigation",
        description: "Which element typically contains navigation links?",
        type: "mcq",
        options: ["<nav>", "<menu>", "<links>", "<navigation>"],
        correctAnswer: "<nav>",
        timeLimit: 120,
        hint: "HTML5 semantic element for major navigation blocks."
      },
      {
        title: "Door 3: Level 5 - Data Attributes",
        description: "Complete the custom data attribute:\n\n<div ___='user123'></div>",
        type: "fillInTheBlank",
        correctAnswer: "data-user-id",
        timeLimit: 120,
        hint: "Custom attributes must start with 'data-'."
      },
    
      // Door 4: Forms and Validation
      {
        title: "Door 4: Level 1 - Form Input",
        description: "Which input type is used for passwords?",
        type: "mcq",
        options: ["password", "secret", "hidden", "secure"],
        correctAnswer: "password",
        timeLimit: 150,
        hint: "This type masks the entered characters."
      },
      {
        title: "Door 4: Level 2 - Form Labels",
        description: "Fix this form label association:\n\n<label>Username:</label>\n<input id='user' name='user'>",
        type: "debug",
        correctAnswer: "<label for='user'>Username:</label>\n<input id='user' name='user'>",
        timeLimit: 150,
        hint: "Labels should be explicitly associated with inputs."
      },
      {
        title: "Door 4: Level 3 - Input Attributes",
        description: "Complete the input placeholder:\n\n<input type='text' ___='Enter your name'>",
        type: "fillInTheBlank",
        correctAnswer: "placeholder",
        timeLimit: 150,
        hint: "This attribute shows hint text that disappears when typing."
      },
      {
        title: "Door 4: Level 4 - Form Validation",
        description: "Which attribute specifies a regular expression pattern?",
        type: "mcq",
        options: ["pattern", "regex", "validation", "match"],
        correctAnswer: "pattern",
        timeLimit: 150,
        hint: "This attribute accepts a regular expression."
      },
      {
        title: "Door 4: Level 5 - Form Elements",
        description: "Complete the textarea with 5 rows:\n\n<textarea ___='5'></textarea>",
        type: "fillInTheBlank",
        correctAnswer: "rows",
        timeLimit: 150,
        hint: "This attribute controls the visible height."
      },
    
      // Door 5: Advanced Semantics
      {
        title: "Door 5: Level 1 - Semantic HTML",
        description: "Which element represents tangential content?",
        type: "mcq",
        options: ["<aside>", "<sidebar>", "<tangent>", "<extra>"],
        correctAnswer: "<aside>",
        timeLimit: 180,
        hint: "Content indirectly related to the main content."
      },
      {
        title: "Door 5: Level 2 - Figure Element",
        description: "Fix this figure with caption:\n\n<figure>\n<img src='chart.png'>\n<caption>Sales Data</caption>\n</figure>",
        type: "debug",
        correctAnswer: "<figure>\n<img src='chart.png'>\n<figcaption>Sales Data</figcaption>\n</figure>",
        timeLimit: 180,
        hint: "Check the correct element name for figure captions."
      },
      {
        title: "Door 5: Level 3 - Time Element",
        description: "Complete the machine-readable date:\n\n<time ___='2023-11-15'>November 15, 2023</time>",
        type: "fillInTheBlank",
        correctAnswer: "datetime",
        timeLimit: 180,
        hint: "This attribute provides the machine-readable version."
      },
      {
        title: "Door 5: Level 4 - Semantic Text",
        description: "Which element highlights text for reference purposes?",
        type: "mcq",
        options: ["<mark>", "<highlight>", "<important>", "<em>"],
        correctAnswer: "<mark>",
        timeLimit: 180,
        hint: "Like using a highlighter pen on paper."
      },
      {
        title: "Door 5: Level 5 - Details Element",
        description: "Complete the interactive disclosure widget:\n\n<___>\n<summary>Show more</summary>\n<p>Additional details here</p>\n</___>",
        type: "fillInTheBlank",
        correctAnswer: "details details",
        timeLimit: 180,
        hint: "Creates a toggleable content area."
      },
    
      // Door 6: Multimedia and Embedding
      {
        title: "Door 6: Level 1 - Iframe",
        description: "Which attribute makes iframes more secure?",
        type: "mcq",
        options: ["sandbox", "secure", "safety", "protected"],
        correctAnswer: "sandbox",
        timeLimit: 210,
        hint: "Restricts what the iframe content can do."
      },
      {
        title: "Door 6: Level 2 - Picture Element",
        description: "Fix this responsive image:\n\n<picture>\n<source media='(min-width: 800px)' src='large.jpg'>\n<img src='small.jpg' alt='responsive image'>\n<picture>",
        type: "debug",
        correctAnswer: "<picture>\n<source media='(min-width: 800px)' srcset='large.jpg'>\n<img src='small.jpg' alt='responsive image'>\n</picture>",
        timeLimit: 210,
        hint: "Check both the closing tag and source attribute."
      },
      {
        title: "Door 6: Level 3 - Audio Attributes",
        description: "Complete the audio controls:\n\n<audio ___ loop>\n<source src='sound.mp3' type='audio/mpeg'>\n</audio>",
        type: "fillInTheBlank",
        correctAnswer: "controls",
        timeLimit: 210,
        hint: "This attribute makes the player controls visible."
      },
      {
        title: "Door 6: Level 4 - Embedding",
        description: "Which element embeds external applications?",
        type: "mcq",
        options: ["<embed>", "<object>", "<external>", "<app>"],
        correctAnswer: "<embed>",
        timeLimit: 210,
        hint: "A self-closing element for plugins."
      },
      {
        title: "Door 6: Level 5 - Video Sources",
        description: "Complete the video with multiple sources:\n\n<video controls>\n<source src='movie.webm' type='___'>\n<source src='movie.mp4' type='video/mp4'>\n</video>",
        type: "fillInTheBlank",
        correctAnswer: "video/webm",
        timeLimit: 210,
        hint: "The MIME type for WebM video format."
      },
    
      // Door 7: Accessibility
      {
        title: "Door 7: Level 1 - ARIA",
        description: "Which ARIA attribute indicates element visibility?",
        type: "mcq",
        options: ["aria-hidden", "aria-visible", "aria-show", "aria-display"],
        correctAnswer: "aria-hidden",
        timeLimit: 240,
        hint: "Boolean attribute that removes from accessibility tree."
      },
      {
        title: "Door 7: Level 2 - Landmark Roles",
        description: "Fix this ARIA landmark:\n\n<div role='navigation'>\n<!-- menu items -->\n<div>",
        type: "debug",
        correctAnswer: "<div role='navigation'>\n<!-- menu items -->\n</div>",
        timeLimit: 240,
        hint: "Check the closing tag."
      },
      {
        title: "Door 7: Level 3 - Image Accessibility",
        description: "Complete the decorative image:\n\n<img src='divider.png' ___=''>",
        type: "fillInTheBlank",
        correctAnswer: "alt",
        timeLimit: 240,
        hint: "Empty when image is purely decorative."
      },
      {
        title: "Door 7: Level 4 - Form Accessibility",
        description: "Which attribute connects help text to a form field?",
        type: "mcq",
        options: ["aria-describedby", "aria-help", "aria-label", "aria-info"],
        correctAnswer: "aria-describedby",
        timeLimit: 240,
        hint: "References the ID of the description element."
      },
      {
        title: "Door 7: Level 5 - Live Regions",
        description: "Complete the dynamic content announcement:\n\n<div aria-___='polite'>New message received</div>",
        type: "fillInTheBlank",
        correctAnswer: "live",
        timeLimit: 240,
        hint: "Indicates content that updates dynamically."
      },
    
      // Door 8: Performance and Optimization
      {
        title: "Door 8: Level 1 - Loading",
        description: "Which attribute defers image loading?",
        type: "mcq",
        options: ["loading='lazy'", "defer", "lazy-load", "load='later'"],
        correctAnswer: "loading='lazy'",
        timeLimit: 270,
        hint: "Native lazy loading for images."
      },
      {
        title: "Door 8: Level 2 - Preloading",
        description: "Fix this resource hint:\n\n<link rel='preload' as='style' href='styles.css'>",
        type: "debug",
        correctAnswer: "<link rel='preload' as='style' href='styles.css'>",
        timeLimit: 270,
        hint: "This preload link is actually correct as is."
      },
      {
        title: "Door 8: Level 3 - Responsive Images",
        description: "Complete the srcset attribute:\n\n<img src='small.jpg' ___='large.jpg 2x'>",
        type: "fillInTheBlank",
        correctAnswer: "srcset",
        timeLimit: 270,
        hint: "Attribute for multiple image sources."
      },
      {
        title: "Door 8: Level 4 - Favicon",
        description: "Which link relation specifies a favicon?",
        type: "mcq",
        options: ["icon", "favicon", "shortcut icon", "logo"],
        correctAnswer: "icon",
        timeLimit: 270,
        hint: "Modern browsers recognize this relation."
      },
      {
        title: "Door 8: Level 5 - Preconnect",
        description: "Complete the DNS prefetch:\n\n<link rel='___' href='https://api.example.com'>",
        type: "fillInTheBlank",
        correctAnswer: "preconnect",
        timeLimit: 270,
        hint: "Establishes early connections to important origins."
      },
    
      // Door 9: Advanced Forms
      {
        title: "Door 9: Level 1 - Input Types",
        description: "Which input type shows a color picker?",
        type: "mcq",
        options: ["color", "picker", "colorwheel", "hue"],
        correctAnswer: "color",
        timeLimit: 300,
        hint: "HTML5 input type for color selection."
      },
      {
        title: "Door 9: Level 2 - Form Attributes",
        description: "Fix this form submission:\n\n<form action='/submit' method='POST' enctype='text/plain'>",
        type: "debug",
        correctAnswer: "<form action='/submit' method='POST' enctype='multipart/form-data'>",
        timeLimit: 300,
        hint: "Proper encoding for file uploads."
      },
      {
        title: "Door 9: Level 3 - Datalist",
        description: "Complete the datalist input:\n\n<input list='browsers'>\n<___ id='browsers'>\n<option value='Chrome'>",
        type: "fillInTheBlank",
        correctAnswer: "datalist",
        timeLimit: 300,
        hint: "Element providing autocomplete options."
      },
      {
        title: "Door 9: Level 4 - Form Validation",
        description: "Which attribute sets minimum length for input?",
        type: "mcq",
        options: ["minlength", "minimum", "size", "length"],
        correctAnswer: "minlength",
        timeLimit: 300,
        hint: "Specifies the minimum number of characters."
      },
      {
        title: "Door 9: Level 5 - Meter Element",
        description: "Complete the meter gauge:\n\n<meter value='0.6' ___='1'>60%</meter>",
        type: "fillInTheBlank",
        correctAnswer: "max",
        timeLimit: 300,
        hint: "Defines the maximum value for the range."
      },
    
      // Door 10: Modern HTML Features
      {
        title: "Door 10: Level 1 - Web Components",
        description: "Which element creates a shadow DOM?",
        type: "mcq",
        options: ["<template>", "<slot>", "<shadow>", "<component>"],
        correctAnswer: "<template>",
        timeLimit: 300,
        hint: "Declares markup fragments for later use."
      },
      {
        title: "Door 10: Level 2 - Custom Elements",
        description: "Fix this custom element definition:\n\n<my-element data-value='test'></my-element>",
        type: "debug",
        correctAnswer: "<my-element data-value='test'></my-element>",
        timeLimit: 300,
        hint: "Custom elements must contain a hyphen in the name."
      },
      {
        title: "Door 10: Level 3 - Template Literals",
        description: "Complete the template element:\n\n<___ id='product-template'>\n<div>{{name}}</div>\n</___>",
        type: "fillInTheBlank",
        correctAnswer: "template template",
        timeLimit: 300,
        hint: "Inert DOM fragment for JavaScript to clone."
      },
      {
        title: "Door 10: Level 4 - Content Security",
        description: "Which meta tag helps prevent XSS attacks?",
        type: "mcq",
        options: [
          "<meta http-equiv='Content-Security-Policy'>",
          "<meta name='security'>",
          "<meta http-equiv='XSS-Protection'>",
          "<meta name='xss-protection'>"
        ],
        correctAnswer: "<meta http-equiv='Content-Security-Policy'>",
        timeLimit: 300,
        hint: "Modern approach to content security."
      },
      {
        title: "Door 10: Level 5 - Progressive Enhancement",
        description: "Complete the noscript fallback:\n\n<noscript>\n<___ href='/basic.css' rel='stylesheet'>\n</noscript>",
        type: "fillInTheBlank",
        correctAnswer: "link",
        timeLimit: 300,
        hint: "Element for linking resources when JS is disabled."
      }
    ];

    // Challenge Data - CSS
    const cssChallenges = [
      // Door 1: Beginner Basics
      {
        title: "Door 1: Level 1 - Basic Selectors",
        description: "Which selector targets all <p> elements in a document?",
        type: "mcq",
        options: ["p", ".p", "#p", "*p"],
        correctAnswer: "p",
        timeLimit: 60,
        hint: "Element selectors use the HTML tag name without any symbols."
      },
      {
        title: "Door 1: Level 2 - Color Values",
        description: "Which color value represents pure red in hexadecimal?",
        type: "mcq",
        options: ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
        correctAnswer: "#ff0000",
        timeLimit: 60,
        hint: "In hex colors, the first two digits represent red intensity."
      },
      {
        title: "Door 1: Level 3 - Basic Property",
        description: "Complete the CSS to set text alignment to center:\n\ndiv {\n  text-___: center;\n}",
        type: "fillInTheBlank",
        correctAnswer: "align",
        timeLimit: 60,
        hint: "This property controls horizontal text positioning."
      },
      {
        title: "Door 1: Level 4 - Debug CSS",
        description: "Fix the error in this CSS rule:\n\nh1 {\n  font-size 24px;\n}",
        type: "debug",
        correctAnswer: "h1 {\n  font-size: 24px;\n}",
        timeLimit: 60,
        hint: "Check the punctuation between property and value."
      },
      {
        title: "Door 1: Level 5 - Basic Layout",
        description: "Which property controls the space inside an element, between its content and border?",
        type: "mcq",
        options: ["padding", "margin", "border", "spacing"],
        correctAnswer: "padding",
        timeLimit: 60,
        hint: "This property creates space within the element's boundaries."
      },
    
      // Door 2: Core Concepts
      {
        title: "Door 2: Level 1 - Specificity",
        description: "Which selector has the highest specificity?",
        type: "mcq",
        options: ["#header", ".menu", "div", "body > div"],
        correctAnswer: "#header",
        timeLimit: 90,
        hint: "ID selectors have higher specificity than class or element selectors."
      },
      {
        title: "Door 2: Level 2 - Pseudo-classes",
        description: "Complete the CSS to style links when hovered:\n\na:___ {\n  color: red;\n}",
        type: "fillInTheBlank",
        correctAnswer: "hover",
        timeLimit: 90,
        hint: "This pseudo-class applies when the user points to an element."
      },
      {
        title: "Door 2: Level 3 - Debug CSS",
        description: "Fix the error in this margin declaration:\n\ndiv {\n  margin: 10px 20px 10px;\n}",
        type: "debug",
        correctAnswer: "div {\n  margin: 10px 20px;\n}",
        timeLimit: 90,
        hint: "Three values are valid only when top/bottom and left/right differ."
      },
      {
        title: "Door 2: Level 4 - Font Properties",
        description: "Which property controls the thickness of font characters?",
        type: "mcq",
        options: ["font-weight", "font-style", "font-size", "font-family"],
        correctAnswer: "font-weight",
        timeLimit: 90,
        hint: "Common values include 'normal' and 'bold'."
      },
      {
        title: "Door 2: Level 5 - Box Model",
        description: "Complete the CSS to add a 2px solid black border:\n\ndiv {\n  border: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "2px solid black",
        timeLimit: 90,
        hint: "The order is width, style, then color."
      },
    
      // Door 3: Layout Fundamentals
      {
        title: "Door 3: Level 1 - Display Property",
        description: "Which display value makes elements appear on the same line?",
        type: "mcq",
        options: ["inline", "block", "flex", "grid"],
        correctAnswer: "inline",
        timeLimit: 120,
        hint: "This value doesn't force new lines before or after the element."
      },
      {
        title: "Door 3: Level 2 - Positioning",
        description: "Complete the CSS to position an element relative to its normal position:\n\ndiv {\n  position: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "relative",
        timeLimit: 120,
        hint: "This allows offsetting with top/right/bottom/left properties."
      },
      {
        title: "Door 3: Level 3 - Debug CSS",
        description: "Fix this z-index declaration:\n\ndiv {\n  z-index: ten;\n}",
        type: "debug",
        correctAnswer: "div {\n  z-index: 10;\n}",
        timeLimit: 120,
        hint: "z-index accepts numeric values, not words."
      },
      {
        title: "Door 3: Level 4 - Float Property",
        description: "Which float value positions an element to the right of its container?",
        type: "mcq",
        options: ["right", "left", "none", "inherit"],
        correctAnswer: "right",
        timeLimit: 120,
        hint: "The opposite of 'left'."
      },
      {
        title: "Door 3: Level 5 - Clear Property",
        description: "Complete the CSS to prevent floating elements on both sides:\n\ndiv {\n  clear: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "both",
        timeLimit: 120,
        hint: "This value affects elements floating in either direction."
      },
    
      // Door 4: Responsive Design
      {
        title: "Door 4: Level 1 - Viewport Meta",
        description: "Which meta tag is essential for responsive mobile design?",
        type: "mcq",
        options: [
          "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
          "<meta name=\"responsive\" content=\"true\">",
          "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">",
          "<meta charset=\"UTF-8\">"
        ],
        correctAnswer: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
        timeLimit: 150,
        hint: "Controls page dimensions and scaling on mobile devices."
      },
      {
        title: "Door 4: Level 2 - Media Queries",
        description: "Complete the media query for screens at least 768px wide:\n\n@media (min-width: ___)",
        type: "fillInTheBlank",
        correctAnswer: "768px",
        timeLimit: 150,
        hint: "The value should match common tablet breakpoints."
      },
      {
        title: "Door 4: Level 3 - Debug CSS",
        description: "Fix this responsive image CSS:\n\nimg {\n  max-width: 100%\n  height: auto;\n}",
        type: "debug",
        correctAnswer: "img {\n  max-width: 100%;\n  height: auto;\n}",
        timeLimit: 150,
        hint: "Check the punctuation after the first property."
      },
      {
        title: "Door 4: Level 4 - Relative Units",
        description: "Which unit is relative to the root element's font size?",
        type: "mcq",
        options: ["rem", "em", "px", "vw"],
        correctAnswer: "rem",
        timeLimit: 150,
        hint: "Stands for 'root em'."
      },
      {
        title: "Door 4: Level 5 - Fluid Typography",
        description: "Complete the CSS for responsive font sizing:\n\nhtml {\n  font-size: calc(___ + 1vw);\n}",
        type: "fillInTheBlank",
        correctAnswer: "16px",
        timeLimit: 150,
        hint: "This creates a base that scales with viewport width."
      },
    
      // Door 5: Flexbox
      {
        title: "Door 5: Level 1 - Flex Direction",
        description: "Which flex-direction value stacks items vertically?",
        type: "mcq",
        options: ["column", "row", "row-reverse", "column-reverse"],
        correctAnswer: "column",
        timeLimit: 180,
        hint: "The opposite of the default 'row' value."
      },
      {
        title: "Door 5: Level 2 - Flex Alignment",
        description: "Complete the CSS to center flex items along the main axis:\n\n.container {\n  justify-content: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "center",
        timeLimit: 180,
        hint: "This value works along the primary flex direction."
      },
      {
        title: "Door 5: Level 3 - Debug Flexbox",
        description: "Fix this flexbox CSS:\n\n.container {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-direction: column;\n  justify-content: center;\n}",
        type: "debug",
        correctAnswer: "container {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  justify-content: center;\n}",
        timeLimit: 180,
        hint: "Remove the duplicate property declaration."
      },
      {
        title: "Door 5: Level 4 - Flex Grow",
        description: "Which property allows a flex item to grow relative to others?",
        type: "mcq",
        options: ["flex-grow", "flex-shrink", "flex-basis", "flex-direction"],
        correctAnswer: "flex-grow",
        timeLimit: 180,
        hint: "Accepts a unitless value that serves as a proportion."
      },
      {
        title: "Door 5: Level 5 - Flex Shorthand",
        description: "Complete the flex shorthand for equal growth, no shrink, and 0 basis:\n\n.item {\n  flex: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "1 0 0",
        timeLimit: 180,
        hint: "The order is grow, shrink, basis."
      },
    
      // Door 6: CSS Grid
      {
        title: "Door 6: Level 1 - Grid Definition",
        description: "Which property defines the columns in a CSS Grid?",
        type: "mcq",
        options: ["grid-template-columns", "grid-columns", "grid-template", "grid-layout"],
        correctAnswer: "grid-template-columns",
        timeLimit: 210,
        hint: "The property name includes both 'template' and 'columns'."
      },
      {
        title: "Door 6: Level 2 - Grid Areas",
        description: "Complete the CSS to define a grid area named 'header':\n\n.header {\n  grid-___: header;\n}",
        type: "fillInTheBlank",
        correctAnswer: "area",
        timeLimit: 210,
        hint: "This property places an item in a named grid area."
      },
      {
        title: "Door 6: Level 3 - Debug Grid",
        description: "Fix this grid template areas declaration:\n\n.container {\n  grid-template-areas: 'header header' 'sidebar main' 'footer footer';\n  grid-template-columns: 1fr 2fr\n}",
        type: "debug",
        correctAnswer: "container {\n  grid-template-areas: 'header header' 'sidebar main' 'footer footer';\n  grid-template-columns: 1fr 2fr;\n}",
        timeLimit: 210,
        hint: "Check the punctuation at the end of the rule."
      },
      {
        title: "Door 6: Level 4 - Grid Gap",
        description: "Which property sets the gap between grid rows and columns?",
        type: "mcq",
        options: ["gap", "grid-gap", "grid-spacing", "grid-margin"],
        correctAnswer: "gap",
        timeLimit: 210,
        hint: "The modern property name is short and simple."
      },
      {
        title: "Door 6: Level 5 - Grid Placement",
        description: "Complete the CSS to place an item from column line 1 to 3:\n\n.item {\n  grid-column: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "1 / 3",
        timeLimit: 210,
        hint: "Uses a slash to separate start and end lines."
      },
    
      // Door 7: Transforms & Transitions
      {
        title: "Door 7: Level 1 - Transform Property",
        description: "Which transform value moves an element horizontally?",
        type: "mcq",
        options: ["translateX()", "translateY()", "scale()", "rotate()"],
        correctAnswer: "translateX()",
        timeLimit: 240,
        hint: "The X axis typically represents horizontal movement."
      },
      {
        title: "Door 7: Level 2 - Transition Timing",
        description: "Complete the CSS for a smooth-in-out transition:\n\nbutton {\n  transition-timing-function: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "ease-in-out",
        timeLimit: 240,
        hint: "This function starts and ends slowly."
      },
      {
        title: "Door 7: Level 3 - Debug Transition",
        description: "Fix this transition shorthand:\n\ndiv {\n  transition: all 2s linear\n}",
        type: "debug",
        correctAnswer: "div {\n  transition: all 2s linear;\n}",
        timeLimit: 240,
        hint: "Check the punctuation at the end."
      },
      {
        title: "Door 7: Level 4 - Transform Origin",
        description: "Which property changes the point around which transforms occur?",
        type: "mcq",
        options: ["transform-origin", "transform-center", "transform-point", "transform-pivot"],
        correctAnswer: "transform-origin",
        timeLimit: 240,
        hint: "The name includes both 'transform' and 'origin'."
      },
      {
        title: "Door 7: Level 5 - Multiple Transforms",
        description: "Complete the CSS to both rotate and scale an element:\n\ndiv {\n  transform: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "rotate(45deg) scale(1.2)",
        timeLimit: 240,
        hint: "Multiple transform functions can be combined in one declaration."
      },
    
      // Door 8: Animations
      {
        title: "Door 8: Level 1 - Keyframes",
        description: "Which at-rule defines CSS animations?",
        type: "mcq",
        options: ["@keyframes", "@animation", "@keyframe", "@animate"],
        correctAnswer: "@keyframes",
        timeLimit: 270,
        hint: "The name is plural, indicating multiple frames."
      },
      {
        title: "Door 8: Level 2 - Animation Fill Mode",
        description: "Complete the CSS to retain the final animation state:\n\ndiv {\n  animation-fill-mode: ___;\n}",
        type: "fillInTheBlank",
        correctAnswer: "forwards",
        timeLimit: 270,
        hint: "This value 'forwards' the final keyframe styles."
      },
      {
        title: "Door 8: Level 3 - Debug Animation",
        description: "Fix this animation shorthand:\n\ndiv {\n  animation: slide 3s infinite ease-in\n}",
        type: "debug",
        correctAnswer: "div {\n  animation: slide 3s infinite ease-in;\n}",
        timeLimit: 270,
        hint: "Check the punctuation at the end."
      },
      {
        title: "Door 8: Level 4 - Animation Direction",
        description: "Which value makes an animation play forwards then backwards?",
        type: "mcq",
        options: ["alternate", "reverse", "normal", "alternate-reverse"],
        correctAnswer: "alternate",
        timeLimit: 270,
        hint: "This value alternates between forward and reverse playback."
      },
      {
        title: "Door 8: Level 5 - Step Animation",
        description: "Complete the CSS for an animation with 5 discrete steps:\n\ndiv {\n  animation-timing-function: steps(___);\n}",
        type: "fillInTheBlank",
        correctAnswer: "5",
        timeLimit: 270,
        hint: "The number should match the requested steps."
      },
    
      // Door 9: Advanced Selectors
      {
        title: "Door 9: Level 1 - Attribute Selectors",
        description: "Which selector targets <a> elements with a 'target' attribute?",
        type: "mcq",
        options: ["a[target]", "a.target", "a(target)", "a::target"],
        correctAnswer: "a[target]",
        timeLimit: 300,
        hint: "Attribute selectors use square brackets."
      },
      {
        title: "Door 9: Level 2 - Child Combinator",
        description: "Complete the selector for direct child <li> elements of <ul>:\n\n___",
        type: "fillInTheBlank",
        correctAnswer: "ul > li",
        timeLimit: 300,
        hint: "Uses the greater-than symbol."
      },
      {
        title: "Door 9: Level 3 - Debug Selector",
        description: "Fix this selector targeting the first paragraph after a div:\n\ndiv + p {\n  color: red;\n}",
        type: "debug",
        correctAnswer: "div + p {\n  color: red;\n}",
        timeLimit: 300,
        hint: "This adjacent sibling selector is actually correct as is."
      },
      {
        title: "Door 9: Level 4 - Pseudo-elements",
        description: "Which pseudo-element targets the first line of a paragraph?",
        type: "mcq",
        options: ["::first-line", "::first-letter", ":first-line", ":first-of-type"],
        correctAnswer: "::first-line",
        timeLimit: 300,
        hint: "Note the double colon syntax for pseudo-elements."
      },
      {
        title: "Door 9: Level 5 - Specific Selector",
        description: "Complete the selector for even-numbered list items:\n\nli:___ {\n  background: #eee;\n}",
        type: "fillInTheBlank",
        correctAnswer: "nth-child(even)",
        timeLimit: 300,
        hint: "This structural pseudo-class accepts 'even' as a parameter."
      },
    
      // Door 10: Advanced Techniques
      {
        title: "Door 10: Level 1 - CSS Variables",
        description: "Complete the CSS to define a variable named 'primary':\n\n:root {\n  --___: #3498db;\n}",
        type: "fillInTheBlank",
        correctAnswer: "primary",
        timeLimit: 300,
        hint: "Variable names are case-sensitive."
      },
      {
        title: "Door 10: Level 2 - Blend Modes",
        description: "Which property controls how an element blends with its background?",
        type: "mcq",
        options: ["mix-blend-mode", "background-blend", "blend-mode", "element-blend"],
        correctAnswer: "mix-blend-mode",
        timeLimit: 300,
        hint: "The name includes 'mix' and 'mode'."
      },
      {
        title: "Door 10: Level 3 - Debug Variables",
        description: "Fix this CSS variable usage:\n\ndiv {\n  color: var primary-color;\n}",
        type: "debug",
        correctAnswer: "div {\n  color: var(--primary-color);\n}",
        timeLimit: 300,
        hint: "Check the syntax for the var() function."
      },
      {
        title: "Door 10: Level 4 - Clip Path",
        description: "Which function creates a circular clipping path?",
        type: "mcq",
        options: ["circle()", "round()", "ellipse()", "circular()"],
        correctAnswer: "circle()",
        timeLimit: 300,
        hint: "The simplest geometric shape function."
      },
      {
        title: "Door 10: Level 5 - Custom Properties",
        description: "Complete the CSS to use a variable with fallback to red:\n\ndiv {\n  color: var(--custom-color, ___);\n}",
        type: "fillInTheBlank",
        correctAnswer: "red",
        timeLimit: 300,
        hint: "The fallback comes after the comma if the variable is undefined."
      }
    ];

    const allChallenges = {
      javascript: javascriptChallenges,
      html: htmlChallenges,
      css: cssChallenges,
    };

    // Game Functions
    function createDoors() {
      doorsContainer.innerHTML = "";
      const topics = ["JavaScript", "HTML", "CSS"];

      topics.forEach((topic) => {
        const door = document.createElement("div");
        door.className = "door unlocked";
        door.textContent = topic;
        door.dataset.topic = topic.toLowerCase();

        door.addEventListener("click", () => {
          currentTopic = topic.toLowerCase();
          currentDoor = 1;
          currentQuestionIndex = 0;
          doorStartTime = Date.now();
          startTime = Date.now();
          
          // Get the first challenge for the selected topic
          const firstChallenge = allChallenges[currentTopic][0];
          if (firstChallenge) {
            openChallengeModal(firstChallenge);
            door.classList.add("open");
          } else {
            console.error("No challenges found for topic:", currentTopic);
          }
        });

        doorsContainer.appendChild(door);
        doors.push(door);
      });
    }

    function openChallengeModal(challenge) {
      // Reset modal state
      isButtonDisabled = false;
      challengeTitle.textContent = challenge.title;
      challengeDescription.textContent = challenge.description;
      codeInput.value = "";
      codeResult.textContent = "";
      hintContainer.style.display = "none";

      // Clear previous MCQ options if any
      const existingOptions = document.getElementById("mcq-options");
      if (existingOptions) {
        existingOptions.remove();
      }

      // Show the modal before setting up challenge-specific UI
      challengeModal.style.display = "flex";

      // Start the timer for this question
      startTimer(challenge.timeLimit);

      // Set up UI based on challenge type
      if (challenge.type === "mcq") {
        codeInput.style.display = "none";
        submitCodeButton.style.display = "none";
        codeResult.style.display = "none";

        const optionsContainer = document.createElement("div");
        optionsContainer.id = "mcq-options";
        challengeDescription.appendChild(optionsContainer);

        challenge.options.forEach((option) => {
          const optionButton = document.createElement("button");
          optionButton.textContent = option;
          optionButton.addEventListener("click", () => {
            if (isButtonDisabled) return;
            isButtonDisabled = true;

            if (option === challenge.correctAnswer) {
              handleCorrectAnswer();
            } else {
              handleIncorrectAnswer();
            }
          });
          optionsContainer.appendChild(optionButton);
        });
      } else if (challenge.type === "fillInTheBlank") {
        codeInput.placeholder = "Fill in the blank(s)";
        codeInput.style.display = "block";
        submitCodeButton.style.display = "block";
        codeResult.style.display = "block";

        submitCodeButton.onclick = () => {
          if (isButtonDisabled) return;
          isButtonDisabled = true;

          const userAnswer = codeInput.value.trim();
          if (userAnswer === challenge.correctAnswer) {
            handleCorrectAnswer();
          } else {
            handleIncorrectAnswer();
          }
        };
      } else if (challenge.type === "debug") {
        codeInput.placeholder = "Fix the code...";
        codeInput.style.display = "block";
        submitCodeButton.style.display = "block";
        codeResult.style.display = "block";

        submitCodeButton.onclick = () => {
          if (isButtonDisabled) return;
          isButtonDisabled = true;

          const userCode = codeInput.value;
          if (userCode === challenge.correctAnswer) {
            handleCorrectAnswer();
          } else {
            handleIncorrectAnswer();
          }
        };
      }

      hintButton.onclick = () => {
        hintContainer.style.display = "block";
        hintText.textContent = challenge.hint;
      };
    }

    function handleCorrectAnswer() {
      codeResult.textContent = "Correct! Next question.";
      codeResult.style.color = "green";
      setTimeout(() => {
        stopTimer();
        currentQuestionIndex++;
        if (currentQuestionIndex < 5) {
          openChallengeModal(allChallenges[currentTopic][(currentDoor - 1) * 5 + currentQuestionIndex]);
        } else {
          challengeModal.style.display = "none";
          stopTimer();
          resetTimer();
          if (currentDoor < 10) {
            const doorTime = Math.floor((Date.now() - doorStartTime) / 1000);
            doorTimes.push({ door: currentDoor, topic: currentTopic, time: doorTime });
            currentDoor++;
            currentQuestionIndex = 0;
            doorStartTime = Date.now();
            openChallengeModal(allChallenges[currentTopic][(currentDoor - 1) * 5]);
          } else {
            const doorTime = Math.floor((Date.now() - doorStartTime) / 1000);
            doorTimes.push({ door: currentDoor, topic: currentTopic, time: doorTime });
            showLeaderboard();
          }
        }
      }, 1000);
    }

    function handleIncorrectAnswer() {
      codeResult.textContent = "Incorrect. Returning to Door 1.";
      codeResult.style.color = "red";
      setTimeout(() => {
        stopTimer();
        currentDoor = 1;
        currentQuestionIndex = 0;
        doorStartTime = Date.now();
        openChallengeModal(allChallenges[currentTopic][0]);
      }, 1500);
    }

    function showLeaderboard() {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      totalTimeDisplay.textContent = totalTime;
      leaderboardTableBody.innerHTML = "";

      const topicDoorTimes = doorTimes.filter((doorTime) => doorTime.topic === currentTopic);
      topicDoorTimes.sort((a, b) => a.time - b.time);

      topicDoorTimes.forEach((doorTime) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${doorTime.topic.charAt(0).toUpperCase() + doorTime.topic.slice(1)} Door ${doorTime.door}</td>
          <td>${doorTime.time} seconds</td>
        `;
        leaderboardTableBody.appendChild(row);
      });

      leaderboardModal.style.display = "flex";
    }

    // Event Listeners
    closeModal.addEventListener("click", () => {
      challengeModal.style.display = "none";
      stopTimer();
    });

    closeLeaderboardModal.addEventListener("click", () => {
      leaderboardModal.style.display = "none";
    });

    logoutButton.addEventListener("click", () => {
      window.location.href = "https://landingpage-hazel-mu.vercel.app/";
    });

    document.getElementById("main-logout-button").addEventListener("click", () => {
      window.location.href = "https://landingpage-hazel-mu.vercel.app/";
    });

    // Initialize Game
    createDoors();
  });