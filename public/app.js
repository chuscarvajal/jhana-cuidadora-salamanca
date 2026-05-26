/*
   Cuidador canino Jhana - Interactive Client Logic
   Paseos, Guardería y Cuidado Canino en Salamanca
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation & Theme Toggle
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const themeToggle = document.querySelector('.theme-toggle');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme',
    savedTheme === 'dark' || (!savedTheme && systemPrefersDark) ? 'dark' : 'light'
  );

  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ==========================================
  // 2. Before / After Image Slider
  // ==========================================
  const sliderContainer = document.querySelector('.comparison-slider');
  const afterImage = document.querySelector('.image-after');
  const handle = document.querySelector('.slider-handle');

  if (sliderContainer && afterImage && handle) {
    let isDragging = false;
    const moveSlider = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      let pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      afterImage.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      handle.style.left = `${pct}%`;
    };
    sliderContainer.addEventListener('mousedown', (e) => { isDragging = true; moveSlider(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    sliderContainer.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
    sliderContainer.addEventListener('touchstart', (e) => { isDragging = true; if (e.touches[0]) moveSlider(e.touches[0].clientX); });
    window.addEventListener('touchend', () => { isDragging = false; });
    sliderContainer.addEventListener('touchmove', (e) => { if (isDragging && e.touches[0]) moveSlider(e.touches[0].clientX); });
  }

  // ==========================================
  // 3. Needs Assessment Quiz
  // ==========================================
  const quizData = [
    {
      question: "¿Por qué necesitas cuidado para tu perro?",
      options: [
        { text: "Trabajo muchas horas y mi perro se queda solo en casa", score: "guarderia" },
        { text: "No tengo tiempo suficiente para sacarlo a pasear todos los días", score: "paseo" },
        { text: "Me voy de viaje o vacaciones y necesito quien lo cuide", score: "cuidado" },
        { text: "Tiene ansiedad por separación y necesita compañía activa", score: "guarderia" }
      ]
    },
    {
      question: "¿Cuántas horas diarias pasa tu perro solo en casa?",
      options: [
        { text: "Menos de 4 horas — solo necesito ayuda algún día", score: "paseo" },
        { text: "Entre 4 y 8 horas — toda la jornada laboral", score: "guarderia" },
        { text: "Más de 8 horas — turno largo o trabajo a turnos", score: "guarderia" },
        { text: "Varios días seguidos por viaje o compromiso largo", score: "cuidado" }
      ]
    },
    {
      question: "¿Cómo es el carácter de tu perro?",
      options: [
        { text: "Muy activo y necesita mucho ejercicio diario", score: "paseo" },
        { text: "Sociable — le encanta estar con personas o perros", score: "guarderia" },
        { text: "Tranquilo, necesita compañía pero no mucha actividad", score: "cuidado" },
        { text: "Tímido o nervioso — requiere un ambiente familiar y calmado", score: "cuidado" }
      ]
    },
    {
      question: "¿Con qué frecuencia necesitas el servicio?",
      options: [
        { text: "Todos los días o casi todos los días", score: "paseo" },
        { text: "Varios días a la semana de forma regular", score: "guarderia" },
        { text: "Puntualmente para viajes o situaciones concretas", score: "cuidado" },
        { text: "No sé todavía — quiero conocer las opciones primero", score: "paseo" }
      ]
    }
  ];

  let currentStep = 0;
  const userAnswers = [];

  const quizStep = document.getElementById('quiz-step');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const progressFill = document.getElementById('progress-fill');
  const stepCount = document.getElementById('step-count');
  const quizResult = document.getElementById('quiz-result');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const recDesc = document.getElementById('rec-desc');
  const btnRestart = document.getElementById('btn-restart');
  const btnSelectResultPackage = document.getElementById('btn-select-result-package');

  function initQuiz() {
    if (!quizStep) return;
    currentStep = 0;
    userAnswers.length = 0;
    quizResult.classList.remove('active');
    quizStep.classList.add('active');
    btnPrev.style.visibility = 'hidden';
    btnNext.innerText = 'Siguiente';
    showQuestion();
  }

  function showQuestion() {
    const q = quizData[currentStep];
    quizQuestion.innerText = q.question;
    quizOptions.innerHTML = '';
    progressFill.style.width = `${(currentStep / quizData.length) * 100}%`;
    stepCount.innerText = `Paso ${currentStep + 1} de ${quizData.length}`;

    q.options.forEach((opt, idx) => {
      const el = document.createElement('div');
      el.classList.add('quiz-option');
      if (userAnswers[currentStep] === idx) el.classList.add('selected');
      el.innerHTML = `<div class="quiz-radio"></div><div class="quiz-option-text">${opt.text}</div>`;
      el.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        userAnswers[currentStep] = idx;
        btnNext.disabled = false;
      });
      quizOptions.appendChild(el);
    });

    btnNext.disabled = userAnswers[currentStep] === undefined;
    btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    btnNext.innerText = currentStep === quizData.length - 1 ? 'Ver Resultado' : 'Siguiente';
  }

  if (btnNext) btnNext.addEventListener('click', () => {
    if (currentStep < quizData.length - 1) { currentStep++; showQuestion(); } else { showResults(); }
  });
  if (btnPrev) btnPrev.addEventListener('click', () => { if (currentStep > 0) { currentStep--; showQuestion(); } });
  if (btnRestart) btnRestart.addEventListener('click', initQuiz);

  function showResults() {
    quizStep.classList.remove('active');
    quizResult.classList.add('active');
    progressFill.style.width = '100%';
    stepCount.innerText = 'Resultado';

    const scores = { paseo: 0, guarderia: 0, cuidado: 0 };
    userAnswers.forEach((ansIdx, qIdx) => { scores[quizData[qIdx].options[ansIdx].score]++; });

    let rec = 'paseo';
    if (scores.guarderia >= scores.paseo && scores.guarderia >= scores.cuidado) rec = 'guarderia';
    else if (scores.cuidado >= scores.paseo && scores.cuidado >= scores.guarderia) rec = 'cuidado';

    if (rec === 'paseo') {
      resultTitle.innerText = "Paseos Diarios — la solución perfecta para ti";
      resultDesc.innerText = "Tu perro necesita salir a ejercitarse y socializar de forma regular. Los paseos diarios de Jhana son exactamente lo que buscas.";
      recDesc.innerText = "Salidas individuales o en pequeño grupo con fotos incluidas. Tu perro llegará a casa ejercitado, feliz y listo para descansar.";
      btnSelectResultPackage.setAttribute('data-target-package', 'paseo');
    } else if (rec === 'guarderia') {
      resultTitle.innerText = "Guardería Diurna — compañía activa todo el día";
      resultDesc.innerText = "Tu perro necesita más que un paseo — necesita compañía real durante el día. La guardería de Jhana es el entorno perfecto para él.";
      recDesc.innerText = "Un ambiente familiar, tranquilo y lleno de atención mientras tú trabajas. Tu perro estará activo, acompañado y feliz desde la mañana hasta que lo recojas.";
      btnSelectResultPackage.setAttribute('data-target-package', 'guarderia');
    } else {
      resultTitle.innerText = "Cuidado en Casa — la alternativa más cálida";
      resultDesc.innerText = "Tu perro necesita un hogar temporal, no una residencia. El cuidado en casa de Jhana le da exactamente eso: un entorno familiar y lleno de cariño.";
      recDesc.innerText = "Tu perro duerme y vive en casa de Jhana durante tu ausencia. Recibe comidas, paseos, mimos y compañía constante. Te irás de viaje con total tranquilidad.";
      btnSelectResultPackage.setAttribute('data-target-package', 'cuidado');
    }
  }

  if (btnSelectResultPackage) btnSelectResultPackage.addEventListener('click', () => {
    selectPackage(btnSelectResultPackage.getAttribute('data-target-package'));
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
  });

  initQuiz();

  // ==========================================
  // 4. Pricing Calculator
  // ==========================================
  const pkgPaseo = document.getElementById('pkg-paseo');
  const pkgGuarderia = document.getElementById('pkg-guarderia');
  const pkgCuidado = document.getElementById('pkg-cuidado');
  const rangeSessions = document.getElementById('range-sessions');
  const sessionCountVal = document.getElementById('session-count-val');
  const sessionsLabel = document.getElementById('sessions-label');
  const addonHome = document.getElementById('addon-home');
  const addonSupport = document.getElementById('addon-support');
  const addonMaterials = document.getElementById('addon-materials');
  const summaryPackageName = document.getElementById('summary-package-name');
  const summaryPackagePrice = document.getElementById('summary-package-price');
  const summarySessionsCount = document.getElementById('summary-sessions-count');
  const summarySessionsPrice = document.getElementById('summary-sessions-price');
  const summaryAddonsList = document.getElementById('summary-addons-list');
  const summaryAddonsPrice = document.getElementById('summary-addons-price');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const btnBookSession = document.getElementById('btn-book-session');

  const packages = {
    paseo:     { name: "Paseos Diarios",    unitPrice: 12, unitLabel: "paseos",  sliderMin: 1, sliderMax: 20, sliderDefault: 5,  priceLabel: "12€/paseo",  sessionLabel: "2. Número de Paseos" },
    guarderia: { name: "Guardería Diurna",  unitPrice: 20, unitLabel: "días",    sliderMin: 1, sliderMax: 20, sliderDefault: 5,  priceLabel: "20€/día",    sessionLabel: "2. Número de Días" },
    cuidado:   { name: "Cuidado en Casa",   unitPrice: 25, unitLabel: "noches",  sliderMin: 1, sliderMax: 14, sliderDefault: 3,  priceLabel: "25€/noche",  sessionLabel: "2. Número de Noches" }
  };

  let activePackage = 'paseo';

  function selectPackage(pkgKey) {
    if (!packages[pkgKey]) return;
    activePackage = pkgKey;
    [pkgPaseo, pkgGuarderia, pkgCuidado].forEach(el => { if (el) el.classList.remove('selected'); });
    const targetEl = document.getElementById(`pkg-${pkgKey}`);
    if (targetEl) targetEl.classList.add('selected');
    const pkg = packages[pkgKey];
    rangeSessions.min = pkg.sliderMin;
    rangeSessions.max = pkg.sliderMax;
    rangeSessions.value = pkg.sliderDefault;
    sessionCountVal.innerText = pkg.sliderDefault;
    if (sessionsLabel) sessionsLabel.innerText = pkg.sessionLabel;
    calculateCosts();
  }

  function setupCalculatorEvents() {
    if (!pkgPaseo) return;
    pkgPaseo.addEventListener('click', () => selectPackage('paseo'));
    pkgGuarderia.addEventListener('click', () => selectPackage('guarderia'));
    pkgCuidado.addEventListener('click', () => selectPackage('cuidado'));
    rangeSessions.addEventListener('input', (e) => { sessionCountVal.innerText = e.target.value; calculateCosts(); });
    [addonHome, addonSupport, addonMaterials].forEach(a => {
      if (a) a.addEventListener('click', () => { a.classList.toggle('selected'); calculateCosts(); });
    });
    if (btnBookSession) btnBookSession.addEventListener('click', () => {
      const pkg = packages[activePackage];
      const qty = rangeSessions.value;
      const total = summaryTotalPrice.innerText;
      const msg = `Hola, me gustaría información sobre: *${pkg.name}* — ${qty} ${pkg.unitLabel}. Presupuesto orientativo: *${total}*.`;
      const contactMessage = document.getElementById('message');
      if (contactMessage) contactMessage.value = msg;
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function calculateCosts() {
    if (!rangeSessions) return;
    const pkg = packages[activePackage];
    const qty = parseInt(rangeSessions.value);
    const baseCost = pkg.unitPrice * qty;
    let addonsTotal = 0;
    const activeAddonsNames = [];

    if (addonHome && addonHome.classList.contains('selected')) {
      const cost = qty * 5;
      addonsTotal += cost;
      activeAddonsNames.push(`Paseo extra (+${cost}€)`);
    }
    if (addonSupport && addonSupport.classList.contains('selected')) {
      const cost = qty * 3;
      addonsTotal += cost;
      activeAddonsNames.push(`Fotos diarias (+${cost}€)`);
    }
    if (addonMaterials && addonMaterials.classList.contains('selected')) {
      const cost = qty * 5;
      addonsTotal += cost;
      activeAddonsNames.push(`Recogida a domicilio (+${cost}€)`);
    }

    const grandTotal = baseCost + addonsTotal;
    if (summaryPackageName) {
      summaryPackageName.innerText = pkg.name;
      summaryPackagePrice.innerText = pkg.priceLabel;
      summarySessionsCount.innerText = `${qty} ${pkg.unitLabel}`;
      summarySessionsPrice.innerText = `${baseCost}€`;
      summaryAddonsList.innerText = activeAddonsNames.length > 0 ? activeAddonsNames.join(', ') : 'Ninguno';
      summaryAddonsPrice.innerText = `+${addonsTotal}€`;
      summaryTotalPrice.classList.remove('pulse');
      void summaryTotalPrice.offsetWidth;
      summaryTotalPrice.classList.add('pulse');
      summaryTotalPrice.innerText = `${grandTotal}€`;
    }
  }

  setupCalculatorEvents();
  calculateCosts();

  // ==========================================
  // 5. Testimonial Carousel
  // ==========================================
  const track = document.querySelector('.reviews-track');
  const slides = Array.from(document.querySelectorAll('.review-slide'));
  const dotsContainer = document.querySelector('.reviews-nav');

  if (track && slides.length > 0 && dotsContainer) {
    let currentSlideIdx = 0;
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('review-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { goToSlide(idx); clearInterval(autoPlayInterval); });
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(document.querySelectorAll('.review-dot'));
    function goToSlide(idx) {
      currentSlideIdx = idx;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[idx].classList.add('active');
    }
    let autoPlayInterval = setInterval(() => { goToSlide((currentSlideIdx + 1) % slides.length); }, 5000);
  }

  // ==========================================
  // 6. FAQ Accordion
  // ==========================================
  document.querySelectorAll('.faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.faq-body').style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 7. Contact Form
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        formStatus.innerText = "Por favor, rellena los campos obligatorios (Nombre, Email y Mensaje).";
        formStatus.className = "form-status error";
        return;
      }
      formStatus.innerText = "¡Gracias por contactar con Jhana! Te responderá lo antes posible.";
      formStatus.className = "form-status success";
      contactForm.reset();
      setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
    });
  }

});
