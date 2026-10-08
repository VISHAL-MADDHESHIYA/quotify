/* =========================================
   QUOTIFY — RANDOM QUOTE GENERATOR
   JavaScript Logic
========================================= */

"use strict";

/* =========================================
   1. QUOTES DATA
========================================= */

const quotes = [
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "In the middle of every difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The journey of a thousand miles begins with a single step.",
        author: "Lao Tzu"
    },
    {
        text: "Whether you think you can or you think you can't, you're right.",
        author: "Henry Ford"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "Everything you've ever wanted is on the other side of fear.",
        author: "George Addair"
    },
    {
        text: "Happiness is not something ready made. It comes from your own actions.",
        author: "Dalai Lama"
    }
];


/* =========================================
   2. DOM ELEMENTS
========================================= */

const quoteCard     = document.getElementById("quoteCard");
const quoteText     = document.getElementById("quoteText");
const quoteAuthor   = document.getElementById("quoteAuthor");
const quoteNumber   = document.getElementById("quoteNumber");
const newQuoteBtn   = document.getElementById("newQuoteBtn");
const copyBtn       = document.getElementById("copyBtn");
const shareBtn      = document.getElementById("shareBtn");
const actionStatus  = document.getElementById("actionStatus");
const totalQuotesEl = document.getElementById("totalQuotes");


/* =========================================
   3. STATE
========================================= */

let currentIndex = 0;
let statusTimeout = null;


/* =========================================
   4. HELPERS
========================================= */

/**
 * Format a number with leading zero (1 -> "01")
 */
function padNumber(num) {
    return String(num).padStart(2, "0");
}

/**
 * Update the "/ 10" total label in the quote number badge.
 */
function updateTotalCounter() {
    const totalLabel = document.querySelector(".number-label");
    if (totalLabel) {
        totalLabel.textContent = `/ ${quotes.length}`;
    }
}

/**
 * Update the stat card that shows total quotes.
 */
function updateTotalStat() {
    if (totalQuotesEl) {
        totalQuotesEl.textContent = `${quotes.length}+`;
    }
}

/**
 * Show a temporary status message below the action buttons.
 */
function showStatus(message, isError = false) {
    clearTimeout(statusTimeout);

    actionStatus.textContent = message;
    actionStatus.style.color = isError ? "#f87171" : "#34d399";
    actionStatus.classList.add("show");

    statusTimeout = setTimeout(() => {
        actionStatus.classList.remove("show");
    }, 2200);
}

/**
 * Pick a random index that is different from the current one.
 */
function getRandomIndex() {
    if (quotes.length <= 1) return 0;

    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentIndex);

    return newIndex;
}


/* =========================================
   5. RENDER QUOTE
========================================= */

function renderQuote(index, animate = true) {
    const quote = quotes[index];

    if (animate) {
        quoteCard.classList.remove("change");
        // Force reflow so animation can restart
        void quoteCard.offsetWidth;
        quoteCard.classList.add("change");
    }

    quoteText.textContent   = quote.text;
    quoteAuthor.textContent = `— ${quote.author}`;
    quoteNumber.textContent = padNumber(index + 1);

    currentIndex = index;
}

/**
 * Load a brand new random quote.
 */
function loadNewQuote() {
    const nextIndex = getRandomIndex();
    renderQuote(nextIndex, true);
}


/* =========================================
   6. COPY TO CLIPBOARD
========================================= */

async function copyQuote() {
    const text = `"${quotes[currentIndex].text}" — ${quotes[currentIndex].author}`;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers / non-secure contexts
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity  = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        showStatus("Quote copied to clipboard!");
    } catch (err) {
        console.error("Copy failed:", err);
        showStatus("Failed to copy quote.", true);
    }
}


/* =========================================
   7. SHARE QUOTE
========================================= */

async function shareQuote() {
    const quote = quotes[currentIndex];
    const shareData = {
        title: "Quotify — Daily Inspiration",
        text:  `"${quote.text}" — ${quote.author}`,
        url:   window.location.href
    };

    // Native share (mobile / supported browsers)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            showStatus("Quote shared!");
        } catch (err) {
            // User cancelled → do nothing
            if (err.name !== "AbortError") {
                console.error("Share failed:", err);
                showStatus("Failed to share quote.", true);
            }
        }
        return;
    }

    // Fallback → copy to clipboard
    try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        showStatus("Sharing not supported — quote copied instead!");
    } catch (err) {
        console.error("Share fallback failed:", err);
        showStatus("Sharing not supported on this browser.", true);
    }
}


/* =========================================
   8. EVENT LISTENERS
========================================= */

newQuoteBtn.addEventListener("click", loadNewQuote);
copyBtn.addEventListener("click", copyQuote);
shareBtn.addEventListener("click", shareQuote);

// Bonus: Space / Right arrow to get a new quote
document.addEventListener("keydown", (e) => {
    if (
        e.code === "Space" &&
        document.activeElement.tagName !== "BUTTON"
    ) {
        e.preventDefault();
        loadNewQuote();
    }
});


/* =========================================
   9. INIT
========================================= */

function init() {
    updateTotalCounter();
    updateTotalStat();

    // Start with a random quote (not always index 0)
    const startIndex = Math.floor(Math.random() * quotes.length);
    renderQuote(startIndex, false);
}

document.addEventListener("DOMContentLoaded", init);