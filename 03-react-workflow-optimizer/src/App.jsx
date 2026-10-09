import React, { useState, useEffect } from 'react';
import './App.css';

const INITIAL_WORKFLOWS = [
  { id: 1, task: "Get weather and summarize news", category: "Automation", tags: ["optimized", "weather"], time: "40% faster" },
  { id: 2, task: "Analyze customer emails", category: "Customer Support", tags: ["urgent", "email"], time: "60% faster" },
  { id: 3, task: "Sales trend regression report", category: "Data Analysis", tags: ["optimized", "data"], time: "55% faster" }
];

export default function App() {
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [feedback, setFeedback] = useState({ show: false, msg: '', type: '' });
  const [filter, setFilter] = useState({ type: 'all', value: '' });

  // Auto-dismiss feedback after 4 seconds
  useEffect(() => {
    if (feedback.show) {
      const timer = setTimeout(() => {
        setFeedback({ show: false, msg: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const showFeedback = (msg, type = 'error') => {
    setFeedback({ show: true, msg, type });
  };

  const handleSaveWorkflow = (e) => {
    e.preventDefault();

    // 1. Validation
    if (!task.trim()) {
      showFeedback("Please enter a task description.", "error");
      return;
    }
    if (!category) {
      showFeedback("Please select a category.", "error");
      return;
    }

    // Process tags (trim and deduplicate)
    const tags = Array.from(
      new Set(
        tagInput
          .split(',')
          .map(t => t.trim().toLowerCase())
          .filter(Boolean)
      )
    );

    // 2. Unique Constraint: Check for duplicate task in the same category
    const isDuplicate = workflows.some(
      w => w.task.toLowerCase() === task.trim().toLowerCase() && w.category === category
    );

    if (isDuplicate) {
      showFeedback(`A task named "${task.trim()}" already exists under "${category}".`, "error");
      return;
    }

    // 3. Create optimized entry
    const simulatedOptimization = `${Math.floor(Math.random() * 35) + 35}% faster`;
    const newWorkflow = {
      id: Date.now(),
      task: task.trim(),
      category,
      tags: tags.length ? tags : ['unclassified'],
      time: simulatedOptimization
    };

    setWorkflows([newWorkflow, ...workflows]);
    setTask('');
    setCategory('');
    setTagInput('');
    showFeedback(`Workflow optimized successfully! (${simulatedOptimization})`, "success");
  };

  const handleDelete = (id) => {
    setWorkflows(workflows.filter(w => w.id !== id));
    showFeedback("Workflow removed.", "info");
  };

  // Filter logic
  const filteredWorkflows = workflows.filter(w => {
    if (filter.type === 'category') return w.category === filter.value;
    if (filter.type === 'tag') return w.tags.includes(filter.value.toLowerCase());
    return true;
  });

  return (
    <div className="container">
      <header className="header">
        <h1>AI Agent Workflow Optimizer</h1>
        <p className="subtitle">Streamline agent task pipelines, reduce latency, and track speedups.</p>
      </header>

      {/* Input Form */}
      <form className="form-box" onSubmit={handleSaveWorkflow}>
        <div className="input-group">
          <input
            type="text"
            id="taskInput"
            placeholder="Enter task (e.g., Get weather report)"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>

        <div className="input-row">
          <select
            id="categoryInput"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Research">Research</option>
            <option value="Automation">Automation</option>
          </select>

          <input
            type="text"
            id="tagInput"
            placeholder="Add tags (comma-separated, e.g., urgent, weather)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />

          <button type="submit" className="btn-primary">Optimize &amp; Save</button>
        </div>
      </form>

      {/* Clear Feedback Banner */}
      {feedback.show && (
        <div className={`feedback-box feedback-${feedback.type}`}>
          <span>{feedback.msg}</span>
          <button className="feedback-close" onClick={() => setFeedback({ show: false, msg: '', type: '' })}>
            &times;
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="filter-box">
        <h3>Organize by:</h3>
        <div className="filter-buttons">
          <button
            className={filter.type === 'all' ? 'active' : ''}
            onClick={() => setFilter({ type: 'all', value: '' })}
          >
            Show All ({workflows.length})
          </button>
          <button
            className={filter.type === 'category' && filter.value === 'Data Analysis' ? 'active' : ''}
            onClick={() => setFilter({ type: 'category', value: 'Data Analysis' })}
          >
            Data Analysis
          </button>
          <button
            className={filter.type === 'category' && filter.value === 'Automation' ? 'active' : ''}
            onClick={() => setFilter({ type: 'category', value: 'Automation' })}
          >
            Automation
          </button>
          <button
            className={filter.type === 'tag' && filter.value === 'optimized' ? 'active' : ''}
            onClick={() => setFilter({ type: 'tag', value: 'optimized' })}
          >
            Tag: #optimized
          </button>
          <button
            className={filter.type === 'tag' && filter.value === 'urgent' ? 'active' : ''}
            onClick={() => setFilter({ type: 'tag', value: 'urgent' })}
          >
            Tag: #urgent
          </button>
        </div>
      </div>

      {/* Workflow List */}
      <div id="workflowList" className="workflow-list">
        {filteredWorkflows.length === 0 ? (
          <div className="empty-state">No matching workflows found.</div>
        ) : (
          filteredWorkflows.map(item => (
            <div key={item.id} className="workflow-card">
              <div className="card-header">
                <span className="category-badge">{item.category}</span>
                <span className="speedup-badge">{item.time}</span>
              </div>
              <h4 className="card-task">{item.task}</h4>
              <div className="card-footer">
                <div className="tag-list">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="tag-pill"
                      onClick={() => setFilter({ type: 'tag', value: t })}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  className="btn-delete"
                  title="Remove workflow"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
