/**
 * AtlasBasket Analytics - GitHub Pages Script
 * Ελληνική έκδοση - Διαχείριση συνδέσμων, mockup tabs & FAQ
 */

const CONFIG = {
  githubUser: "boxlab-dev", 
  githubRepo: "atlasbasket_analytics", 
  defaultVersion: "v1.0.1",
  defaultApkName: "atlasbasket-v1.0.1-github.apk",
  contactEmail: "support@boxlab.gr",
  
  // Συνδέσεις προεπιλογής
  get releasesPageUrl() {
    return `https://github.com/${this.githubUser}/${this.githubRepo}/releases`;
  },
  get latestDownloadUrl() {
    return `https://github.com/${this.githubUser}/${this.githubRepo}/releases/latest/download/${this.defaultApkName}`;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initDownloadLinks();
  initMobileMenu();
  initMockupTabs();
  initFaqAccordion();
  checkLatestReleaseFromGithub();
});

/**
 * Ρύθμιση των συνδέσμων λήψης σε όλα τα κουμπιά
 */
function initDownloadLinks() {
  const downloadBtns = document.querySelectorAll(".btn-download-apk");
  const releasesBtns = document.querySelectorAll(".btn-view-releases");
  const versionBadges = document.querySelectorAll(".badge-version-text");

  downloadBtns.forEach(btn => {
    btn.setAttribute("href", CONFIG.latestDownloadUrl);
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
  });

  releasesBtns.forEach(btn => {
    btn.setAttribute("href", CONFIG.releasesPageUrl);
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
  });

  versionBadges.forEach(b => {
    b.textContent = CONFIG.defaultVersion;
  });
}

/**
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.contains("hidden");
    if (isHidden) {
      mobileMenu.classList.remove("hidden");
    } else {
      mobileMenu.classList.add("hidden");
    }
  });

  // Κλείσιμο μενού μόλις πατηθεί σύνδεσμος
  const navLinks = mobileMenu.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

/**
 * Διαδραστική εναλλαγή οθονών στο κινητό (Mockup)
 */
function initMockupTabs() {
  const tabButtons = document.querySelectorAll(".mockup-tab-btn");
  const screens = {
    home: document.getElementById("screenHome"),
    boxscore: document.getElementById("screenBoxscore"),
    radar: document.getElementById("screenRadar"),
    scouting: document.getElementById("screenScouting")
  };

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetScreen = btn.getAttribute("data-screen");

      // Ενημέρωση ενεργού κουμπιού
      tabButtons.forEach(b => {
        b.classList.remove("bg-orange-500", "text-white", "font-bold");
        b.classList.add("bg-gray-800/80", "text-gray-400");
      });
      btn.classList.add("bg-orange-500", "text-white", "font-bold");
      btn.classList.remove("bg-gray-800/80", "text-gray-400");

      // Εμφάνιση της κατάλληλης οθόνης στο κινητό
      Object.keys(screens).forEach(key => {
        if (screens[key]) {
          if (key === targetScreen) {
            screens[key].classList.remove("hidden");
          } else {
            screens[key].classList.add("hidden");
          }
        }
      });
    });
  });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const header = item.querySelector(".faq-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Κλείσιμο όλων των υπόλοιπων
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
        }
      });

      // Toggle του τρέχοντος
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });
}

/**
 * Αυτόματος έλεγχος τελευταίας έκδοσης μέσω GitHub API
 */
async function checkLatestReleaseFromGithub() {
  // Αν είναι ακόμα το προεπιλεγμένο dummy username, δεν κάνουμε κλήση API
  if (CONFIG.githubUser === "YOUR_GITHUB_USERNAME") return;

  try {
    const apiUrl = `https://api.github.com/repos/${CONFIG.githubUser}/${CONFIG.githubRepo}/releases/latest`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) return;

    const data = await response.json();
    if (data.tag_name) {
      const versionText = data.tag_name.startsWith("v") ? data.tag_name : `v${data.tag_name}`;
      
      // Ενημέρωση κειμένου έκδοσης
      document.querySelectorAll(".badge-version-text").forEach(el => {
        el.textContent = versionText;
      });

      // Εύρεση του APK asset
      const apkAsset = data.assets?.find(a => a.name.toLowerCase().endsWith(".apk"));
      if (apkAsset && apkAsset.browser_download_url) {
        document.querySelectorAll(".btn-download-apk").forEach(btn => {
          btn.setAttribute("href", apkAsset.browser_download_url);
        });

        // Ενημέρωση μεγέθους αρχείου αν υπάρχει
        if (apkAsset.size) {
          const mbSize = (apkAsset.size / (1024 * 1024)).toFixed(1);
          document.querySelectorAll(".apk-size-text").forEach(el => {
            el.textContent = `~${mbSize} MB`;
          });
        }
      }
    }
  } catch (err) {
    // Σιωπηρή αποτυχία και διατήρηση των fallback links
    console.log("GitHub API release check skipped/unavailable:", err);
  }
}

