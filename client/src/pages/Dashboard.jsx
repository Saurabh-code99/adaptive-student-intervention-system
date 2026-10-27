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
      <div className="page">
        <h2>Loading dashboard...</h2>
      </div>
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
      return "badge badge-high";
    }

    if (level === "MEDIUM") {
      return "badge badge-medium";
    }

    return "badge badge-low";
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Student Intervention Dashboard</h1>

        <p className="subtitle">
          Monitor student performance, identify risk and coordinate
          adaptive interventions.
        </p>
      </div>

      <button
        className="btn btn-primary"
        onClick={advanceWeek}
        disabled={advancing}
        style={{ marginBottom: "25px" }}
      >
        {advancing
          ? "Advancing Week..."
          : "Advance One Week"}
      </button>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">
            Total Students
          </div>

          <div className="stat-value">
            {totalStudents}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            High Risk
          </div>

          <div className="stat-value">
            {highRisk}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            Medium Risk
          </div>

          <div className="stat-value">
            {mediumRisk}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            Low Risk
          </div>

          <div className="stat-value">
            {lowRisk}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">
          Student Risk Overview
        </h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Class</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <strong>
                      {student.name}
                    </strong>
                  </td>

                  <td>
                    {student.rollNumber}
                  </td>

                  <td>
                    {student.className}
                  </td>

                  <td>
                    {student.currentRiskScore}
                  </td>

                  <td>
                    <span
                      className={getRiskBadge(
                        student.currentRiskLevel
                      )}
                    >
                      {student.currentRiskLevel}
                    </span>
                  </td>

                  <td>
                    <Link
                      className="action-link"
                      to={`/students/${student._id}`}
                    >
                      View Profile →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {students.length === 0 && (
            <p
              className="subtitle"
              style={{ marginTop: "20px" }}
            >
              No students available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;