# Complete AI Agent & Workflow Suite

A complete suite of production-ready AI agent interfaces, workflow optimizers, and interactive consoles built for autonomous multi-agent pipelines.

---

## 📦 What's Inside This Archive

### `01-ai-workflow-optimizer/`
The standalone **AI Agent Workflow Optimizer** web application.
- **`index.html`**: Complete UI with task form, category select, tag inputs, and workflow cards.
- **`style.css`**: Modern dark-mode styling with glowing accents, responsiveness, and clear feedback alerts.
- **`script.js`**: Handles unique constraint checking (unique task per category), simulated speedup benchmarks (35%-75% faster), dynamic category/tag filtering, and `localStorage` persistence.
- **`README.md`**: Guide on running with zero dependencies.
- **How to Run**: Double-click `index.html` in your browser, or run `python -m http.server 3000`.

---

### `02-nova-ai-platform-and-console/`
The full **Nova AI Autonomous Agent Platform** — SaaS landing page + Agent Console & Playground workspace.
- **`index.html`**: High-converting SaaS landing page with live interactive streaming terminal, engineering ROI savings calculator, bento grid, pricing frequency toggle, and dark/light mode switch.
- **`console.html`**: Multi-agent playground interface with chat threads, collapsible reasoning traces (`<details>`), live tool execution boxes, and real-time telemetry inspector (tokens, latency, episodic vector memory).
- **`style.css` & `console.css`**: Ultra-modern glassmorphic styles with CSS custom properties.
- **`script.js` & `console.js`**: Streaming typewriter terminal engine, interactive prompts, and telemetry analytics.
- **`types.ts`**: TypeScript interface definitions for Agent, Tool, Workflow, Telemetry, and Memory schemas.
- **How to Run**: Open `index.html` or `console.html` in your browser, or run `python -m http.server 3001`.

---

### `03-react-workflow-optimizer/`
The **React Component Implementation** of the Workflow Optimizer.
- **`src/App.jsx`**: Fully typed React state management with hooks (`useState`, `useEffect`), input validation, and filter reducers.
- **`src/App.css`**: Modular scoped styling for the React app.
- **`package.json`**: Standard Vite + React configuration.
- **How to Run**: Run `npm install` followed by `npm run dev`.

---

## ⚡ Quick Start

You don't need to install anything to run the core projects:
1. Extract this zip file anywhere on your system.
2. Open `01-ai-workflow-optimizer/index.html` for the Workflow Optimizer.
3. Open `02-nova-ai-platform-and-console/console.html` for the Agent Console & Playground.
4. Open `02-nova-ai-platform-and-console/index.html` for the SaaS Landing Page.
