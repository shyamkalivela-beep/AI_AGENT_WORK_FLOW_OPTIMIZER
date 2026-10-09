// ==========================================
// NOVA AI — Core Client-Side Interactions
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSandbox();
  initCalculator();
  initPricingToggle();
  initFaqAccordion();
  initMobileNav();
});

// --------------------------------------------------
// 1. Theme Toggle (Dark / Light) with LocalStorage
// --------------------------------------------------
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  // Detect saved preference or system preference
  const savedTheme = localStorage.getItem('nova_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nova_theme', newTheme);
    updateThemeIcon(newTheme, themeIcon);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });
}

function updateThemeIcon(theme, iconEl) {
  if (!iconEl) return;
  iconEl.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// --------------------------------------------------
// 2. Interactive Agent Sandbox Terminal Simulator
// --------------------------------------------------
const SCENARIOS = {
  market: {
    name: "Financial Market Scout",
    latency: "38ms",
    toolsCount: "4 / 4",
    tokens: "1,420",
    logs: [
      { type: "prompt", text: "$ nova run agent:market-scout --ticker NVDA,AAPL --depth deep" },
      { type: "step", text: "[ORCHESTRATOR] Initialized session with dynamic model router (Gemini 1.5 Pro + Sonnet 3.5 fallback)..." },
      { type: "tool", text: "[TOOL CALL] invoking `financial_data_feed(tickers=['NVDA', 'AAPL'])` -> latency 14ms" },
      { type: "step", text: "[MEMORY] Vector store queried 8 prior analyst transcripts (similarity score 0.942)..." },
      { type: "tool", text: "[TOOL CALL] invoking `sec_edgar_filings(form='10-Q', period='Q3-2026')` -> status 200 OK" },
      { type: "tool", text: "[TOOL CALL] invoking `sentiment_analyzer(transcripts, news_signals)` -> bullish delta +12.4%" },
      { type: "step", text: "[SELF-CRITIQUE] Checked output coherence: 0 hallucinated metrics detected." },
      { type: "success", text: "[SYNTHESIS COMPLETE] Generated 1-page structured briefing report with 100% citation coverage." }
    ]
  },
  security: {
    name: "Cloud Security Auditor",
    latency: "44ms",
    toolsCount: "5 / 5",
    tokens: "1,890",
    logs: [
      { type: "prompt", text: "$ nova run agent:security-auditor --env prod-us-east-1 --policy strict" },
      { type: "step", text: "[ORCHESTRATOR] Spawning zero-trust ephemeral microVM container #vm-8931..." },
      { type: "tool", text: "[TOOL CALL] invoking `aws_iam_scan(max_keys=500)` -> found 3 dormant admin keys > 90 days" },
      { type: "tool", text: "[TOOL CALL] invoking `s3_bucket_acl_audit()` -> verified 42 buckets private, 0 public exposure" },
      { type: "tool", text: "[TOOL CALL] invoking `terraform_patch_generator(dormant_keys)` -> synthesized remediation PR #412" },
      { type: "step", text: "[REASONING] Validating Terraform syntax against HCL v2 parser... passed cleanly." },
      { type: "success", text: "[AUDIT SUCCESS] 0 critical vulnerabilities. Auto-drafted PR submitted for engineering review." }
    ]
  },
  support: {
    name: "Auto Customer Escalation",
    latency: "29ms",
    toolsCount: "3 / 3",
    tokens: "960",
    logs: [
      { type: "prompt", text: "$ nova run agent:support-triage --ticket-id TCK-9941 --sla enterprise" },
      { type: "step", text: "[ORCHESTRATOR] Received inbound customer webhook: 'Database timeout on eu-central clusters'." },
      { type: "tool", text: "[TOOL CALL] invoking `datadog_metrics_query(service='eu-postgres')` -> CPU spike 98% confirmed" },
      { type: "tool", text: "[TOOL CALL] invoking `slack_incident_escalate(channel='#oncall-infra', severity='P1')` -> dispatched" },
      { type: "tool", text: "[TOOL CALL] invoking `zendesk_reply_draft(ticket_id='TCK-9941')` -> personalized status update ready" },
      { type: "success", text: "[TRIAGE RESOLVED] Mean Time to Response (MTTR) reduced from 45 min to 18 seconds." }
    ]
  }
};

let currentScenarioKey = 'market';
let typewriterTimeout = null;

function initSandbox() {
  const presetButtons = document.querySelectorAll('.preset-btn');
  const runBtn = document.getElementById('runAgentBtn');

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScenarioKey = btn.getAttribute('data-agent');
      runScenario(currentScenarioKey);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runScenario(currentScenarioKey);
    });
  }

  // Initial run
  runScenario(currentScenarioKey);
}

function runScenario(key) {
  const scenario = SCENARIOS[key] || SCENARIOS.market;
  const screen = document.getElementById('terminalOutput');
  const latencyEl = document.getElementById('termLatency');
  const toolsEl = document.getElementById('termTools');
  const tokensEl = document.getElementById('termTokens');

  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
  }

  screen.innerHTML = '';
  latencyEl.textContent = '...';
  toolsEl.textContent = '...';
  tokensEl.textContent = '...';

  let logIndex = 0;

  function streamNextLine() {
    if (logIndex < scenario.logs.length) {
      const line = scenario.logs[logIndex];
      const div = document.createElement('div');
      div.className = 'terminal-line';

      let classPrefix = 'line-step';
      if (line.type === 'prompt') classPrefix = 'line-prompt';
      if (line.type === 'tool') classPrefix = 'line-tool';
      if (line.type === 'success') classPrefix = 'line-success';

      div.innerHTML = `<span class="${classPrefix}">${escapeHtml(line.text)}</span>`;
      screen.appendChild(div);

      // Auto scroll
      const terminalScreen = document.getElementById('terminalScreen');
      if (terminalScreen) {
        terminalScreen.scrollTop = terminalScreen.scrollHeight;
      }

      logIndex++;
      typewriterTimeout = setTimeout(streamNextLine, 180);
    } else {
      // Completed streaming
      latencyEl.textContent = scenario.latency;
      toolsEl.textContent = scenario.toolsCount;
      tokensEl.textContent = scenario.tokens;
    }
  }

  streamNextLine();
}

// --------------------------------------------------
// 3. Interactive ROI Calculator
// --------------------------------------------------
function initCalculator() {
  const devCountSlider = document.getElementById('devCount');
  const tasksSlider = document.getElementById('tasksPerMonth');
  const rateSlider = document.getElementById('hourlyRate');

  const devCountVal = document.getElementById('devCountVal');
  const tasksVal = document.getElementById('tasksPerMonthVal');
  const rateVal = document.getElementById('hourlyRateVal');

  const annualSavingsEl = document.getElementById('annualSavings');
  const hoursSavedEl = document.getElementById('hoursSaved');
  const speedupFactorEl = document.getElementById('speedupFactor');

  function calculate() {
    const devs = parseInt(devCountSlider.value, 10);
    const tasks = parseInt(tasksSlider.value, 10);
    const rate = parseInt(rateSlider.value, 10);

    // Update slider readouts
    devCountVal.textContent = `${devs} Engineer${devs === 1 ? '' : 's'}`;
    tasksVal.textContent = `${tasks.toLocaleString()} runs`;
    rateVal.textContent = `$${rate} / hr`;

    // Formula: Each automated task saves ~0.35 hours of manual dev debugging & coordination
    const monthlyHoursSaved = Math.round(tasks * 0.35);
    const annualHoursSaved = monthlyHoursSaved * 12;
    const grossDollarSavings = annualHoursSaved * rate;

    // Projected velocity multiplier
    const speedup = (3.5 + (tasks / 8000)).toFixed(1);

    // Render results
    annualSavingsEl.textContent = `$${grossDollarSavings.toLocaleString()}`;
    hoursSavedEl.textContent = `${annualHoursSaved.toLocaleString()} hrs`;
    speedupFactorEl.textContent = `${speedup}x`;
  }

  [devCountSlider, tasksSlider, rateSlider].forEach(slider => {
    slider.addEventListener('input', calculate);
  });

  calculate();
}

// --------------------------------------------------
// 4. Pricing Billing Frequency Switcher
// --------------------------------------------------
function initPricingToggle() {
  const toggleBtn = document.getElementById('billingToggle');
  const lblMonthly = document.getElementById('lblMonthly');
  const lblAnnual = document.getElementById('lblAnnual');
  const priceVals = document.querySelectorAll('.price-val');

  let isAnnual = true; // default annual

  function updatePrices() {
    toggleBtn.classList.toggle('monthly', !isAnnual);
    lblMonthly.classList.toggle('active', !isAnnual);
    lblAnnual.classList.toggle('active', isAnnual);

    priceVals.forEach(val => {
      const targetPrice = isAnnual 
        ? val.getAttribute('data-annual') 
        : val.getAttribute('data-monthly');
      
      val.style.opacity = '0';
      setTimeout(() => {
        val.textContent = targetPrice;
        val.style.opacity = '1';
      }, 150);
    });
  }

  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    updatePrices();
  });

  lblMonthly.addEventListener('click', () => {
    if (isAnnual) {
      isAnnual = false;
      updatePrices();
    }
  });

  lblAnnual.addEventListener('click', () => {
    if (!isAnnual) {
      isAnnual = true;
      updatePrices();
    }
  });
}

function selectPlan(planName) {
  showToast(`Selected ${planName} plan. Redirecting to onboarding...`, 'success');
}

// --------------------------------------------------
// 5. FAQ Accordion Interaction
// --------------------------------------------------
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other items
      faqItems.forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// --------------------------------------------------
// 6. Mobile Navigation Menu
// --------------------------------------------------
function initMobileNav() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close when clicking a link
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// --------------------------------------------------
// 7. Lead Form Signup Handling
// --------------------------------------------------
function handleSignup(e) {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  const email = input.value.trim();

  if (!email || !email.includes('@')) {
    showToast('Please enter a valid work email address', 'error');
    return;
  }

  input.value = '';
  showToast(`Success! Onboarding instructions sent to ${email}`, 'success');
}

// --------------------------------------------------
// 8. Toast Notifications
// --------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// Security sanitization helper
function escapeHtml(text) {
  if (!text) return '';
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}
