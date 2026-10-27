import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import api from "../services/api";

function StudentDetails() {
  const { id } = useParams();

  const [studentData, setStudentData] = useState(null);
  const [risk, setRisk] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const [studentRes, riskRes, interventionRes] =
        await Promise.all([
          api.get(`/students/${id}`),
          api.get(`/students/${id}/risk`),
          api.get(`/interventions/students/${id}`)
        ]);

      setStudentData(studentRes.data);
      setRisk(riskRes.data);
      setInterventions(interventionRes.data);
    } catch (error) {
      console.error("Failed to fetch student data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const generateIntervention = async () => {
    try {
      setActionLoading(true);
      setMessage("");

      const response = await api.post(
        `/interventions/students/${id}/generate`
      );

      setMessage(response.data.message);

      await fetchData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to generate intervention"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const approveIntervention = async (interventionId) => {
    try {
      setActionLoading(true);
      setMessage("");

      const response = await api.patch(
        `/interventions/${interventionId}/approve`
      );

      setMessage(response.data.message);

      await fetchData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to approve intervention"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const rejectIntervention = async (interventionId) => {
    try {
      setActionLoading(true);
      setMessage("");

      const response = await api.patch(
        `/interventions/${interventionId}/reject`
      );

      setMessage(response.data.message);

      await fetchData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to reject intervention"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <StudentStyles />

        <div className="student-loading">
          <div className="student-loader"></div>

          <h2>Loading Student Profile</h2>

          <p>
            Analysing performance and intervention history...
          </p>
        </div>
      </>
    );
  }

  if (!studentData || !studentData.student) {
    return (
      <>
        <StudentStyles />

        <div className="student-not-found">
          <div>!</div>

          <h2>Student not found</h2>

          <p>
            The requested student profile could not be loaded.
          </p>
        </div>
      </>
    );
  }

  const student = studentData.student;

  const pendingIntervention = interventions.find(
    (item) => item.status === "PENDING"
  );

  const getRiskClass = () => {
    if (risk?.level === "HIGH") {
      return "student-risk student-risk-high";
    }

    if (risk?.level === "MEDIUM") {
      return "student-risk student-risk-medium";
    }

    return "student-risk student-risk-low";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusClass = (status) => {
    if (status === "COMPLETED") {
      return "student-status student-status-completed";
    }

    if (status === "PENDING") {
      return "student-status student-status-pending";
    }

    if (status === "APPROVED") {
      return "student-status student-status-approved";
    }

    if (status === "REJECTED") {
      return "student-status student-status-rejected";
    }

    return "student-status";
  };

  const getOutcomeClass = (outcome) => {
    if (outcome === "IMPROVED") {
      return "student-outcome student-outcome-good";
    }

    if (outcome === "WORSENED") {
      return "student-outcome student-outcome-bad";
    }

    if (outcome === "NO_CHANGE") {
      return "student-outcome student-outcome-neutral";
    }

    return "student-outcome student-outcome-pending";
  };

  return (
    <>
      <StudentStyles />

      <div className="student-page">

        {/* HERO */}

        <section className="student-hero">

          <div className="student-hero-profile">

            <div className="student-avatar-large">
              {getInitials(student.name)}
            </div>

            <div>

              <div className="student-hero-label">
                ✦ STUDENT INTELLIGENCE PROFILE
              </div>

              <h1>
                {student.name}
              </h1>

              <div className="student-meta">

                <span>
                  {student.rollNumber}
                </span>

                <span className="student-meta-dot">
                  •
                </span>

                <span>
                  {student.className}
                </span>

              </div>

            </div>

          </div>


          <div className="student-risk-box">

            <span className="student-risk-label">
              CURRENT RISK SCORE
            </span>

            <div className="student-risk-score">
              {risk?.score ?? 0}
              <span>/100</span>
            </div>

            <div className={getRiskClass()}>
              <span></span>
              {risk?.level || "LOW"} RISK
            </div>

          </div>

        </section>


        {/* QUICK SUMMARY */}

        <section className="student-summary-grid">

          <div className="student-summary-card">

            <div className="student-summary-icon student-purple">
              ◈
            </div>

            <div>
              <span>
                Risk Score
              </span>

              <h2>
                {risk?.score ?? 0}
              </h2>

              <p>
                Current calculated risk
              </p>
            </div>

          </div>


          <div className="student-summary-card">

            <div className="student-summary-icon student-blue">
              ◐
            </div>

            <div>
              <span>
                Weekly Records
              </span>

              <h2>
                {studentData.metrics.length}
              </h2>

              <p>
                Performance data points
              </p>
            </div>

          </div>


          <div className="student-summary-card">

            <div className="student-summary-icon student-orange">
              →
            </div>

            <div>
              <span>
                Interventions
              </span>

              <h2>
                {interventions.length}
              </h2>

              <p>
                Recorded strategies
              </p>
            </div>

          </div>


          <div className="student-summary-card">

            <div className="student-summary-icon student-green">
              ✓
            </div>

            <div>
              <span>
                Current Status
              </span>

              <h3>
                {pendingIntervention
                  ? "Action Required"
                  : "Monitoring"}
              </h3>

              <p>
                Intervention workflow state
              </p>
            </div>

          </div>

        </section>


        {/* RISK REASONS */}

        <section className="student-panel">

          <div className="student-panel-header">

            <div>

              <div className="student-section-label">
                RISK EXPLANATION
              </div>

              <h2>
                Why was this student flagged?
              </h2>

              <p>
                Transparent factors contributing to the
                current risk level.
              </p>

            </div>

            <div className={getRiskClass()}>
              <span></span>
              {risk?.level || "LOW"}
            </div>

          </div>


          {risk?.reasons?.length > 0 ? (

            <div className="student-reasons-grid">

              {risk.reasons.map((reason, index) => (

                <div
                  className="student-reason-card"
                  key={index}
                >

                  <div className="student-reason-number">
                    {index + 1}
                  </div>

                  <p>
                    {reason}
                  </p>

                </div>

              ))}

            </div>

          ) : (

            <div className="student-empty">

              <div>✓</div>

              <h3>
                No major risk signals
              </h3>

              <p>
                Current performance indicators are within
                the expected range.
              </p>

            </div>

          )}

        </section>


        {/* PERFORMANCE TREND */}

        <section className="student-panel">

          <div className="student-panel-header">

            <div>

              <div className="student-section-label">
                PERFORMANCE MONITORING
              </div>

              <h2>
                Weekly Performance Trend
              </h2>

              <p>
                Attendance and marks progression across
                recorded weeks.
              </p>

            </div>

            <div className="student-live-badge">
              <span></span>
              Live Trend
            </div>

          </div>


          <div className="student-chart-wrapper">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={studentData.metrics}
                margin={{
                  top: 20,
                  right: 30,
                  left: 5,
                  bottom: 15
                }}
              >

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#e9edf5"
                />

                <XAxis
                  dataKey="week"
                  tick={{
                    fontSize: 11,
                    fill: "#64748b"
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{
                    fontSize: 11,
                    fill: "#94a3b8"
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow:
                      "0 12px 30px rgba(15,23,42,0.12)",
                    fontSize: "12px"
                  }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#4f46e5"
                  }}
                  activeDot={{
                    r: 7
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="marks"
                  name="Marks"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#16a34a"
                  }}
                  activeDot={{
                    r: 7
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* AI INTERVENTION PLANNER */}

        <section className="student-ai-panel">

          <div className="student-ai-header">

            <div className="student-ai-icon">
              AI
            </div>

            <div>

              <span>
                ADAPTIVE INTELLIGENCE
              </span>

              <h2>
                AI Intervention Planner
              </h2>

              <p>
                Generates an intervention using risk signals,
                performance trends and previous outcomes.
              </p>

            </div>

          </div>


          {!pendingIntervention && (

            <button
              className="student-generate-button"
              onClick={generateIntervention}
              disabled={actionLoading}
            >

              <span>
                ✦
              </span>

              {actionLoading
                ? "Generating Recommendation..."
                : "Generate AI Intervention"}

            </button>

          )}


          {message && (

            <div className="student-message">

              <div>
                ✓
              </div>

              <span>
                {message}
              </span>

            </div>

          )}


          {pendingIntervention && (

            <div className="student-recommendation">

              <div className="student-recommendation-top">

                <div>

                  <span className="student-ai-recommendation-badge">
                    ✦ AI RECOMMENDATION
                  </span>

                  <h2>
                    {pendingIntervention.type}
                  </h2>

                </div>

                <span className="student-status student-status-pending">
                  PENDING
                </span>

              </div>


              <div className="student-recommendation-grid">

                <div>

                  <span>
                    REASON
                  </span>

                  <p>
                    {pendingIntervention.reason}
                  </p>

                </div>


                <div>

                  <span>
                    ASSIGNED TO
                  </span>

                  <strong>
                    {pendingIntervention.owner}
                  </strong>

                </div>


                <div>

                  <span>
                    DEADLINE
                  </span>

                  <strong>
                    {pendingIntervention.deadlineDays} days
                  </strong>

                </div>

              </div>


              <div className="student-action-buttons">

                <button
                  className="student-approve-button"
                  disabled={actionLoading}
                  onClick={() =>
                    approveIntervention(
                      pendingIntervention._id
                    )
                  }
                >
                  <span>✓</span>
                  Approve Intervention
                </button>


                <button
                  className="student-reject-button"
                  disabled={actionLoading}
                  onClick={() =>
                    rejectIntervention(
                      pendingIntervention._id
                    )
                  }
                >
                  <span>×</span>
                  Reject
                </button>

              </div>

            </div>

          )}

        </section>


        {/* WEEKLY DATA */}

        <section className="student-panel">

          <div className="student-panel-header">

            <div>

              <div className="student-section-label">
                PERFORMANCE DATA
              </div>

              <h2>
                Weekly Performance Records
              </h2>

              <p>
                Detailed student metrics used by the risk
                assessment system.
              </p>

            </div>

          </div>


          <div className="student-table-wrapper">

            <table className="student-table">

              <thead>

                <tr>
                  <th>Week</th>
                  <th>Attendance</th>
                  <th>Marks</th>
                  <th>Assignments</th>
                </tr>

              </thead>


              <tbody>

                {studentData.metrics.map((metric) => (

                  <tr key={metric._id}>

                    <td>

                      <div className="student-week">
                        W{metric.week}
                      </div>

                    </td>


                    <td>

                      <div className="student-metric-cell">

                        <strong>
                          {metric.attendance}%
                        </strong>

                        <div className="student-mini-track">

                          <div
                            style={{
                              width: `${Math.min(
                                metric.attendance,
                                100
                              )}%`
                            }}
                          ></div>

                        </div>

                      </div>

                    </td>


                    <td>

                      <strong className="student-marks">
                        {metric.marks}
                      </strong>

                    </td>


                    <td>

                      <span className="student-assignment-badge">
                        {metric.assignmentsCompleted}/
                        {metric.totalAssignments}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* INTERVENTION HISTORY */}

        <section className="student-panel">

          <div className="student-panel-header">

            <div>

              <div className="student-section-label">
                ADAPTIVE HISTORY
              </div>

              <h2>
                Intervention History
              </h2>

              <p>
                Previous recommendations and recorded
                outcomes for this student.
              </p>

            </div>

            <div className="student-history-count">
              {interventions.length} Records
            </div>

          </div>


          {interventions.length === 0 ? (

            <div className="student-empty">

              <div>◈</div>

              <h3>
                No intervention history
              </h3>

              <p>
                Generated interventions will appear here.
              </p>

            </div>

          ) : (

            <div className="student-history-list">

              {interventions.map((item, index) => (

                <div
                  key={item._id}
                  className="student-history-card"
                >

                  <div className="student-history-number">
                    {interventions.length - index}
                  </div>


                  <div className="student-history-content">

                    <div className="student-history-top">

                      <div>

                        <h3>
                          {item.type}
                        </h3>

                        <span>
                          Intervention Strategy
                        </span>

                      </div>

                      <span
                        className={getStatusClass(
                          item.status
                        )}
                      >
                        {item.status}
                      </span>

                    </div>


                    <p className="student-history-reason">
                      {item.reason}
                    </p>


                    <div className="student-history-footer">

                      <div>

                        <span>
                          OWNER
                        </span>

                        <strong>
                          {item.owner}
                        </strong>

                      </div>


                      <div>

                        <span>
                          OUTCOME
                        </span>

                        <strong
                          className={getOutcomeClass(
                            item.outcome
                          )}
                        >
                          {item.outcome ||
                            "NOT EVALUATED"}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        <div className="student-footer-note">

          <span></span>

          Risk and intervention information is updated from
          the student's latest performance records.

        </div>

      </div>
    </>
  );
}


function StudentStyles() {
  return (
    <style>{`

      .student-page {
        max-width: 1440px;
        margin: 0 auto;
        padding: 34px 34px 70px;
        color: #172033;
      }


      /* HERO */

      .student-hero {
        position: relative;
        overflow: hidden;

        display: flex;
        justify-content: space-between;
        align-items: center;

        gap: 30px;

        padding: 36px 40px;

        margin-bottom: 28px;

        border-radius: 24px;

        color: white;

        background:
          radial-gradient(
            circle at 80% 20%,
            rgba(129,140,248,0.35),
            transparent 35%
          ),
          linear-gradient(
            135deg,
            #111827 0%,
            #312e81 55%,
            #4338ca 100%
          );

        box-shadow:
          0 24px 60px
          rgba(49,46,129,0.18);
      }


      .student-hero::after {
        content: "";

        position: absolute;

        width: 260px;
        height: 260px;

        right: -100px;
        bottom: -150px;

        border-radius: 50%;

        background:
          rgba(255,255,255,0.07);
      }


      .student-hero > div {
        position: relative;
        z-index: 2;
      }


      .student-hero-profile {
        display: flex;
        align-items: center;

        gap: 20px;
      }


      .student-avatar-large {
        width: 76px;
        height: 76px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 22px;

        background:
          rgba(255,255,255,0.14);

        border:
          1px solid rgba(255,255,255,0.18);

        color: white;

        font-size: 22px;
        font-weight: 900;

        backdrop-filter: blur(10px);

        box-shadow:
          0 12px 30px
          rgba(0,0,0,0.15);
      }


      .student-hero-label {
        margin-bottom: 8px;

        color: #c7d2fe;

        font-size: 10px;
        font-weight: 850;

        letter-spacing: 1.6px;
      }


      .student-hero h1 {
        margin: 0;

        font-size:
          clamp(30px,4vw,46px);

        letter-spacing: -1.2px;
      }


      .student-meta {
        display: flex;
        align-items: center;

        gap: 8px;

        margin-top: 9px;

        color: #d7dcf8;

        font-size: 12px;
      }


      .student-meta-dot {
        color: #818cf8;
      }


      .student-risk-box {
        min-width: 175px;

        padding: 20px;

        border-radius: 18px;

        text-align: center;

        background:
          rgba(255,255,255,0.10);

        border:
          1px solid rgba(255,255,255,0.14);

        backdrop-filter:
          blur(10px);
      }


      .student-risk-label {
        display: block;

        margin-bottom: 7px;

        color: #c7d2fe;

        font-size: 8px;

        font-weight: 850;

        letter-spacing: 1.2px;
      }


      .student-risk-score {
        margin-bottom: 9px;

        font-size: 34px;

        font-weight: 900;
      }


      .student-risk-score span {
        margin-left: 3px;

        color: #a5b4fc;

        font-size: 11px;

        font-weight: 500;
      }



      /* RISK BADGES */

      .student-risk {
        display: inline-flex;
        align-items: center;

        gap: 7px;

        padding: 7px 11px;

        border-radius: 999px;

        font-size: 9px;
        font-weight: 900;

        letter-spacing: 0.5px;
      }


      .student-risk span {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: currentColor;
      }


      .student-risk-high {
        color: #b91c1c;
        background: #fee2e2;
      }


      .student-risk-medium {
        color: #b45309;
        background: #fef3c7;
      }


      .student-risk-low {
        color: #15803d;
        background: #dcfce7;
      }



      /* SUMMARY */

      .student-summary-grid {
        display: grid;

        grid-template-columns:
          repeat(4,minmax(0,1fr));

        gap: 18px;

        margin-bottom: 28px;
      }


      .student-summary-card {
        display: flex;

        gap: 14px;

        padding: 21px;

        border-radius: 18px;

        background: white;

        border:
          1px solid #e7ebf2;

        box-shadow:
          0 8px 30px
          rgba(15,23,42,0.055);

        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }


      .student-summary-card:hover {
        transform:
          translateY(-3px);

        box-shadow:
          0 16px 38px
          rgba(15,23,42,0.09);
      }


      .student-summary-icon {
        width: 44px;
        height: 44px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 13px;

        font-weight: 900;
      }


      .student-purple {
        background: #eef2ff;
        color: #4f46e5;
      }


      .student-blue {
        background: #eff6ff;
        color: #2563eb;
      }


      .student-orange {
        background: #fff7ed;
        color: #ea580c;
      }


      .student-green {
        background: #f0fdf4;
        color: #16a34a;
      }


      .student-summary-card span {
        display: block;

        color: #64748b;

        font-size: 11px;
        font-weight: 750;
      }


      .student-summary-card h2 {
        margin: 5px 0 3px;

        color: #0f172a;

        font-size: 28px;
      }


      .student-summary-card h3 {
        margin: 7px 0 3px;

        color: #172033;

        font-size: 15px;
      }


      .student-summary-card p {
        margin: 0;

        color: #9aa4b4;

        font-size: 9px;
      }



      /* PANELS */

      .student-panel {
        overflow: hidden;

        margin-bottom: 24px;

        border-radius: 20px;

        background: white;

        border:
          1px solid #e7ebf2;

        box-shadow:
          0 12px 40px
          rgba(15,23,42,0.055);
      }


      .student-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 20px;

        padding: 25px 28px;

        border-bottom:
          1px solid #edf0f5;
      }


      .student-section-label {
        margin-bottom: 6px;

        color: #6366f1;

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 1.6px;
      }


      .student-panel-header h2 {
        margin: 0;

        color: #172033;

        font-size: 21px;
      }


      .student-panel-header p {
        margin: 7px 0 0;

        color: #8993a6;

        font-size: 11px;
      }



      /* REASONS */

      .student-reasons-grid {
        display: grid;

        grid-template-columns:
          repeat(2,minmax(0,1fr));

        gap: 15px;

        padding: 24px;
      }


      .student-reason-card {
        display: flex;
        align-items: flex-start;

        gap: 12px;

        padding: 16px;

        border-radius: 13px;

        background: #fafbff;

        border:
          1px solid #e7eaf2;
      }


      .student-reason-number {
        width: 28px;
        height: 28px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 8px;

        background: #fee2e2;

        color: #b91c1c;

        font-size: 10px;

        font-weight: 900;
      }


      .student-reason-card p {
        margin: 2px 0 0;

        color: #64748b;

        font-size: 12px;

        line-height: 1.5;
      }



      /* LIVE */

      .student-live-badge {
        display: flex;
        align-items: center;

        gap: 7px;

        padding: 8px 11px;

        border-radius: 999px;

        background: #f0fdf4;

        border: 1px solid #bbf7d0;

        color: #15803d;

        font-size: 9px;

        font-weight: 850;
      }


      .student-live-badge span {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: #22c55e;

        box-shadow:
          0 0 0 4px
          rgba(34,197,94,0.10);
      }



      /* CHART */

      .student-chart-wrapper {
        width: 100%;
        height: 390px;

        padding: 25px 20px 10px;
      }



      /* AI PANEL */

      .student-ai-panel {
        margin-bottom: 24px;

        padding: 27px;

        border-radius: 20px;

        color: white;

        background:
          radial-gradient(
            circle at 85% 20%,
            rgba(167,139,250,0.25),
            transparent 35%
          ),
          linear-gradient(
            135deg,
            #1e1b4b,
            #312e81
          );

        box-shadow:
          0 16px 45px
          rgba(49,46,129,0.15);
      }


      .student-ai-header {
        display: flex;
        align-items: center;

        gap: 15px;

        margin-bottom: 22px;
      }


      .student-ai-icon {
        width: 48px;
        height: 48px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 14px;

        background:
          rgba(255,255,255,0.13);

        font-size: 11px;

        font-weight: 900;
      }


      .student-ai-header span {
        display: block;

        color: #a5b4fc;

        font-size: 8px;

        font-weight: 900;

        letter-spacing: 1.4px;
      }


      .student-ai-header h2 {
        margin: 5px 0;

        font-size: 21px;
      }


      .student-ai-header p {
        margin: 0;

        color: #c7d2fe;

        font-size: 11px;
      }


      .student-generate-button {
        display: inline-flex;
        align-items: center;

        gap: 8px;

        padding: 12px 17px;

        border: none;

        border-radius: 10px;

        background: white;

        color: #312e81;

        font-size: 11px;

        font-weight: 850;

        cursor: pointer;

        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }


      .student-generate-button:hover:not(:disabled) {
        transform:
          translateY(-2px);

        box-shadow:
          0 10px 25px
          rgba(0,0,0,0.20);
      }


      .student-generate-button:disabled {
        opacity: 0.7;

        cursor: wait;
      }



      /* MESSAGE */

      .student-message {
        display: flex;
        align-items: center;

        gap: 9px;

        margin-top: 16px;

        padding: 11px 13px;

        border-radius: 10px;

        background:
          rgba(255,255,255,0.10);

        color: #e0e7ff;

        font-size: 11px;
      }


      .student-message div {
        width: 23px;
        height: 23px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: #22c55e;

        color: white;

        font-size: 10px;
      }



      /* RECOMMENDATION */

      .student-recommendation {
        margin-top: 20px;

        padding: 20px;

        border-radius: 16px;

        background:
          rgba(255,255,255,0.08);

        border:
          1px solid rgba(255,255,255,0.13);
      }


      .student-recommendation-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        gap: 15px;

        margin-bottom: 17px;
      }


      .student-ai-recommendation-badge {
        display: block;

        margin-bottom: 7px;

        color: #a5b4fc;

        font-size: 8px;

        font-weight: 900;

        letter-spacing: 1.2px;
      }


      .student-recommendation h2 {
        margin: 0;

        font-size: 22px;
      }


      .student-recommendation-grid {
        display: grid;

        grid-template-columns:
          2fr 1fr 1fr;

        gap: 12px;
      }


      .student-recommendation-grid > div {
        padding: 13px;

        border-radius: 10px;

        background:
          rgba(255,255,255,0.06);
      }


      .student-recommendation-grid span {
        display: block;

        margin-bottom: 6px;

        color: #a5b4fc;

        font-size: 7px;

        font-weight: 900;

        letter-spacing: 1px;
      }


      .student-recommendation-grid p {
        margin: 0;

        color: #e0e7ff;

        font-size: 11px;

        line-height: 1.5;
      }


      .student-recommendation-grid strong {
        font-size: 11px;
      }


      .student-action-buttons {
        display: flex;

        gap: 10px;

        margin-top: 18px;
      }


      .student-approve-button,
      .student-reject-button {
        display: flex;
        align-items: center;

        gap: 7px;

        padding: 10px 15px;

        border: none;

        border-radius: 9px;

        font-size: 10px;

        font-weight: 850;

        cursor: pointer;
      }


      .student-approve-button {
        background: #22c55e;

        color: white;
      }


      .student-reject-button {
        background:
          rgba(255,255,255,0.10);

        color: #fecaca;

        border:
          1px solid rgba(254,202,202,0.20);
      }



      /* STATUS */

      .student-status {
        display: inline-flex;

        padding: 6px 9px;

        border-radius: 999px;

        font-size: 8px;

        font-weight: 900;

        letter-spacing: 0.5px;
      }


      .student-status-completed {
        color: #15803d;

        background: #dcfce7;
      }


      .student-status-pending {
        color: #b45309;

        background: #fef3c7;
      }


      .student-status-approved {
        color: #1d4ed8;

        background: #dbeafe;
      }


      .student-status-rejected {
        color: #b91c1c;

        background: #fee2e2;
      }



      /* TABLE */

      .student-table-wrapper {
        width: 100%;

        overflow-x: auto;
      }


      .student-table {
        width: 100%;

        border-collapse: collapse;
      }


      .student-table th {
        padding: 14px 20px;

        text-align: left;

        background: #f8fafc;

        border-bottom:
          1px solid #e9edf3;

        color: #7b8798;

        font-size: 10px;

        font-weight: 850;

        letter-spacing: 0.5px;

        text-transform: uppercase;
      }


      .student-table td {
        padding: 16px 20px;

        border-bottom:
          1px solid #f0f2f6;

        color: #475569;

        font-size: 12px;
      }


      .student-table tbody tr:hover {
        background: #fafbff;
      }


      .student-week {
        width: 35px;
        height: 35px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 9px;

        background: #eef2ff;

        color: #4338ca;

        font-size: 10px;

        font-weight: 900;
      }


      .student-metric-cell {
        min-width: 130px;
      }


      .student-metric-cell strong {
        display: block;

        margin-bottom: 6px;
      }


      .student-mini-track {
        width: 100%;
        height: 4px;

        overflow: hidden;

        border-radius: 40px;

        background: #edf0f5;
      }


      .student-mini-track div {
        height: 100%;

        border-radius: 40px;

        background:
          linear-gradient(
            90deg,
            #818cf8,
            #4f46e5
          );
      }


      .student-marks {
        color: #334155;
      }


      .student-assignment-badge {
        display: inline-block;

        padding: 6px 9px;

        border-radius: 8px;

        background: #f8fafc;

        color: #475569;

        font-weight: 800;
      }



      /* HISTORY */

      .student-history-count {
        padding: 7px 10px;

        border-radius: 9px;

        background: #f8fafc;

        border: 1px solid #e5eaf1;

        color: #64748b;

        font-size: 9px;

        font-weight: 850;
      }


      .student-history-list {
        padding: 24px;
      }


      .student-history-card {
        display: flex;

        gap: 15px;

        padding: 16px 0;

        border-bottom:
          1px solid #edf0f5;
      }


      .student-history-card:last-child {
        border-bottom: none;
      }


      .student-history-number {
        width: 34px;
        height: 34px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 10px;

        background: #eef2ff;

        color: #4338ca;

        font-size: 10px;

        font-weight: 900;
      }


      .student-history-content {
        flex: 1;
      }


      .student-history-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        gap: 15px;
      }


      .student-history-top h3 {
        margin: 0;

        color: #172033;

        font-size: 14px;
      }


      .student-history-top div > span {
        display: block;

        margin-top: 3px;

        color: #a0a9b7;

        font-size: 9px;
      }


      .student-history-reason {
        margin: 10px 0;

        color: #64748b;

        font-size: 11px;

        line-height: 1.5;
      }


      .student-history-footer {
        display: flex;

        gap: 25px;
      }


      .student-history-footer > div > span {
        display: block;

        margin-bottom: 4px;

        color: #94a3b8;

        font-size: 7px;

        font-weight: 900;

        letter-spacing: 0.8px;
      }


      .student-history-footer strong {
        color: #475569;

        font-size: 10px;
      }



      /* OUTCOME */

      .student-outcome {
        display: inline-block;

        padding: 4px 7px;

        border-radius: 6px;

        font-size: 8px !important;

        font-weight: 900 !important;
      }


      .student-outcome-good {
        color: #15803d !important;

        background: #dcfce7;
      }


      .student-outcome-bad {
        color: #b91c1c !important;

        background: #fee2e2;
      }


      .student-outcome-neutral {
        color: #475569 !important;

        background: #f1f5f9;
      }


      .student-outcome-pending {
        color: #7c3aed !important;

        background: #ede9fe;
      }



      /* EMPTY */

      .student-empty {
        padding: 45px 20px;

        text-align: center;
      }


      .student-empty > div {
        width: 45px;
        height: 45px;

        margin: auto;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 13px;

        color: #4f46e5;

        background: #eef2ff;

        font-weight: 900;
      }


      .student-empty h3 {
        margin: 12px 0 5px;

        color: #334155;
      }


      .student-empty p {
        margin: 0;

        color: #94a3b8;

        font-size: 10px;
      }



      /* FOOTER */

      .student-footer-note {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 7px;

        margin-top: 18px;

        color: #94a3b8;

        font-size: 9px;
      }


      .student-footer-note span {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: #22c55e;
      }



      /* LOADING */

      .student-loading,
      .student-not-found {
        min-height: 70vh;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        text-align: center;

        color: #334155;
      }


      .student-loading p,
      .student-not-found p {
        margin-top: 5px;

        color: #94a3b8;

        font-size: 11px;
      }


      .student-loader {
        width: 42px;
        height: 42px;

        margin-bottom: 15px;

        border-radius: 50%;

        border: 4px solid #e0e7ff;

        border-top-color: #4f46e5;

        animation:
          student-spin 0.8s linear infinite;
      }


      .student-not-found > div {
        width: 45px;
        height: 45px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 13px;

        color: #b91c1c;

        background: #fee2e2;

        font-weight: 900;
      }


      @keyframes student-spin {
        to {
          transform: rotate(360deg);
        }
      }



      /* RESPONSIVE */

      @media (max-width: 1050px) {

        .student-summary-grid {
          grid-template-columns:
            repeat(2,1fr);
        }

        .student-recommendation-grid {
          grid-template-columns:
            1fr 1fr;
        }

      }


      @media (max-width: 750px) {

        .student-page {
          padding:
            20px 14px 50px;
        }

        .student-hero {
          flex-direction: column;

          align-items: flex-start;

          padding:
            27px 22px;
        }

        .student-hero-profile {
          align-items: flex-start;
        }

        .student-risk-box {
          width: 100%;
        }

        .student-summary-grid {
          grid-template-columns:
            1fr;
        }

        .student-panel-header {
          flex-direction: column;

          align-items: flex-start;
        }

        .student-reasons-grid {
          grid-template-columns:
            1fr;

          padding: 15px;
        }

        .student-chart-wrapper {
          height: 340px;
        }

        .student-recommendation-grid {
          grid-template-columns:
            1fr;
        }

        .student-action-buttons {
          flex-direction: column;
        }

        .student-approve-button,
        .student-reject-button {
          justify-content: center;
        }

        .student-history-top {
          flex-direction: column;
        }

        .student-history-footer {
          flex-direction: column;

          gap: 10px;
        }

      }

    `}</style>
  );
}

export default StudentDetails;