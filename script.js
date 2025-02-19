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

    let timeRemaining = 300; // 5 minutes in seconds
    let timerInterval;
    let currentDoor = 1;
    let doors = [];
    let isTimerRunning = false;
    let startTime;
    let doorTimes = []; // Array to store time taken for each door
    let doorStartTime; // Track start time for each door

    // Timer functionality
    function startTimer() {
        if (!isTimerRunning) {
            isTimerRunning = true;
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
        timeRemaining = 300;
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
    document.addEventListener("DOMContentLoaded", () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("You must log in first!");
            window.location.href = "https://landingpage-hazel-mu.vercel.app"; // Redirect to landing page
        }
    });
    
    // Challenges
    const challenges = [
        // Door 1: MCQ (Guess the Output)
        {
            title: "Door 1: Guess the Output",
            description: "What will be the output of the following code?\n\nconst x = 5;\nconst y = 3;\nconsole.log(x + y);",
            type: "mcq",
            options: ["8", "53", "35", "Error"],
            correctAnswer: "8",
        },
        // Door 2: MCQ (Guess the Output)
        {
            title: "Door 2: Guess the Output",
            description: "What will be the output of the following code?\n\nconst arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);",
            type: "mcq",
            options: ["3", "4", "5", "Error"],
            correctAnswer: "4",
        },
        // Door 3: MCQ (Guess the Output)
        {
            title: "Door 3: Guess the Output",
            description: "What will be the output of the following code?\n\nconst str = 'Hello';\nconsole.log(str.toUpperCase());",
            type: "mcq",
            options: ["hello", "HELLO", "Hello", "Error"],
            correctAnswer: "HELLO",
        },
        // Door 4: Fill in the Blanks
        {
            title: "Door 4: Fill in the Blanks",
            description: "Complete the code to calculate the sum of two numbers.\n\nfunction sum(a, b) {\n  return a ___ b;\n}",
            type: "fillInTheBlank",
            correctAnswer: "+",
        },
        // Door 5: Fill in the Blanks
        {
            title: "Door 5: Fill in the Blanks",
            description: "Complete the code to check if a number is even.\n\nfunction isEven(num) {\n  return num ___ 2 === 0;\n}",
            type: "fillInTheBlank",
            correctAnswer: "%",
        },
        // Door 6: Fill in the Blanks
        {
            title: "Door 6: Fill in the Blanks",
            description: "Complete the code to reverse a string.\n\nfunction reverseString(str) {\n  return str.___('').___('');\n}",
            type: "fillInTheBlank",
            correctAnswer: "split,reverse,join",
        },
        // Door 7: Write Full Code
        {
            title: "Door 7: Write Full Code",
            description: "Write a function `factorial(n)` that returns the factorial of a number.",
            type: "writeCode",
            test: (code) => {
                try {
                    const func = new Function(`${code}; return factorial(5);`);
                    return func() === 120;
                } catch (error) {
                    return false;
                }
            },
        },
        // Door 8: Write Full Code
        {
            title: "Door 8: Write Full Code",
            description: "Write a function `isPalindrome(str)` that returns `true` if the input string is a palindrome, otherwise `false`.",
            type: "writeCode",
            test: (code) => {
                try {
                    const func = new Function(`${code}; return isPalindrome('racecar');`);
                    return func() === true;
                } catch (error) {
                    return false;
                }
            },
        },
        // Door 9: Write Full Code
        {
            title: "Door 9: Write Full Code",
            description: "Write a function `findLargest(arr)` that returns the largest number in an array.",
            type: "writeCode",
            test: (code) => {
                try {
                    const func = new Function(`${code}; return findLargest([1, 5, 3, 9, 2]);`);
                    return func() === 9;
                } catch (error) {
                    return false;
                }
            },
        },
        // Door 10: Write Full Code
        {
            title: "Door 10: Write Full Code",
            description: "Write a function `countVowels(str)` that returns the number of vowels in the input string.",
            type: "writeCode",
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
            if (i === 1) {
                door.textContent = "JavaScript";
            } else {
                door.textContent = `Door ${i}`;
            }
            door.addEventListener('click', () => {
                if (i === currentDoor) {
                    doorStartTime = Date.now(); // Track start time for the door
                    startTimer();
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

            challenge.options.forEach((option, index) => {
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


