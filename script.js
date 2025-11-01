document.addEventListener("DOMContentLoaded", () => {
  // --- 1. GET ALL THE NECESSARY HTML ELEMENTS ---

  const uploadPage = document.getElementById("upload-page");
  const scanningPage = document.getElementById("scanning-page");
  const resultsPage = document.getElementById("results-page");

  const imageUploadInput = document.getElementById("image-upload");
  const resetButton = document.getElementById("reset-button");

  const scanningImage = document.getElementById("scanning-image");
  const resultsImage = document.getElementById("results-image");

  const confidenceScoreEl = document.getElementById("confidence-score");
  const artifactListEl = document.getElementById("artifact-list");

  // NEW: Get the log output element
  const logOutputEl = document.getElementById("log-data-output");

  // --- 2. DEFINE APP STATE AND HELPER FUNCTIONS ---

  let userImageUrl = null;
  const FAKE_SCAN_TIME = 3500; // 3.5 seconds

  const FAKE_ARTIFACTS_POOL = [
    "Unnatural chromatic aberration in shadow tones.",
    "Residual latent-space noise patterns.",
    "Evidence of non-human emotional simulation.",
    "Synthetic shadow penumbra mismatch.",
    "Algorithmic composition bias detected.",
    "Pixel-level generative-adversarial remnants.",
    "Anomalous texture repetition.",
    "Implausible physics in light refraction.",
    "Non-Euclidean geometry in background elements.",
    "Tell-tale diffusion markers.",
    "Excessive symmetry in organic patterns.",
    "Spectral leakage from a StyleGAN v3.B model.",
  ];

  // NEW: Define the log lines as an array
  const LOG_LINES = [
    "[00:00.01] INITIATING AI DETECTOR v4.B",
    "[00:00.02] KERNEL: LENS_FORENSIC_CORE",
    "[00:00.03] LOADING IMAGE METADATA...",
    "[00:00.04]   > FILESIZE: 4.2MB",
    "[00:00.05]   > DIMENSIONS: 1024x1024",
    "[00:00.06]   > EXIF DATA: [NULL]",
    "[00:00.07] INITIATING PROCESSORS...",
    "[00:01.03] STARTING SCAN: PASS 1/3",
    "[00:01.04] ANALYZING CHROMATIC ABERRATION...",
    "[00:01.58] CHECKING FOR LATENT-SPACE NOISE...",
    "[00:02.01] ...NOISE PATTERNS DETECTED.",
    "[00:02.02] STARTING SCAN: PASS 2/3",
    "[00:02.55] EVALUATING EMOTIONAL SIMULATION...",
    "[00:03.01] ...NON-HUMAN SIMULATION CONFIRMED.",
    "[00:03.02] STARTING SCAN: PASS 3/3",
    "[00:03.48] CROSS-REFERENCING MODEL SIGNATURES...",
    "[00:03.49] COMPILING FINAL REPORT...",
  ];

  /**
   * A helper function to switch between pages.
   */
  function showPage(pageId) {
    uploadPage.classList.remove("active");
    scanningPage.classList.remove("active");
    resultsPage.classList.remove("active");

    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
      pageToShow.classList.add("active");
    }
  }

  /**
   * Generates a random number between 97.3523 and 99.9998
   */
  function getRandomConfidence() {
    const min = 97.3523;
    const max = 99.9998;
    const randomScore = Math.random() * (max - min) + min;
    return randomScore.toFixed(6);
  }

  /**
   * Selects 3 unique, random artifacts from the pool.
   */
  function getRandomArtifacts(count) {
    const shuffled = [...FAKE_ARTIFACTS_POOL];
    let m = shuffled.length,
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = shuffled[m];
      shuffled[m] = shuffled[i];
      shuffled[i] = t;
    }
    return shuffled.slice(0, count);
  }

  // NEW: Function to animate the log text
  /**
   * Animates the fake log text line by line.
   */
  function startLogAnimation() {
    logOutputEl.innerHTML = ""; // Clear the log

    // Calculate delay per line to fit within the scan time
    const totalLogTime = FAKE_SCAN_TIME - 500; // Finish 500ms before scan
    const perLineDelay = totalLogTime / LOG_LINES.length;

    LOG_LINES.forEach((line, index) => {
      setTimeout(() => {
        logOutputEl.innerHTML += line + "\n"; // Add the new line
        // Auto-scroll the pre block to the bottom
        logOutputEl.scrollTop = logOutputEl.scrollHeight;
      }, index * perLineDelay);
    });
  }

  /**
   * Generates the random data and populates the results page.
   */
  function showResults() {
    const newScore = getRandomConfidence();
    const newArtifacts = getRandomArtifacts(3);

    confidenceScoreEl.textContent = newScore;
    artifactListEl.innerHTML = "";

    newArtifacts.forEach((artifact) => {
      const li = document.createElement("li");
      li.textContent = artifact;
      artifactListEl.appendChild(li);
    });

    showPage("results-page");
  }

  /**
   * Resets the entire application to its initial state.
   */
  function resetApp() {
    imageUploadInput.value = null;

    if (userImageUrl) {
      URL.revokeObjectURL(userImageUrl);
      userImageUrl = null;
    }

    scanningImage.src = "";
    resultsImage.src = "";

    confidenceScoreEl.textContent = "";
    artifactListEl.innerHTML = "";

    // UPDATED: Clear the log text on reset
    logOutputEl.innerHTML = "";

    showPage("upload-page");
  }

  // --- 3. SET UP EVENT LISTENERS ---

  imageUploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      userImageUrl = URL.createObjectURL(file);
      scanningImage.src = userImageUrl;
      resultsImage.src = userImageUrl;

      showPage("scanning-page");

      // UPDATED: Start the log animation
      startLogAnimation();

      // This timeout remains the same
      setTimeout(showResults, FAKE_SCAN_TIME);
    }
  });

  resetButton.addEventListener("click", resetApp);

  // --- 4. INITIALIZE THE APP ---
  showPage("upload-page");
});
