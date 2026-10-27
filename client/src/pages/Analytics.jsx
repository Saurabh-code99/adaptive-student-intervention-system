import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

import api from "../services/api";

function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(
        "/analytics/intervention-effectiveness"
      );

      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Loading analytics...</h2>
      </div>
    );
  }

  const totalInterventions = data.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const totalImproved = data.reduce(
    (sum, item) => sum + item.improved,
    0
  );

  const totalWorsened = data.reduce(
    (sum, item) => sum + item.worsened,
    0
  );

  const overallEffectiveness =
    totalInterventions === 0
      ? 0
      : Math.round(
          (totalImproved / totalInterventions) * 100
        );

  const bestIntervention =
    data.length > 0
      ? [...data].sort(
          (a, b) =>
            b.effectiveness - a.effectiveness
        )[0]
      : null;

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">
        <h1>Intervention Analytics</h1>

        <p className="subtitle">
          Track intervention outcomes and identify which
          strategies are most effective.
        </p>
      </div>


      {/* SUMMARY CARDS */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-title">
            Total Interventions
          </div>

          <div className="stat-value">
            {totalInterventions}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            Students Improved
          </div>

          <div className="stat-value">
            {totalImproved}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            Overall Effectiveness
          </div>

          <div className="stat-value">
            {overallEffectiveness}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            Best Intervention
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: "800",
              marginTop: "10px"
            }}
          >
            {bestIntervention?.type || "No data"}
          </div>
        </div>

      </div>


      {/* EFFECTIVENESS CHART */}

      <div className="panel">

        <h2 className="panel-title">
          Intervention Effectiveness
        </h2>

        <p
          className="subtitle"
          style={{ marginBottom: "25px" }}
        >
          Percentage of completed interventions that
          resulted in student improvement.
        </p>

        {data.length === 0 ? (

          <p className="subtitle">
            No completed intervention data available yet.
          </p>

        ) : (

          <div
            style={{
              width: "100%",
              height: "380px"
            }}
          >

            <ResponsiveContainer>

              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 35
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="type"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis
                  domain={[0, 100]}
                  label={{
                    value: "Effectiveness %",
                    angle: -90,
                    position: "insideLeft"
                  }}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="effectiveness"
                  name="Effectiveness %"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>


      {/* OUTCOME TABLE */}

      <div className="panel">

        <h2 className="panel-title">
          Detailed Intervention Outcomes
        </h2>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Intervention</th>
                <th>Total</th>
                <th>Improved</th>
                <th>No Change</th>
                <th>Worsened</th>
                <th>Effectiveness</th>
              </tr>
            </thead>

            <tbody>

              {data.map((item) => (

                <tr key={item.type}>

                  <td>
                    <strong>
                      {item.type}
                    </strong>
                  </td>

                  <td>
                    {item.total}
                  </td>

                  <td>
                    {item.improved}
                  </td>

                  <td>
                    {item.noChange}
                  </td>

                  <td>
                    {item.worsened}
                  </td>

                  <td>

                    <span
                      className={
                        item.effectiveness >= 70
                          ? "badge badge-low"
                          : item.effectiveness >= 40
                          ? "badge badge-medium"
                          : "badge badge-high"
                      }
                    >
                      {item.effectiveness}%
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* INSIGHT PANEL */}

      <div className="panel">

        <h2 className="panel-title">
          Evidence-Based Learning
        </h2>

        {bestIntervention ? (

          <>
            <p>
              Current best-performing intervention:
              {" "}
              <strong>
                {bestIntervention.type}
              </strong>
            </p>

            <p
              className="subtitle"
              style={{ marginTop: "8px" }}
            >
              Effectiveness:
              {" "}
              {bestIntervention.effectiveness}%.
              The system can use these historical outcomes
              when generating future recommendations.
            </p>
          </>

        ) : (

          <p className="subtitle">
            Complete more interventions to generate
            effectiveness insights.
          </p>

        )}

      </div>

    </div>
  );
}

export default Analytics;