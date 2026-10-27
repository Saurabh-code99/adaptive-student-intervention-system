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
      <div className="page">
        <h2>Loading student...</h2>
      </div>
    );
  }

  if (!studentData || !studentData.student) {
    return (
      <div className="page">
        <h2>Student not found.</h2>
      </div>
    );
  }

  const student = studentData.student;

  const pendingIntervention = interventions.find(
    (item) => item.status === "PENDING"
  );

  const riskBadge =
    risk?.level === "HIGH"
      ? "badge badge-high"
      : risk?.level === "MEDIUM"
      ? "badge badge-medium"
      : "badge badge-low";

  return (
    <div className="page">

      {/* STUDENT HEADER */}

      <div className="student-header panel">

        <div>
          <h1>{student.name}</h1>

          <p className="subtitle">
            Roll Number: {student.rollNumber}
          </p>

          <p className="subtitle">
            Class: {student.className}
          </p>
        </div>

        <div>
          <div className="risk-score">
            {risk?.score ?? 0}
          </div>

          <span className={riskBadge}>
            {risk?.level || "LOW"} RISK
          </span>
        </div>

      </div>


      {/* RISK REASONS */}

      <div className="panel">

        <h2 className="panel-title">
          Why was this student flagged?
        </h2>

        {risk?.reasons?.length > 0 ? (
          <ul className="reason-list">

            {risk.reasons.map((reason, index) => (
              <li key={index}>
                {reason}
              </li>
            ))}

          </ul>
        ) : (
          <p className="subtitle">
            No major risk signals detected.
          </p>
        )}

      </div>


      {/* PERFORMANCE TREND CHART */}

      <div className="panel">

        <h2 className="panel-title">
          Performance Trend
        </h2>

        <p
          className="subtitle"
          style={{ marginBottom: "20px" }}
        >
          Weekly attendance and marks trend
        </p>

        <div
          style={{
            width: "100%",
            height: "340px"
          }}
        >

          <ResponsiveContainer>

            <LineChart
              data={studentData.metrics}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="week"
                label={{
                  value: "Week",
                  position: "insideBottom",
                  offset: -3
                }}
              />

              <YAxis
                domain={[0, 100]}
              />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance"
                stroke="#4f46e5"
                strokeWidth={3}
                activeDot={{ r: 7 }}
              />

              <Line
                type="monotone"
                dataKey="marks"
                name="Marks"
                stroke="#16a34a"
                strokeWidth={3}
                activeDot={{ r: 7 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* AI INTERVENTION */}

      <div className="panel">

        <h2 className="panel-title">
          AI Intervention Planner
        </h2>

        <p
          className="subtitle"
          style={{ marginBottom: "18px" }}
        >
          AI analyses risk signals and previous intervention outcomes
          before suggesting the next action.
        </p>

        {!pendingIntervention && (

          <button
            className="btn btn-primary"
            onClick={generateIntervention}
            disabled={actionLoading}
          >
            {actionLoading
              ? "Generating..."
              : "Generate AI Intervention"}
          </button>

        )}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {pendingIntervention && (

          <div
            className="intervention-card"
            style={{ marginTop: "20px" }}
          >

            <span className="badge badge-pending">
              AI RECOMMENDATION
            </span>

            <h2 style={{ marginTop: "15px" }}>
              {pendingIntervention.type}
            </h2>

            <p>
              <strong>Reason:</strong>{" "}
              {pendingIntervention.reason}
            </p>

            <p>
              <strong>Assigned To:</strong>{" "}
              {pendingIntervention.owner}
            </p>

            <p>
              <strong>Deadline:</strong>{" "}
              {pendingIntervention.deadlineDays} days
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {pendingIntervention.status}
            </p>

            <div style={{ marginTop: "20px" }}>

              <button
                className="btn btn-success"
                disabled={actionLoading}
                onClick={() =>
                  approveIntervention(
                    pendingIntervention._id
                  )
                }
              >
                Approve
              </button>

              <button
                className="btn btn-danger"
                style={{ marginLeft: "10px" }}
                disabled={actionLoading}
                onClick={() =>
                  rejectIntervention(
                    pendingIntervention._id
                  )
                }
              >
                Reject
              </button>

            </div>

          </div>

        )}

      </div>


      {/* WEEKLY METRICS */}

      <div className="panel">

        <h2 className="panel-title">
          Weekly Performance Data
        </h2>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Week</th>
                <th>Attendance</th>
                <th>Marks</th>
                <th>Assignments</th>
              </tr>

            </thead>

            <tbody>

              {studentData.metrics.map(
                (metric) => (

                  <tr key={metric._id}>

                    <td>
                      Week {metric.week}
                    </td>

                    <td>
                      {metric.attendance}%
                    </td>

                    <td>
                      {metric.marks}
                    </td>

                    <td>
                      {metric.assignmentsCompleted}/
                      {metric.totalAssignments}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* INTERVENTION HISTORY */}

      <div className="panel">

        <h2 className="panel-title">
          Intervention History
        </h2>

        {interventions.length === 0 ? (

          <p className="subtitle">
            No interventions recorded yet.
          </p>

        ) : (

          interventions.map((item) => (

            <div
              key={item._id}
              className="intervention-card"
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px"
                }}
              >

                <h3>
                  {item.type}
                </h3>

                <span
                  className={
                    item.status === "COMPLETED"
                      ? "badge badge-completed"
                      : item.status === "PENDING"
                      ? "badge badge-pending"
                      : "badge"
                  }
                >
                  {item.status}
                </span>

              </div>

              <p>
                {item.reason}
              </p>

              <p>
                <strong>Owner:</strong>{" "}
                {item.owner}
              </p>

              <p>
                <strong>Outcome:</strong>{" "}

                {item.outcome === "IMPROVED"
                  ? "✅ IMPROVED"
                  : item.outcome === "WORSENED"
                  ? "❌ WORSENED"
                  : item.outcome === "NO_CHANGE"
                  ? "➖ NO CHANGE"
                  : "Not evaluated yet"}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default StudentDetails;