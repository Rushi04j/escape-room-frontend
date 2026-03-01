document.addEventListener("DOMContentLoaded", () => {
  const landingPage = document.getElementById("landingPage")
  const authPage = document.getElementById("authPage")
  const enterButton = document.getElementById("enterButton")
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")
  const loginButton = loginForm.querySelector(".submit-btn")
  const signupButton = signupForm.querySelector(".submit-btn")
  const tabBtns = document.querySelectorAll(".tab-btn")
  const customCursor = document.querySelector(".custom-cursor")
  const jumpScare = document.getElementById("jumpScare")
  const easterEggTrigger = document.getElementById("easterEggTrigger")
  const miniGame = document.getElementById("miniGame")
  const closeGame = document.getElementById("closeGame")
  const gameGrid = document.getElementById("gameGrid")
  const clicksRemaining = document.getElementById("clicksRemaining")
  const strengthMeter = document.getElementById("strengthMeter")
  const strengthText = document.getElementById("strengthText")
  const hiddenMessages = document.querySelectorAll(".hidden-message")

  // Backend and Frontend URLs - Dynamic for local and live testing
  const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  const backendUrl = isLocal ? "http://localhost:5000/api/auth" : "https://escape-room-backend.vercel.app/api/auth";
  const frontendUrl = isLocal ? "../Frontend/index.html" : "https://escape-room-frontend-iota.vercel.app/";

  // Custom Alert Modal Function
  const customAlert = document.getElementById("customAlert");
  const customAlertTitle = document.getElementById("customAlertTitle");
  const customAlertMessage = document.getElementById("customAlertMessage");
  const customAlertClose = document.getElementById("customAlertClose");

  function showCustomAlert(title, message) {
    customAlertTitle.textContent = title;
    customAlertMessage.textContent = message;
    customAlert.classList.remove("hidden");
    // Small delay to allow display to apply before animation
    setTimeout(() => {
        customAlert.classList.add("active");
    }, 10);
  }

  if (customAlertClose) {
    customAlertClose.addEventListener("click", () => {
        customAlert.classList.remove("active");
        setTimeout(() => {
            customAlert.classList.add("hidden");
        }, 300);
    });
  }

  // Dynamic lighting effect
  const lightingOverlay = document.createElement("div")
  lightingOverlay.className = "dynamic-lighting"
  document.body.appendChild(lightingOverlay)

  // Custom cursor with improved tracking and interactive flashlight
  document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
      customCursor.style.left = `${e.clientX}px`
      customCursor.style.top = `${e.clientY}px`
      
      // Update the dynamic lighting focal point
      lightingOverlay.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, transparent 150px, rgba(0, 0, 0, 0.95) 500px)`
    })
  })

  document.addEventListener("mousedown", () => {
    customCursor.classList.add("active")
  })

  document.addEventListener("mouseup", () => {
    customCursor.classList.remove("active")
  })

  // Add link hover effect to all clickable elements with improved detection
  const updateClickableElements = () => {
    const clickableElements = document.querySelectorAll(
      "button, a, .tab-btn, .easter-egg-trigger, .game-cell, .close-game",
    )
    clickableElements.forEach((element) => {
      if (!element.hasAttribute("data-cursor-initialized")) {
        element.setAttribute("data-cursor-initialized", "true")

        element.addEventListener("mouseenter", () => {
          customCursor.classList.add("link-hover")
        })

        element.addEventListener("mouseleave", () => {
          customCursor.classList.remove("link-hover")
        })
      }
    })
  }

  // Initial setup of clickable elements
  updateClickableElements()

  // Update clickable elements when DOM changes (for dynamically added elements)
  const observer = new MutationObserver(updateClickableElements)
  observer.observe(document.body, { childList: true, subtree: true })

  // Countdown timer with improved reliability
  function updateCountdown() {
    const hours = document.getElementById("hours")
    const minutes = document.getElementById("minutes")
    const seconds = document.getElementById("seconds")

    if (!hours || !minutes || !seconds) return

    // Decrease time by 1 second
    let currentHours = Number.parseInt(hours.textContent)
    let currentMinutes = Number.parseInt(minutes.textContent)
    let currentSeconds = Number.parseInt(seconds.textContent)

    if (currentSeconds > 0) {
      currentSeconds--
    } else {
      if (currentMinutes > 0) {
        currentMinutes--
        currentSeconds = 59
      } else {
        if (currentHours > 0) {
          currentHours--
          currentMinutes = 59
          currentSeconds = 59
        } else {
          // Time's up!
          triggerJumpScare()
          return
        }
      }
    }

    hours.textContent = currentHours.toString().padStart(2, "0")
    minutes.textContent = currentMinutes.toString().padStart(2, "0")
    seconds.textContent = currentSeconds.toString().padStart(2, "0")

    // Add flashing effect when time is running low
    const countdownContainer = document.querySelector(".countdown-container")
    if (countdownContainer && currentHours === 0 && currentMinutes < 5) {
      countdownContainer.style.animation = "pulse 0.5s infinite"
    }

    setTimeout(updateCountdown, 1000)
  }

  // Start countdown
  updateCountdown()

  // Create horror audio elements with lazy loading and error handling
  const createAudioElement = (src, volume = 0.3, loop = true) => {
    try {
      const audio = new Audio();
      audio.preload = "none"; // Lazy load to improve page speed
      audio.src = src;
      audio.volume = volume;
      audio.loop = loop;
      return audio;
    } catch (error) {
      console.error("Error creating audio element:", error)
      // Return a dummy audio object that won't throw errors when methods are called
      return {
        play: () => Promise.resolve(),
        pause: () => {},
        volume: volume,
        loop: loop,
      }
    }
  }

  // Background ambient sound
  const ambientSound = createAudioElement(
    "https://assets.mixkit.co/sfx/preview/mixkit-horror-ambient-atmosphere-2485.mp3",
  )

  // Button click sound
  const buttonSound = createAudioElement(
    "https://assets.mixkit.co/sfx/preview/mixkit-horror-wood-crack-2487.mp3",
    0.5,
    false,
  )

  // Heartbeat sound
  const heartbeatSound = createAudioElement(
    "https://assets.mixkit.co/sfx/preview/mixkit-heartbeat-in-a-scary-hospital-2482.mp3",
    0.2,
  )

  // Jump scare sound
  const jumpScareSound = createAudioElement(
    "https://assets.mixkit.co/sfx/preview/mixkit-cinematic-horror-hit-with-echo-2486.mp3",
    0.7,
    false,
  )

  // Safe audio play function
  const safePlayAudio = (audio) => {
    if (audio && typeof audio.play === "function") {
      audio.play().catch((e) => console.log("Audio play failed:", e))
    }
  }

  // Play ambient sound on user interaction with better error handling
  document.body.addEventListener(
    "click",
    () => {
      safePlayAudio(ambientSound)
    },
    { once: true },
  )

  // Add horror typing effect to game description
  const gameDescription = document.querySelector(".game-description")
  if (gameDescription) {
    gameDescription.classList.remove("typewriter")
    gameDescription.style.whiteSpace = "normal"
    gameDescription.style.borderRight = "none"
    gameDescription.style.width = "auto"

    const text = gameDescription.textContent || ""
    gameDescription.textContent = ""

    let charIndex = 0

    function typeText() {
      if (charIndex < text.length) {
        gameDescription.textContent += text.charAt(charIndex)
        charIndex++

        // Random typing speed for horror effect
        const randomDelay = Math.random() * (150 - 50) + 50
        setTimeout(typeText, randomDelay)
      }
    }

    // Start typing after a delay
    setTimeout(typeText, 1000)
  }

  // Hidden messages with improved randomization
  function showRandomHiddenMessage() {
    if (!hiddenMessages || hiddenMessages.length === 0) return

    // Hide any currently visible messages
    hiddenMessages.forEach((message) => {
      message.classList.remove("visible")
    })

    // Show a random message
    const randomIndex = Math.floor(Math.random() * hiddenMessages.length)
    const randomMessage = hiddenMessages[randomIndex]

    // Position randomly on screen but ensure it's visible
    const margin = 20 // % margin from edges
    randomMessage.style.top = `${Math.random() * (100 - 2 * margin) + margin}%`
    randomMessage.style.left = `${Math.random() * (100 - 2 * margin) + margin}%`

    // Make visible
    randomMessage.classList.add("visible")

    // Schedule next message
    setTimeout(showRandomHiddenMessage, Math.random() * 20000 + 10000)
  }

  // Start showing hidden messages after a delay
  setTimeout(showRandomHiddenMessage, 5000)

  // Jump scare function with improved reliability
  function triggerJumpScare() {
    if (!jumpScare) return

    jumpScare.classList.add("active")
    safePlayAudio(jumpScareSound)

    setTimeout(() => {
      jumpScare.classList.remove("active")
    }, 800) // Increased from 500ms for better visibility
  }

  // Random jump scares with reduced frequency
  function scheduleRandomJumpScare() {
    const randomTime = Math.random() * 90000 + 60000 // Between 60s and 150s (less frequent)
    setTimeout(() => {
      // 15% chance of jump scare (reduced from 20%)
      if (Math.random() < 0.15) {
        triggerJumpScare()
      }
      scheduleRandomJumpScare()
    }, randomTime)
  }

  // Start scheduling random jump scares
  scheduleRandomJumpScare()

  // Easter egg with improved click handling
  if (easterEggTrigger) {
    easterEggTrigger.addEventListener("click", (e) => {
      e.preventDefault()
      openMiniGame()

      // Play click sound
      const clickSound = createAudioElement(
        "https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3",
        0.4,
        false,
      )
      safePlayAudio(clickSound)
    })
  }

  // Mini game with improved game logic
  let keyIndex = -1 // Store key index globally

  function openMiniGame() {
    if (!miniGame || !gameGrid) return

    miniGame.classList.remove("hidden")

    // Create game grid
    gameGrid.innerHTML = ""
    let remainingClicks = 10
    if (clicksRemaining) {
      clicksRemaining.textContent = remainingClicks
    }

    // Set random key location
    keyIndex = Math.floor(Math.random() * 16)

    // Create 16 cells (4x4 grid)
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement("div")
      cell.className = "game-cell"
      cell.dataset.index = i

      cell.addEventListener("click", (e) => {
        e.preventDefault()

        if (cell.classList.contains("revealed")) return

        // Decrease clicks
        remainingClicks--
        if (clicksRemaining) {
          clicksRemaining.textContent = remainingClicks
        }

        // Reveal cell
        cell.classList.add("revealed")

        // Check if key found
        if (Number.parseInt(cell.dataset.index) === keyIndex) {
          cell.textContent = "🔑"

          // Play success sound
          const successSound = createAudioElement(
            "https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3",
            0.3,
            false,
          )
          safePlayAudio(successSound)

          setTimeout(() => {
            showCustomAlert("Access Granted", "You found the key! You can now escape...")
            miniGame.classList.add("hidden")
          }, 1000)
        } else {
          // Random horror symbol
          const symbols = ["💀", "👻", "🕷️", "🦇", "🔪", "⚰️", "🩸", "👁️"]
          cell.textContent = symbols[Math.floor(Math.random() * symbols.length)]

          // Play fail sound
          const failSound = createAudioElement(
            "https://assets.mixkit.co/sfx/preview/mixkit-spooky-forest-wind-1228.mp3",
            0.2,
            false,
          )
          safePlayAudio(failSound)

          // Check if out of clicks
          if (remainingClicks <= 0) {
            setTimeout(() => {
              showCustomAlert("Game Over", "You ran out of attempts! The darkness consumes you...")
              miniGame.classList.add("hidden")
              triggerJumpScare()
            }, 500)
          }
        }

        // Update clickable elements for the newly revealed cell
        updateClickableElements()
      })

      gameGrid.appendChild(cell)
    }

    // Update clickable elements for the new game cells
    updateClickableElements()
  }

  // Close mini game with improved click handling
  if (closeGame) {
    closeGame.addEventListener("click", (e) => {
      e.preventDefault()
      if (miniGame) {
        miniGame.classList.add("hidden")
      }

      // Play close sound
      const closeSound = createAudioElement(
        "https://assets.mixkit.co/sfx/preview/mixkit-gate-latch-click-1924.mp3",
        0.3,
        false,
      )
      safePlayAudio(closeSound)
    })
  }

  // 🔹 Transition from Landing Page to Auth Page with enhanced effects and reliability
  if (enterButton) {
    enterButton.addEventListener("click", (e) => {
      e.preventDefault()
      safePlayAudio(buttonSound)

      // Flicker effect before transition
      let flickerCount = 0
      const flickerInterval = setInterval(() => {
        if (landingPage) {
          landingPage.style.opacity = flickerCount % 2 === 0 ? "0.5" : "1"
        }
        flickerCount++

        if (flickerCount > 6) {
          clearInterval(flickerInterval)

          // Start actual transition
          if (landingPage) {
            landingPage.style.opacity = "0"
            landingPage.style.transform = "scale(1.1)"
          }

          setTimeout(() => {
            if (landingPage) landingPage.classList.add("hidden")
            if (authPage) authPage.classList.remove("hidden")

            // Play heartbeat sound during auth page
            safePlayAudio(heartbeatSound)

            setTimeout(() => {
              if (authPage) authPage.style.opacity = "1"
            }, 50)
          }, 800)
        }
      }, 100)
    })
  }

  // 🔹 Enhanced fade effect for pages
  if (landingPage) {
    landingPage.style.transition = "opacity 0.8s ease, transform 0.8s ease"
  }
  if (authPage) {
    authPage.style.transition = "opacity 0.8s ease"
    authPage.style.opacity = "0"
  }

  // 🔹 Tab Switching with animation (Login / Signup) and improved reliability
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      safePlayAudio(buttonSound)

      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      if (btn.dataset.tab === "login") {
        if (signupForm) {
          signupForm.style.opacity = "0"
          signupForm.style.transform = "translateX(20px)"
        }

        setTimeout(() => {
          if (loginForm) loginForm.classList.remove("hidden")
          if (signupForm) signupForm.classList.add("hidden")

          setTimeout(() => {
            if (loginForm) {
              loginForm.style.opacity = "1"
              loginForm.style.transform = "translateX(0)"
            }
          }, 50)
        }, 300)
      } else {
        if (loginForm) {
          loginForm.style.opacity = "0"
          loginForm.style.transform = "translateX(-20px)"
        }

        setTimeout(() => {
          if (loginForm) loginForm.classList.add("hidden")
          if (signupForm) signupForm.classList.remove("hidden")

          setTimeout(() => {
            if (signupForm) {
              signupForm.style.opacity = "1"
              signupForm.style.transform = "translateX(0)"
            }
          }, 50)
        }, 300)
      }
    })
  })

  // Set initial form styles for animations
  if (loginForm) {
    loginForm.style.opacity = "1"
    loginForm.style.transform = "translateX(0)"
    loginForm.style.transition = "opacity 0.3s ease, transform 0.3s ease"
  }

  if (signupForm) {
    signupForm.style.opacity = "0"
    signupForm.style.transform = "translateX(20px)"
    signupForm.style.transition = "opacity 0.3s ease, transform 0.3s ease"
  }

  // Password strength meter with improved validation
  const passwordInput = document.getElementById("signup-password")
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value
      let strength = 0

      // Calculate password strength with better criteria
      if (password.length >= 8) strength += 1
      if (password.length >= 12) strength += 0.5
      if (/[A-Z]/.test(password)) strength += 1
      if (/[0-9]/.test(password)) strength += 1
      if (/[^A-Za-z0-9]/.test(password)) strength += 1
      if (/[0-9].*[0-9]/.test(password)) strength += 0.5 // At least 2 numbers

      // Update strength meter
      if (strengthMeter && strengthText) {
        if (password.length === 0) {
          strengthMeter.style.width = "0"
          strengthMeter.className = "strength-meter-fill"
          strengthText.textContent = "Password strength"
        } else if (strength <= 2) {
          strengthMeter.style.width = "33%"
          strengthMeter.className = "strength-meter-fill weak"
          strengthText.textContent = "Weak"
        } else if (strength <= 3.5) {
          strengthMeter.style.width = "66%"
          strengthMeter.className = "strength-meter-fill medium"
          strengthText.textContent = "Medium"
        } else {
          strengthMeter.style.width = "100%"
          strengthMeter.className = "strength-meter-fill strong"
          strengthText.textContent = "Strong"
        }
      }

      // Play typing sound with pitch based on strength
      const typingSound = createAudioElement(
        "https://assets.mixkit.co/sfx/preview/mixkit-typewriter-key-single-hit-1362.mp3",
        0.1,
        false,
      )
      if (typingSound.playbackRate !== undefined) {
        typingSound.playbackRate = 0.8 + strength * 0.2 // Increase pitch with strength
      }
      safePlayAudio(typingSound)
    })
  }

  // 🔹 Handle Login with animation and improved form validation
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const emailInput = e.target.querySelector('input[type="email"]')
      const passwordInput = e.target.querySelector('input[type="password"]')

      if (!emailInput || !passwordInput) {
        showCustomAlert("Error", "Form inputs not found. Please try again.")
        return
      }

      const email = emailInput.value
      const password = passwordInput.value

      // Basic validation
      if (!email || !password) {
        showCustomAlert("Missing Fields", "Please fill in all fields")
        return
      }

      if (!email.includes("@") || !email.includes(".")) {
        showCustomAlert("Invalid Email", "Please enter a valid email address")
        return
      }

      // Button press animation
      if (loginButton) {
        loginButton.style.transform = "scale(0.95)"
        setTimeout(() => {
          loginButton.style.transform = "scale(1)"
        }, 100)
      }

      try {
        // Show loading state
        if (loginButton) {
          loginButton.disabled = true
          loginButton.textContent = "Logging in..."
        }

        const res = await fetch(`${backendUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (res.ok) {
          localStorage.setItem("token", data.token)

          // Success animation
          document.body.style.transition = "filter 2s ease"
          document.body.style.filter = "brightness(2) blur(10px)"

          setTimeout(() => {
            showCustomAlert("Success", "Login successful! Redirecting...")
            window.location.href = frontendUrl // ✅ Redirect to Game Frontend
          }, 1000)
        } else {
          // Error animation
          if (loginForm) {
            loginForm.style.animation = "shake 0.5s ease"
            setTimeout(() => {
              loginForm.style.animation = ""
            }, 500)
          }
          showCustomAlert("Login Failed", data.error || "Login failed. Please try again.")

          // Reset button state
          if (loginButton) {
            loginButton.disabled = false
            loginButton.textContent = "Enter The Room"
          }
        }
      } catch (err) {
        console.error("Login error:", err)
        showCustomAlert("Error", "Login failed! Please try again.")

        // Reset button state
        if (loginButton) {
          loginButton.disabled = false
          loginButton.textContent = "Enter The Room"
        }
      }
    })
  }

  // 🔹 Handle Signup with animation and improved form validation
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const usernameInput = e.target.querySelector('input[type="text"]')
      const emailInput = e.target.querySelector('input[type="email"]')
      const passwordInputs = e.target.querySelectorAll('input[type="password"]')

      if (!usernameInput || !emailInput || passwordInputs.length < 2) {
        showCustomAlert("Error", "Form inputs not found. Please try again.")
        return
      }

      const username = usernameInput.value
      const email = emailInput.value
      const password = passwordInputs[0].value
      const confirmPassword = passwordInputs[1].value

      // Basic validation
      if (!username || !email || !password || !confirmPassword) {
        showCustomAlert("Missing Fields", "Please fill in all fields")
        return
      }

      if (username.length < 3) {
        showCustomAlert("Invalid Input", "Username must be at least 3 characters long")
        return
      }

      if (!email.includes("@") || !email.includes(".")) {
        showCustomAlert("Invalid Format", "Please enter a valid email address")
        return
      }

      if (password.length < 6) {
        showCustomAlert("Weak Password", "Password must be at least 6 characters long")
        return
      }

      // Button press animation
      if (signupButton) {
        signupButton.style.transform = "scale(0.95)"
        setTimeout(() => {
          signupButton.style.transform = "scale(1)"
        }, 100)
      }

      if (password !== confirmPassword) {
        // Password mismatch animation
        if (signupForm) {
          signupForm.style.animation = "shake 0.5s ease"
          setTimeout(() => {
            signupForm.style.animation = ""
          }, 500)
        }
        showCustomAlert("Mismatch", "Passwords do not match!")
        return
      }

      try {
        // Show loading state
        if (signupButton) {
          signupButton.disabled = true
          signupButton.textContent = "Signing up..."
        }

        const res = await fetch(`${backendUrl}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        })

        const data = await res.json()

        if (res.ok) {
          // Success animation
          document.body.style.transition = "filter 2s ease"
          document.body.style.filter = "brightness(2) blur(10px)"

          setTimeout(() => {
            showCustomAlert("Success", "Signup successful! Redirecting to game...")
            window.location.href = frontendUrl // ✅ Redirect to Game Frontend after Signup
          }, 1000)
        } else {
          // Error animation
          if (signupForm) {
            signupForm.style.animation = "shake 0.5s ease"
            setTimeout(() => {
              signupForm.style.animation = ""
            }, 500)
          }
          showCustomAlert("Signup Failed", data.error || "Signup failed. Please try again.")

          // Reset button state
          if (signupButton) {
            signupButton.disabled = false
            signupButton.textContent = "Begin Your Journey"
          }
        }
      } catch (err) {
        console.error("Signup error:", err)
        showCustomAlert("Error", "Signup failed! Please try again.")

        // Reset button state
        if (signupButton) {
          signupButton.disabled = false
          signupButton.textContent = "Begin Your Journey"
        }
      }
    })
  }

  // 🔹 Enhanced Button Movement and Disabling with improved validation
  // Function to check if all inputs in a form are filled
  const isFormComplete = (form) => {
    if (!form) return false

    const inputs = form.querySelectorAll("input[required]")
    return Array.from(inputs).every((input) => input.value.trim() !== "")
  }

  // Function to enable/disable buttons based on form completion
  const updateButtonState = (form, button) => {
    if (!form || !button) return

    if (isFormComplete(form)) {
      button.disabled = false
      button.classList.remove("disabled")
    } else {
      button.disabled = true
      button.classList.add("disabled")
    }
  }

  // Add input event listeners to login form with typing sound
  if (loginForm) {
    loginForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        // Play typing sound
        if (input.value.length > 0) {
          const typingSound = createAudioElement(
            "https://assets.mixkit.co/sfx/preview/mixkit-typewriter-key-single-hit-1362.mp3",
            0.2,
            false,
          )
          safePlayAudio(typingSound)
        }

        updateButtonState(loginForm, loginButton)
      })
    })
  }

  // Add input event listeners to signup form with typing sound
  if (signupForm) {
    signupForm.querySelectorAll("input").forEach((input) => {
      if (input.id !== "signup-password") {
        // Password input has its own listener
        input.addEventListener("input", () => {
          // Play typing sound
          if (input.value.length > 0) {
            const typingSound = createAudioElement(
              "https://assets.mixkit.co/sfx/preview/mixkit-typewriter-key-single-hit-1362.mp3",
              0.2,
              false,
            )
            safePlayAudio(typingSound)
          }

          updateButtonState(signupForm, signupButton)
        })
      } else {
        // Still update button state for password input
        input.addEventListener("input", () => {
          updateButtonState(signupForm, signupButton)
        })
      }
    })
  }

  // Function to move the button randomly on the page with horror effect
  const moveButtonRandomly = (button) => {
    if (!button) return

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const buttonWidth = button.offsetWidth
    const buttonHeight = button.offsetHeight

    // Generate random positions within the window bounds
    // Keep button within viewport with margins
    const margin = 50 // pixels from edge
    const randomX = Math.floor(Math.random() * (windowWidth - buttonWidth - 2 * margin) + margin)
    const randomY = Math.floor(Math.random() * (windowHeight - buttonHeight - 2 * margin) + margin)

    // Horror sound effect
    const horrorSound = createAudioElement(
      "https://assets.mixkit.co/sfx/preview/mixkit-horror-dream-transition-1002.mp3",
      0.3,
      false,
    )
    safePlayAudio(horrorSound)

    // Move the button to the random position with horror effect
    button.style.position = "fixed"
    button.style.left = `${randomX}px`
    button.style.top = `${randomY}px`
    button.style.zIndex = "1000"

    // Add flickering effect to the button
    let flickerCount = 0
    const flickerInterval = setInterval(() => {
      button.style.opacity = flickerCount % 2 === 0 ? "0.7" : "1"
      flickerCount++

      if (flickerCount > 6) {
        clearInterval(flickerInterval)
        button.style.opacity = "1"
      }
    }, 100)
  }

  // Add click event listener to disabled buttons for random movement
  const addButtonMovementEffect = (button) => {
    if (!button) return

    button.addEventListener("click", (e) => {
      if (button.disabled) {
        e.preventDefault() // Prevent form submission
        moveButtonRandomly(button) // Move the button randomly
      }
    })
  }

  addButtonMovementEffect(loginButton)
  addButtonMovementEffect(signupButton)

  // Initialize button states
  updateButtonState(loginForm, loginButton)
  updateButtonState(signupForm, signupButton)

  // Add particle effects to the background
  const createParticles = () => {
    const particleContainer = document.createElement("div")
    particleContainer.className = "particle-container"
    particleContainer.style.position = "fixed"
    particleContainer.style.top = "0"
    particleContainer.style.left = "0"
    particleContainer.style.width = "100%"
    particleContainer.style.height = "100%"
    particleContainer.style.pointerEvents = "none"
    particleContainer.style.zIndex = "5"
    document.body.appendChild(particleContainer)

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.position = "absolute"
      particle.style.width = `${Math.random() * 5 + 1}px`
      particle.style.height = particle.style.width
      particle.style.background = "rgba(220, 38, 38, 0.5)"
      particle.style.borderRadius = "50%"
      particle.style.top = `${Math.random() * 100}%`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.boxShadow = "0 0 10px rgba(220, 38, 38, 0.7)"

      // Set animation
      particle.style.animation = `float-particle ${Math.random() * 10 + 10}s linear infinite`

      // Add keyframes for the animation
      if (!document.querySelector("#particle-keyframes")) {
        const style = document.createElement("style")
        style.id = "particle-keyframes"
        style.textContent = `
                    @keyframes float-particle {
                        0% {
                            transform: translateY(0) rotate(0deg);
                            opacity: 0;
                        }
                        10% {
                            opacity: 0.5;
                        }
                        90% {
                            opacity: 0.5;
                        }
                        100% {
                            transform: translateY(-100vh) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `
        document.head.appendChild(style)
      }

      particleContainer.appendChild(particle)
    }
  }

  // Create particles
  createParticles()

  // Add 3D tilt effect to form elements with improved performance
  const addTiltEffect = (element) => {
    if (!element) return

    let tiltTimeout

    element.addEventListener("mousemove", (e) => {
      if (tiltTimeout) {
        cancelAnimationFrame(tiltTimeout)
      }

      tiltTimeout = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const xPercent = x / rect.width - 0.5
        const yPercent = y / rect.height - 0.5

        const maxTilt = 5 // Maximum tilt in degrees

        element.style.transform = `perspective(1000px) rotateX(${-yPercent * maxTilt}deg) rotateY(${xPercent * maxTilt}deg) scale3d(1.02, 1.02, 1.02)`
      })
    })

    element.addEventListener("mouseleave", () => {
      if (tiltTimeout) {
        cancelAnimationFrame(tiltTimeout)
      }
      element.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
    })
  }

  // Apply tilt effect to login container
  const loginContainer = document.querySelector(".login-container")
  if (loginContainer) {
    addTiltEffect(loginContainer)
  }

  // Add horror text scramble effect with improved performance
  const addTextScramble = (element) => {
    if (!element) return

    const originalText = element.textContent || ""
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}:"<>?|'
    let scrambleInterval

    element.addEventListener("mouseover", () => {
      let iterations = 0

      // Clear any existing interval
      if (scrambleInterval) {
        clearInterval(scrambleInterval)
      }

      scrambleInterval = setInterval(() => {
        element.textContent = originalText
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return originalText[index]
            }
            return letters[Math.floor(Math.random() * letters.length)]
          })
          .join("")

        if (iterations >= originalText.length) {
          clearInterval(scrambleInterval)
          element.textContent = originalText
        }

        iterations += 1 / 3
      }, 30)
    })

    element.addEventListener("mouseleave", () => {
      clearInterval(scrambleInterval)
      element.textContent = originalText
    })
  }

  // Apply text scramble to headings and buttons
  document.querySelectorAll("h1, .submit-btn, .tab-btn").forEach(addTextScramble)

  // Add floating horror elements animation with improved randomization
  const animateFloatingElements = () => {
    const elements = document.querySelectorAll(
      ".floating-skull, .floating-ghost, .floating-spider, .floating-bat, .floating-knife",
    )

    elements.forEach((element) => {
      // Initial random position
      const randomX = Math.random() * window.innerWidth * 0.8
      const randomY = Math.random() * window.innerHeight * 0.8

      element.style.transform = `translate(${randomX}px, ${randomY}px)`

      // Randomly reposition elements occasionally
      const moveElement = () => {
        const newX = Math.random() * window.innerWidth * 0.8
        const newY = Math.random() * window.innerHeight * 0.8
        const rotation = Math.random() * 360
        const scale = 0.8 + Math.random() * 0.5

        element.style.transition = "transform 5s ease-in-out"
        element.style.transform = `translate(${newX}px, ${newY}px) rotate(${rotation}deg) scale(${scale})`

        // Schedule next movement
        setTimeout(moveElement, 5000 + Math.random() * 5000)
      }

      // Start movement after a random delay
      setTimeout(moveElement, Math.random() * 2000)
    })
  }

  // Start floating elements animation
  animateFloatingElements()

  // Add input field focus effects with sound and improved reliability
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("focus", () => {
      // Play eerie focus sound
      const focusSound = createAudioElement(
        "https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-strings-2843.mp3",
        0.1,
        false,
      )
      safePlayAudio(focusSound)

      // Add visual effect to parent without affecting visibility
      const parent = input.parentElement
      if (parent) {
        parent.style.transform = "scale(1.05)"
        parent.style.zIndex = "100"
        // Make sure floating label is hidden
        const label = parent.querySelector(".floating-label")
        if (label) {
          label.style.opacity = "0"
          label.style.visibility = "hidden"
        }
      }
    })

    input.addEventListener("blur", () => {
      const parent = input.parentElement
      if (parent) {
        parent.style.transform = ""
        parent.style.zIndex = ""
      }
    })
  })

  // Add more blood drips dynamically with improved performance
  const addMoreBloodDrips = () => {
    const bloodContainer = document.querySelector(".blood-drips")
    if (!bloodContainer) return

    // Limit the number of active drips
    const maxDrips = 15

    const createDrip = () => {
      // Check if we already have too many drips
      const currentDrips = bloodContainer.querySelectorAll(".drip").length
      if (currentDrips >= maxDrips) return

      const drip = document.createElement("div")
      drip.className = "drip"
      drip.style.left = `${Math.random() * 100}%`
      drip.style.animationDelay = `${Math.random() * 2}s`
      drip.style.width = `${3 + Math.random() * 8}px`
      drip.style.height = `${30 + Math.random() * 100}px`

      bloodContainer.appendChild(drip)

      // Remove drip after animation completes
      setTimeout(() => {
        if (drip.parentNode === bloodContainer) {
          bloodContainer.removeChild(drip)
        }
      }, 10000)
    }

    // Create initial drips
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createDrip(), i * 500)
    }

    // Continue adding drips periodically
    setInterval(createDrip, 3000)
  }

  // Start adding blood drips
  addMoreBloodDrips()

  // Check if device is mobile
  const isMobile = () => {
    return window.innerWidth <= 768
  }

  // Adjust UI elements based on screen size
  const adjustForScreenSize = () => {
    // Responsive adjustments for mobile
    if (isMobile()) {
      // Make buttons more touch-friendly
      const buttons = document.querySelectorAll("button, .game-cell, .close-game")
      buttons.forEach((button) => {
        button.style.padding = button.classList.contains("submit-btn") ? "1rem" : ""
        button.style.fontSize = button.classList.contains("submit-btn") ? "1.1rem" : ""
      })
    }
  }

  // Run on load and resize
  adjustForScreenSize()
  window.addEventListener("resize", adjustForScreenSize)

  // Ensure forms are properly displayed after page load
  setTimeout(() => {
    if (loginForm && !loginForm.classList.contains("hidden")) {
      loginForm.style.opacity = "1"
      loginForm.style.transform = "translateX(0)"
    }
    if (signupForm && !signupForm.classList.contains("hidden")) {
      signupForm.style.opacity = "1"
      signupForm.style.transform = "translateX(0)"
    }
  }, 500)
})

