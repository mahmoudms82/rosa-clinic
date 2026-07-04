document.addEventListener("DOMContentLoaded", () => {
  // أزرار وعناصر القائمة للموبايل
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuIcon = menuToggle.querySelector("i");

  // 1. فتح وإغلاق قائمة الموبايل الرئيسية
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    // تغيير شكل الأيقونة من تبرجر لـ X
    if (navMenu.classList.contains("active")) {
      menuIcon.className = "fas fa-times";
    } else {
      menuIcon.className = "fas fa-bars";
    }
  });

  // 2. تفعيل فتح الـ Dropdowns عن طريق الضغط (حالة شاشات الموبايل)
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const toggleBtn = dropdown.querySelector(".dropdown-toggle");

    toggleBtn.addEventListener("click", (e) => {
      // نمنع الانتقال للرابط فقط لو الشاشة موبايل عشان يفتح القائمة الفرعية
      if (window.innerWidth <= 991) {
        e.preventDefault();

        // غلق أي قائمة تانية مفتوحة
        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove("open");
          }
        });

        // فتح أو غلق القائمة الحالية
        dropdown.classList.toggle("open");
      }
    });
  });

  // 3. فتح وإغلاق صندوق البحث الصغير (Search Form Toggle)
  const searchTrigger = document.getElementById("searchTrigger");
  const searchForm = document.getElementById("searchForm");

  searchTrigger.addEventListener("click", (e) => {
    e.stopPropagation(); // منع غلق الفورم فوراً بسبب الـ click event
    searchForm.classList.toggle("show");
  });

  // غلق صندوق البحث لو المستخدم ضغط في أي مكان برة الـ Header
  document.addEventListener("click", (e) => {
    if (!searchForm.contains(e.target) && e.target !== searchTrigger) {
      searchForm.classList.remove("show");
    }
  });
});
