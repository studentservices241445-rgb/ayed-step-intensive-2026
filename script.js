// JavaScript for the intensive STEP 2026 website

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  // Hide menu when clicking any link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// Seat counters for pricing section and hero
let seats = 50;
function updateSeats() {
  const seatEls = document.querySelectorAll('#seatCount, #seatCount2');
  seatEls.forEach(el => {
    if (el) el.textContent = seats;
  });
}
updateSeats();
// Decrease seats periodically (simulate demand)
setInterval(() => {
  if (seats > 15) {
    const decrement = Math.random() < 0.4 ? 1 : 0;
    seats -= decrement;
    updateSeats();
  }
}, 45000);

// Toast notifications
function toastMsg(message) {
  const toastContainer = document.getElementById('toast');
  const card = document.createElement('div');
  card.className = 'toast-card flex items-start gap-3';
  card.innerHTML = `
    <div class="pulse-dot mt-1"></div>
    <div class="flex-1">
      <div class="font-bold text-sm">${message}</div>
    </div>
    <button class="ml-auto text-muted hover:text-gold">✕</button>
  `;
  toastContainer.appendChild(card);
  // Show
  requestAnimationFrame(() => card.classList.add('show'));
  // Remove
  const remove = () => {
    card.classList.remove('show');
    setTimeout(() => card.remove(), 300);
  };
  card.querySelector('button').addEventListener('click', remove);
  setTimeout(remove, 5000);
}

// Copy buttons
document.querySelectorAll('.copyBtn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(value);
      toastMsg('تم نسخ المعلومات بنجاح');
    } catch (err) {
      toastMsg('حدث خطأ أثناء النسخ');
    }
  });
});

// Show/hide previous score field
const prevAttempt = document.getElementById('prevAttempt');
const prevScoreWrap = document.getElementById('prevScoreWrap');
if (prevAttempt && prevScoreWrap) {
  prevAttempt.addEventListener('change', () => {
    if (prevAttempt.value === 'yes') {
      prevScoreWrap.classList.remove('hidden');
    } else {
      prevScoreWrap.classList.add('hidden');
    }
  });
}

// Form submission for enrollment
const enrollForm = document.getElementById('enrollForm');
const resultContainer = document.getElementById('resultContainer');
const readyMsg = document.getElementById('readyMsg');
const copyMsg = document.getElementById('copyMsg');
const openTg = document.getElementById('openTg');
if (enrollForm) {
  enrollForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const contactMethod = document.getElementById('contactMethod').value;
    const contactValue = document.getElementById('contactValue').value.trim();
    const examDate = document.getElementById('examDate').value;
    const targetScore = document.getElementById('targetScore').value.trim();
    const prev = document.getElementById('prevAttempt').value;
    const prevScore = document.getElementById('prevScore').value.trim();
    const reason = document.getElementById('reason').value;
    const notes = document.getElementById('notes').value.trim();
    const receipt = document.getElementById('receipt').files[0];
    const agree = document.getElementById('agreeTerms').checked;
    if (!receipt) {
      toastMsg('يجب إرفاق إيصال الدفع');
      return;
    }
    if (!agree) {
      toastMsg('يجب الموافقة على السياسات والشروط');
      return;
    }
    // Generate message
    const methodLabel = contactMethod === 'telegram' ? 'تيليجرام' : contactMethod === 'whatsapp' ? 'واتساب' : 'إيميل';
    const lines = [];
    lines.push('السلام عليكم ورحمة الله وبركاته');
    lines.push('أرغب في تأكيد اشتراكي في الدورة المكثفة STEP 2026');
    lines.push('—');
    lines.push(`الاسم: ${fullName}`);
    lines.push(`وسيلة التواصل: ${methodLabel} ${contactValue || '(غير محدد)'}`);
    lines.push(`موعد الاختبار: ${examDate || '(غير محدد)'}`);
    if (targetScore) lines.push(`الدرجة المستهدفة: ${targetScore}`);
    lines.push(`هل اختبرت سابقاً؟ ${prev === 'yes' ? 'نعم' : 'لا'}`);
    if (prev === 'yes' && prevScore) lines.push(`الدرجة السابقة: ${prevScore}`);
    lines.push(`سبب التسجيل: ${reason}`);
    if (notes) lines.push(`ملاحظات: ${notes}`);
    lines.push('—');
    lines.push('تم رفع الإيصال عبر الموقع ✅');
    lines.push('وسأرفقه هنا أيضاً للتأكيد.');
    lines.push('—');
    lines.push('رسوم الاشتراك: 299 ريال');
    lines.push('مدة الوصول للمحتوى: 90 يوم');
    lines.push('شكراً لكم');
    const message = lines.join('\n');
    readyMsg.value = message;
    // Set Telegram link (update username accordingly)
    const username = 'Ayed_Academy_2026';
    openTg.href = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
    resultContainer.style.display = 'block';
    toastMsg('تم تجهيز الرسالة، انسخها وأرسلها للحساب الرسمي');
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  });
}
// Copy prepared message
if (copyMsg) {
  copyMsg.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(readyMsg.value);
      toastMsg('تم نسخ الرسالة إلى الحافظة');
    } catch (err) {
      toastMsg('حدث خطأ أثناء النسخ');
    }
  });
}

// Level test submission
const levelForm = document.getElementById('levelTestForm');
const levelResult = document.getElementById('levelResult');
const recommendation = document.getElementById('recommendation');
if (levelForm) {
  levelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;
    if (document.getElementById('q1').value === '2') score++;
    if (document.getElementById('q2').value === '1') score++;
    if (document.getElementById('q3').value === '1') score++;
    if (document.getElementById('q4').value === '3') score++;
    // Evaluate recommendation
    let rec;
    if (score >= 3) {
      rec = 'نوصيك بمسار 7 أيام أو 15 يوم للحصول على نتيجة سريعة.';
    } else if (score === 2) {
      rec = 'نوصيك بمسار 14 يوماً للتدرج في الدراسة.';
    } else {
      rec = 'نوصيك بمسار 30 يوماً لتغطية جميع المهارات بعمق.';
    }
    recommendation.textContent = rec;
    levelResult.classList.remove('hidden');
    levelResult.scrollIntoView({ behavior: 'smooth' });
  });
}

// Referral program logic
const refForm = document.getElementById('referralForm');
const refResult = document.getElementById('refResult');
const refMsg = document.getElementById('refMsg');
const copyRefMsg = document.getElementById('copyRefMsg');
const bankInfo = document.getElementById('bankInfo');
if (refForm) {
  // Show/hide bank info based on payout
  document.getElementById('refPayout').addEventListener('change', (e) => {
    if (e.target.value === 'bank') {
      bankInfo.classList.remove('hidden');
    } else {
      bankInfo.classList.add('hidden');
    }
  });
  refForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('refName').value.trim() || 'صديقي';
    const platform = document.getElementById('refPlatform').value;
    const desc = document.getElementById('refDesc').value.trim();
    const payout = document.getElementById('refPayout').value;
    const bank = document.getElementById('refBank').value.trim();
    const agree = document.getElementById('refAgree').checked;
    if (!agree) {
      toastMsg('يجب الموافقة على شروط برنامج الإحالة');
      return;
    }
    let payoutTxt = payout === 'stars' ? 'ستحصل على نجوم تيليجرام عن كل إحالة ناجحة' : `ستحصل على تحويل بنكي (${bank || 'لم يتم تحديد الحساب'}) عند وصول أرباحك إلى 100 دولار`;
    const link = window.location.origin + window.location.pathname;
    const msg = `مرحباً ${name},\n\nأشارك معك رابط الدورة المكثفة STEP 2026 من أكاديمية عايد. الدورة تقدم خطة منظمة، محاضرات مسجلة وتدريبات مكثفة لضمان نجاحك في الاختبار.\n\n${desc ? 'الفئة المستهدفة: ' + desc + '\n\n' : ''}يمكنك التسجيل عبر الرابط التالي:\n${link}\n\n${payoutTxt}.\n\nشكراً لك!`;
    refMsg.value = msg;
    refResult.classList.remove('hidden');
    refResult.scrollIntoView({ behavior: 'smooth' });
    toastMsg('تم إنشاء رسالة المشاركة');
  });
  copyRefMsg.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(refMsg.value);
      toastMsg('تم نسخ رسالة الإحالة');
    } catch (err) {
      toastMsg('حدث خطأ أثناء النسخ');
    }
  });
}

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('installBanner');
  banner.classList.remove('hidden');
});
const installBtn = document.getElementById('installBtn');
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      toastMsg('تم تثبيت التطبيق بنجاح');
    } else {
      toastMsg('تم إلغاء التثبيت');
    }
    deferredPrompt = null;
    document.getElementById('installBanner').classList.add('hidden');
  });
}
