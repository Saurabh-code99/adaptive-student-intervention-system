import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const advanceWeek = async () => {
    try {
      setAdvancing(true);

      await api.post("/simulation/advance-week");

      alert("One simulated week completed successfully.");

      await fetchStudents();
    } catch (error) {
      console.error("Failed to advance week:", error);

      alert(
        error.response?.data?.message ||
          "Failed to advance week."
      );
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardStyles />

        <div className="dash-loading-wrapper">
          <div className="dash-loader"></div>

          <h2>Loading Dashboard</h2>

          <p>Analysing student performance...</p>
        </div>
      </>
    );
  }

  const totalStudents = students.length;

  const highRisk = students.filter(
    (student) => student.currentRiskLevel === "HIGH"
  ).length;

  const mediumRisk = students.filter(
    (student) => student.currentRiskLevel === "MEDIUM"
  ).length;

  const lowRisk = students.filter(
    (student) => student.currentRiskLevel === "LOW"
  ).length;

  const getRiskBadge = (level) => {
    if (level === "HIGH") {
      return "dash-risk-badge dash-risk-high";
    }

    if (level === "MEDIUM") {
      return "dash-risk-badge dash-risk-medium";
    }

    return "dash-risk-badge dash-risk-low";
  };

  const getRiskBarClass = (level) => {
    if (level === "HIGH") {
      return "dash-risk-progress dash-progress-high";
    }

    if (level === "MEDIUM") {
      return "dash-risk-progress dash-progress-medium";
    }

    return "dash-risk-progress dash-progress-low";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <DashboardStyles />

      <div className="dash-page">

        {/* HERO */}

        <section className="dash-hero">

          <div className="dash-hero-content">

            <div className="dash-small-label">
              ✦ EDUADAPT INTELLIGENCE
            </div>

            <h1>
              Student Intervention
              <span> Dashboard</span>
            </h1>

            <p>
              Monitor student performance, identify emerging risks
              and coordinate timely interventions from one intelligent
              workspace.
            </p>

          </div>

          <div className="dash-hero-action">

            <div className="dash-system-status">
              <span className="dash-live-dot"></span>
              System Active
            </div>

            <button
              className="dash-advance-button"
              onClick={advanceWeek}
              disabled={advancing}
            >
              <span className="dash-button-icon">
                {advancing ? "↻" : "→"}
              </span>

              {advancing
                ? "Advancing Week..."
                : "Advance One Week"}
            </button>

          </div>

        </section>


        {/* STAT CARDS */}

        <section className="dash-stats-grid">

          <div className="dash-stat-card dash-total-card">

            <div className="dash-stat-top">

              <div>
                <span className="dash-stat-label">
                  Total Students
                </span>

                <h2>{totalStudents}</h2>
              </div>

              <div className="dash-stat-icon">
                👥
              </div>

            </div>

            <div className="dash-stat-footer">
              Currently monitored students
            </div>

          </div>


          <div className="dash-stat-card dash-high-card">

            <div className="dash-stat-top">

              <div>
                <span className="dash-stat-label">
                  High Risk
                </span>

                <h2>{highRisk}</h2>
              </div>

              <div className="dash-stat-icon">
                !
              </div>

            </div>

            <div className="dash-stat-footer">
              Requires immediate attention
            </div>

          </div>


          <div className="dash-stat-card dash-medium-card">

            <div className="dash-stat-top">

              <div>
                <span className="dash-stat-label">
                  Medium Risk
                </span>

                <h2>{mediumRisk}</h2>
              </div>

              <div className="dash-stat-icon">
                ◐
              </div>

            </div>

            <div className="dash-stat-footer">
              Needs active monitoring
            </div>

          </div>


          <div className="dash-stat-card dash-low-card">

            <div className="dash-stat-top">

              <div>
                <span className="dash-stat-label">
                  Low Risk
                </span>

                <h2>{lowRisk}</h2>
              </div>

              <div className="dash-stat-icon">
                ✓
              </div>

            </div>

            <div className="dash-stat-footer">
              Performing within safe range
            </div>

          </div>

        </section>


        {/* TABLE PANEL */}

        <section className="dash-panel">

          <div className="dash-panel-header">

            <div>
              <div className="dash-section-label">
                LIVE MONITORING
              </div>

              <h2>Student Risk Overview</h2>

              <p>
                Review individual risk levels and open detailed
                performance profiles.
              </p>
            </div>

            <div className="dash-student-count">
              {totalStudents} Students
            </div>

          </div>


          <div className="dash-table-container">

            <table className="dash-table">

              <thead>

                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Class</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {students.map((student) => (

                  <tr key={student._id}>

                    {/* STUDENT */}

                    <td>

                      <div className="dash-student-info">

                        <div className="dash-avatar">
                          {getInitials(student.name)}
                        </div>

                        <div>
                          <div className="dash-student-name">
                            {student.name}
                          </div>

                          <div className="dash-student-sub">
                            Student Profile
                          </div>
                        </div>

                      </div>

                    </td>


                    {/* ROLL */}

                    <td>

                      <span className="dash-roll-number">
                        {student.rollNumber}
                      </span>

                    </td>


                    {/* CLASS */}

                    <td>
                      {student.className}
                    </td>


                    {/* SCORE */}

                    <td>

                      <div className="dash-score-wrapper">

                        <div className="dash-score-number">
                          {student.currentRiskScore}
                          <span>/100</span>
                        </div>

                        <div className="dash-progress-track">

                          <div
                            className={getRiskBarClass(
                              student.currentRiskLevel
                            )}
                            style={{
                              width: `${Math.min(
                                student.currentRiskScore,
                                100
                              )}%`
                            }}
                          ></div>

                        </div>

                      </div>

                    </td>


                    {/* LEVEL */}

                    <td>

                      <span
                        className={getRiskBadge(
                          student.currentRiskLevel
                        )}
                      >
                        <span className="dash-badge-dot"></span>

                        {student.currentRiskLevel}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <Link
                        className="dash-profile-link"
                        to={`/students/${student._id}`}
                      >
                        View Profile
                        <span>→</span>
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {students.length === 0 && (

              <div className="dash-empty-state">

                <div className="dash-empty-icon">
                  👥
                </div>

                <h3>No students available</h3>

                <p>
                  Student records will appear here once available.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* FOOT NOTE */}

        <div className="dash-footer-note">

          <span>●</span>

          Risk information is continuously recalculated from
          student performance data.

        </div>

      </div>
    </>
  );
}


function DashboardStyles() {
  return (
    <style>{`

      .dash-page {
        max-width: 1440px;
        margin: 0 auto;
        padding: 34px 34px 70px;
        color: #172033;
      }


      /* HERO */

      .dash-hero {
        position: relative;
        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 30px;

        padding: 38px 42px;

        margin-bottom: 28px;

        border-radius: 24px;

        color: white;

        background:
          radial-gradient(
            circle at 80% 20%,
            rgba(129, 140, 248, 0.35),
            transparent 35%
          ),
          linear-gradient(
            135deg,
            #111827 0%,
            #312e81 55%,
            #4338ca 100%
          );

        box-shadow:
          0 24px 60px rgba(49, 46, 129, 0.20);
      }


      .dash-hero::before {
        content: "";

        position: absolute;

        width: 260px;
        height: 260px;

        right: -90px;
        bottom: -140px;

        border-radius: 50%;

        background:
          rgba(255, 255, 255, 0.08);
      }


      .dash-hero-content {
        position: relative;
        z-index: 2;

        max-width: 750px;
      }


      .dash-small-label {
        display: inline-block;

        margin-bottom: 14px;

        font-size: 11px;
        letter-spacing: 1.8px;
        font-weight: 800;

        color: #c7d2fe;
      }


      .dash-hero h1 {
        margin: 0;

        font-size: clamp(32px, 4vw, 50px);
        line-height: 1.05;
        letter-spacing: -1.5px;

        font-weight: 850;
      }


      .dash-hero h1 span {
        color: #a5b4fc;
      }


      .dash-hero p {
        max-width: 650px;

        margin-top: 17px;

        line-height: 1.7;

        color: #d7dcf8;

        font-size: 15px;
      }


      .dash-hero-action {
        position: relative;
        z-index: 2;

        min-width: 220px;

        display: flex;
        flex-direction: column;

        align-items: flex-end;

        gap: 15px;
      }


      .dash-system-status {
        display: flex;
        align-items: center;

        gap: 8px;

        font-size: 12px;
        font-weight: 700;

        color: #dbeafe;
      }


      .dash-live-dot {
        width: 8px;
        height: 8px;

        border-radius: 50%;

        background: #4ade80;

        box-shadow:
          0 0 0 5px rgba(74, 222, 128, 0.12);
      }


      .dash-advance-button {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 10px;

        min-width: 205px;

        padding: 14px 20px;

        border: 1px solid rgba(255, 255, 255, 0.20);

        border-radius: 12px;

        background: white;

        color: #312e81;

        font-size: 14px;
        font-weight: 800;

        cursor: pointer;

        box-shadow:
          0 10px 30px rgba(0, 0, 0, 0.16);

        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }


      .dash-advance-button:hover:not(:disabled) {
        transform: translateY(-2px);

        box-shadow:
          0 14px 35px rgba(0, 0, 0, 0.24);
      }


      .dash-advance-button:disabled {
        opacity: 0.7;
        cursor: wait;
      }


      .dash-button-icon {
        font-size: 18px;
      }



      /* STATS */

      .dash-stats-grid {
        display: grid;

        grid-template-columns:
          repeat(4, minmax(0, 1fr));

        gap: 18px;

        margin-bottom: 28px;
      }


      .dash-stat-card {
        position: relative;
        overflow: hidden;

        padding: 23px;

        border-radius: 18px;

        background: white;

        border:
          1px solid rgba(226, 232, 240, 0.9);

        box-shadow:
          0 8px 30px rgba(15, 23, 42, 0.055);

        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }


      .dash-stat-card:hover {
        transform: translateY(-3px);

        box-shadow:
          0 16px 38px rgba(15, 23, 42, 0.09);
      }


      .dash-stat-card::after {
        content: "";

        position: absolute;

        width: 90px;
        height: 90px;

        border-radius: 50%;

        right: -30px;
        top: -32px;

        opacity: 0.12;
      }


      .dash-total-card::after {
        background: #4f46e5;
      }

      .dash-high-card::after {
        background: #ef4444;
      }

      .dash-medium-card::after {
        background: #f59e0b;
      }

      .dash-low-card::after {
        background: #22c55e;
      }


      .dash-stat-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        gap: 15px;
      }


      .dash-stat-label {
        display: block;

        margin-bottom: 10px;

        color: #64748b;

        font-size: 13px;
        font-weight: 700;
      }


      .dash-stat-card h2 {
        margin: 0;

        font-size: 34px;

        color: #0f172a;

        letter-spacing: -1px;
      }


      .dash-stat-icon {
        width: 44px;
        height: 44px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 13px;

        background: #f1f5f9;

        font-size: 18px;

        font-weight: 900;
      }


      .dash-high-card .dash-stat-icon {
        background: #fef2f2;
        color: #dc2626;
      }


      .dash-medium-card .dash-stat-icon {
        background: #fffbeb;
        color: #d97706;
      }


      .dash-low-card .dash-stat-icon {
        background: #f0fdf4;
        color: #16a34a;
      }


      .dash-total-card .dash-stat-icon {
        background: #eef2ff;
        color: #4f46e5;
      }


      .dash-stat-footer {
        margin-top: 16px;

        color: #94a3b8;

        font-size: 12px;
      }



      /* PANEL */

      .dash-panel {
        overflow: hidden;

        border-radius: 20px;

        border: 1px solid #e7ebf2;

        background: white;

        box-shadow:
          0 12px 40px rgba(15, 23, 42, 0.06);
      }


      .dash-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 20px;

        padding: 26px 28px;

        border-bottom: 1px solid #edf0f5;
      }


      .dash-section-label {
        margin-bottom: 6px;

        color: #6366f1;

        font-size: 10px;
        font-weight: 900;

        letter-spacing: 1.6px;
      }


      .dash-panel-header h2 {
        margin: 0;

        font-size: 21px;

        color: #172033;
      }


      .dash-panel-header p {
        margin: 7px 0 0;

        color: #8993a6;

        font-size: 13px;
      }


      .dash-student-count {
        padding: 9px 13px;

        border-radius: 10px;

        background: #f8fafc;

        border: 1px solid #e5eaf1;

        color: #64748b;

        font-size: 12px;
        font-weight: 800;
      }



      /* TABLE */

      .dash-table-container {
        width: 100%;
        overflow-x: auto;
      }


      .dash-table {
        width: 100%;

        border-collapse: collapse;
      }


      .dash-table th {
        padding: 14px 20px;

        background: #f8fafc;

        border-bottom:
          1px solid #e9edf3;

        color: #7b8798;

        font-size: 11px;
        font-weight: 800;

        text-transform: uppercase;
        letter-spacing: 0.5px;

        text-align: left;
      }


      .dash-table td {
        padding: 17px 20px;

        border-bottom:
          1px solid #f0f2f6;

        color: #475569;

        font-size: 13px;

        vertical-align: middle;
      }


      .dash-table tbody tr {
        transition:
          background 0.15s ease,
          transform 0.15s ease;
      }


      .dash-table tbody tr:hover {
        background: #fafbff;
      }


      .dash-table tbody tr:last-child td {
        border-bottom: none;
      }



      /* STUDENT */

      .dash-student-info {
        display: flex;
        align-items: center;

        gap: 12px;
      }


      .dash-avatar {
        width: 40px;
        height: 40px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 12px;

        background:
          linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );

        color: white;

        font-size: 12px;
        font-weight: 850;

        box-shadow:
          0 5px 14px rgba(79, 70, 229, 0.20);
      }


      .dash-student-name {
        color: #172033;

        font-size: 14px;
        font-weight: 750;
      }


      .dash-student-sub {
        margin-top: 3px;

        color: #a0a9b7;

        font-size: 11px;
      }


      .dash-roll-number {
        padding: 5px 8px;

        border-radius: 6px;

        background: #f8fafc;

        color: #64748b;

        font-family: monospace;

        font-size: 12px;
      }



      /* RISK SCORE */

      .dash-score-wrapper {
        width: 125px;
      }


      .dash-score-number {
        margin-bottom: 7px;

        color: #334155;

        font-weight: 800;

        font-size: 13px;
      }


      .dash-score-number span {
        color: #9ca3af;

        font-weight: 500;

        font-size: 10px;
      }


      .dash-progress-track {
        width: 100%;
        height: 5px;

        overflow: hidden;

        border-radius: 20px;

        background: #edf0f5;
      }


      .dash-risk-progress {
        height: 100%;

        border-radius: 20px;

        transition: width 0.5s ease;
      }


      .dash-progress-high {
        background:
          linear-gradient(
            90deg,
            #f87171,
            #dc2626
          );
      }


      .dash-progress-medium {
        background:
          linear-gradient(
            90deg,
            #fbbf24,
            #d97706
          );
      }


      .dash-progress-low {
        background:
          linear-gradient(
            90deg,
            #4ade80,
            #16a34a
          );
      }



      /* BADGES */

      .dash-risk-badge {
        width: fit-content;

        display: inline-flex;
        align-items: center;

        gap: 7px;

        padding: 7px 11px;

        border-radius: 999px;

        font-size: 10px;
        font-weight: 900;

        letter-spacing: 0.5px;
      }


      .dash-badge-dot {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: currentColor;
      }


      .dash-risk-high {
        color: #b91c1c;
        background: #fef2f2;
        border: 1px solid #fecaca;
      }


      .dash-risk-medium {
        color: #b45309;
        background: #fffbeb;
        border: 1px solid #fde68a;
      }


      .dash-risk-low {
        color: #15803d;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
      }



      /* PROFILE LINK */

      .dash-profile-link {
        display: inline-flex;
        align-items: center;

        gap: 7px;

        color: #4f46e5;

        font-size: 12px;
        font-weight: 800;

        text-decoration: none;

        transition:
          gap 0.2s ease,
          color 0.2s ease;
      }


      .dash-profile-link:hover {
        gap: 10px;

        color: #3730a3;
      }



      /* FOOTER */

      .dash-footer-note {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 7px;

        margin-top: 18px;

        color: #94a3b8;

        font-size: 11px;
      }


      .dash-footer-note span {
        color: #22c55e;

        font-size: 8px;
      }



      /* EMPTY */

      .dash-empty-state {
        padding: 60px 20px;

        text-align: center;
      }


      .dash-empty-icon {
        margin-bottom: 10px;

        font-size: 36px;
      }


      .dash-empty-state h3 {
        margin: 0;

        color: #334155;
      }


      .dash-empty-state p {
        margin-top: 7px;

        color: #94a3b8;
      }



      /* LOADER */

      .dash-loading-wrapper {
        min-height: 70vh;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        color: #334155;
      }


      .dash-loading-wrapper p {
        margin-top: 5px;

        color: #94a3b8;

        font-size: 13px;
      }


      .dash-loader {
        width: 42px;
        height: 42px;

        margin-bottom: 15px;

        border-radius: 50%;

        border: 4px solid #e0e7ff;

        border-top-color: #4f46e5;

        animation:
          dash-spin 0.8s linear infinite;
      }


      @keyframes dash-spin {
        to {
          transform: rotate(360deg);
        }
      }



      /* RESPONSIVE */

      @media (max-width: 1050px) {

        .dash-stats-grid {
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
        }

        .dash-hero {
          align-items: flex-start;
          flex-direction: column;
        }

        .dash-hero-action {
          align-items: flex-start;
        }

      }


      @media (max-width: 650px) {

        .dash-page {
          padding: 20px 14px 50px;
        }

        .dash-hero {
          padding: 28px 23px;

          border-radius: 18px;
        }

        .dash-hero h1 {
          font-size: 33px;
        }

        .dash-stats-grid {
          grid-template-columns: 1fr;
        }

        .dash-panel-header {
          align-items: flex-start;
          flex-direction: column;
        }

        .dash-advance-button {
          width: 100%;
        }

      }

    `}</style>
  );
}

export default Dashboard;