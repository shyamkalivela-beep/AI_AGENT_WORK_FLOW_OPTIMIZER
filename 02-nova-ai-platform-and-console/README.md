# Nova AI — Autonomous Agent Infrastructure Website

A modern, responsive, high-converting SaaS landing page for an autonomous AI agent orchestration platform.

## Architecture & Features

- **Live Sandbox Terminal Simulator**:
  - Interactive multi-scenario agent runner with streaming typewriter effect and real-time step critique logs.
  - Metrics tracking: Latency, tool calls, and token usage.
- **Dynamic Model & Router Bento Grid**:
  - Highlights neural routing, episodic vector memory, microVM sandboxes, and OpenTelemetry trace replay.
- **Interactive ROI & Cost Savings Calculator**:
  - Live reactive sliders for Team Size, Monthly Invocations, and Loaded Hourly Rates.
  - Automatically calculates reclaimed developer hours and estimated dollar savings.
- **Transparent Pricing Tier Matrix**:
  - Instant monthly vs. annual billing switch with automatic discount calculations.
- **Dark / Light Mode**:
  - Seamless theme toggle with local storage persistence and CSS custom property theming.
- **Accessible Interactions**:
  - FAQ accordion, responsive mobile navigation drawer, and toast notifications.

## File Structure

```
nova-ai-website/
├── index.html        # Semantic markup and structure
├── style.css         # Modern styling, glassmorphism, responsive grid & tokens
├── script.js         # Reactive simulator, ROI calculator, pricing switch, theme toggle
└── README.md         # Documentation
```

## Running the Website

You can open `index.html` directly in any web browser, or serve it locally:

```powershell
cd C:\Users\shyam\.gemini\antigravity\scratch\nova-ai-website
python -m http.server 3001
```
