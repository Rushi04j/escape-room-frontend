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

    const leaderboardModal = document.getElementById('leaderboard-modal');
    const closeLeaderboardModal = document.getElementById('close-leaderboard-modal');
    const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');
    const totalTimeDisplay = document.getElementById('total-time');

    let timeRemaining; // Timer will be set based on the difficulty of the question
    let timerInterval;
    let currentDoor = 1;
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
            startTime = Date.now();
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerDisplay();

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    alert("Time's up! You failed to escape.");
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
        doorTimes = []; // Reset door times
        createDoors();
    }

    // Challenges with difficulty-based time limits
    const challenges = [
        // Door 1: MCQ (Guess the Output) - Easy (1 minute)
        {
            title: "Door 1: Guess the Output",
            description: "What will be the output of the following code?\n\nconst x = 5;\nconst y = 3;\nconsole.log(x + y);",
            type: "mcq",
            options: ["8", "53", "35", "Error"],
            correctAnswer: "8",
            timeLimit: 60, // 1 minute
        },
        // Door 2: MCQ (Guess the Output) - Easy (1 minute)
        {
            title: "Door 2: Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
            type: "mcq",
            options: ["3", "4", "5", "Error"],
            correctAnswer: "4",
            timeLimit: 60, // 1 minute
        },
        // Door 3: MCQ (Guess the Output) - Easy (1 minute)
        {
            title: "Door 3: Guess the Output",
            description: "What will be the output of the following code?\n\nconst str = 'Hello';\nconsole.log(str.toUpperCase());",
            type: "mcq",
            options: ["hello", "HELLO", "Hello", "Error"],
            correctAnswer: "HELLO",
            timeLimit: 60, // 1 minute
        },
        // Door 4: Fill in the Blanks - Medium (2 minutes)
        {
            title: "Door 4: Fill in the Blanks",
            description: "Complete the code to calculate the sum of two numbers.\n\nfunction sum(a, b) {\n  return a ___ b;\n}",
            type: "fillInTheBlank",
            correctAnswer: "+",
            timeLimit: 120, // 2 minutes
        },
        // Door 5: Fill in the Blanks - Medium (2 minutes)
        {
            title: "Door 5: Fill in the Blanks",
            description: "Complete the code to check if a number is even.\n\nfunction isEven(num) {\n  return num ___ 2 === 0;\n}",
            type: "fillInTheBlank",
            correctAnswer: "%",
            timeLimit: 120, // 2 minutes
        },
        // Door 6: Fill in the Blanks - Medium (2 minutes)
        {
            title: "Door 6: Fill in the Blanks",
            description: "Complete the code to reverse a string.\n\nfunction reverseString(str) {\n  return str.___('').___('');\n}",
            type: "fillInTheBlank",
            correctAnswer: "split,reverse,join",
            timeLimit: 120, // 2 minutes
        },
        // Door 7: Write Full Code - Hard (3 minutes)
        {
            title: "Door 7: Write Full Code",
            description: "Write a function `factorial(n)` that returns the factorial of a number.",
            type: "writeCode",
            timeLimit: 180, // 3 minutes
            test: (code) => {
                try {
                    const func = new Function(`${code}; return factorial(5);`);
                    return func() === 120;
                } catch (error) {
                    return false;
                }
            },
        },
        // Door 8: Write Full Code - Hard (3 minutes)
        {
            title: "Door 8: Write Full Code",
            description: "Write a function `isPalindrome(str)` that returns `true` if the input string is a palindrome, otherwise `false`.",
            type: "writeCode",
            timeLimit: 180, // 3 minutes
            test: (code) => {
                try {
                    const func = new Function(`${code}; return isPalindrome('racecar');`);
                    return func() === true;
                } catch (error) {
                    return false;
                }
            },
        },
        // Door 9: Write Full Code - Hard (3 minutes)
        {
            title: "Door 9: Write Full Code",
            description: "Write a function `findLargest(arr)` that returns the largest number in an array.",
            type: "writeCode",
            timeLimit: 180, // 3 minutes
            test: (code) => {
                try {
                    const func = new Function(`${code}; return findLargest([1, 5, 3, 9, 2]);`);
                    return func() === 9;
                } catch (error) {
                    return false;
                }
            },
        },
        // Door 10: Write Full Code - Hard (3 minutes)
        {
            title: "Door 10: Write Full Code",
            description: "Write a function `countVowels(str)` that returns the number of vowels in the input string.",
            type: "writeCode",
            timeLimit: 180, // 3 minutes
            test: (code) => {
                try {
                    const func = new Function(`${code}; return countVowels('hello world');`);
                    return func() === 3;
                } catch (error) {
                    return false;
                }
            },
        },
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
                    startTimer(challenges[i - 1].timeLimit); // Start timer with the challenge's time limit
                    openChallengeModal(challenges[i - 1]);
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

        // Clear previous content
        codeInput.style.display = 'block';
        submitCodeButton.style.display = 'block';
        codeResult.style.display = 'block';

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
                        codeResult.textContent = "Correct! Door unlocked.";
                        codeResult.style.color = "green";
                        setTimeout(() => {
                            challengeModal.style.display = 'none';
                            stopTimer();
                            resetTimer();
                            if (currentDoor < 10) {
                                const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the door
                                doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                currentDoor++;
                                updateDoorVisibility();
                            } else {
                                const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the last door
                                doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                                showLeaderboard();
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
                    codeResult.textContent = "Correct! Door unlocked.";
                    codeResult.style.color = "green";
                    setTimeout(() => {
                        challengeModal.style.display = 'none';
                        stopTimer();
                        resetTimer();
                        if (currentDoor < 10) {
                            const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the door
                            doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                            currentDoor++;
                            updateDoorVisibility();
                        } else {
                            const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the last door
                            doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                            showLeaderboard();
                        }
                    }, 1000);
                } else {
                    codeResult.textContent = "Incorrect. Try again.";
                    codeResult.style.color = "red";
                }
            });
        } else if (challenge.type === "writeCode") {
            // Show code input for Write Full Code
            codeInput.placeholder = "Write your code here...";
            submitCodeButton.addEventListener('click', () => {
                const userCode = codeInput.value;
                if (challenge.test(userCode)) {
                    codeResult.textContent = "Correct! Door unlocked.";
                    codeResult.style.color = "green";
                    setTimeout(() => {
                        challengeModal.style.display = 'none';
                        stopTimer();
                        resetTimer();
                        if (currentDoor < 10) {
                            const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the door
                            doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                            currentDoor++;
                            updateDoorVisibility();
                        } else {
                            const doorTime = Math.floor((Date.now() - doorStartTime) / 1000); // Calculate time taken for the last door
                            doorTimes.push({ door: currentDoor, time: doorTime }); // Store door time
                            showLeaderboard();
                        }
                    }, 1000);
                } else {
                    codeResult.textContent = "Incorrect. Try again.";
                    codeResult.style.color = "red";
                }
            });
        }

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

    closeModal.addEventListener('click', () => {
        challengeModal.style.display = 'none';
        updateDoorVisibility(); // Ensure the current door is visible after closing the modal
    });

    closeLeaderboardModal.addEventListener('click', () => {
        leaderboardModal.style.display = 'none';
    });

    // Start the game
    createDoors();
});