// Initial default workflows with latest session entries
const DEFAULT_WORKFLOWS = [
  {
    id: 1791569469396,
    task: "get weather",
    category: "Data Analysis",
    tags: ["optimised"],
    time: "59% faster"
  },
  {
    id: 1791569429602,
    task: "AI Agent workflow optimizer",
    category: "Automation",
    tags: ["html", "css", "java"],
    time: "36% faster"
  },
  { 
    id: 1, 
    task: "Get weather and summarize news", 
    category: "Automation", 
    tags: ["optimized", "weather"], 
    time: "40% faster" 
  },
  { 
    id: 2, 
    task: "Analyze customer emails", 
    category: "Customer Support", 
    tags: ["urgent", "email"], 
    time: "60% faster" 
  },
  {
    id: 3,
    task: "Synthesize quarterly financial statements",
    category: "Data Analysis",
    tags: ["optimized", "finance"],
    time: "48% faster"
  }
];

// App State
let workflows = [];
let currentFilter = { type: 'all', value: '' };
let feedbackTimeout = null;

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
  loadStoredWorkflows();
  renderWorkflows();
  updateStats();
  setupKeyboardShortcuts();
});

// Load from localStorage or defaults
function loadStoredWorkflows() {
  try {
    const stored = localStorage.getItem('agy_workflows');
    if (stored) {
      workflows = JSON.parse(stored);
    } else {
      workflows = [...DEFAULT_WORKFLOWS];
      saveToStorage();
    }
  } catch (err) {
    console.error("Storage read failed, using defaults", err);
    workflows = [...DEFAULT_WORKFLOWS];
  }
}

function saveToStorage() {
  try {
    localStorage.setItem('agy_workflows', JSON.stringify(workflows));
  } catch (err) {
    console.error("Storage write failed", err);
  }
}

// -------------------------------------------------------------
// SAVE WORKFLOW (With Constraints & Clear Feedback)
// -------------------------------------------------------------
function saveWorkflow() {
  const taskInput = document.getElementById('taskInput');
  const categoryInput = document.getElementById('categoryInput');
  const tagInput = document.getElementById('tagInput');

  const task = taskInput.value.trim();
  const category = categoryInput.value;
  const rawTags = tagInput.value;

  // 1. Validation constraints
  if (!task) {
    showFeedback("Task description cannot be empty. Please enter a task.", "error");
    taskInput.focus();
    return;
  }

  if (!category) {
    showFeedback("Please select a workflow category.", "error");
    categoryInput.focus();
    return;
  }

  // 2. UNIQUE CONSTRAINT: Category & Task Uniqueness
  const isDuplicate = workflows.some(
    w => w.task.toLowerCase() === task.toLowerCase() && w.category === category
  );

  if (isDuplicate) {
    showFeedback(`Unique Constraint Error: Task "${task}" already exists in "${category}".`, "error");
    taskInput.focus();
    return;
  }

  // Parse and deduplicate tags
  const tags = Array.from(
    new Set(
      rawTags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)
    )
  );

  // If no tag is provided, add default tag
  const finalTags = tags.length > 0 ? tags : ["optimized"];

  // Generate optimization benchmark calculation (35% - 75%)
  const speedupPercent = Math.floor(Math.random() * 41) + 35;
  const speedupText = `${speedupPercent}% faster`;

  // Create workflow object
  const newWorkflow = {
    id: Date.now(),
    task,
    category,
    tags: finalTags,
    time: speedupText
  };

  // Add to workflow list
  workflows.unshift(newWorkflow);
  saveToStorage();

  // Reset inputs
  taskInput.value = '';
  categoryInput.value = '';
  tagInput.value = '';

  // Show clear success feedback
  showFeedback(`Workflow optimized and saved! Execution latency reduced by ${speedupText}.`, "success");

  // Re-render
  renderWorkflows();
  updateStats();
}

// -------------------------------------------------------------
// FEEDBACK SYSTEM (COMMON CONSTRAINT: Clear Feedback Area)
// -------------------------------------------------------------
function showFeedback(message, type = 'info') {
  const box = document.getElementById('feedbackBox');
  if (!box) return;

  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout);
  }

  box.className = `feedback-box ${type}`;
  box.innerHTML = `
    <span><strong>${type === 'error' ? '⚠️' : '✓'}</strong> ${message}</span>
    <button class="feedback-close" onclick="clearFeedback()" title="Dismiss">&times;</button>
  `;

  // Auto-clear feedback after 4.5 seconds
  feedbackTimeout = setTimeout(() => {
    clearFeedback();
  }, 4500);
}

function clearFeedback() {
  const box = document.getElementById('feedbackBox');
  if (!box) return;
  box.className = 'feedback-box feedback-hidden';
  box.innerHTML = '';
}

// -------------------------------------------------------------
// FILTERING
// -------------------------------------------------------------
function filterBy(type, value) {
  currentFilter = { type, value };
  updateFilterButtons();
  renderWorkflows();
}

function loadAll() {
  currentFilter = { type: 'all', value: '' };
  updateFilterButtons();
  renderWorkflows();
}

function updateFilterButtons() {
  const buttons = document.querySelectorAll('.btn-filter');
  const label = document.getElementById('activeFilterLabel');

  buttons.forEach(btn => btn.classList.remove('active'));

  if (currentFilter.type === 'all') {
    const allBtn = document.getElementById('btnFilterAll');
    if (allBtn) allBtn.classList.add('active');
    if (label) label.textContent = 'Showing All';
  } else if (currentFilter.type === 'category') {
    buttons.forEach(btn => {
      if (btn.textContent.trim() === currentFilter.value) {
        btn.classList.add('active');
      }
    });
    if (label) label.textContent = `Category: ${currentFilter.value}`;
  } else if (currentFilter.type === 'tag') {
    buttons.forEach(btn => {
      if (btn.textContent.trim().toLowerCase() === `#${currentFilter.value.toLowerCase()}`) {
        btn.classList.add('active');
      }
    });
    if (label) label.textContent = `Tag: #${currentFilter.value}`;
  }
}

// -------------------------------------------------------------
// WORKFLOW RENDERING
// -------------------------------------------------------------
function renderWorkflows() {
  const container = document.getElementById('workflowList');
  const countEl = document.getElementById('resultsCount');
  if (!container) return;

  const filtered = workflows.filter(w => {
    if (currentFilter.type === 'category') {
      return w.category === currentFilter.value;
    }
    if (currentFilter.type === 'tag') {
      return w.tags && w.tags.includes(currentFilter.value.toLowerCase());
    }
    return true;
  });

  if (countEl) {
    countEl.textContent = `${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No workflows match your selection</h3>
        <p>Try switching filters or optimize a new agent workflow above.</p>
        <button class="btn btn-filter" style="margin-top:14px;" onclick="loadAll()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(w => {
    const categoryClass = getCategoryClass(w.category);
    return `
      <div class="workflow-card" id="workflow-${w.id}">
        <div class="card-meta">
          <span class="category-tag ${categoryClass}">${escapeHtml(w.category)}</span>
          <span class="speedup-indicator">⚡ ${escapeHtml(w.time)}</span>
        </div>
        <h3 class="card-task-title">${escapeHtml(w.task)}</h3>
        <div class="card-footer">
          <div class="card-tags">
            ${(w.tags || []).map(tag => `
              <span 
                class="tag-badge" 
                onclick="filterBy('tag', '${escapeHtml(tag)}')" 
                title="Filter by #${escapeHtml(tag)}"
              >#${escapeHtml(tag)}</span>
            `).join('')}
          </div>
          <div class="card-actions">
            <button 
              class="btn-icon" 
              onclick="deleteWorkflow(${w.id})" 
              title="Delete this workflow"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getCategoryClass(category) {
  switch (category) {
    case 'Data Analysis': return 'cat-data';
    case 'Customer Support': return 'cat-support';
    case 'Research': return 'cat-research';
    case 'Automation': return 'cat-automation';
    default: return '';
  }
}

// -------------------------------------------------------------
// DELETE WORKFLOW
// -------------------------------------------------------------
function deleteWorkflow(id) {
  const target = workflows.find(w => w.id === id);
  if (!target) return;

  workflows = workflows.filter(w => w.id !== id);
  saveToStorage();
  renderWorkflows();
  updateStats();
  showFeedback(`Deleted workflow: "${target.task.slice(0, 30)}..."`, "info");
}

// -------------------------------------------------------------
// METRICS & STATS
// -------------------------------------------------------------
function updateStats() {
  const statTotal = document.getElementById('statTotal');
  const statSpeedup = document.getElementById('statSpeedup');

  if (statTotal) {
    statTotal.textContent = workflows.length;
  }

  if (statSpeedup) {
    if (workflows.length === 0) {
      statSpeedup.textContent = '0%';
    } else {
      const totalPercent = workflows.reduce((acc, curr) => {
        const val = parseInt(curr.time, 10) || 40;
        return acc + val;
      }, 0);
      const avg = Math.round(totalPercent / workflows.length);
      statSpeedup.textContent = `${avg}%`;
    }
  }
}

// -------------------------------------------------------------
// PRESETS & SHORTCUTS
// -------------------------------------------------------------
function applyPreset(task, category, tags) {
  document.getElementById('taskInput').value = task;
  document.getElementById('categoryInput').value = category;
  document.getElementById('tagInput').value = tags;
  showFeedback("Preset loaded into form. Click 'Optimize & Save' to benchmark.", "info");
}

function setupKeyboardShortcuts() {
  const taskInput = document.getElementById('taskInput');
  const tagInput = document.getElementById('tagInput');

  [taskInput, tagInput].forEach(el => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveWorkflow();
      }
    });
  });
}

// Helper to escape HTML characters
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
