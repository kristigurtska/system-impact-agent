# System Impact Agent

An AI-powered system impact analysis agent built with **LangChain, Ollama, Llama 3.2, Python, and FastAPI**.

The project helps users understand software architecture by showing what happens when a service fails.

Instead of only asking:

> *How does the Payments service work?*

the user can ask:

> **What happens if Payments goes down?**

The agent analyzes the system's service dependencies and identifies which services are directly affected. It then explains the dependency, possible user impact, and a practical troubleshooting step.


## Example

**Question:**

> What happens if Payments goes down?

**Result:**

```text
FAILED SERVICE
Payments

DIRECTLY AFFECTED
API Gateway

WHY
The API Gateway depends on the Payments service to process
payment-related requests.

IMPACT
Users may be unable to complete payment transactions.

NEXT STEP
Check the Payments service health and recent errors.
```

## How It Works

The project follows a simple principle:

> **The Python tools determine the facts; the LLM explains the facts.**

The system architecture is represented in `architecture.json`.

The Python tools in `tools.py` analyze this architecture. For example, `trace_impact()` identifies services that directly depend on a failed service.

The LangChain agent in `agent.py` connects the tools with the Llama 3.2 model running locally through Ollama and determines how to use the available tools based on the user's question.

FastAPI provides the backend API that connects the frontend with the agent.

The frontend uses HTML, CSS, and JavaScript to provide the interactive interface and visualize the analysis.

### Architecture

```text
User
  ↓
Frontend
  ↓
FastAPI
  ↓
LangChain Agent
  ↓
Llama 3.2 / Ollama
  ↓
Python Tools
  ↓
architecture.json
```

## Technologies

* **Python** — application and analysis logic
* **LangChain** — AI agent orchestration and tool integration
* **Llama 3.2** — language model
* **Ollama** — local LLM runtime
* **FastAPI** — backend API
* **Pydantic** — request validation
* **HTML / CSS / JavaScript** — frontend
* **JSON** — system architecture representation

## Features

* Analyze the impact of service failures
* Identify directly affected services
* Explain service dependencies
* Provide a likely user-facing impact
* Suggest a practical troubleshooting step
* Visualize affected services
* Run the LLM locally through Ollama
* Use Python tools as a factual source instead of relying on the LLM to guess dependencies

## Project Structure

```text
system-impact-agent/
│
├── README.md
│
└── app/
    ├── agent.py
    ├── tools.py
    ├── architecture.json
    ├── server.py
    ├── main.py
    │
    └── frontend/
        ├── index.html
        ├── style.css
        └── script.js
```

### File Responsibilities

| File                | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `agent.py`          | Creates the LangChain agent and defines its behavior    |
| `tools.py`          | Contains Python tools for analyzing the architecture    |
| `architecture.json` | Stores the example system architecture and dependencies |
| `server.py`         | FastAPI backend connecting the frontend to the agent    |
| `main.py`           | Command-line interface for testing                      |
| `index.html`        | Frontend structure                                      |
| `style.css`         | Frontend styling                                        |
| `script.js`         | Frontend interaction and visualization                  |

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd system-impact-agent
```

### 2. Install Python dependencies

```bash
pip install langchain langchain-ollama fastapi uvicorn pydantic
```

### 3. Install Ollama

Install Ollama and download the Llama 3.2 model:

```bash
ollama pull llama3.2
```

Make sure Ollama is running before starting the application.

### 4. Start the FastAPI server

From the `app` directory:

```bash
cd app
python -m uvicorn server:app --host 127.0.0.1 --port 8000
```

The API will run at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 5. Open the frontend

Open the frontend and use the **Analyze** button to send questions to the agent.

## Example Questions

```text
What happens if Payments goes down?

What happens if Loans goes down?

What happens if Keycloak goes down?

What happens if the Database goes down?

Which services directly depend on the Database?
```

## Why Ollama?

The project uses **Ollama** to run Llama 3.2 locally instead of relying on an external LLM API.

This makes the project suitable for experimenting with system-analysis scenarios where architecture information could potentially be sensitive. With a local model, the architecture information does not need to be sent to an external LLM API.

