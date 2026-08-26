# govCatalyst

*From government challenges to Startup solution*

## Project Structure
- **Frontend**: The frontend files should be added in the `client` folder.
- **Backend**: The backend files should be added in the `server` folder.

## Branching Guidelines
Branches should follow this naming convention: `<fe|be>/feat: <feature name>`
- `fe`: Frontend
- `be`: Backend

**Example:**
- `be/feat: authentication` (for a backend authentication feature)
- `fe/feat: login-page` (for a frontend login page feature)

**Backend-Structure:**
<br>
server/<br>
├── src/<br>
│   ├── models/           # DB schema/ORM models (1 file per table)<br>
│   │   ├── user.model.js<br>
│   │   ├── startup.model.js<br>
│   │   ├── challenge.model.js<br>
│   │   ├── application.model.js<br>
│   │   ├── pilot.model.js<br>
│   │   ├── milestone.model.js<br>
│   │   └── ...<br>
│   │<br>
│   ├── controllers/      # Request/response handling only — thin, no business logic<br>
│   │   ├── auth.controller.js<br>
│   │   ├── challenge.controller.js<br>
│   │   ├── application.controller.js<br>
│   │   ├── evaluation.controller.js<br>
│   │   ├── pilot.controller.js<br>
│   │   └── ...<br>
│   │<br>
│   ├── services/         # ⭐ Business logic lives here — THIS is what saves you<br>
│   │   ├── matching.service.js       # AI-based startup-challenge matching<br>
│   │   ├── eligibility.service.js    # relaxed criteria logic<br>
│   │   ├── evaluation.service.js     # weighted scoring calculations<br>
│   │   ├── pilot.service.js          # state machine transitions<br>
│   │   ├── document.service.js       # template generation (PDF/docx)<br>
│   │   ├── ai.service.js             # all LLM API calls, centralized<br>
│   │   └── audit.service.js          # writes to audit_logs on every action<br>
│   │<br>
│   ├── routes/            # Just endpoint → controller mapping, nothing else<br>
│   │   ├── auth.routes.js<br>
│   │   ├── challenge.routes.js<br>
│   │   ├── application.routes.js<br>
│   │   ├── pilot.routes.js<br>
│   │   └── index.js       # combines all routes<br>
│   │<br>
│   ├── middleware/<br>
│   │   ├── auth.middleware.js        # JWT verification<br>
│   │   ├── role.middleware.js        # RBAC (dept_admin, evaluator, etc.)<br>
│   │   └── errorHandler.middleware.js<br>
│   │<br>
│   ├── config/<br>
│   │   ├── db.js<br>
│   │   └── env.js<br>
│   │<br>
│   ├── utils/<br>
│   │   ├── stateMachine.js           # generic status transition validator<br>
│   │   └── responseFormatter.js<br>
│   │<br>
│   └── app.js<br>
│<br>
├── seed/<br>
│   └── seed.sql<br>
├── .env<br>
└── package.json<br>
