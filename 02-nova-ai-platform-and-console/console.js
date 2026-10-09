// ========================================================
// NOVA AI — Agent Console & Playground Engine
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  initConsoleEvents();
  initTextareaAutoGrow();
});

// Knowledge base for simulated agent responses based on keywords
const KNOWLEDGE_BASE = {
  iam: {
    agentName: "DevOps Sentinel",
    reasoning: [
      "1. Parse user intent: AWS IAM security audit & dormant key detection.",
      "2. Query episodic memory for AWS account credentials and policy boundary.",
      "3. MicroVM tool sandbox initialized: executing `aws_iam_security_scan()`.",
      "4. Synthesizing least-privilege remediation patch in Terraform HCL."
    ],
    toolCall: {
      name: "aws_iam_security_scan(account_id='8921-3910-11', age_threshold_days=90)",
      latency: "38ms",
      output: "STATUS: 3 keys found exceeding 90 days. User `ci-deploy-bot` has `AdministratorAccess` without MFA."
    },
    answer: `I completed a security scan across your AWS IAM configuration.\n\n### Findings:\n- **Dormant Access Keys**: Found 3 keys unrotated for >90 days on \`ci-deploy-bot\` and \`staging-sync\`.\n- **Overly Permissive Role**: \`ci-deploy-bot\` possesses full \`AdministratorAccess\` instead of scoped ECR push credentials.\n\nHere is the proposed least-privilege Terraform patch:`,
    codeSnippet: `resource "aws_iam_policy" "scoped_ci_deploy" {
  name        = "ScopedCIDeployPolicy"
  description = "Restricted deployment permissions without admin bypass"
  policy      = jsonencode({
    Version   = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ecr:GetAuthorizationToken", "ecr:BatchCheckLayerAvailability", "ecs:UpdateService"]
      Resource = "*"
    }]
  })
}`,
    tokens: { prompt: 520, output: 340, cached: 1850 },
    latencies: { router: "11ms", tool: "38ms", gen: "165ms" },
    memories: [
      { tag: "AWS-IAM", score: "0.98", snippet: "Role: ci-deploy-bot, last rotated 114 days ago" },
      { tag: "Security-Policy", score: "0.94", snippet: "SOC2 Compliance requires 90-day rotation" }
    ]
  },

  query: {
    agentName: "DevOps Sentinel",
    reasoning: [
      "1. User requested PostgreSQL slow query diagnosis.",
      "2. Inspecting pg_stat_statements metrics in RDS production replica.",
      "3. Executing `postgres_explain_analyze(query_hash='q_98412')` inside isolated sandbox.",
      "4. Found sequential table scan on `transactions` table (4.2M rows)."
    ],
    toolCall: {
      name: "postgres_explain_analyze(table='transactions', seq_scan_detected=true)",
      latency: "44ms",
      output: "Seq Scan on transactions (cost=0.00..89240.20 rows=4210980 width=128) - execution time: 1,480ms"
    },
    answer: `The query latency spike is caused by a **Sequential Scan** across 4.2 million rows on \`transactions\` due to a missing composite index on \`(user_id, created_at)\`.\n\nAdding this partial B-Tree index will reduce execution time from **1,480ms down to ~3ms**:`,
    codeSnippet: `CREATE INDEX CONCURRENTLY idx_transactions_user_created 
ON transactions (user_id, created_at DESC) 
WHERE status != 'archived';`,
    tokens: { prompt: 460, output: 290, cached: 2100 },
    latencies: { router: "9ms", tool: "44ms", gen: "140ms" },
    memories: [
      { tag: "RDS-Postgres", score: "0.97", snippet: "Transactions table size: 4.2M rows, 1.8GB disk" },
      { tag: "DB-SLA", score: "0.92", snippet: "P99 query target: < 15ms" }
    ]
  },

  k8s: {
    agentName: "DevOps Sentinel",
    reasoning: [
      "1. User requested Kubernetes pod triage in production cluster.",
      "2. Querying cluster telemetry via `kubectl_get_events(namespace='production')`.",
      "3. Detecting pods in `CrashLoopBackOff` state.",
      "4. MicroVM sandbox isolated log tail executed on pod `payment-worker-7f89d-4x1`."
    ],
    toolCall: {
      name: "kubectl_describe_pod(pod='payment-worker-7f89d-4x1', namespace='prod')",
      latency: "51ms",
      output: "OOMKilled: Exit Code 137. Memory limit exceeded (256Mi). Peak consumption reached 258Mi during batch job."
    },
    answer: `Triaged the incident: Pod \`payment-worker-7f89d-4x1\` was terminated due to an **OOMKilled (Exit Code 137)** event.\n\nThe current pod memory limit is set to \`256Mi\`, which is saturated during the hourly batch queue processing.\n\nRecommended Helm values update:`,
    codeSnippet: `resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi" # Increased from 256Mi to absorb batch spikes
    cpu: "1000m"`,
    tokens: { prompt: 610, output: 380, cached: 1940 },
    latencies: { router: "12ms", tool: "51ms", gen: "190ms" },
    memories: [
      { tag: "K8s-Prod", score: "0.99", snippet: "Node pool: t3.large, available allocatable memory: 4.8Gi" },
      { tag: "Alert-Rule", score: "0.93", snippet: "PagerDuty alert triggered by PodOOMKilledCounter" }
    ]
  },

  generic: {
    agentName: "DevOps Sentinel",
    reasoning: [
      "1. Parsing user prompt & evaluating tool orchestration path.",
      "2. Neural router verified schema constraints.",
      "3. Tool sandbox dispatched microVM subprocess.",
      "4. Trace verified with zero hallucination critique."
    ],
    toolCall: {
      name: "nova_agent_exec(tool='system_diagnostic')",
      latency: "32ms",
      output: "DIAGNOSTIC COMPLETED: Task executed successfully in ephemeral container."
    },
    answer: `I have processed your request through the Nova Autonomous Agent runtime.\n\nAll tools executed with verified schema validation and 100% trace telemetry logging. You can inspect the live latency breakdown and retrieved memory fragments in the right-hand panel.`,
    codeSnippet: `// Nova Autonomous Agent Pipeline
const result = await nova.orchestrate({
  task: prompt,
  sandbox: "firecracker-microvm",
  vectorMemory: true
});`,
    tokens: { prompt: 410, output: 250, cached: 1400 },
    latencies: { router: "14ms", tool: "32ms", gen: "155ms" },
    memories: [
      { tag: "Session-Context", score: "0.89", snippet: "Active workspace: Prod-Cluster-US" }
    ]
  }
};

function initConsoleEvents() {
  const clearBtn = document.getElementById('clearChatBtn');
  const promptInput = document.getElementById('promptInput');

  if (clearBtn) {
    clearBtn.addEventListener('click', clearThread);
  }

  if (promptInput) {
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    });
  }

  // Sidebar navigation tab toggles
  document.querySelectorAll('.side-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function initTextareaAutoGrow() {
  const textarea = document.getElementById('promptInput');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  });
}

function fillPrompt(text) {
  const input = document.getElementById('promptInput');
  if (input) {
    input.value = text;
    input.focus();
  }
}

function clearThread() {
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="message-row agent-msg">
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble">
        <div class="msg-sender-row">
          <span class="msg-sender">DevOps Sentinel</span>
          <span class="msg-time">Just now</span>
        </div>
        <div class="msg-content">
          <p>Session cleared. Memory indexes and sandbox state have been reset. How can I assist you with your infrastructure today?</p>
        </div>
      </div>
    </div>
  `;
}

function handleSendMessage(e) {
  if (e) e.preventDefault();

  const input = document.getElementById('promptInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';

  // 1. Append User Message
  appendUserMessage(text);

  // 2. Determine response data
  const lower = text.toLowerCase();
  let key = 'generic';
  if (lower.includes('iam') || lower.includes('security') || lower.includes('key')) {
    key = 'iam';
  } else if (lower.includes('query') || lower.includes('sql') || lower.includes('postgres') || lower.includes('database')) {
    key = 'query';
  } else if (lower.includes('k8s') || lower.includes('pod') || lower.includes('kubernetes') || lower.includes('crash')) {
    key = 'k8s';
  }

  const responseData = KNOWLEDGE_BASE[key];

  // 3. Render Agent Response with simulated streaming steps
  simulateAgentExecution(responseData);
}

function appendUserMessage(text) {
  const container = document.getElementById('messagesContainer');
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const msgDiv = document.createElement('div');
  msgDiv.className = 'message-row user-msg';
  msgDiv.innerHTML = `
    <div class="msg-avatar">YOU</div>
    <div class="msg-bubble">
      <div class="msg-sender-row">
        <span class="msg-sender">Engineer</span>
        <span class="msg-time">${now}</span>
      </div>
      <div class="msg-content">
        <p>${escapeHtml(text)}</p>
      </div>
    </div>
  `;

  container.appendChild(msgDiv);
  scrollToBottom();
}

function simulateAgentExecution(data) {
  const container = document.getElementById('messagesContainer');
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Create empty Agent Message Row with loading status
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message-row agent-msg';
  msgDiv.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      <div class="msg-sender-row">
        <span class="msg-sender">${data.agentName}</span>
        <span class="msg-time">${now}</span>
      </div>
      <div class="msg-content" id="activeAgentBubble">
        <!-- Collapsible Reasoning Trace -->
        <details class="reasoning-box" open>
          <summary class="reasoning-header">
            <span>💭 Autonomous Reasoning Trace (${data.reasoning.length} steps)</span>
          </summary>
          <div class="reasoning-content">
            ${data.reasoning.map(step => `<div>${escapeHtml(step)}</div>`).join('')}
          </div>
        </details>

        <!-- Tool Call Execution Box -->
        <div class="tool-call-box">
          <div class="tool-call-title">
            <span>⚡ Tool Exec: \`${escapeHtml(data.toolCall.name)}\`</span>
            <span>${data.toolCall.latency}</span>
          </div>
          <div class="tool-call-output">
            ${escapeHtml(data.toolCall.output)}
          </div>
        </div>

        <!-- Synthesized Answer -->
        <div style="margin-top: 12px;">
          ${data.answer.split('\n\n').map(p => `<p>${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>')}</p>`).join('')}
        </div>

        <!-- Code Snippet -->
        ${data.codeSnippet ? `<pre class="code-block-msg"><code>${escapeHtml(data.codeSnippet)}</code></pre>` : ''}
      </div>
    </div>
  `;

  container.appendChild(msgDiv);
  scrollToBottom();

  // Update Inspector Telemetry metrics
  updateInspectorTelemetry(data);
}

function updateInspectorTelemetry(data) {
  const routerLat = document.getElementById('statRouterLat');
  const toolLat = document.getElementById('statToolLat');
  const genLat = document.getElementById('statGenLat');

  const pTokens = document.getElementById('statPromptTokens');
  const oTokens = document.getElementById('statOutputTokens');
  const cTokens = document.getElementById('statCachedTokens');

  const memoryList = document.getElementById('memoryList');

  if (routerLat) routerLat.textContent = data.latencies.router;
  if (toolLat) toolLat.textContent = data.latencies.tool;
  if (genLat) genLat.textContent = data.latencies.gen;

  if (pTokens) pTokens.textContent = data.tokens.prompt.toLocaleString();
  if (oTokens) oTokens.textContent = data.tokens.output.toLocaleString();
  if (cTokens) cTokens.textContent = data.tokens.cached.toLocaleString();

  if (memoryList && data.memories) {
    memoryList.innerHTML = data.memories.map(m => `
      <div class="memory-item">
        <div class="memory-meta">
          <span class="mem-tag">${escapeHtml(m.tag)}</span>
          <span class="mem-score">${escapeHtml(m.score)} match</span>
        </div>
        <p class="mem-snippet">${escapeHtml(m.snippet)}</p>
      </div>
    `).join('');
  }
}

function scrollToBottom() {
  const container = document.getElementById('messagesContainer');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
