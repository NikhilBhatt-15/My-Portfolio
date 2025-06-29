"use strict";

// Visitor Tracking System
const VisitorTracker = {
  sessionId: null,
  startTime: Date.now(),

  init() {
    this.sessionId = this.generateSessionId();
    this.logVisitorInfo();
    this.trackPageViews();
    this.trackProjectClicks();
    this.trackTimeSpent();
    this.trackFormSubmissions();
  },

  generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  },

  logVisitorInfo() {
    const visitorData = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer || "Direct",
      url: window.location.href,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    };

    console.log("🔍 Portfolio Visitor:", visitorData);

    // Send to analytics service (optional)
    this.sendToAnalytics("visitor_arrival", visitorData);
  },

  trackPageViews() {
    const navigationLinks = document.querySelectorAll("[data-nav-link]");
    navigationLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const pageData = {
          sessionId: this.sessionId,
          action: "page_view",
          page: link.textContent.toLowerCase(),
          timestamp: new Date().toISOString(),
          timeOnPreviousPage: Date.now() - this.startTime,
        };

        console.log("📄 Page View:", pageData);
        this.sendToAnalytics("page_view", pageData);
        this.startTime = Date.now(); // Reset timer for new page
      });
    });
  },

  trackProjectClicks() {
    const projectButtons = document.querySelectorAll(".project-btn");
    projectButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const projectCard = button.closest(".project-item");
        const projectTitle =
          projectCard.querySelector(".project-title")?.textContent;
        const buttonType = button.textContent.includes("Demo")
          ? "live_demo"
          : "view_code";

        const clickData = {
          sessionId: this.sessionId,
          action: "project_interaction",
          projectName: projectTitle,
          buttonType: buttonType,
          url: button.href,
          timestamp: new Date().toISOString(),
        };

        console.log("🚀 Project Click:", clickData);
        this.sendToAnalytics("project_click", clickData);
      });
    });
  },

  trackTimeSpent() {
    // Track time when user is about to leave
    window.addEventListener("beforeunload", () => {
      const timeData = {
        sessionId: this.sessionId,
        action: "session_end",
        totalTimeSpent: Date.now() - this.startTime,
        timestamp: new Date().toISOString(),
      };

      console.log("⏱️ Session End:", timeData);
      this.sendToAnalytics("session_end", timeData);
    });

    // Track visibility changes (tab switching)
    document.addEventListener("visibilitychange", () => {
      const visibilityData = {
        sessionId: this.sessionId,
        action: document.hidden ? "tab_hidden" : "tab_visible",
        timestamp: new Date().toISOString(),
      };

      console.log("👁️ Visibility Change:", visibilityData);
      this.sendToAnalytics("visibility_change", visibilityData);
    });
  },

  trackFormSubmissions() {
    const form = document.querySelector("[data-form]");
    if (form) {
      form.addEventListener("submit", () => {
        const formData = {
          sessionId: this.sessionId,
          action: "contact_form_submit",
          timestamp: new Date().toISOString(),
        };

        console.log("📧 Form Submission:", formData);
        this.sendToAnalytics("form_submit", formData);
      });
    }
  },

  sendToAnalytics(eventType, data) {
    // Option 1: Send to Google Analytics (if you set it up)
    if (typeof gtag !== "undefined") {
      gtag("event", eventType, {
        custom_parameter: JSON.stringify(data),
      });
    }

    // Option 2: Send to your own API endpoint
    /*
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: eventType,
        data: data
      })
    }).catch(err => console.log('Analytics error:', err));
    */

    // Option 3: Store in localStorage for later review
    const storedData = JSON.parse(
      localStorage.getItem("portfolioAnalytics") || "[]"
    );
    storedData.push({ type: eventType, data: data });

    // Keep only last 100 events
    if (storedData.length > 100) {
      storedData.splice(0, storedData.length - 100);
    }

    localStorage.setItem("portfolioAnalytics", JSON.stringify(storedData));
  },
};

// Initialize visitor tracking when page loads
document.addEventListener("DOMContentLoaded", () => {
  VisitorTracker.init();
});

// Add method to view analytics data in console
window.viewAnalytics = () => {
  const data = JSON.parse(localStorage.getItem("portfolioAnalytics") || "[]");
  console.table(data);
  return data;
};

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(form);

  emailjs.sendForm("service_zoo8rdp", "template_3g32rhp", form).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
      alert("Message sent successfully!");
      form.reset();
    },
    function (error) {
      console.log("FAILED...", error);
      alert("Failed to send message. Please try again.");
    }
  );
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    // Remove active class from all nav links and pages
    for (let j = 0; j < navigationLinks.length; j++) {
      navigationLinks[j].classList.remove("active");
      pages[j].classList.remove("active");
    }

    // Add active class to the clicked nav link and corresponding page
    this.classList.add("active");
    const pageName = this.innerHTML.toLowerCase();
    document.querySelector(`[data-page="${pageName}"]`).classList.add("active");

    // Scroll to top
    window.scrollTo(0, 0);
  });
}
