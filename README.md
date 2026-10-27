# EduAdapt AI — Adaptive Student Intervention System

An AI-assisted student support platform that identifies academically at-risk students, explains the reasons behind their risk, recommends appropriate interventions, coordinates follow-up tasks, monitors outcomes, and adapts future recommendations based on previous results.

## Problem

Educational institutions often identify struggling students only after their attendance, marks, or academic performance have already declined significantly.

EduAdapt AI focuses on early intervention.

Instead of only displaying student performance, the system follows a continuous adaptive cycle:

**Observe → Assess Risk → Plan Intervention → Coordinate → Monitor Outcome → Learn → Adjust**

## Key Features

### Student Risk Detection

The system continuously evaluates student performance using:

- Attendance
- Marks
- Assignment completion
- Attendance trend
- Marks trend

Students are classified into:

- LOW Risk
- MEDIUM Risk
- HIGH Risk

The system also explains why a student has been flagged.

### AI Intervention Planner

For at-risk students, the application uses a Groq-hosted `openai/gpt-oss-120b` model to generate an intervention recommendation.

Possible interventions include:

- Mentor Meeting
- Peer Tutoring
- Remedial Class
- Parent Contact
- Counsellor Referral

The AI receives:

- Current risk score
- Risk level
- Reasons for risk
- Previous intervention history
- Previous intervention outcomes

This allows future recommendations to consider what previously worked or failed.

### Human-in-the-Loop Approval

AI recommendations are not executed automatically.

A teacher or administrator can:

- Approve an intervention
- Reject an intervention

This keeps the system explainable and human-controlled.

### Intervention Task Board

Approved interventions automatically create actionable tasks containing:

- Student
- Intervention
- Assigned owner
- Deadline
- Status

Tasks can be:

- PENDING
- OVERDUE
- COMPLETED

Expired pending tasks are automatically marked as overdue.

### Weekly Outcome Simulation

The prototype includes an **Advance One Week** feature.

It simulates the next student-performance cycle and allows the complete adaptive workflow to be demonstrated during a short hackathon presentation.

After a simulated week, the system evaluates whether the intervention resulted in:

- IMPROVED
- NO_CHANGE
- WORSENED

The student's risk is then recalculated.

### Intervention Analytics

The analytics dashboard tracks intervention effectiveness using historical outcomes.

For each intervention type, the system shows:

- Total completed interventions
- Improved outcomes
- Worsened outcomes
- No-change outcomes
- Effectiveness percentage

### Performance Visualization

Individual student profiles include weekly attendance and marks trend charts, making performance decline or recovery visually understandable.

### Search and Risk Filtering

The dashboard supports:

- Student-name search
- Roll-number search
- Class search
- Risk-level filtering
- Automatic risk-priority sorting

## Agentic AI Approach

EduAdapt AI currently uses a human-in-the-loop agentic workflow rather than an external multi-agent framework.

The workflow is:

1. Observe student performance.
2. Calculate risk using deterministic rules.
3. Send risk context and intervention history to the LLM.
4. Generate an intervention plan.
5. Ask a human to approve or reject the recommendation.
6. Convert approved interventions into tasks.
7. Monitor future student performance.
8. Evaluate the intervention outcome.
9. Use historical outcomes during future intervention planning.

The intervention planner is powered by the Groq API using the `openai/gpt-oss-120b` model.

## Technology Stack

### Frontend

- React
- Vite
- Axios
- React Router
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- Mongoose

### Database

- MongoDB Atlas

### AI

- Groq API
- `openai/gpt-oss-120b`

## Project Structure

```text
adaptive-student-intervention-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── seed/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Backend Architecture

### Models

The application uses four primary MongoDB models:

**Student**

Stores student identity and current risk state.

**Metric**

Stores weekly attendance, marks, and assignment completion.

**Intervention**

Stores AI recommendations, approval status, ownership, deadlines, and outcomes.

**Task**

Stores actionable tasks created after interventions are approved.

### Services

**Risk Service**

Uses deterministic and explainable rules to calculate student risk.

**LLM Service**

Communicates with Groq to generate intervention recommendations using the student's risk context and intervention history.

### Controllers

Controllers handle:

- Student retrieval
- Risk calculation
- Intervention generation
- Intervention approval/rejection
- Task management
- Weekly simulation
- Intervention analytics

## Risk Assessment

The current prototype uses an explainable rule-based risk engine.

Risk indicators include:

- Attendance below 75%
- Marks below 60
- Assignment completion below 70%
- Attendance decline of at least 10 percentage points
- Marks decline of at least 10 points

Risk levels are classified as:

```text
0–39   → LOW
40–69  → MEDIUM
70–100 → HIGH
```

This approach was selected for the prototype so every risk decision remains transparent and explainable.

## Synthetic Demo Dataset

The prototype uses synthetic student information instead of real student data.

The seed script generates 50 demo students with deliberately planted performance patterns representing:

- High-risk students
- Medium-risk students
- Low-risk students

Synthetic data allows the system to demonstrate realistic behaviour without exposing real student information.

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd adaptive-student-intervention-system
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

Seed the demo database:

```bash
node seed/seedStudents.js
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## Demo Flow

A recommended demonstration sequence is:

1. Open the student-risk dashboard.
2. Select a HIGH-risk student.
3. Show the student's declining performance graph.
4. Explain the risk reasons.
5. Generate an AI intervention.
6. Approve the recommendation.
7. Open the Task Board.
8. Show the generated intervention task.
9. Advance one simulated week.
10. Return to the student's profile.
11. Show the recorded intervention outcome.
12. Generate another intervention if required.
13. Demonstrate how intervention history influences future recommendations.
14. Open Analytics to show intervention effectiveness.

## Why MERN?

MERN was selected because the project requires a responsive data-driven dashboard, multiple REST APIs, frequently changing student metrics, flexible intervention records, and easy AI-service integration.

Using JavaScript across the frontend and backend also accelerated hackathon development and simplified integration.

## Privacy and Safety

The prototype:

- Uses synthetic student data.
- Does not expose real student records.
- Keeps AI recommendations subject to human approval.
- Provides explainable risk reasons.
- Keeps API keys and database credentials in environment variables.

Secrets must never be committed to the repository.

## Future Improvements

Potential future extensions include:

- Integration with real institutional student-management systems
- Authentication and role-based access control
- Teacher, counsellor, and administrator accounts
- Notifications and automated escalation
- Machine-learning-based risk prediction
- Intervention effectiveness by student profile
- Bias and fairness monitoring
- Real-time institutional analytics
- More sophisticated agent orchestration
- Automated intervention scheduling
- Production-grade audit logs

## Current Prototype

The current hackathon prototype demonstrates the complete adaptive intervention lifecycle:

**Student Data → Risk Detection → Explanation → AI Planning → Human Approval → Task Coordination → Outcome Monitoring → Learning → Updated Intervention Strategy**