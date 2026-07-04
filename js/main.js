document.addEventListener("DOMContentLoaded", () => {
  // Navigation elements
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuIcon = menuToggle ? menuToggle.querySelector("i") : null;

  // 1. Mobile navigation toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      if (menuIcon) {
        menuIcon.className = navMenu.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
      }
    });
  }

  // 2. Mobile dropdown accordion toggle
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => {
    const toggleBtn = dropdown.querySelector(".dropdown-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          dropdowns.forEach((other) => {
            if (other !== dropdown) other.classList.remove("open");
          });
          dropdown.classList.toggle("open");
        }
      });
    }
  });

  // 3. Search Box Toggle
  const searchTrigger = document.getElementById("searchTrigger");
  const searchForm = document.getElementById("searchForm");
  if (searchTrigger && searchForm) {
    searchTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      searchForm.classList.toggle("show");
    });
    document.addEventListener("click", (e) => {
      if (!searchForm.contains(e.target) && e.target !== searchTrigger) {
        searchForm.classList.remove("show");
      }
    });
  }

  // 4. Hero Slider/Banner slideshow logic (alternates slides every 5 seconds)
  const slides = document.querySelectorAll(".hero-slider .slide");
  if (slides.length > 1) {
    let currentSlide = 0;
    
    function nextSlide() {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }

    // Set interval for auto transition
    let slideInterval = setInterval(nextSlide, 5000);

    // Arrow controls
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        clearInterval(slideInterval);
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
        slideInterval = setInterval(nextSlide, 5000);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        clearInterval(slideInterval);
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
        slideInterval = setInterval(nextSlide, 5000);
      });
    }
  }
});
