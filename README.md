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
server/
├── src/
│   ├── models/           # DB schema/ORM models (1 file per table)
│   │   ├── user.model.js
│   │   ├── startup.model.js
│   │   ├── challenge.model.js
│   │   ├── application.model.js
│   │   ├── pilot.model.js
│   │   ├── milestone.model.js
│   │   └── ...
│   │
│   ├── controllers/      # Request/response handling only — thin, no business logic
│   │   ├── auth.controller.js
│   │   ├── challenge.controller.js
│   │   ├── application.controller.js
│   │   ├── evaluation.controller.js
│   │   ├── pilot.controller.js
│   │   └── ...
│   │
│   ├── services/         # ⭐ Business logic lives here — THIS is what saves you
│   │   ├── matching.service.js       # AI-based startup-challenge matching
│   │   ├── eligibility.service.js    # relaxed criteria logic
│   │   ├── evaluation.service.js     # weighted scoring calculations
│   │   ├── pilot.service.js          # state machine transitions
│   │   ├── document.service.js       # template generation (PDF/docx)
│   │   ├── ai.service.js             # all LLM API calls, centralized
│   │   └── audit.service.js          # writes to audit_logs on every action
│   │
│   ├── routes/            # Just endpoint → controller mapping, nothing else
│   │   ├── auth.routes.js
│   │   ├── challenge.routes.js
│   │   ├── application.routes.js
│   │   ├── pilot.routes.js
│   │   └── index.js       # combines all routes
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── role.middleware.js        # RBAC (dept_admin, evaluator, etc.)
│   │   └── errorHandler.middleware.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── utils/
│   │   ├── stateMachine.js           # generic status transition validator
│   │   └── responseFormatter.js
│   │
│   └── app.js
│
├── seed/
│   └── seed.sql
├── .env
└── package.json