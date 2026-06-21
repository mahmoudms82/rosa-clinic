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
  const couponInput = document.getElementById("copon");
  const applyCouponBtn = document.getElementById("apply_coupon");
  const couponMessage = document.getElementById("coupon_message");
  const priceDisplay = document.getElementById("price");

  let basePrice = 0;
  let discount = 0;

  offerSelect.addEventListener("change", function () {
    const selectedOffer = this.value;

    if (selectedOffer === "ابتسامة هوليوود") {
      basePrice = 2500;
    } else if (selectedOffer === "تبييض وفلورايد") {
      basePrice = 600;
    } else if (selectedOffer === "زراعة وتقويم") {
      basePrice = 4000;
    } else {
      basePrice = 0;
    }

    updatePrice();
  });

  applyCouponBtn.addEventListener("click", function () {
    const code = couponInput.value.trim().toUpperCase();

    if (code === "S15") {
      discount = 0.15;
      couponMessage.innerHTML = `<span class="text-green-600">✅ تم تطبيق خصم 15% بنجاح!</span>`;
    } else {
      discount = 0;
      couponMessage.innerHTML = `<span class="text-red-500">❌ كود الخصم غير صحيح</span>`;
    }
    updatePrice();
  });

  function updatePrice() {
    if (basePrice === 0) {
      priceDisplay.innerText = "يرجى اختيار العرض والفرع";
      return;
    }

    const finalPrice = Math.round(basePrice * (1 - discount));
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

    // Extra fields handling
    formData.append("is_gift", isGiftCheckbox.checked ? "نعم" : "لا");
    formData.append(
      "sender_name",
      form.sender_name ? form.sender_name.value || "لا يوجد" : "لا يوجد",
    );
    formData.append(
      "sender_phone",
      form.sender_phone ? form.sender_phone.value || "لا يوجد" : "لا يوجد",
    );
    formData.append("copon", couponInput.value.trim() || "لم يتم استخدام كود");

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
        priceDisplay.innerText = "يرجى اختيار العرض والفرع";

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
