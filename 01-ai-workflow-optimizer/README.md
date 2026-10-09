# AI Agent Workflow Optimizer

A sleek, responsive web application for benchmarking and optimizing AI agent workflows, managing execution constraints, and filtering pipelines.

## Project Structure
```
ai-workflow-optimizer/
├── index.html        # Main HTML markup with form, filters, and feedback area
├── style.css         # Modern dark-mode UI with glowing badges and card layouts
├── script.js         # Reactive state, constraints enforcement, and filtering
└── README.md         # Documentation and instructions
```

## Features & Constraints

1. **Unique Constraint (Category & Task)**:
   - Prevents duplicate workflow tasks within the same category to ensure prompt and pipeline uniqueness.
   - Cleans and deduplicates comma-separated tag sets.
2. **Clear Feedback Area**:
   - Explicit feedback banner with distinct state stylings (`success`, `error`, `info`).
   - Auto-clears after 4.5 seconds or can be dismissed manually.
3. **Multi-Faceted Filtering**:
   - Filter by categories (`Data Analysis`, `Automation`, `Customer Support`, `Research`).
   - Filter by specific tag pills (`#optimized`, `#urgent`, etc.).
   - Interactive tag clicking on cards directly triggers filter views.
4. **Local Persistence & Stats**:
   - Saves all workflows to browser `localStorage`.
   - Real-time calculation of total workflows and average speedup percentage.

## How to Run

1. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari).
2. Alternatively, serve via a local server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
