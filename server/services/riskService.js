function calculateRisk(metrics) {
  let score = 0;
  const reasons = [];

  // Metrics should be ordered week 1 -> latest week
  const latest = metrics[metrics.length - 1];
  const first = metrics[0];

  // Current attendance
  if (latest.attendance < 75) {
    score += 30;
    reasons.push("Attendance is below 75%");
  }

  // Current marks
  if (latest.marks < 60) {
    score += 25;
    reasons.push("Marks are below 60%");
  }

  // Assignment completion
  const completionRate =
    latest.assignmentsCompleted / latest.totalAssignments;

  if (completionRate < 0.7) {
    score += 20;
    reasons.push("Assignment completion is below 70%");
  }

  // Attendance trend
  const attendanceDrop =
    first.attendance - latest.attendance;

  if (attendanceDrop >= 10) {
    score += 15;
    reasons.push(
      `Attendance dropped by ${attendanceDrop} percentage points`
    );
  }

  // Marks trend
  const marksDrop =
    first.marks - latest.marks;

  if (marksDrop >= 10) {
    score += 10;
    reasons.push(
      `Marks dropped by ${marksDrop} points`
    );
  }

  // Maximum score = 100
  score = Math.min(score, 100);

  let level = "LOW";

  if (score >= 70) {
    level = "HIGH";
  } else if (score >= 40) {
    level = "MEDIUM";
  }

  return {
    score,
    level,
    reasons
  };
}

module.exports = {
  calculateRisk
};