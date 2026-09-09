/* =========================================================
   MENTAL HEALTH PREDICTOR — SCRIPT.JS
   Vanilla JavaScript only (no frameworks)
   ========================================================= */

// Base URL of the FastAPI backend
const API_BASE_URL = "http://127.0.0.1:8000";
const PREDICT_ENDPOINT = API_BASE_URL + "/predict";

/* ---------------------------------------------------------
   1. MOBILE NAVIGATION TOGGLE
   --------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close the mobile menu whenever a nav link is clicked
document.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");

    // Update the "active" highlight on the clicked link
    document.querySelectorAll(".nav-link").forEach(function (l) {
      l.classList.remove("active");
    });
    link.classList.add("active");
  });
});

/* ---------------------------------------------------------
   2. SMOOTH SCROLL TO PREDICTION FORM (CTA BUTTON)
   --------------------------------------------------------- */
const ctaBtn = document.getElementById("ctaBtn");
const predictSection = document.getElementById("predict");

ctaBtn.addEventListener("click", function () {
  predictSection.scrollIntoView({ behavior: "smooth" });
});

/* ---------------------------------------------------------
   3. FORM ELEMENTS
   --------------------------------------------------------- */
const form = document.getElementById("predictionForm");
const formCard = document.getElementById("formCard");
const resultCard = document.getElementById("resultCard");
const predictBtn = document.getElementById("predictBtn");
const predictBtnText = document.getElementById("predictBtnText");
const predictSpinner = document.getElementById("predictSpinner");
const serverError = document.getElementById("serverError");
const resetBtn = document.getElementById("resetBtn");

// Fields that need numeric range validation.
// Each entry maps the input's id to { min, max, label }.
const numericRules = {
  age: { min: 10, max: 100, label: "Age" },
  avg_Daily_Usage_Hours: { min: 0, max: 24, label: "Average Daily Usage Hours" },
  daily_Unlocks: { min: 0, max: Infinity, label: "Daily Unlocks" },
  study_Hours: { min: 0, max: 24, label: "Study Hours" },
  physical_Activity_Hours: { min: 0, max: 24, label: "Physical Activity Hours" },
  sleep_Hours_Per_Night: { min: 0, max: 24, label: "Sleep Hours Per Night" }
};

// Maps input id -> error <span> id
const errorFieldMap = {
  age: "ageError",
  gender: "genderError",
  country: "countryError",
  academic_Level: "academicLevelError",
  most_Used_Platform: "platformError",
  purpose_Of_Use: "purposeError",
  avg_Daily_Usage_Hours: "usageHoursError",
  daily_Unlocks: "unlocksError",
  study_Hours: "studyHoursError",
  physical_Activity_Hours: "activityError",
  sleep_Hours_Per_Night: "sleepError"
};

/* ---------------------------------------------------------
   4. HELPER FUNCTIONS FOR SHOWING / CLEARING ERRORS
   --------------------------------------------------------- */

// Show an error message under a given field, and mark it invalid.
function showFieldError(fieldId, message) {
  const errorId = errorFieldMap[fieldId];
  const errorEl = document.getElementById(errorId);
  const inputEl = document.getElementById(fieldId);

  if (errorEl) {
    errorEl.textContent = message;
  }
  if (inputEl) {
    inputEl.classList.add("invalid");
  }
}

// Clear the error message and invalid styling for a given field.
function clearFieldError(fieldId) {
  const errorId = errorFieldMap[fieldId];
  const errorEl = document.getElementById(errorId);
  const inputEl = document.getElementById(fieldId);

  if (errorEl) {
    errorEl.textContent = "";
  }
  if (inputEl) {
    inputEl.classList.remove("invalid");
  }
}

// Clear every field error message on the form (used before re-validating).
function clearAllErrors() {
  Object.keys(errorFieldMap).forEach(clearFieldError);
  document.getElementById("stressError").textContent = "";
  serverError.hidden = true;
  serverError.textContent = "";
}

/* ---------------------------------------------------------
   5. VALIDATION LOGIC
   --------------------------------------------------------- */

// Validates the whole form. Returns true if everything is valid,
// otherwise displays error messages and returns false.
function validateForm(formData) {
  let isValid = true;

  // --- Required text/select fields ---
  const requiredSelects = [
    "gender",
    "country",
    "academic_Level",
    "most_Used_Platform",
    "purpose_Of_Use"
  ];

  requiredSelects.forEach(function (fieldId) {
    const value = formData.get(fieldId);
    if (!value) {
      showFieldError(fieldId, "This field is required.");
      isValid = false;
    }
  });

  // --- Numeric fields with min/max rules ---
  Object.keys(numericRules).forEach(function (fieldId) {
    const rawValue = formData.get(fieldId);
    const rule = numericRules[fieldId];

    if (rawValue === null || rawValue === "") {
      showFieldError(fieldId, rule.label + " is required.");
      isValid = false;
      return;
    }

    const numValue = Number(rawValue);

    if (Number.isNaN(numValue)) {
      showFieldError(fieldId, "Please enter a valid number.");
      isValid = false;
      return;
    }

    if (numValue < rule.min || numValue > rule.max) {
      const maxText = rule.max === Infinity ? "" : (" and " + rule.max);
      showFieldError(
        fieldId,
        rule.label + " must be between " + rule.min + maxText + "."
      );
      isValid = false;
      return;
    }

    // daily_Unlocks must be a whole number
    if (fieldId === "daily_Unlocks" && !Number.isInteger(numValue)) {
      showFieldError(fieldId, "Daily Unlocks must be a whole number.");
      isValid = false;
    }
  });

  // --- Stress level (radio group) ---
  const stressValue = formData.get("stress_Level");
  if (!stressValue) {
    document.getElementById("stressError").textContent =
      "Please select a stress level.";
    isValid = false;
  }

  return isValid;
}

/* ---------------------------------------------------------
   6. BUILD THE JSON PAYLOAD FROM FORM DATA
   --------------------------------------------------------- */
function buildPayload(formData) {
  return {
    age: Number(formData.get("age")),
    gender: formData.get("gender"),
    country: formData.get("country"),
    academic_Level: formData.get("academic_Level"),
    most_Used_Platform: formData.get("most_Used_Platform"),
    purpose_Of_Use: formData.get("purpose_Of_Use"),
    avg_Daily_Usage_Hours: Number(formData.get("avg_Daily_Usage_Hours")),
    daily_Unlocks: Number(formData.get("daily_Unlocks")),
    study_Hours: Number(formData.get("study_Hours")),
    physical_Activity_Hours: Number(formData.get("physical_Activity_Hours")),
    sleep_Hours_Per_Night: Number(formData.get("sleep_Hours_Per_Night")),
    stress_Level: formData.get("stress_Level")
  };
}

/* ---------------------------------------------------------
   7. LOADING STATE HELPERS
   --------------------------------------------------------- */
function setLoadingState(isLoading) {
  predictBtn.disabled = isLoading;
  predictSpinner.hidden = !isLoading;
  predictBtnText.textContent = isLoading
    ? "Analyzing..."
    : "Predict Mental Health Score";
}

/* ---------------------------------------------------------
   8. ERROR DISPLAY HELPER (for network / server issues)
   --------------------------------------------------------- */
function showServerError(message) {
  serverError.hidden = false;
  serverError.innerHTML =
    '<i class="fa-solid fa-triangle-exclamation"></i> <span>' + message + "</span>";
}

/* ---------------------------------------------------------
   9. FORM SUBMISSION HANDLER
   --------------------------------------------------------- */
form.addEventListener("submit", function (event) {
  event.preventDefault();

  clearAllErrors();

  const formData = new FormData(form);

  // Stop here if client-side validation fails.
  if (!validateForm(formData)) {
    return;
  }

  const payload = buildPayload(formData);
  sendPrediction(payload);
});

// Sends the prediction request to the FastAPI backend.
async function sendPrediction(payload) {
  setLoadingState(true);

  try {
    const response = await fetch(PREDICT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // The server responded, but with an error status code.
      showServerError(
        "The prediction server returned an error (status " +
          response.status +
          "). Please check your input and try again."
      );
      setLoadingState(false);
      return;
    }

    const data = await response.json();

    // Validate the shape of the response.
    if (
      !data ||
      typeof data.predicted_mental_health_score !== "number" ||
      Number.isNaN(data.predicted_mental_health_score)
    ) {
      showServerError(
        "Invalid prediction response received from the server."
      );
      setLoadingState(false);
      return;
    }

    // Success — show the result card with the animated score.
    displayResult(data.predicted_mental_health_score);
  } catch (error) {
    // fetch() throws when the network request itself fails
    // (server not running, CORS issue, no internet, etc.)
    showServerError(
      "Unable to connect to the prediction server. Please make sure the FastAPI backend is running at http://127.0.0.1:8000."
    );
  } finally {
    setLoadingState(false);
  }
}

/* ---------------------------------------------------------
   10. RESULT DISPLAY + ANIMATED CIRCULAR GAUGE
   --------------------------------------------------------- */
const gaugeValueEl = document.getElementById("gaugeValue");
const gaugeProgressEl = document.getElementById("gaugeProgress");

// Circle circumference for r=85 -> 2 * PI * 85 ≈ 534
const GAUGE_CIRCUMFERENCE = 534;

// Assumes a typical 0-100 scoring range for the visual ring fill.
// The exact numeric value shown to the user is always the raw score.
const GAUGE_MAX_SCALE = 100;

function displayResult(score) {
  // Hide the form, show the result card.
  formCard.hidden = true;
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });

  // Determine how much of the ring should fill (clamped 0-100%).
  const clampedRatio = Math.max(0, Math.min(score / GAUGE_MAX_SCALE, 1));
  const targetOffset = GAUGE_CIRCUMFERENCE * (1 - clampedRatio);

  // Reset ring before animating.
  gaugeProgressEl.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;

  // Trigger the ring fill animation on the next frame.
  requestAnimationFrame(function () {
    gaugeProgressEl.style.strokeDashoffset = targetOffset;
  });

  // Animate the numeric value counting up from 0 to the score.
  animateCountUp(score);
}

// Animates the displayed number from 0 up to `targetValue` over ~1.2s.
function animateCountUp(targetValue) {
  const durationMs = 1200;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const currentValue = targetValue * progress;

    gaugeValueEl.textContent = currentValue.toFixed(2);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      gaugeValueEl.textContent = targetValue.toFixed(2);
    }
  }

  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   11. RESET BUTTON — START A NEW PREDICTION
   --------------------------------------------------------- */
resetBtn.addEventListener("click", function () {
  form.reset();
  clearAllErrors();

  resultCard.hidden = true;
  formCard.hidden = false;

  predictSection.scrollIntoView({ behavior: "smooth" });
});

/* ---------------------------------------------------------
   12. FOOTER — CURRENT YEAR
   --------------------------------------------------------- */
document.getElementById("currentYear").textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   13. LIVE VALIDATION ON BLUR (nice UX touch, not required
        but helps users fix mistakes before submitting)
   --------------------------------------------------------- */
Object.keys(numericRules).forEach(function (fieldId) {
  const inputEl = document.getElementById(fieldId);
  if (!inputEl) return;

  inputEl.addEventListener("blur", function () {
    const rule = numericRules[fieldId];
    const rawValue = inputEl.value;

    if (rawValue === "") {
      return; // Full validation happens on submit; don't nag on empty blur.
    }

    const numValue = Number(rawValue);

    if (!Number.isNaN(numValue) && numValue >= rule.min && numValue <= rule.max) {
      clearFieldError(fieldId);
    }
  });
});
