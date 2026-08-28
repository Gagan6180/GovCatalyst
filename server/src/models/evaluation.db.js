/**
 * GovCatalyst — Expert Evaluation DB Model
 * Raw pg-pool queries for the human review layer.
 *
 * Tables consumed:
 *   evaluation_criteria        — scoring rubric per challenge
 *   evaluation_assignments     — maps evaluator → application
 *   evaluation_scores          — per-criterion score by each evaluator
 *   evaluation_panel_decisions — aggregated panel recommendation
 *   evaluation_appeals         — startup appeal on rejection
 */

const pool = require('../config/db');

// ─────────────────────────────────────────
// EVALUATION CRITERIA  (rubric per challenge)
// ─────────────────────────────────────────
const EvaluationCriteria = {
  /** Create a single criterion for a challenge */
  async create({ challengeId, criterionName, description, weight, maxScore, category, sortOrder }) {
    const { rows } = await pool.query(
      `INSERT INTO evaluation_criteria
         (challenge_id, criterion_name, description, weight, max_score, category, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        challengeId, criterionName, description || null,
        weight, maxScore || 10,
        category || 'Technical', sortOrder || 0
      ]
    );
    return rows[0];
  },

  /** Bulk-create the default 5-criterion rubric for a challenge */
  async seedDefaults(challengeId) {
    const defaults = [
      { name: 'Technical Feasibility',    desc: 'How technically sound and viable is the proposed solution?', weight: 25, category: 'Technical',      order: 1 },
      { name: 'Innovation & Novelty',     desc: 'Does the solution offer a novel approach to the problem?',   weight: 20, category: 'Innovation',     order: 2 },
      { name: 'Alignment with Outcomes',  desc: 'How closely does the proposal address the stated outcome statement?', weight: 25, category: 'Outcome', order: 3 },
      { name: 'Cost Effectiveness',       desc: 'Is the proposed cost reasonable and justified?',             weight: 15, category: 'Financial',     order: 4 },
      { name: 'Scalability & Replication',desc: 'Can the solution scale across districts or departments?',    weight: 15, category: 'Scalability',   order: 5 },
    ];

    const results = [];
    for (const d of defaults) {
      const { rows } = await pool.query(
        `INSERT INTO evaluation_criteria
           (challenge_id, criterion_name, description, weight, max_score, category, sort_order)
         VALUES ($1,$2,$3,$4,10,$5,$6)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        [challengeId, d.name, d.desc, d.weight, d.category, d.order]
      );
      if (rows[0]) results.push(rows[0]);
    }
    return results;
  },

  /** Get all criteria for a challenge, ordered by sort_order */
  async findByChallenge(challengeId) {
    const { rows } = await pool.query(
      `SELECT * FROM evaluation_criteria
       WHERE challenge_id = $1 AND is_active = true
       ORDER BY sort_order, created_at`,
      [challengeId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM evaluation_criteria WHERE id = $1', [id]
    );
    return rows[0] || null;
  },

  async update(id, { criterionName, description, weight, maxScore, category, isActive }) {
    const { rows } = await pool.query(
      `UPDATE evaluation_criteria
       SET criterion_name = COALESCE($1, criterion_name),
           description    = COALESCE($2, description),
           weight         = COALESCE($3, weight),
           max_score      = COALESCE($4, max_score),
           category       = COALESCE($5, category),
           is_active      = COALESCE($6, is_active),
           updated_at     = now()
       WHERE id = $7 RETURNING *`,
      [criterionName, description, weight, maxScore, category, isActive, id]
    );
    return rows[0];
  },

  async delete(id) {
    await pool.query(
      'UPDATE evaluation_criteria SET is_active = false, updated_at = now() WHERE id = $1', [id]
    );
  }
};

// ─────────────────────────────────────────
// EVALUATION ASSIGNMENTS  (who reviews what)
// ─────────────────────────────────────────
const EvaluationAssignment = {
  /** Assign an evaluator to an application */
  async create({ applicationId, evaluatorId, assignedBy, dueDate }) {
    const { rows } = await pool.query(
      `INSERT INTO evaluation_assignments
         (application_id, evaluator_id, assigned_by, due_date, status)
       VALUES ($1, $2, $3, $4, 'pending')
       ON CONFLICT (application_id, evaluator_id) DO UPDATE
         SET status = 'pending', due_date = EXCLUDED.due_date, assigned_at = now()
       RETURNING *`,
      [applicationId, evaluatorId, assignedBy, dueDate || null]
    );
    return rows[0];
  },

  /** Get all assignments for an application (with evaluator name/email) */
  async findByApplication(applicationId) {
    const { rows } = await pool.query(
      `SELECT ea.*,
              u.name  AS evaluator_name,
              u.email AS evaluator_email,
              u.designation AS evaluator_designation
       FROM evaluation_assignments ea
       JOIN users u ON ea.evaluator_id = u.id
       WHERE ea.application_id = $1
       ORDER BY ea.assigned_at`,
      [applicationId]
    );
    return rows;
  },

  /** Get all pending/active assignments for an evaluator */
  async findByEvaluator(evaluatorId) {
    const { rows } = await pool.query(
      `SELECT ea.*,
              a.proposal_summary,
              a.match_score      AS ai_score,
              c.title            AS challenge_title,
              c.sector,
              s.company_name     AS startup_name,
              s.dpiit_reg_number
       FROM evaluation_assignments ea
       JOIN applications a ON ea.application_id = a.id
       JOIN challenges   c ON a.challenge_id    = c.id
       JOIN startups     s ON a.startup_id      = s.id
       WHERE ea.evaluator_id = $1
       ORDER BY ea.due_date NULLS LAST, ea.assigned_at`,
      [evaluatorId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT ea.*, u.name AS evaluator_name, u.email AS evaluator_email
       FROM evaluation_assignments ea
       JOIN users u ON ea.evaluator_id = u.id
       WHERE ea.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  /** Mark assignment as in_progress (evaluator opened the form) */
  async startReview(id) {
    const { rows } = await pool.query(
      `UPDATE evaluation_assignments
       SET status = 'in_progress', updated_at = now()
       WHERE id = $1 AND status = 'pending'
       RETURNING *`,
      [id]
    );
    return rows[0];
  },

  /** Mark assignment as submitted after all scores entered */
  async markSubmitted(id) {
    const { rows } = await pool.query(
      `UPDATE evaluation_assignments
       SET status = 'submitted', submitted_at = now()
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return rows[0];
  },

  /** Declare conflict of interest — withdraws the assignment */
  async declareConflict(id, reason) {
    const { rows } = await pool.query(
      `UPDATE evaluation_assignments
       SET status = 'withdrawn', conflict_of_interest = true, coi_reason = $1
       WHERE id = $2
       RETURNING *`,
      [reason, id]
    );
    return rows[0];
  },

  /** Count submitted assignments for an application */
  async countSubmitted(applicationId) {
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS submitted_count,
              (SELECT COUNT(*) FROM evaluation_assignments WHERE application_id = $1) AS total_count
       FROM evaluation_assignments
       WHERE application_id = $1 AND status = 'submitted'`,
      [applicationId]
    );
    return {
      submitted: parseInt(rows[0].submitted_count),
      total:     parseInt(rows[0].total_count),
    };
  }
};

// ─────────────────────────────────────────
// EVALUATION SCORES  (per-criterion, per-evaluator)
// ─────────────────────────────────────────
const EvaluationScore = {
  /** Upsert a score for one criterion by one evaluator */
  async upsert({ applicationId, evaluatorId, criterionId, assignmentId, score, comments, justification }) {
    const { rows } = await pool.query(
      `INSERT INTO evaluation_scores
         (application_id, evaluator_id, criterion_id, assignment_id, score, comments, justification)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (application_id, evaluator_id, criterion_id)
       DO UPDATE SET
         score         = EXCLUDED.score,
         comments      = EXCLUDED.comments,
         justification = EXCLUDED.justification,
         assignment_id = EXCLUDED.assignment_id
       RETURNING *`,
      [applicationId, evaluatorId, criterionId, assignmentId || null,
       score, comments || null, justification || null]
    );
    return rows[0];
  },

  /** Submit all criteria scores in one transaction */
  async submitAll(applicationId, evaluatorId, assignmentId, scoresArray) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const saved = [];
      for (const s of scoresArray) {
        const { rows } = await client.query(
          `INSERT INTO evaluation_scores
             (application_id, evaluator_id, criterion_id, assignment_id, score, comments, justification)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (application_id, evaluator_id, criterion_id)
           DO UPDATE SET score=$5, comments=$6, justification=$7, assignment_id=$4
           RETURNING *`,
          [applicationId, evaluatorId, s.criterionId, assignmentId,
           s.score, s.comments || null, s.justification || null]
        );
        saved.push(rows[0]);
      }
      await client.query('COMMIT');
      return saved;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /** Get all scores for an application (grouped by evaluator) */
  async findByApplication(applicationId) {
    const { rows } = await pool.query(
      `SELECT es.*,
              ec.criterion_name,
              ec.weight,
              ec.max_score,
              ec.category,
              u.name  AS evaluator_name,
              u.email AS evaluator_email
       FROM evaluation_scores es
       JOIN evaluation_criteria ec ON es.criterion_id = ec.id
       JOIN users               u  ON es.evaluator_id  = u.id
       WHERE es.application_id = $1
       ORDER BY u.name, ec.sort_order`,
      [applicationId]
    );
    return rows;
  },

  /** Get scores submitted by one evaluator for one application */
  async findByEvaluatorAndApplication(evaluatorId, applicationId) {
    const { rows } = await pool.query(
      `SELECT es.*, ec.criterion_name, ec.weight, ec.max_score, ec.category, ec.sort_order
       FROM evaluation_scores es
       JOIN evaluation_criteria ec ON es.criterion_id = ec.id
       WHERE es.evaluator_id = $1 AND es.application_id = $2
       ORDER BY ec.sort_order`,
      [evaluatorId, applicationId]
    );
    return rows;
  },

  /**
   * Calculate weighted score for one evaluator.
   * Formula: Σ (score / max_score * weight) for each criterion
   */
  async calcWeightedScore(evaluatorId, applicationId) {
    const { rows } = await pool.query(
      `SELECT
         ROUND(
           SUM( (es.score / ec.max_score) * ec.weight )::numeric, 2
         ) AS weighted_score,
         COUNT(*) AS criteria_scored
       FROM evaluation_scores es
       JOIN evaluation_criteria ec ON es.criterion_id = ec.id
       WHERE es.evaluator_id = $1 AND es.application_id = $2`,
      [evaluatorId, applicationId]
    );
    return {
      weightedScore:   parseFloat(rows[0]?.weighted_score  || 0),
      criteriaScored:  parseInt(rows[0]?.criteria_scored   || 0),
    };
  }
};

// ─────────────────────────────────────────
// PANEL DECISIONS  (final aggregated decision)
// ─────────────────────────────────────────
const PanelDecision = {
  /**
   * Compute and upsert a panel decision from all submitted evaluator scores.
   * Called by dept_admin once all assignments are submitted.
   */
  async computeAndSave({ applicationId, finalizedBy, panelSummary }) {
    // Aggregate avg weighted score across all submitted evaluators
    const { rows: agg } = await pool.query(
      `SELECT
         COUNT(DISTINCT es.evaluator_id)::int                           AS evaluator_count,
         ROUND(AVG(sub.weighted_score)::numeric, 2)                     AS avg_weighted_score
       FROM evaluation_assignments ea
       JOIN LATERAL (
         SELECT ROUND(SUM((es2.score / ec.max_score) * ec.weight)::numeric, 2) AS weighted_score
         FROM evaluation_scores es2
         JOIN evaluation_criteria ec ON es2.criterion_id = ec.id
         WHERE es2.application_id = ea.application_id
           AND es2.evaluator_id   = ea.evaluator_id
       ) sub ON true
       JOIN evaluation_scores es ON es.evaluator_id = ea.evaluator_id
                                 AND es.application_id = ea.application_id
       WHERE ea.application_id = $1 AND ea.status = 'submitted'`,
      [applicationId]
    );

    const avgScore  = parseFloat(agg[0]?.avg_weighted_score || 0);
    const evalCount = parseInt(agg[0]?.evaluator_count      || 0);

    // Recommendation thresholds (out of 100 weighted points)
    let recommendation = 'REJECT';
    if (avgScore >= 75)      recommendation = 'APPROVE';
    else if (avgScore >= 55) recommendation = 'CONDITIONAL';

    const { rows } = await pool.query(
      `INSERT INTO evaluation_panel_decisions
         (application_id, evaluator_count, avg_weighted_score, panel_recommendation,
          panel_summary, finalized_at, finalized_by)
       VALUES ($1, $2, $3, $4, $5, now(), $6)
       ON CONFLICT (application_id) DO UPDATE SET
         evaluator_count      = EXCLUDED.evaluator_count,
         avg_weighted_score   = EXCLUDED.avg_weighted_score,
         panel_recommendation = EXCLUDED.panel_recommendation,
         panel_summary        = EXCLUDED.panel_summary,
         finalized_at         = now(),
         finalized_by         = EXCLUDED.finalized_by,
         updated_at           = now()
       RETURNING *`,
      [applicationId, evalCount, avgScore, recommendation,
       panelSummary || null, finalizedBy]
    );
    return { ...rows[0], avgScore, recommendation };
  },

  /** Apply a dept_admin override over the panel decision */
  async override({ applicationId, overrideDecision, overrideReason, overrideBy }) {
    const { rows } = await pool.query(
      `UPDATE evaluation_panel_decisions
       SET is_overridden     = true,
           override_decision = $1,
           override_reason   = $2,
           override_by       = $3,
           override_at       = now(),
           updated_at        = now()
       WHERE application_id = $4
       RETURNING *`,
      [overrideDecision, overrideReason, overrideBy, applicationId]
    );
    return rows[0];
  },

  async findByApplication(applicationId) {
    const { rows } = await pool.query(
      `SELECT pd.*,
              u1.name AS finalized_by_name,
              u2.name AS override_by_name
       FROM evaluation_panel_decisions pd
       LEFT JOIN users u1 ON pd.finalized_by = u1.id
       LEFT JOIN users u2 ON pd.override_by  = u2.id
       WHERE pd.application_id = $1`,
      [applicationId]
    );
    return rows[0] || null;
  }
};

// ─────────────────────────────────────────
// APPEALS
// ─────────────────────────────────────────
const EvaluationAppeal = {
  async create({ applicationId, startupId, appealReason, supportingDocs }) {
    const { rows } = await pool.query(
      `INSERT INTO evaluation_appeals
         (application_id, startup_id, appeal_reason, supporting_docs, status)
       VALUES ($1, $2, $3, $4, 'pending')
       ON CONFLICT (application_id) DO UPDATE SET
         appeal_reason   = EXCLUDED.appeal_reason,
         supporting_docs = EXCLUDED.supporting_docs,
         status          = 'pending',
         submitted_at    = now()
       RETURNING *`,
      [applicationId, startupId, appealReason, supportingDocs || null]
    );
    return rows[0];
  },

  async findByApplication(applicationId) {
    const { rows } = await pool.query(
      'SELECT * FROM evaluation_appeals WHERE application_id = $1', [applicationId]
    );
    return rows[0] || null;
  },

  async findAllPending() {
    const { rows } = await pool.query(
      `SELECT ea.*,
              s.company_name AS startup_name,
              a.match_score  AS ai_score,
              c.title        AS challenge_title
       FROM evaluation_appeals ea
       JOIN startups     s ON ea.startup_id      = s.id
       JOIN applications a ON ea.application_id  = a.id
       JOIN challenges   c ON a.challenge_id     = c.id
       WHERE ea.status = 'pending'
       ORDER BY ea.submitted_at`
    );
    return rows;
  },

  async review({ applicationId, status, reviewedBy, reviewNotes }) {
    const { rows } = await pool.query(
      `UPDATE evaluation_appeals
       SET status      = $1,
           reviewed_by = $2,
           review_notes= $3,
           reviewed_at = now()
       WHERE application_id = $4
       RETURNING *`,
      [status, reviewedBy, reviewNotes || null, applicationId]
    );
    return rows[0];
  }
};

module.exports = { EvaluationCriteria, EvaluationAssignment, EvaluationScore, PanelDecision, EvaluationAppeal };
