document.addEventListener('DOMContentLoaded', () => {
    const doorsContainer = document.getElementById('doors');
    const challengeModal = document.getElementById('challenge-modal');
    const challengeTitle = document.getElementById('challenge-title');
    const challengeDescription = document.getElementById('challenge-description');
    const codeInput = document.getElementById('code-input');
    const submitCodeButton = document.getElementById('submit-code');
    const codeResult = document.getElementById('code-result');
    const closeModal = document.getElementById('close-modal');
    const timerDisplay = document.getElementById('time');
    const timerContainer = document.getElementById('timer');
    const hintButton = document.getElementById('hint-button');
    const hintContainer = document.getElementById('hint-container');
    const hintText = document.getElementById('hint-text');
    const leaderboardModal = document.getElementById('leaderboard-modal');
    const closeLeaderboardModal = document.getElementById('close-leaderboard-modal');
    const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
    const totalTimeDisplay = document.getElementById('total-time');
    const logoutButton = document.getElementById('logout-button');

    let timeRemaining; // Timer will be set based on the difficulty of the question
    let timerInterval;
    let currentDoor = 1;
    let currentQuestionIndex = 0; // Track the current question within a door
    let doors = [];
    let isTimerRunning = false;
    let startTime;
    let doorTimes = []; // Array to store time taken for each door
    let doorStartTime; // Track start time for each door

    // Timer functionality
    function startTimer(timeLimit) {
        if (!isTimerRunning) {
            isTimerRunning = true;
            timeRemaining = timeLimit; // Set the timer based on the difficulty level
            timerContainer.style.display = 'block';
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
        timerContainer.style.display = 'none';
    }

    function resetTimer() {
        timeRemaining = 0; // Reset to 0, as the timer will be set dynamically
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function resetGame() {
        stopTimer();
        resetTimer();
        currentDoor = 1;
        currentQuestionIndex = 0;
        doorTimes = []; // Reset door times
        createDoors();
    }

    // Challenges with difficulty-based time limits
    const challenges = [
        // Door 1: Level 1 (Basic)
        {
            title: "Door 1: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst x = 5;\nconst y = 3;\nconsole.log(x + y);",
            type: "mcq",
            options: ["8", "53", "35", "Error"],
            correctAnswer: "8",
            timeLimit: 60, // 1 minute
            hint: "The '+' operator adds two numbers together."
        },
        {
            title: "Door 1: Level 2 - Debug the Code",
            description: "The following code is supposed to print 'Hello, World!', but it has an error. Fix the error.\n\nconsole.log('Hello, World!');",
            type: "debug",
            correctAnswer: "console.log('Hello, World!');",
            timeLimit: 60, // 1 minute
            hint: "Check the syntax of the console.log statement."
        },
        {
            title: "Door 1: Level 3 - Fill in the Blanks",
            description: "Complete the code to calculate the sum of two numbers.\n\nfunction sum(a, b) {\n  return a ___ b;\n}",
            type: "fillInTheBlank",
            correctAnswer: "+",
            timeLimit: 60, // 1 minute
            hint: "The '+' operator is used to add two numbers."
        },
        {
            title: "Door 1: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst str = 'Hello';\nconsole.log(str.length);",
            type: "mcq",
            options: ["5", "6", "Hello", "Error"],
            correctAnswer: "5",
            timeLimit: 60, // 1 minute
            hint: "The 'length' property returns the number of characters in a string."
        },
        {
            title: "Door 1: Level 5 - Code Completion",
            description: "Complete the code to multiply two numbers.\n\nfunction multiply(a, b) {\n  return a ___ b;\n}",
            type: "fillInTheBlank",
            correctAnswer: "*",
            timeLimit: 60, // 1 minute
            hint: "The '*' operator multiplies two numbers."
        },

        // Door 2: Level 2 (Intermediate)
        {
            title: "Door 2: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr[0]);",
            type: "mcq",
            options: ["1", "2", "3", "Error"],
            correctAnswer: "1",
            timeLimit: 90, // 1.5 minutes
            hint: "Array indices start at 0."
        },
        {
            title: "Door 2: Level 2 - Debug the Code",
            description: "The following code is supposed to print the first element of the array, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr[1]);",
            type: "debug",
            correctAnswer: "console.log(arr[0]);",
            timeLimit: 90, // 1.5 minutes
            hint: "Array indices start at 0."
        },
        {
            title: "Door 2: Level 3 - Fill in the Blanks",
            description: "Complete the code to check if a number is even.\n\nfunction isEven(num) {\n  return num ___ 2 === 0;\n}",
            type: "fillInTheBlank",
            correctAnswer: "%",
            timeLimit: 90, // 1.5 minutes
            hint: "The '%' operator returns the remainder of a division."
        },
        {
            title: "Door 2: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.join('-'));",
            type: "mcq",
            options: ["1-2-3", "[1, 2, 3]", "Error"],
            correctAnswer: "1-2-3",
            timeLimit: 90, // 1.5 minutes
            hint: "The 'join' method joins all elements of an array into a string."
        },
        {
            title: "Door 2: Level 5 - Code Completion",
            description: "Complete the code to check if a number is zero.\n\nfunction isZero(num) {\n  return num ___ 0;\n}",
            type: "fillInTheBlank",
            correctAnswer: "===",
            timeLimit: 90, // 1.5 minutes
            hint: "The '===' operator checks for strict equality."
        },

        // Door 3: Level 3 (Intermediate)
        {
            title: "Door 3: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.map(x => x * 2));",
            type: "mcq",
            options: ["[2, 4, 6]", "[1, 2, 3]", "Error"],
            correctAnswer: "[2, 4, 6]",
            timeLimit: 120, // 2 minutes
            hint: "The 'map' method creates a new array by applying a function to each element."
        },
        {
            title: "Door 3: Level 2 - Debug the Code",
            description: "The following code is supposed to double each element in the array, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr.map(x => x * 2));",
            type: "debug",
            correctAnswer: "console.log(arr.map(x => x * 2));",
            timeLimit: 120, // 2 minutes
            hint: "Check the syntax of the map function."
        },
        {
            title: "Door 3: Level 3 - Fill in the Blanks",
            description: "Complete the code to find the maximum number in an array.\n\nfunction findMax(arr) {\n  return Math.___(...arr);\n}",
            type: "fillInTheBlank",
            correctAnswer: "max",
            timeLimit: 120, // 2 minutes
            hint: "The 'Math.max' method returns the largest of zero or more numbers."
        },
        {
            title: "Door 3: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.filter(x => x > 1));",
            type: "mcq",
            options: ["[2, 3]", "[1, 2, 3]", "Error"],
            correctAnswer: "[2, 3]",
            timeLimit: 120, // 2 minutes
            hint: "The 'filter' method creates a new array with elements that pass a test."
        },
        {
            title: "Door 3: Level 5 - Code Completion",
            description: "Complete the code to find the sum of all elements in an array.\n\nfunction sumArray(arr) {\n  return arr.___((a, b) => a + b);\n}",
            type: "fillInTheBlank",
            correctAnswer: "reduce",
            timeLimit: 120, // 2 minutes
            hint: "The 'reduce' method reduces the array to a single value."
        },

        // Door 4: Level 4 (Advanced)
        {
            title: "Door 4: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.slice(1));",
            type: "mcq",
            options: ["[2, 3]", "[1, 2, 3]", "Error"],
            correctAnswer: "[2, 3]",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'slice' method returns a shallow copy of a portion of an array."
        },
        {
            title: "Door 4: Level 2 - Debug the Code",
            description: "The following code is supposed to return a portion of the array, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr.slice(1));",
            type: "debug",
            correctAnswer: "console.log(arr.slice(1));",
            timeLimit: 150, // 2.5 minutes
            hint: "Check the syntax of the slice method."
        },
        {
            title: "Door 4: Level 3 - Fill in the Blanks",
            description: "Complete the code to reverse an array.\n\nfunction reverseArray(arr) {\n  return arr.___();\n}",
            type: "fillInTheBlank",
            correctAnswer: "reverse",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'reverse' method reverses the order of elements in an array."
        },
        {
            title: "Door 4: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.includes(2));",
            type: "mcq",
            options: ["true", "false", "Error"],
            correctAnswer: "true",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'includes' method checks if an array contains a certain value."
        },
        {
            title: "Door 4: Level 5 - Code Completion",
            description: "Complete the code to sort an array in ascending order.\n\nfunction sortArray(arr) {\n  return arr.___((a, b) => a - b);\n}",
            type: "fillInTheBlank",
            correctAnswer: "sort",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'sort' method sorts the elements of an array."
        },

        // Door 5: Level 5 (Expert)
        {
            title: "Door 5: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.find(x => x > 1));",
            type: "mcq",
            options: ["2", "[2, 3]", "Error"],
            correctAnswer: "2",
            timeLimit: 180, // 3 minutes
            hint: "The 'find' method returns the first element in the array that satisfies the condition."
        },
        {
            title: "Door 5: Level 2 - Debug the Code",
            description: "The following code is supposed to find the first element greater than 1, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr.find(x => x > 1));",
            type: "debug",
            correctAnswer: "console.log(arr.find(x => x > 1));",
            timeLimit: 180, // 3 minutes
            hint: "Check the syntax of the find method."
        },
        {
            title: "Door 5: Level 3 - Fill in the Blanks",
            description: "Complete the code to flatten a nested array.\n\nfunction flattenArray(arr) {\n  return arr.___();\n}",
            type: "fillInTheBlank",
            correctAnswer: "flat",
            timeLimit: 180, // 3 minutes
            hint: "The 'flat' method creates a new array with all sub-array elements concatenated."
        },
        {
            title: "Door 5: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.every(x => x > 0));",
            type: "mcq",
            options: ["true", "false", "Error"],
            correctAnswer: "true",
            timeLimit: 180, // 3 minutes
            hint: "The 'every' method tests whether all elements in the array pass the test."
        },
        {
            title: "Door 5: Level 5 - Code Completion",
            description: "Complete the code to remove duplicates from an array.\n\nfunction removeDuplicates(arr) {\n  return [...new ___(arr)];\n}",
            type: "fillInTheBlank",
            correctAnswer: "Set",
            timeLimit: 180, // 3 minutes
            hint: "The 'Set' object lets you store unique values of any type."
        },

        // Door 6: Level 1 (Basic)
        {
            title: "Door 6: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst x = 10;\nconst y = 5;\nconsole.log(x - y);",
            type: "mcq",
            options: ["5", "15", "50", "Error"],
            correctAnswer: "5",
            timeLimit: 60, // 1 minute
            hint: "The '-' operator subtracts two numbers."
        },
        {
            title: "Door 6: Level 2 - Debug the Code",
            description: "The following code is supposed to subtract two numbers, but it has an error. Fix the error.\n\nconst x = 10;\nconst y = 5;\nconsole.log(x - y);",
            type: "debug",
            correctAnswer: "console.log(x - y);",
            timeLimit: 60, // 1 minute
            hint: "Check the syntax of the subtraction operation."
        },
        {
            title: "Door 6: Level 3 - Fill in the Blanks",
            description: "Complete the code to divide two numbers.\n\nfunction divide(a, b) {\n  return a ___ b;\n}",
            type: "fillInTheBlank",
            correctAnswer: "/",
            timeLimit: 60, // 1 minute
            hint: "The '/' operator divides two numbers."
        },
        {
            title: "Door 6: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.indexOf(2));",
            type: "mcq",
            options: ["1", "2", "3", "Error"],
            correctAnswer: "1",
            timeLimit: 60, // 1 minute
            hint: "The 'indexOf' method returns the index of the first occurrence of a value."
        },
        {
            title: "Door 6: Level 5 - Code Completion",
            description: "Complete the code to check if a number is odd.\n\nfunction isOdd(num) {\n  return num ___ 2 !== 0;\n}",
            type: "fillInTheBlank",
            correctAnswer: "%",
            timeLimit: 60, // 1 minute
            hint: "The '%' operator returns the remainder of a division."
        },

        // Door 7: Level 2 (Intermediate)
        {
            title: "Door 7: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.concat([4, 5]));",
            type: "mcq",
            options: ["[1, 2, 3, 4, 5]", "[1, 2, 3]", "Error"],
            correctAnswer: "[1, 2, 3, 4, 5]",
            timeLimit: 90, // 1.5 minutes
            hint: "The 'concat' method merges two or more arrays."
        },
        {
            title: "Door 7: Level 2 - Debug the Code",
            description: "The following code is supposed to merge two arrays, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr.concat([4, 5]));",
            type: "debug",
            correctAnswer: "console.log(arr.concat([4, 5]));",
            timeLimit: 90, // 1.5 minutes
            hint: "Check the syntax of the concat method."
        },
        {
            title: "Door 7: Level 3 - Fill in the Blanks",
            description: "Complete the code to find the product of all elements in an array.\n\nfunction productArray(arr) {\n  return arr.___((a, b) => a * b);\n}",
            type: "fillInTheBlank",
            correctAnswer: "reduce",
            timeLimit: 90, // 1.5 minutes
            hint: "The 'reduce' method reduces the array to a single value."
        },
        {
            title: "Door 7: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.reverse());",
            type: "mcq",
            options: ["[3, 2, 1]", "[1, 2, 3]", "Error"],
            correctAnswer: "[3, 2, 1]",
            timeLimit: 90, // 1.5 minutes
            hint: "The 'reverse' method reverses the order of elements in an array."
        },
        {
            title: "Door 7: Level 5 - Code Completion",
            description: "Complete the code to check if a number is positive.\n\nfunction isPositive(num) {\n  return num ___ 0;\n}",
            type: "fillInTheBlank",
            correctAnswer: ">",
            timeLimit: 90, // 1.5 minutes
            hint: "The '>' operator checks if a number is greater than another."
        },

        // Door 8: Level 3 (Intermediate)
        {
            title: "Door 8: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.sort((a, b) => b - a));",
            type: "mcq",
            options: ["[3, 2, 1]", "[1, 2, 3]", "Error"],
            correctAnswer: "[3, 2, 1]",
            timeLimit: 120, // 2 minutes
            hint: "The 'sort' method sorts the elements of an array in descending order."
        },
        {
            title: "Door 8: Level 2 - Debug the Code",
            description: "The following code is supposed to sort the array in descending order, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr.sort((a, b) => b - a));",
            type: "debug",
            correctAnswer: "console.log(arr.sort((a, b) => b - a));",
            timeLimit: 120, // 2 minutes
            hint: "Check the syntax of the sort method."
        },
        {
            title: "Door 8: Level 3 - Fill in the Blanks",
            description: "Complete the code to find the index of a specific value in an array.\n\nfunction findIndex(arr, value) {\n  return arr.___(value);\n}",
            type: "fillInTheBlank",
            correctAnswer: "indexOf",
            timeLimit: 120, // 2 minutes
            hint: "The 'indexOf' method returns the index of the first occurrence of a value."
        },
        {
            title: "Door 8: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.some(x => x > 2));",
            type: "mcq",
            options: ["true", "false", "Error"],
            correctAnswer: "true",
            timeLimit: 120, // 2 minutes
            hint: "The 'some' method tests whether at least one element in the array passes the test."
        },
        {
            title: "Door 8: Level 5 - Code Completion",
            description: "Complete the code to check if an array contains a specific value.\n\nfunction containsValue(arr, value) {\n  return arr.___(value);\n}",
            type: "fillInTheBlank",
            correctAnswer: "includes",
            timeLimit: 120, // 2 minutes
            hint: "The 'includes' method checks if an array contains a certain value."
        },

        // Door 9: Level 4 (Advanced)
        {
            title: "Door 9: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.flatMap(x => [x, x * 2]));",
            type: "mcq",
            options: ["[1, 2, 2, 4, 3, 6]", "[1, 2, 3]", "Error"],
            correctAnswer: "[1, 2, 2, 4, 3, 6]",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'flatMap' method maps each element to a new array and flattens the result."
        },
        {
            title: "Door 9: Level 2 - Debug the Code",
            description: "The following code is supposed to map and flatten the array, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr.flatMap(x => [x, x * 2]));",
            type: "debug",
            correctAnswer: "console.log(arr.flatMap(x => [x, x * 2]));",
            timeLimit: 150, // 2.5 minutes
            hint: "Check the syntax of the flatMap method."
        },
        {
            title: "Door 9: Level 3 - Fill in the Blanks",
            description: "Complete the code to create a new array with the results of applying a function to each element.\n\nfunction mapArray(arr, func) {\n  return arr.___(func);\n}",
            type: "fillInTheBlank",
            correctAnswer: "map",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'map' method creates a new array by applying a function to each element."
        },
        {
            title: "Door 9: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.reduceRight((a, b) => a + b));",
            type: "mcq",
            options: ["6", "[3, 2, 1]", "Error"],
            correctAnswer: "6",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'reduceRight' method reduces the array from right to left."
        },
        {
            title: "Door 9: Level 5 - Code Completion",
            description: "Complete the code to create a new array with elements that pass a test.\n\nfunction filterArray(arr, func) {\n  return arr.___(func);\n}",
            type: "fillInTheBlank",
            correctAnswer: "filter",
            timeLimit: 150, // 2.5 minutes
            hint: "The 'filter' method creates a new array with elements that pass a test."
        },

        // Door 10: Level 5 (Expert)
        {
            title: "Door 10: Level 1 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.copyWithin(1, 0));",
            type: "mcq",
            options: ["[1, 1, 2]", "[1, 2, 3]", "Error"],
            correctAnswer: "[1, 1, 2]",
            timeLimit: 180, // 3 minutes
            hint: "The 'copyWithin' method copies a portion of the array to another location."
        },
        {
            title: "Door 10: Level 2 - Debug the Code",
            description: "The following code is supposed to copy a portion of the array, but it has an error. Fix the error.\n\nconst arr = [1, 2, 3];\nconsole.log(arr.copyWithin(1, 0));",
            type: "debug",
            correctAnswer: "console.log(arr.copyWithin(1, 0));",
            timeLimit: 180, // 3 minutes
            hint: "Check the syntax of the copyWithin method."
        },
        {
            title: "Door 10: Level 3 - Fill in the Blanks",
            description: "Complete the code to find the minimum number in an array.\n\nfunction findMin(arr) {\n  return Math.___(...arr);\n}",
            type: "fillInTheBlank",
            correctAnswer: "min",
            timeLimit: 180, // 3 minutes
            hint: "The 'Math.min' method returns the smallest of zero or more numbers."
        },
        {
            title: "Door 10: Level 4 - Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\nconsole.log(arr.findIndex(x => x === 2));",
            type: "mcq",
            options: ["1", "2", "Error"],
            correctAnswer: "1",
            timeLimit: 180, // 3 minutes
            hint: "The 'findIndex' method returns the index of the first element that satisfies the condition."
        },
        {
            title: "Door 10: Level 5 - Code Completion",
            description: "Complete the code to check if all elements in an array pass a test.\n\nfunction allPass(arr, func) {\n  return arr.___(func);\n}",
            type: "fillInTheBlank",
            correctAnswer: "every",
            timeLimit: 180, // 3 minutes
            hint: "The 'every' method tests whether all elements in the array pass the test."
        }
    ];

    // Create doors
    function createDoors() {
        doorsContainer.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const door = document.createElement('div');
            door.className = i === 1 ? 'door unlocked' : 'door locked';
            door.textContent = i === 1 ? "JavaScript" : `Door ${i}`;
            door.addEventListener('click', () => {
                if (i === currentDoor) {
                    doorStartTime = Date.now(); // Track start time for the door
                    openChallengeModal(challenges[(i - 1) * 5]); // Open the first question of the door
                    door.classList.add('open'); // Add open animation
                }
            });
            doorsContainer.appendChild(door);
            doors.push(door);
        }
        updateDoorVisibility();
    }

    function updateDoorVisibility() {
        doors.forEach((door, index) => {
            if (index + 1 === currentDoor) {
                door.classList.add('unlocked');
                door.style.display = 'block';
            } else {
                door.style.display = 'none';
            }
        });
    }

    function openChallengeModal(challenge) {
        challengeTitle.textContent = challenge.title;
        challengeDescription.textContent = challenge.description;
        codeInput.value = '';
        codeResult.textContent = '';
        hintContainer.style.display = 'none';

        // Clear previous content
        codeInput.style.display = 'block';
        submitCodeButton.style.display = 'block';
        codeResult.style.display = 'block';

        // Start the timer for this question
        startTimer(challenge.timeLimit);

        if (challenge.type === "mcq") {
            // Hide code input for MCQ
            codeInput.style.display = 'none';
            submitCodeButton.style.display = 'none';
            codeResult.style.display = 'none';

            // Create MCQ options
            const optionsContainer = document.createElement('div');
            optionsContainer.id = 'mcq-options';
            challengeDescription.appendChild(optionsContainer);

            challenge.options.forEach((option) => {
                const optionButton = document.createElement('button');
                optionButton.textContent = option;
                optionButton.addEventListener('click', () => {
                    if (option === challenge.correctAnswer) {
                        codeResult.textContent = "Correct! Next question.";
                        codeResult.style.color = "green";
                        setTimeout(() => {
                            stopTimer(); // Stop the timer for the current question
                            currentQuestionIndex++;
                            if (currentQuestionIndex < 5) {
                                openChallengeModal(challenges[(currentDoor - 1) * 5 + currentQuestionIndex]);
                            } else {
                                challengeModal.style.display = 'none';
                                stopTimer();
                                resetTimer();
                                if (currentDoor < 10) {
                                    const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the door
                                    doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                    currentDoor++;
                                    currentQuestionIndex = 0;
                                    updateDoorVisibility();
                                } else {
                                    const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the last door
                                    doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                    showLeaderboard();
                                }
                            }
                        }, 1000);
                    } else {
                        codeResult.textContent = "Incorrect. Try again.";
                        codeResult.style.color = "red";
                    }
                });
                optionsContainer.appendChild(optionButton);
            });
        } else if (challenge.type === "fillInTheBlank") {
            // Show code input for Fill in the Blanks
            codeInput.placeholder = "Fill in the blank(s)";
            submitCodeButton.addEventListener('click', () => {
                const userAnswer = codeInput.value.trim();
                if (userAnswer === challenge.correctAnswer) {
                    codeResult.textContent = "Correct! Next question.";
                    codeResult.style.color = "green";
                    setTimeout(() => {
                        stopTimer(); // Stop the timer for the current question
                        currentQuestionIndex++;
                        if (currentQuestionIndex < 5) {
                            openChallengeModal(challenges[(currentDoor - 1) * 5 + currentQuestionIndex]);
                        } else {
                            challengeModal.style.display = 'none';
                            stopTimer();
                            resetTimer();
                            if (currentDoor < 10) {
                                const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the door
                                doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                currentDoor++;
                                currentQuestionIndex = 0;
                                updateDoorVisibility();
                            } else {
                                const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the last door
                                doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                showLeaderboard();
                            }
                        }
                    }, 1000);
                } else {
                    codeResult.textContent = "Incorrect. Try again.";
                    codeResult.style.color = "red";
                }
            });
        } else if (challenge.type === "debug") {
            // Show code input for Debugging
            codeInput.placeholder = "Fix the code...";
            submitCodeButton.addEventListener('click', () => {
                const userCode = codeInput.value;
                if (userCode === challenge.correctAnswer) {
                    codeResult.textContent = "Correct! Next question.";
                    codeResult.style.color = "green";
                    setTimeout(() => {
                        stopTimer(); // Stop the timer for the current question
                        currentQuestionIndex++;
                        if (currentQuestionIndex < 5) {
                            openChallengeModal(challenges[(currentDoor - 1) * 5 + currentQuestionIndex]);
                        } else {
                            challengeModal.style.display = 'none';
                            stopTimer();
                            resetTimer();
                            if (currentDoor < 10) {
                                const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the door
                                doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                currentDoor++;
                                currentQuestionIndex = 0;
                                updateDoorVisibility();
                            } else {
                                const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the last door
                                doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                showLeaderboard();
                            }
                        }
                    }, 1000);
                } else {
                    codeResult.textContent = "Incorrect. Try again.";
                    codeResult.style.color = "red";
                }
            });
        }

        // Hint system
        hintButton.addEventListener('click', () => {
            hintContainer.style.display = 'block';
            hintText.textContent = challenge.hint;
        });

        challengeModal.style.display = 'flex';
    }

    function showLeaderboard() {
        // Sort doorTimes array by time taken (ascending order)
        doorTimes.sort((a, b) => a.time - b.time);

        // Display total time taken
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        totalTimeDisplay.textContent = totalTime;

        // Clear previous leaderboard rows
        leaderboardTableBody.innerHTML = '';

        // Add rows to the leaderboard table
        doorTimes.forEach((doorTime) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Door ${doorTime.door}</td>
                <td>${doorTime.time} seconds</td>
            `;
            leaderboardTableBody.appendChild(row);
        });

        // Show the leaderboard modal
        leaderboardModal.style.display = 'flex';
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        // Redirect to the logout page (replace 'logout.html' with your actual logout page)
        window.location.href = 'logout.html';
    });

    closeModal.addEventListener('click', () => {
        challengeModal.style.display = 'none';
        stopTimer(); // Stop the timer when the modal is closed
        updateDoorVisibility(); // Ensure the current door is visible after closing the modal
    });

    closeLeaderboardModal.addEventListener('click', () => {
        leaderboardModal.style.display = 'none';
    });

    // Start the game
    createDoors();
});