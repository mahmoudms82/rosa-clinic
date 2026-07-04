// js/main.js
document.addEventListener("DOMContentLoaded", function () {
  // ====================== GIFT FIELDS TOGGLE ======================
  const isGiftCheckbox = document.getElementById("is_gift");
  const giftFieldsDiv = document.getElementById("gift_fields");
  const giftInputs = giftFieldsDiv.querySelectorAll("input");

  isGiftCheckbox.addEventListener("change", function () {
    if (this.checked) {
      giftFieldsDiv.classList.remove("hidden");
      giftInputs.forEach((input) => (input.required = true));
    } else {
      giftFieldsDiv.classList.add("hidden");
      giftInputs.forEach((input) => {
        input.required = false;
        input.value = "";
      });
    }
  });

  // ====================== PRICE CALCULATION ======================
  const offerSelect = document.querySelector('select[name="offer"]');
  const branchSelect = document.querySelector('select[name="branch"]');
  const nationalitySelect = document.querySelector('select[name="nationality"]');
  const couponInput = document.getElementById("copon");
  const applyCouponBtn = document.getElementById("apply_coupon");
  const couponMessage = document.getElementById("coupon_message");
  const priceDisplay = document.getElementById("price");

  let basePrice = 0;
  let discount = 0;

  const offerPrices = {
    "ديرما بن + إبرة نضارة وتوريد شفاه": 500,
    "إبرة ديفا للوجه + تنظيف وتلميع أسنان + 5 جلسات شد اللغلوغ + توريد شفاه": 1500,
    "فراكشنال + سكارليت + بلازما": 1000,
    "تقشير وجه كامل + إبرة سالمون": 995,
    "فيلر ستيلاج (1 مللي)": 800,
    "فيلر ستيلاج (3 مللي)": 1950,
    "بوتوكس الجبهة": 650,
    "بوتوكس كامل الوجه": 900,
    "زراعة أسنان أمريكية + التركيبة + الكشفية": 1700,
    "تقويم الأسنان (دفعة أولى)": 800,
    "ابتسامة هوليوود (قسط أول)": 1500,
    "تبييض وتلميع الأسنان بالليزر": 400,
    "3 جلسات ليزر لمنطقة واحدة": 250,
    "3 جلسات ليزر جسم كامل للسيدات": 750,
    "3 جلسات ليزر جسم كامل للرجال": 850,
    "5 زيارات لتكسير الدهون الموضعية بدون جراحة": 850
  };

  offerSelect.addEventListener("change", function () {
    const selectedOffer = this.value;
    basePrice = offerPrices[selectedOffer] || 0;
    updatePrice();
  });

  branchSelect.addEventListener("change", updatePrice);
  nationalitySelect.addEventListener("change", updatePrice);

  couponInput.addEventListener("input", function () {
    discount = 0;
    couponMessage.innerHTML = "";
    updatePrice();
  });

  applyCouponBtn.addEventListener("click", function () {
    const code = couponInput.value.trim().toUpperCase();

    if (code === "W30") {
      discount = 0.20;
      couponMessage.innerHTML = `<span class="text-green-600">✅ تم تطبيق خصم 20% بنجاح!</span>`;
    } else {
      discount = 0;
      couponMessage.innerHTML = `<span class="text-red-500">❌ كود الخصم غير صحيح</span>`;
    }
    updatePrice();
  });

  function updatePrice() {
    if (basePrice === 0 || !branchSelect.value || !nationalitySelect.value) {
      priceDisplay.innerText = "يرجى اختيار العرض والفرع والجنسية";
      return;
    }

    // Apply coupon discount
    let finalPrice = basePrice * (1 - discount);

    // Apply 15% tax for non-Saudi citizens
    if (nationalitySelect.value === "none_saudi") {
      finalPrice = finalPrice * 1.15;
    }

    finalPrice = Math.round(finalPrice);
    priceDisplay.innerText = `${finalPrice} ريال سعودي`;
  }

  // ====================== FORM SUBMISSION TO GOOGLE SHEETS ======================
  const form = document.getElementById("appointmentForm");
  const submitBtn = form.querySelector('button[type="submit"]');
  const successMsg = document.getElementById("successMessage");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Button loading state
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "جاري التسجيل...";
    submitBtn.disabled = true;

    const formData = new FormData(form);

    // Extra fields handling using set instead of append to prevent duplicate keys
    formData.set("is_gift", isGiftCheckbox.checked ? "نعم" : "لا");
    formData.set(
      "sender_name",
      form.sender_name ? form.sender_name.value || "لا يوجد" : "لا يوجد",
    );
    formData.set(
      "sender_phone",
      form.sender_phone ? form.sender_phone.value || "لا يوجد" : "لا يوجد",
    );
    formData.set("copon", couponInput.value.trim() || "لم يتم استخدام كود");

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxE6CNZHrhDM4PPvyTefSC8IDH1zVlPnXr-0U0jMYIPySA1BNhnx2YTU51OrLlsQ_aL/exec";

    fetch(scriptURL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        // Success
        successMsg.classList.remove("hidden");
        form.reset();
        giftFieldsDiv.classList.add("hidden");
        couponMessage.innerHTML = "";
        priceDisplay.innerText = "يرجى اختيار العرض والفرع والجنسية";
        basePrice = 0;
        discount = 0;

        // Scroll to success message smoothly
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          successMsg.classList.add("hidden");
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
        }, 6000);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.");
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      });
  });
});
