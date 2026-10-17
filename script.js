// ====================================
// JARVIS AI - NAVBAR JAVASCRIPT
// ====================================

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");
    const launchButtons = document.querySelectorAll(".launch-btn");

    // Initialize Lucide icons when the library is available
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Mobile menu open / close
    function setMenuOpen(isOpen) {
        navMenu.classList.toggle("open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuToggle.innerHTML = isOpen
            ? '<i data-lucide="x"></i>'
            : '<i data-lucide="menu"></i>';

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.contains("open");
        setMenuOpen(!isOpen);
    });

    // Close menu when a navigation link is selected
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            setMenuOpen(false);

            navLinks.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    // Close menu when clicking outside the navbar
    document.addEventListener("click", (event) => {
        if (!navbar.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    // Close menu using the Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });

    // Close mobile menu when returning to desktop layout
    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            setMenuOpen(false);
        }
    });

    // Navbar background effect while scrolling
    function updateNavbar() {
        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();

    // Highlight the section currently visible on screen
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window && sections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;

                        navLinks.forEach((link) => {
                            const isActive =
                                link.getAttribute("href") ===
                                `#${sectionId}`;

                            link.classList.toggle(
                                "active",
                                isActive
                            );
                        });
                    }
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }

    // Launch button: connect this to your assistant later
    launchButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setMenuOpen(false);

            // The current demo scrolls to the assistant section.
            // Add your real AI assistant initialization here.
            const assistant = document.getElementById("assistant");

            if (assistant) {
                assistant.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    console.log("JARVIS AI Navbar initialized successfully.");
});
// ==========================================
// JARVIS AI - HERO SECTION JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const core = document.getElementById("aiCore");
    const initButton = document.getElementById("initializeBtn");
    const statusText = document.getElementById("interfaceStatus");
    const clock = document.getElementById("heroClock");
    const date = document.getElementById("heroDate");
    const canvas = document.getElementById("heroParticles");

    // ----------------------------------------
    // 1. LIVE CLOCK AND DATE
    // ----------------------------------------

    function updateClock() {
        const now = new Date();

        if (clock) {
            clock.textContent = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            });
        }

        if (date) {
            date.textContent = now.toLocaleDateString([], {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }).toUpperCase();
        }
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ----------------------------------------
    // 2. INITIALIZE BUTTON
    // ----------------------------------------

    if (initButton && core && statusText) {
        initButton.addEventListener("click", () => {
            const initialized = core.classList.toggle("initialized");

            statusText.textContent = initialized
                ? "INITIALIZED"
                : "STANDBY";

            const buttonText = initButton.querySelector("span");

            if (buttonText) {
                buttonText.textContent = initialized
                    ? "JARVIS Initialized"
                    : "Initialize JARVIS";
            }

            initButton.setAttribute(
                "aria-pressed",
                String(initialized)
            );
        });
    }

    // ----------------------------------------
    // 3. HOLOGRAPHIC PARTICLE BACKGROUND
    // ----------------------------------------

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let particles = [];
    let animationId = null;
    let width = 0;
    let height = 0;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = rect.width;
        height = rect.height;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(
            90,
            Math.floor((width * height) / 11000)
        );

        particles = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.4,
            speed: Math.random() * 0.35 + 0.08,
            opacity: Math.random() * 0.55 + 0.15,
            drift: (Math.random() - 0.5) * 0.25
        }));

        drawParticles();
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle) => {
            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(70, 223, 255, ${particle.opacity})`;

            ctx.fill();

            if (!reducedMotion.matches) {
                particle.y -= particle.speed;
                particle.x += particle.drift;

                if (particle.y < -5) {
                    particle.y = height + 5;
                    particle.x = Math.random() * width;
                }

                if (particle.x < 0) {
                    particle.x = width;
                } else if (particle.x > width) {
                    particle.x = 0;
                }
            }
        });
    }

    function animateParticles() {
        drawParticles();

        if (!reducedMotion.matches) {
            animationId = requestAnimationFrame(
                animateParticles
            );
        }
    }

    function startParticles() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        if (reducedMotion.matches) {
            drawParticles();
        } else {
            animationId = requestAnimationFrame(
                animateParticles
            );
        }
    }

    resizeCanvas();
    startParticles();

    // Resize canvas when the browser dimensions change.
    window.addEventListener("resize", () => {
        resizeCanvas();
        startParticles();
    });

    // Respect operating-system motion preferences.
    reducedMotion.addEventListener("change", startParticles);

    // Redraw when returning to the page.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            startParticles();
        }
    });

    // Initialize Lucide icons if the library is available.
    if (window.lucide) {
        window.lucide.createIcons();
    }

    console.log("JARVIS hero interface loaded.");
});
// ==============================================
// JARVIS AI - VOICE ASSISTANT JAVASCRIPT
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".voice-assistant");

    if (!section) return;

    const micButton = document.getElementById("voiceMicButton");
    const micIcon = document.getElementById("voiceMicIcon");
    const reactor = document.getElementById("voiceReactor");

    const stateText = document.getElementById("voiceState");
    const instruction = document.getElementById("voiceInstruction");
    const coreLabel = document.getElementById("voiceCoreLabel");

    const interfaceStatus = document.getElementById("voiceInterfaceStatus");
    const inputStatus = document.getElementById("voiceInputStatus");
    const outputStatus = document.getElementById("voiceOutputStatus");
    const footerStatus = document.getElementById("voiceFooterStatus");
    const supportNote = document.getElementById("voiceSupportNote");

    const transcript = document.getElementById("voiceTranscript");
    const textForm = document.getElementById("voiceTextForm");
    const textInput = document.getElementById("voiceTextInput");
    const stopButton = document.getElementById("voiceStopButton");

    // Browser voice recognition support
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    let recognition = null;
    let listening = false;
    let speaking = false;
    let manuallyStopped = false;
    let shouldSpeak = true;
    let finalTranscript = "";
    let recognitionGeneration = 0;

    // ------------------------------------------
    // TRANSCRIPT
    // ------------------------------------------

    function addMessage(role, message) {
        const placeholder = transcript.querySelector(
            ".transcript-placeholder"
        );

        if (placeholder) {
            placeholder.remove();
        }

        const item = document.createElement("div");
        item.className =
            "transcript-message " +
            (role === "YOU" ? "user-message" : "assistant-message");

        const label = document.createElement("span");
        label.className = "transcript-role";
        label.textContent = role;

        const paragraph = document.createElement("p");
        paragraph.textContent = message;

        item.append(label, paragraph);
        transcript.appendChild(item);

        // Keep the latest message visible.
        transcript.scrollTop = transcript.scrollHeight;
    }

    // ------------------------------------------
    // STATUS MANAGEMENT
    // ------------------------------------------

    function setStatus(mode, message, detail) {
        stateText.textContent = message;
        coreLabel.textContent = detail;

        section.classList.toggle("is-listening", mode === "listening");
        section.classList.toggle("is-speaking", mode === "speaking");

        if (mode === "listening") {
            interfaceStatus.textContent = "LISTENING";
            inputStatus.textContent = "MIC ACTIVE";
            footerStatus.textContent = "LISTENING FOR SPEECH";
            instruction.textContent =
                "Speak clearly. Select the microphone again to stop.";
        } else if (mode === "speaking") {
            interfaceStatus.textContent = "RESPONDING";
            inputStatus.textContent = "READY";
            footerStatus.textContent = "VOICE RESPONSE ACTIVE";
            instruction.textContent = "JARVIS is speaking.";
        } else if (mode === "processing") {
            interfaceStatus.textContent = "PROCESSING";
            inputStatus.textContent = "PROCESSING";
            footerStatus.textContent = "PROCESSING COMMAND";
            instruction.textContent = "Analyzing your command...";
        } else {
            interfaceStatus.textContent = "STANDBY";
            inputStatus.textContent = "READY";
            footerStatus.textContent = "SYSTEM READY";
            instruction.textContent =
                "Press the microphone and start speaking.";
        }

        if (micButton) {
            const label = micButton.querySelector("span");

            if (label) {
                label.textContent =
                    mode === "listening"
                        ? "Stop Listening"
                        : "Activate Microphone";
            }

            micButton.setAttribute(
                "aria-pressed",
                String(mode === "listening")
            );
        }

        if (micIcon) {
            micIcon.setAttribute(
                "data-lucide",
                mode === "listening" ? "mic-off" : "mic"
            );
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // ------------------------------------------
    // TEXT-TO-SPEECH
    // ------------------------------------------

    function stopSpeaking() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        speaking = false;
        section.classList.remove("is-speaking");
        outputStatus.textContent = "READY";
    }

    function speak(message) {
        if (!shouldSpeak || !("speechSynthesis" in window)) {
            setStatus("idle", "Response ready.", "VOICE CORE STANDBY");
            return;
        }

        stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "en-US";
        utterance.rate = 1;
        utterance.pitch = 0.95;
        utterance.volume = 1;

        speaking = true;
        outputStatus.textContent = "SPEAKING";

        setStatus("speaking", "JARVIS is speaking...", "VOICE OUTPUT ACTIVE");

        utterance.onend = () => {
            speaking = false;
            outputStatus.textContent = "READY";
            setStatus("idle", "Response complete.", "VOICE CORE STANDBY");
        };

        utterance.onerror = () => {
            speaking = false;
            outputStatus.textContent = "READY";
            setStatus("idle", "Response ready.", "VOICE CORE STANDBY");
        };

        window.speechSynthesis.speak(utterance);
    }

    // ------------------------------------------
    // LOCAL COMMAND HANDLER
    // ------------------------------------------

    function getResponse(message) {
        const text = message.toLowerCase().trim();

        if (
            /\b(hello|hi|hey)\b/.test(text)
        ) {
            return "Hello! I am JARVIS, your personal voice assistant. How can I help you?";
        }

        if (
            text.includes("your name") ||
            text.includes("who are you")
        ) {
            return "I am JARVIS, your browser-based voice assistant interface.";
        }

        if (
            text.includes("what time") ||
            text === "time" ||
            text.includes("current time")
        ) {
            return "The current time is " +
                new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit"
                });
        }

        if (
            text.includes("today's date") ||
            text.includes("what date") ||
            text.includes("what day") ||
            text === "date"
        ) {
            return "Today is " +
                new Date().toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
        }

        if (
            text.includes("tell me a joke") ||
            text.includes("make me laugh")
        ) {
            return "Why did the computer go to the doctor? Because it had a virus!";
        }

        if (
            text.includes("what can you do") ||
            text.includes("your capabilities") ||
            text.includes("help me")
        ) {
            return "I can respond to a few built-in commands, tell you the time and date, tell a joke, and demonstrate voice interaction. Connect an AI backend to enable open-ended conversations.";
        }

        if (
            text.includes("stop speaking") ||
            text.includes("be quiet") ||
            text === "stop"
        ) {
            shouldSpeak = false;
            stopSpeaking();
            setStatus("idle", "Speech stopped.", "VOICE CORE STANDBY");
            return null;
        }

        if (
            text.includes("go to home") ||
            text.includes("open home")
        ) {
            document.getElementById("home")?.scrollIntoView({
                behavior: "smooth"
            });

            return "Taking you to the home section.";
        }

        if (
            text.includes("open assistant") ||
            text.includes("voice assistant")
        ) {
            document.getElementById("assistant")?.scrollIntoView({
                behavior: "smooth"
            });

            return "You are already in the voice assistant section.";
        }

        return "I heard you say: " + message +
            ". I can answer a few built-in commands right now. Connect a language model API through a secure backend for more intelligent answers.";
    }

    // ------------------------------------------
    // PROCESS USER INPUT
    // ------------------------------------------

    function processMessage(message) {
        const cleaned = message.trim();

        if (!cleaned) return;

        shouldSpeak = true;
        stopSpeaking();

        addMessage("YOU", cleaned);
        setStatus("processing", "Processing command...", "ANALYZING INPUT");

        const response = getResponse(cleaned);

        if (response) {
            addMessage("JARVIS", response);
            speak(response);
        }
    }

    // ------------------------------------------
    // SPEECH RECOGNITION
    // ------------------------------------------

    function stopListening() {
        manuallyStopped = true;
        listening = false;

        if (recognition) {
            try {
                recognition.stop();
            } catch (error) {
                // Recognition may already have stopped.
            }
        }

        setStatus("idle", "Microphone stopped.", "VOICE CORE STANDBY");
    }

    function startListening() {
        if (!SpeechRecognition) {
            supportNote.textContent =
                "Speech recognition is not supported in this browser. Use the text input below or try a supported browser.";

            setStatus("idle", "Voice input unavailable.", "TEXT INPUT AVAILABLE");
            textInput.focus();
            return;
        }

        if (listening) {
            stopListening();
            return;
        }

        stopSpeaking();

        recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        finalTranscript = "";
        manuallyStopped = false;
        listening = true;

        const currentGeneration = ++recognitionGeneration;

        recognition.onstart = () => {
            if (currentGeneration !== recognitionGeneration) return;

            setStatus("listening", "Listening to your voice...", "VOICE INPUT ACTIVE");
            supportNote.textContent =
                "Microphone active. Speak a command in English.";
        };

        recognition.onresult = (event) => {
            if (currentGeneration !== recognitionGeneration) return;

            let interimTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += text + " ";
                } else {
                    interimTranscript += text;
                }
            }

            const liveText = (
                finalTranscript + interimTranscript
            ).trim();

            stateText.textContent = liveText
                ? "Heard: " + liveText
                : "Listening to your voice...";
        };

        recognition.onerror = (event) => {
            if (currentGeneration !== recognitionGeneration) return;

            listening = false;

            if (event.error === "not-allowed" ||
                event.error === "service-not-allowed") {
                supportNote.textContent =
                    "Microphone permission was denied. Allow microphone access in your browser settings.";
            } else if (event.error === "no-speech") {
                supportNote.textContent =
                    "No speech detected. Press the microphone and try again.";
            } else if (event.error === "network") {
                supportNote.textContent =
                    "Speech recognition encountered a network error. Try again or use text input.";
            } else {
                supportNote.textContent =
                    "Voice recognition stopped. You can use text input instead.";
            }

            setStatus("idle", "Voice input stopped.", "VOICE CORE STANDBY");
        };

        recognition.onend = () => {
            if (currentGeneration !== recognitionGeneration) return;

            listening = false;

            const message = finalTranscript.trim();

            if (!manuallyStopped && message) {
                processMessage(message);
            } else if (!speaking) {
                setStatus("idle", "Ready when you are.", "VOICE CORE STANDBY");
            }
        };

        try {
            recognition.start();
        } catch (error) {
            listening = false;
            setStatus("idle", "Unable to start microphone.", "VOICE CORE STANDBY");
            supportNote.textContent =
                "Try again after checking your browser microphone permissions.";
        }
    }

    // ------------------------------------------
    // BUTTON EVENTS
    // ------------------------------------------

    micButton.addEventListener("click", () => {
        startListening();
    });

    textForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const message = textInput.value.trim();

        if (!message) return;

        if (listening) {
            stopListening();
        }

        textInput.value = "";
        processMessage(message);
    });

    document.querySelectorAll(".voice-command").forEach((button) => {
        button.addEventListener("click", () => {
            processMessage(button.dataset.command || "");
        });
    });

    stopButton.addEventListener("click", () => {
        shouldSpeak = false;
        stopSpeaking();

        setStatus("idle", "Speech stopped.", "VOICE CORE STANDBY");
    });

    // ------------------------------------------
    // INITIALIZE INTERFACE
    // ------------------------------------------

    if (!("speechSynthesis" in window)) {
        outputStatus.textContent = "UNAVAILABLE";
    }

    if (!SpeechRecognition) {
        supportNote.textContent =
            "Your browser does not support voice recognition. Text commands are available below.";
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }

    setStatus("idle", "Ready when you are.", "VOICE CORE STANDBY");

    console.log("JARVIS Voice Assistant initialized.");
});
// ===============================
// JARVIS AI CHAT - JAVASCRIPT
// Local demo version
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector(".app");
  const chatArea = document.getElementById("chatArea");
  const welcome = document.getElementById("welcome");
  const messages = document.getElementById("messages");
  const chatForm = document.getElementById("chatForm");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const charCount = document.getElementById("charCount");
  const newChatBtn = document.getElementById("newChatBtn");
  const clearBtn = document.getElementById("clearBtn");
  const focusBtn = document.getElementById("focusBtn");
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const toast = document.getElementById("toast");

  let isReplying = false;
  let toastTimer;

  // -------------------------------
  // Notifications
  // -------------------------------

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // -------------------------------
  // Time formatting
  // -------------------------------

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // -------------------------------
  // Create message safely
  // -------------------------------

  function addMessage(role, text) {
    const message = document.createElement("div");
    message.className = `message ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = role === "user" ? "U" : "J";

    const content = document.createElement("div");
    content.className = "message-content";

    const meta = document.createElement("div");
    meta.className = "message-meta";

    const name = document.createElement("span");
    name.textContent = role === "user" ? "You" : "JARVIS AI";

    const time = document.createElement("time");
    time.textContent = getCurrentTime();

    meta.append(name, time);

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    // textContent prevents user messages from being treated as HTML.
    bubble.textContent = text;

    content.append(meta, bubble);
    message.append(avatar, content);
    messages.appendChild(message);

    welcome.classList.add("hidden");
    chatArea.scrollTop = chatArea.scrollHeight;

    return message;
  }

  // -------------------------------
  // Typing animation
  // -------------------------------

  function showTyping() {
    const message = document.createElement("div");
    message.className = "message";
    message.id = "typingMessage";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "J";

    const content = document.createElement("div");
    content.className = "message-content";

    const meta = document.createElement("div");
    meta.className = "message-meta";
    meta.textContent = "JARVIS AI";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    const dots = document.createElement("div");
    dots.className = "typing-dots";
    dots.setAttribute("aria-label", "JARVIS is typing");

    for (let i = 0; i < 3; i++) {
      dots.appendChild(document.createElement("span"));
    }

    bubble.appendChild(dots);
    content.append(meta, bubble);
    message.append(avatar, content);
    messages.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function removeTyping() {
    document.getElementById("typingMessage")?.remove();
  }

  // -------------------------------
  // Local demo responses
  // -------------------------------

  function getAIResponse(input) {
    const text = input.toLowerCase().trim();

    if (/^(hi|hello|hey|hai)\b/.test(text)) {
      return "Hello! I am JARVIS, your personal AI interface. What would you like to explore today?";
    }

    if (text.includes("your name") || text.includes("who are you")) {
      return "I am JARVIS AI, a demo assistant interface built with HTML, CSS, and JavaScript. Connect an AI backend to enable real AI conversations.";
    }

    if (text.includes("time")) {
      return "The current time is " + new Date().toLocaleTimeString() + ".";
    }

    if (text.includes("date") || text.includes("today")) {
      return "Today's date is " + new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }) + ".";
    }

    if (
      text.includes("artificial intelligence") ||
      text === "explain ai" ||
      text.includes("what is ai")
    ) {
      return "Artificial intelligence (AI) is technology that allows computers to perform tasks such as understanding language, recognizing patterns, and generating content. Modern AI assistants can answer questions and help with coding when connected to an appropriate AI model.";
    }

    if (
      text.includes("html") ||
      text.includes("javascript") ||
      text.includes("css") ||
      text.includes("coding") ||
      text.includes("write code")
    ) {
      return "Here is a simple HTML example:\n\n<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello, JARVIS!</h1>\n  <button onclick=\"alert('Hello!')\">Click Me</button>\n</body>\n</html>\n\nSave this as index.html and open it in your browser. This is a local demo response, not an answer generated by a real AI model.";
    }

    if (
      text.includes("project idea") ||
      text.includes("website idea") ||
      text.includes("creative idea")
    ) {
      return "Here are five project ideas:\n\n1. Personal AI assistant dashboard\n2. Smart study planner\n3. Digital queue management system\n4. Emergency SOS web application\n5. Interactive online shopping website\n\nStart with one small feature, build it, and then expand it.";
    }

    if (
      text.includes("joke") ||
      text.includes("make me laugh")
    ) {
      return "Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 😄";
    }

    if (
      text.includes("help") ||
      text.includes("what can you do") ||
      text.includes("capabilities")
    ) {
      return "In this demo, I can respond to a few built-in topics, show the time and date, and demonstrate the chat interface. For real question answering, coding help, and contextual conversations, connect this interface to an AI API through a backend server.";
    }

    if (
      text.includes("thank you") ||
      text.includes("thanks")
    ) {
      return "You're welcome! I'm ready for your next question.";
    }

    return "I received your message: \"" + input + "\"\n\nThis JARVIS interface is currently running in demo mode, so it cannot generate a real AI answer to every question. Connect a secure backend and an AI model to enable intelligent responses.";
  }

  // -------------------------------
  // Send message
  // -------------------------------

  async function sendMessage(text) {
    const message = text.trim();

    if (!message || isReplying) return;

    isReplying = true;
    updateComposer();

    addMessage("user", message);
    messageInput.value = "";
    resizeTextarea();
    updateComposer();

    showTyping();

    // Simulate processing time for the demo.
    await new Promise(resolve => setTimeout(resolve, 800));

    removeTyping();

    const reply = getAIResponse(message);
    addMessage("assistant", reply);

    isReplying = false;
    updateComposer();
    messageInput.focus();
  }

  // -------------------------------
  // Input controls
  // -------------------------------

  function updateComposer() {
    const length = messageInput.value.length;

    charCount.textContent = `${length} / 4000`;
    sendBtn.disabled = length === 0 || isReplying;
  }

  function resizeTextarea() {
    messageInput.style.height = "auto";
    messageInput.style.height =
      Math.min(messageInput.scrollHeight, 150) + "px";
  }

  messageInput.addEventListener("input", () => {
    updateComposer();
    resizeTextarea();
  });

  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(messageInput.value);
  });

  messageInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!sendBtn.disabled) {
        chatForm.requestSubmit();
      }
    }
  });

  // -------------------------------
  // Quick prompts
  // -------------------------------

  document.querySelectorAll("[data-prompt]").forEach(button => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.prompt;

      if (!prompt) return;

      sidebar.classList.remove("open");
      messageInput.value = prompt;
      updateComposer();
      resizeTextarea();
      messageInput.focus();
    });
  });

  // -------------------------------
  // New conversation / clear chat
  // -------------------------------

  function clearConversation() {
    if (isReplying) {
      showToast("Please wait for the current reply to finish.");
      return;
    }

    messages.replaceChildren();
    welcome.classList.remove("hidden");

    messageInput.value = "";
    updateComposer();
    resizeTextarea();

    sidebar.classList.remove("open");
    messageInput.focus();

    showToast("New conversation started.");
  }

  newChatBtn.addEventListener("click", clearConversation);
  clearBtn.addEventListener("click", clearConversation);

  // -------------------------------
  // Focus mode
  // -------------------------------

  focusBtn.addEventListener("click", () => {
    app.classList.toggle("focus-mode");

    const enabled = app.classList.contains("focus-mode");

    focusBtn.classList.toggle("active", enabled);
    focusBtn.innerHTML = enabled
      ? "<span>✧</span> Exit focus mode"
      : "<span>✧</span> Focus mode";

    sidebar.classList.remove("open");

    showToast(enabled ? "Focus mode enabled." : "Focus mode disabled.");
  });

  // -------------------------------
  // Mobile sidebar
  // -------------------------------

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.addEventListener("click", event => {
    if (
      window.innerWidth <= 850 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      sidebar.classList.remove("open");
    }
  });

  // -------------------------------
  // Initialize
  // -------------------------------

  updateComposer();
  messageInput.focus();
});
// =====================================
// JARVIS SMART DASHBOARD - JAVASCRIPT
// Append to your existing script.js
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  const dashboard = document.getElementById("dashboard");

  // Allows this script to coexist with other pages.
  if (!dashboard) return;

  const $ = id => document.getElementById(id);

  const timeEl = $("dashTime");
  const dateEl = $("dashDate");
  const refreshBtn = $("dashRefresh");
  const activityValue = $("activityValue");
  const activityProgress = $("activityProgress");
  const completedValue = $("completedValue");
  const responseValue = $("responseValue");
  const chartCurrentValue = $("chartCurrentValue");

  const chartSvg = $("dashChartSvg");
  const chartGrid = $("dashChartGrid");
  const chartArea = $("dashChartArea");
  const chartLine = $("dashChartLine");
  const chartPoints = $("dashChartPoints");
  const chartLabels = $("dashChartLabels");
  const chartRange = $("dashChartRange");

  const activityList = $("dashActivityList");
  const clearActivityBtn = $("dashClearActivity");

  const taskForm = $("dashTaskForm");
  const taskInput = $("dashTaskInput");
  const taskList = $("dashTaskList");
  const taskCount = $("dashTaskCount");
  const emptyTasks = $("dashEmptyTasks");

  let activity = 86.4;
  let responseSpeed = 124;
  let taskId = 0;
  const tasks = [];

  // -------------------------------
  // CLOCK AND DATE
  // -------------------------------

  function updateClock() {
    const now = new Date();

    timeEl.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    dateEl.textContent = now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  // -------------------------------
  // CHART GENERATION
  // -------------------------------

  function createChart() {
    const count = Number(chartRange.value) || 7;

    const values = Array.from({ length: count }, () =>
      Math.round(35 + Math.random() * 60)
    );

    // Make the final chart point match the current demo activity.
    values[values.length - 1] = Math.round(activity);

    const width = 600;
    const height = 200;
    const left = 10;
    const right = 10;
    const top = 12;
    const bottom = 15;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const points = values.map((value, index) => ({
      x: left + (index / (count - 1 || 1)) * plotWidth,
      y: top + ((100 - value) / 100) * plotHeight,
      value
    }));

    // Horizontal chart grid lines.
    chartGrid.replaceChildren();

    [0, 25, 50, 75, 100].forEach(level => {
      const y = top + ((100 - level) / 100) * plotHeight;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg", "line"
      );

      line.setAttribute("x1", left);
      line.setAttribute("x2", width - right);
      line.setAttribute("y1", y);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "#26364B");
      line.setAttribute("stroke-width", "1");

      chartGrid.appendChild(line);
    });

    const linePath = points.map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    ).join(" ");

    const areaPath =
      linePath +
      ` L ${points[points.length - 1].x} ${height - bottom}` +
      ` L ${points[0].x} ${height - bottom} Z`;

    chartLine.setAttribute("d", linePath);
    chartArea.setAttribute("d", areaPath);

    // Draw points.
    chartPoints.replaceChildren();

    points.forEach((point, index) => {
      if (index !== points.length - 1 && count > 7) return;

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg", "circle"
      );

      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
      circle.setAttribute("r", index === points.length - 1 ? "4.5" : "3");
      circle.setAttribute("fill", "#55e7ff");
      circle.setAttribute("stroke", "#0e1726");
      circle.setAttribute("stroke-width", "2");

      chartPoints.appendChild(circle);
    });

    // Label each point with a simple sequence number.
    chartLabels.replaceChildren();

    points.forEach((point, index) => {
      const label = document.createElement("span");
      label.textContent = `P${index + 1}`;
      chartLabels.appendChild(label);
    });

    chartCurrentValue.textContent = `${activity.toFixed(1)}%`;
    chartSvg.setAttribute(
      "aria-label",
      `Illustrative activity chart. Latest value ${activity.toFixed(1)} percent.`
    );
  }

  // -------------------------------
  // ACTIVITY LOG
  // -------------------------------

  function addActivity(title, description) {
    const item = document.createElement("div");
    item.className = "dash-activity-item";

    const icon = document.createElement("span");
    icon.className = "dash-activity-icon activity-cyan";
    icon.textContent = "⌘";

    const content = document.createElement("div");
    const heading = document.createElement("strong");
    const detail = document.createElement("p");
    const time = document.createElement("small");

    heading.textContent = title;
    detail.textContent = description;
    time.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    content.append(heading, detail, time);
    item.append(icon, content);

    activityList.prepend(item);

    // Keep the activity feed compact.
    while (activityList.children.length > 8) {
      activityList.lastElementChild.remove();
    }
  }

  clearActivityBtn.addEventListener("click", () => {
    activityList.replaceChildren();
    addActivity("Activity log cleared", "New events will appear here.");
  });

  // -------------------------------
  // REFRESH DEMO METRICS
  // -------------------------------

  function refreshMetrics() {
    activity = Number((60 + Math.random() * 39).toFixed(1));
    responseSpeed = Math.floor(80 + Math.random() * 121);

    activityValue.textContent = activity.toFixed(1);
    activityProgress.style.width = `${activity}%`;
    responseValue.textContent = responseSpeed;

    createChart();

    addActivity(
      "Dashboard refreshed",
      "Illustrative metrics updated."
    );
  }

  refreshBtn.addEventListener("click", () => {
    refreshMetrics();
  });

  chartRange.addEventListener("change", createChart);

  // -------------------------------
  // TASK MANAGER
  // -------------------------------

  function renderTasks() {
    taskList.replaceChildren();

    const completed = tasks.filter(task => task.completed).length;

    taskCount.textContent =
      `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;

    // Show the starting demo count plus completed tasks.
    completedValue.textContent = 12 + completed;

    emptyTasks.classList.toggle("hidden", tasks.length > 0);

    tasks.forEach(task => {
      const item = document.createElement("div");
      item.className = "dash-task-item";

      if (task.completed) {
        item.classList.add("completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", `Complete ${task.text}`);

      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        renderTasks();

        addActivity(
          task.completed ? "Task completed" : "Task reopened",
          task.text
        );
      });

      const text = document.createElement("span");
      text.className = "dash-task-text";
      text.textContent = task.text;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "dash-task-delete";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", `Delete ${task.text}`);

      removeBtn.addEventListener("click", () => {
        const index = tasks.findIndex(item => item.id === task.id);

        if (index !== -1) {
          tasks.splice(index, 1);
        }

        renderTasks();
        addActivity("Task deleted", task.text);
      });

      item.append(checkbox, text, removeBtn);
      taskList.appendChild(item);
    });
  }

  taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
      taskInput.focus();
      return;
    }

    if (tasks.length >= 50) {
      addActivity("Task limit reached", "Delete a task before adding more.");
      return;
    }

    tasks.push({
      id: ++taskId,
      text,
      completed: false
    });

    taskInput.value = "";
    renderTasks();

    addActivity("New task added", text);
    taskInput.focus();
  });

  // -------------------------------
  // QUICK ACTIONS
  // -------------------------------

  dashboard.querySelectorAll("[data-dash-action]").forEach(button => {
    button.addEventListener("click", () => {
      const action = button.dataset.dashAction;

      if (action === "refresh") {
        refreshMetrics();
        return;
      }

      if (action === "report") {
        const completed = tasks.filter(task => task.completed).length;
        const pending = tasks.length - completed;

        const report = [
          "JARVIS SMART DASHBOARD REPORT",
          "Generated: " + new Date().toLocaleString(),
          "",
          `Demo activity: ${activity.toFixed(1)}%`,
          `Demo response speed: ${responseSpeed} ms`,
          `Tasks completed: ${completed}`,
          `Tasks pending: ${pending}`,
          "",
          "Note: Performance metrics are simulated."
        ].join("\n");

        // Download a plain-text demo report.
        const blob = new Blob([report], {
          type: "text/plain;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "jarvis-dashboard-report.txt";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        addActivity("Report generated", "Demo report downloaded.");
        return;
      }

      if (action === "assistant") {
        const assistant = document.getElementById("assistant");

        if (assistant) {
          assistant.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          addActivity("AI Assistant opened", "Navigated to assistant section.");
        } else {
          addActivity(
            "AI Assistant unavailable",
            "Add a section with id=\"assistant\" to enable navigation."
          );
        }
      }
    });
  });

  // -------------------------------
  // INITIALIZE DASHBOARD
  // -------------------------------

  renderTasks();
  createChart();
});
// ======================================
// JARVIS FEATURES & CAPABILITIES
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".jarvis-features");

  if (!section) return;

  const cards = section.querySelectorAll(".feature-card");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // -------------------------------
  // SCROLL REVEAL ANIMATIONS
  // -------------------------------

  if ("IntersectionObserver" in window && !reducedMotion) {
    cards.forEach(card => {
      card.style.animation = "none";
      card.style.opacity = "0";
      card.style.transform = "translateY(18px)";
      card.style.transition =
        "opacity 0.5s ease, transform 0.5s ease";
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const card = entry.target;

          card.style.opacity = "1";
          card.style.transform = "translateY(0)";

          observer.unobserve(card);
        });
      },
      {
        threshold: 0.12
      }
    );

    cards.forEach(card => observer.observe(card));
  }

  // -------------------------------
  // SMOOTH INTERNAL NAVIGATION
  // -------------------------------

  section.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      // Show information for the privacy feature.
      if (targetId === "#security") {
        event.preventDefault();

        alert(
          "JARVIS Privacy Awareness\n\n" +
          "This feature introduces secure design principles, " +
          "permission handling, and safe API-key management.\n\n" +
          "This website section does not perform a security scan."
        );

        return;
      }

      const target = document.querySelector(targetId);

      // Allow normal browser navigation if the target is missing.
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // -------------------------------
  // CARD HOVER ACCESSIBILITY
  // -------------------------------

  cards.forEach(card => {
    card.addEventListener("pointerenter", () => {
      card.classList.add("feature-hovered");
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("feature-hovered");
    });
  });

  // -------------------------------
  // INITIALIZE
  // -------------------------------

  section.classList.add("features-initialized");

  console.log("JARVIS Features section initialized.");
});
/* =========================================================
   JARVIS SECURITY + CTA + FOOTER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     FOOTER YEAR
  ----------------------------------------- */

  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  /* -----------------------------------------
     SMOOTH SCROLL
  ----------------------------------------- */

  const smoothLinks = document.querySelectorAll(
    '.jarvis-security a[href^="#"], .jarvis-final-cta a[href^="#"], .jarvis-footer a[href^="#"]'
  );

  smoothLinks.forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

    });

  });


  /* -----------------------------------------
     SECURITY CARD REVEAL
  ----------------------------------------- */

  const securityCards =
    document.querySelectorAll(".security-card");

  if ("IntersectionObserver" in window) {

    const securityObserver =
      new IntersectionObserver((entries, observer) => {

        entries.forEach((entry, index) => {

          if (!entry.isIntersecting) {
            return;
          }

          const card = entry.target;

          card.style.opacity = "0";
          card.style.transform = "translateY(25px)";

          setTimeout(() => {

            card.style.transition =
              "opacity 0.6s ease, transform 0.6s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

          }, index * 100);

          observer.unobserve(card);

        });

      }, {
        threshold: 0.12
      });

    securityCards.forEach(card => {
      securityObserver.observe(card);
    });

  }


  /* -----------------------------------------
     ACTIVATE JARVIS BUTTON
  ----------------------------------------- */

  const activateButton =
    document.getElementById("activateJarvisBtn");

  if (activateButton) {

    activateButton.addEventListener("click", () => {

      activateButton.disabled = true;

      const originalHTML = activateButton.innerHTML;

      activateButton.innerHTML =
        '<span class="cta-button-icon">◉</span> INITIALIZING...';

      activateButton.style.opacity = "0.75";

      setTimeout(() => {

        activateButton.disabled = false;
        activateButton.innerHTML = originalHTML;
        activateButton.style.opacity = "1";

        const assistant =
          document.querySelector("#assistant");

        if (assistant) {

          assistant.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          /*
             If your existing Voice Assistant section has
             an initialization button, try to trigger it.
          */

          const possibleButtons = [
            "#initializeBtn",
            "#initBtn",
            "#startAssistant",
            "#startJarvis"
          ];

          for (const selector of possibleButtons) {

            const button =
              document.querySelector(selector);

            if (button) {
              button.click();
              break;
            }

          }

        } else {

          alert(
            "JARVIS AI CORE\n\n" +
            "System ready.\n" +
            "Assistant interface is waiting for activation."
          );

        }

      }, 900);

    });

  }


  /* -----------------------------------------
     SECURITY STATUS INTERACTION
  ----------------------------------------- */

  const securityPanel =
    document.querySelector(".security-status-panel");

  if (securityPanel) {

    securityPanel.addEventListener("click", () => {

      const statusText =
        securityPanel.querySelector(".status-right span:last-child");

      if (!statusText) {
        return;
      }

      const currentStatus =
        statusText.textContent.trim();

      if (currentStatus === "SECURE MODE") {

        statusText.textContent = "SECURITY VERIFIED";

        setTimeout(() => {
          statusText.textContent = "SECURE MODE";
        }, 1800);

      }

    });

  }


  /* -----------------------------------------
     BACK TO TOP
  ----------------------------------------- */

  const backToTop =
    document.querySelector('.footer-bottom-links a[href="#home"]');

  if (backToTop) {

    backToTop.addEventListener("click", event => {

      const home =
        document.querySelector("#home");

      if (!home) {
        return;
      }

      event.preventDefault();

      home.scrollIntoView({
        behavior:
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        block: "start"
      });

    });

  }


  console.log(
    "%cJARVIS Security + CTA + Footer initialized.",
    "color:#00f5ff;font-weight:bold;"
  );

});
