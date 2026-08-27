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
│   │   ├── userModel.js<br>
│   │   ├── startupModel.js<br>
│   │   ├── challengeModel.js<br>
│   │   ├── applicationModel.js<br>
│   │   ├── pilotModel.js<br>
│   │   ├── milestoneModel.js<br>
│   │   └── ...<br>
│   │<br>
│   ├── controllers/      # Request/response handling only — thin, no business logic<br>
│   │   ├── authController.js<br>
│   │   ├── challengeController.js<br>
│   │   ├── applicationController.js<br>
│   │   ├── evaluationController.js<br>
│   │   ├── pilotController.js<br>
│   │   └── ...<br>
│   │<br>
│   ├── services/         # ⭐ Business logic lives here — THIS is what saves you<br>
│   │   ├── matchingService.js       # AI-based startup-challenge matching<br>
│   │   ├── eligibilityService.js    # relaxed criteria logic<br>
│   │   ├── evaluationService.js     # weighted scoring calculations<br>
│   │   ├── pilotService.js          # state machine transitions<br>
│   │   ├── documentService.js       # template generation (PDF/docx)<br>
│   │   ├── aiService.js             # all LLM API calls, centralized<br>
│   │   └── auditService.js          # writes to audit_logs on every action<br>
│   │<br>
│   ├── routes/            # Just endpoint → controller mapping, nothing else<br>
│   │   ├── authRoutes.js<br>
│   │   ├── challengeRoutes.js<br>
│   │   ├── applicationRoutes.js<br>
│   │   ├── pilotRoutes.js<br>
│   │   └── index.js       # combines all routes<br>
│   │<br>
│   ├── middleware/<br>
│   │   ├── authMiddleware.js        # JWT verification<br>
│   │   ├── roleMiddleware.js        # RBAC (dept_admin, evaluator, etc.)<br>
│   │   └── errorHandlerMiddleware.js<br>
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
