import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

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

  const filteredStudents = useMemo(() => {
    const riskPriority = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    };

    return students
      .filter((student) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
          student.name
            .toLowerCase()
            .includes(searchValue) ||
          student.rollNumber
            .toLowerCase()
            .includes(searchValue) ||
          student.className
            .toLowerCase()
            .includes(searchValue);

        const matchesRisk =
          riskFilter === "ALL" ||
          student.currentRiskLevel === riskFilter;

        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => {
        const riskDifference =
          riskPriority[b.currentRiskLevel] -
          riskPriority[a.currentRiskLevel];

        if (riskDifference !== 0) {
          return riskDifference;
        }

        return (
          b.currentRiskScore -
          a.currentRiskScore
        );
      });
  }, [students, search, riskFilter]);

  const getRiskBadge = (level) => {
    if (level === "HIGH") {
      return "badge badge-high";
    }

    if (level === "MEDIUM") {
      return "badge badge-medium";
    }

    return "badge badge-low";
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">
        <h1>Student Intervention Dashboard</h1>

        <p className="subtitle">
          Monitor student performance, identify risk and
          coordinate adaptive interventions.
        </p>
      </div>


      {/* ADVANCE WEEK */}

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


      {/* SUMMARY CARDS */}

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


      {/* STUDENT TABLE */}

      <div className="panel">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "22px"
          }}
        >

          <div>
            <h2 className="panel-title">
              Student Risk Overview
            </h2>

            <p className="subtitle">
              High-risk students are automatically
              prioritised.
            </p>
          </div>


          {/* SEARCH + FILTER */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={{
                padding: "10px 13px",
                border: "1px solid #d6dbe5",
                borderRadius: "8px",
                minWidth: "220px",
                outline: "none"
              }}
            />

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(e.target.value)
              }
              style={{
                padding: "10px 13px",
                border: "1px solid #d6dbe5",
                borderRadius: "8px",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="ALL">
                All Risk Levels
              </option>

              <option value="HIGH">
                High Risk
              </option>

              <option value="MEDIUM">
                Medium Risk
              </option>

              <option value="LOW">
                Low Risk
              </option>
            </select>

          </div>

        </div>


        {/* RESULT COUNT */}

        <p
          className="subtitle"
          style={{ marginBottom: "15px" }}
        >
          Showing {filteredStudents.length} of{" "}
          {students.length} students
        </p>


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

              {filteredStudents.map(
                (student) => (

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
                      <strong>
                        {student.currentRiskScore}
                      </strong>
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

                )
              )}

            </tbody>

          </table>


          {filteredStudents.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px"
              }}
            >
              <h3>
                No students found
              </h3>

              <p className="subtitle">
                Try changing your search or risk filter.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;