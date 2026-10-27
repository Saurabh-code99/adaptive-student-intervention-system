import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
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
      console.error(
        "Failed to fetch analytics:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <>
        <AnalyticsStyles />

        <div className="analytics-loading">
          <div className="analytics-loader"></div>

          <h2>Loading Analytics</h2>

          <p>
            Analysing intervention outcomes...
          </p>
        </div>
      </>
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
          (totalImproved /
            totalInterventions) *
            100
        );

  const bestIntervention =
    data.length > 0
      ? [...data].sort(
          (a, b) =>
            b.effectiveness -
            a.effectiveness
        )[0]
      : null;

  const getEffectivenessClass = (
    effectiveness
  ) => {
    if (effectiveness >= 70) {
      return "analytics-effectiveness analytics-good";
    }

    if (effectiveness >= 40) {
      return "analytics-effectiveness analytics-medium";
    }

    return "analytics-effectiveness analytics-poor";
  };

  return (
    <>
      <AnalyticsStyles />

      <div className="analytics-page">

        {/* HERO */}

        <section className="analytics-hero">

          <div>

            <div className="analytics-hero-label">
              ✦ PERFORMANCE INTELLIGENCE
            </div>

            <h1>
              Intervention
              <span> Analytics</span>
            </h1>

            <p>
              Measure intervention outcomes,
              identify effective strategies and
              turn historical results into
              evidence-driven decisions.
            </p>

          </div>

          <div className="analytics-hero-score">

            <div className="analytics-score-circle">

              <div>
                <strong>
                  {overallEffectiveness}%
                </strong>

                <span>
                  EFFECTIVE
                </span>
              </div>

            </div>

            <p>
              Overall Intervention Success
            </p>

          </div>

        </section>


        {/* SUMMARY CARDS */}

        <section className="analytics-stats">

          <div className="analytics-stat-card">

            <div className="analytics-icon analytics-purple">
              ◈
            </div>

            <div>

              <span>
                Total Interventions
              </span>

              <h2>
                {totalInterventions}
              </h2>

              <p>
                Completed intervention records
              </p>

            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="analytics-icon analytics-green">
              ✓
            </div>

            <div>

              <span>
                Students Improved
              </span>

              <h2>
                {totalImproved}
              </h2>

              <p>
                Positive outcomes recorded
              </p>

            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="analytics-icon analytics-red">
              ↓
            </div>

            <div>

              <span>
                Worsened Outcomes
              </span>

              <h2>
                {totalWorsened}
              </h2>

              <p>
                Cases requiring strategy change
              </p>

            </div>

          </div>


          <div className="analytics-stat-card">

            <div className="analytics-icon analytics-blue">
              ★
            </div>

            <div>

              <span>
                Best Intervention
              </span>

              <h3>
                {bestIntervention?.type ||
                  "No data"}
              </h3>

              <p>
                {bestIntervention
                  ? `${bestIntervention.effectiveness}% effectiveness`
                  : "Awaiting intervention data"}
              </p>

            </div>

          </div>

        </section>


        {/* CHART */}

        <section className="analytics-panel">

          <div className="analytics-panel-header">

            <div>

              <div className="analytics-section-label">
                EFFECTIVENESS COMPARISON
              </div>

              <h2>
                Intervention Performance
              </h2>

              <p>
                Percentage of completed
                interventions resulting in
                student improvement.
              </p>

            </div>

            <div className="analytics-live-badge">
              <span></span>
              Live Data
            </div>

          </div>


          {data.length === 0 ? (

            <div className="analytics-empty">

              <div>
                ◈
              </div>

              <h3>
                No analytics data yet
              </h3>

              <p>
                Complete interventions to
                generate performance insights.
              </p>

            </div>

          ) : (

            <div className="analytics-chart-wrapper">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={data}
                  margin={{
                    top: 15,
                    right: 25,
                    left: 0,
                    bottom: 50
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e9edf5"
                  />

                  <XAxis
                    dataKey="type"
                    angle={-15}
                    textAnchor="end"
                    interval={0}
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
                      border:
                        "1px solid #e2e8f0",
                      boxShadow:
                        "0 12px 30px rgba(15,23,42,0.12)",
                      fontSize: "12px"
                    }}
                    cursor={{
                      fill:
                        "rgba(79,70,229,0.04)"
                    }}
                  />

                  <Bar
                    dataKey="effectiveness"
                    name="Effectiveness %"
                    fill="#4f46e5"
                    radius={[
                      9,
                      9,
                      3,
                      3
                    ]}
                    maxBarSize={60}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </section>


        {/* DETAILED OUTCOME TABLE */}

        <section className="analytics-panel">

          <div className="analytics-panel-header">

            <div>

              <div className="analytics-section-label">
                OUTCOME BREAKDOWN
              </div>

              <h2>
                Detailed Intervention Outcomes
              </h2>

              <p>
                Compare individual strategy
                performance and recorded results.
              </p>

            </div>

          </div>


          <div className="analytics-table-wrapper">

            <table className="analytics-table">

              <thead>

                <tr>
                  <th>
                    Intervention
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Improved
                  </th>

                  <th>
                    No Change
                  </th>

                  <th>
                    Worsened
                  </th>

                  <th>
                    Effectiveness
                  </th>
                </tr>

              </thead>


              <tbody>

                {data.map((item) => (

                  <tr key={item.type}>

                    <td>

                      <div className="analytics-intervention">

                        <div className="analytics-intervention-icon">
                          AI
                        </div>

                        <div>

                          <strong>
                            {item.type}
                          </strong>

                          <span>
                            Intervention Strategy
                          </span>

                        </div>

                      </div>

                    </td>


                    <td>

                      <span className="analytics-number">
                        {item.total}
                      </span>

                    </td>


                    <td>

                      <span className="analytics-result analytics-result-good">
                        ↑ {item.improved}
                      </span>

                    </td>


                    <td>

                      <span className="analytics-result analytics-result-neutral">
                        — {item.noChange}
                      </span>

                    </td>


                    <td>

                      <span className="analytics-result analytics-result-bad">
                        ↓ {item.worsened}
                      </span>

                    </td>


                    <td>

                      <div className="analytics-effectiveness-wrapper">

                        <span
                          className={getEffectivenessClass(
                            item.effectiveness
                          )}
                        >
                          {item.effectiveness}%
                        </span>

                        <div className="analytics-mini-track">

                          <div
                            style={{
                              width: `${Math.min(
                                item.effectiveness,
                                100
                              )}%`
                            }}
                          ></div>

                        </div>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* INSIGHT CARD */}

        <section className="analytics-insight">

          <div className="analytics-insight-icon">
            ✦
          </div>

          <div>

            <span className="analytics-insight-label">
              AI INSIGHT
            </span>

            <h2>
              Evidence-Based Learning
            </h2>

            {bestIntervention ? (

              <p>
                Current historical data indicates{" "}
                <strong>
                  {bestIntervention.type}
                </strong>{" "}
                as the strongest-performing
                intervention with{" "}
                <strong>
                  {bestIntervention.effectiveness}%
                </strong>{" "}
                effectiveness. These outcomes can
                be used as contextual evidence
                when generating future student
                intervention recommendations.
              </p>

            ) : (

              <p>
                Complete more interventions to
                generate evidence-based strategy
                insights.
              </p>

            )}

          </div>

        </section>


        <div className="analytics-footer">

          <span></span>

          Analytics are calculated from
          completed intervention outcomes.

        </div>

      </div>
    </>
  );
}


function AnalyticsStyles() {
  return (
    <style>{`

      .analytics-page {
        max-width: 1440px;
        margin: 0 auto;
        padding: 34px 34px 70px;
        color: #172033;
      }


      /* HERO */

      .analytics-hero {
        position: relative;
        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 35px;

        padding: 38px 42px;

        margin-bottom: 28px;

        border-radius: 24px;

        color: white;

        background:
          radial-gradient(
            circle at 80% 20%,
            rgba(167, 139, 250, 0.38),
            transparent 35%
          ),
          linear-gradient(
            135deg,
            #111827 0%,
            #312e81 52%,
            #4f46e5 100%
          );

        box-shadow:
          0 24px 60px
          rgba(49, 46, 129, 0.18);
      }


      .analytics-hero::after {
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


      .analytics-hero > div {
        position: relative;
        z-index: 2;
      }


      .analytics-hero-label {
        margin-bottom: 14px;

        color: #c7d2fe;

        font-size: 11px;
        font-weight: 850;

        letter-spacing: 1.8px;
      }


      .analytics-hero h1 {
        margin: 0;

        font-size:
          clamp(32px, 4vw, 50px);

        line-height: 1.05;

        letter-spacing: -1.5px;
      }


      .analytics-hero h1 span {
        color: #a5b4fc;
      }


      .analytics-hero p {
        max-width: 650px;

        margin-top: 16px;

        color: #d8ddf8;

        font-size: 15px;

        line-height: 1.7;
      }


      .analytics-hero-score {
        display: flex;
        flex-direction: column;

        align-items: center;

        min-width: 180px;
      }


      .analytics-score-circle {
        width: 118px;
        height: 118px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background:
          conic-gradient(
            #a5b4fc 0deg,
            #ffffff 250deg,
            rgba(255,255,255,0.15) 250deg
          );

        padding: 6px;

        box-shadow:
          0 15px 40px
          rgba(0,0,0,0.18);
      }


      .analytics-score-circle > div {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: #312e81;
      }


      .analytics-score-circle strong {
        font-size: 26px;
      }


      .analytics-score-circle span {
        margin-top: 3px;

        color: #c7d2fe;

        font-size: 8px;
        font-weight: 850;

        letter-spacing: 1px;
      }


      .analytics-hero-score p {
        margin-top: 10px;

        font-size: 10px;

        color: #c7d2fe;

        text-align: center;
      }



      /* STAT CARDS */

      .analytics-stats {
        display: grid;

        grid-template-columns:
          repeat(4, minmax(0,1fr));

        gap: 18px;

        margin-bottom: 28px;
      }


      .analytics-stat-card {
        display: flex;

        gap: 15px;

        padding: 22px;

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


      .analytics-stat-card:hover {
        transform:
          translateY(-3px);

        box-shadow:
          0 16px 38px
          rgba(15,23,42,0.09);
      }


      .analytics-icon {
        width: 46px;
        height: 46px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 13px;

        font-size: 18px;
        font-weight: 900;
      }


      .analytics-purple {
        background: #eef2ff;
        color: #4f46e5;
      }


      .analytics-green {
        background: #f0fdf4;
        color: #16a34a;
      }


      .analytics-red {
        background: #fef2f2;
        color: #dc2626;
      }


      .analytics-blue {
        background: #eff6ff;
        color: #2563eb;
      }


      .analytics-stat-card span {
        display: block;

        color: #64748b;

        font-size: 12px;

        font-weight: 750;
      }


      .analytics-stat-card h2 {
        margin: 6px 0 3px;

        color: #0f172a;

        font-size: 30px;

        letter-spacing: -1px;
      }


      .analytics-stat-card h3 {
        margin: 7px 0 4px;

        color: #172033;

        font-size: 16px;
      }


      .analytics-stat-card p {
        margin: 0;

        color: #9aa4b4;

        font-size: 10px;

        line-height: 1.4;
      }



      /* PANELS */

      .analytics-panel {
        overflow: hidden;

        margin-bottom: 24px;

        border-radius: 20px;

        background: white;

        border: 1px solid #e7ebf2;

        box-shadow:
          0 12px 40px
          rgba(15,23,42,0.055);
      }


      .analytics-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 20px;

        padding: 25px 28px;

        border-bottom:
          1px solid #edf0f5;
      }


      .analytics-section-label {
        margin-bottom: 6px;

        color: #6366f1;

        font-size: 10px;

        font-weight: 900;

        letter-spacing: 1.6px;
      }


      .analytics-panel-header h2 {
        margin: 0;

        color: #172033;

        font-size: 21px;
      }


      .analytics-panel-header p {
        margin: 7px 0 0;

        color: #8993a6;

        font-size: 12px;
      }


      .analytics-live-badge {
        display: flex;
        align-items: center;

        gap: 7px;

        padding: 8px 12px;

        border-radius: 999px;

        background: #f0fdf4;

        border: 1px solid #bbf7d0;

        color: #15803d;

        font-size: 10px;
        font-weight: 800;
      }


      .analytics-live-badge span {
        width: 7px;
        height: 7px;

        border-radius: 50%;

        background: #22c55e;

        box-shadow:
          0 0 0 4px
          rgba(34,197,94,0.10);
      }



      /* CHART */

      .analytics-chart-wrapper {
        width: 100%;
        height: 400px;

        padding: 24px 20px 5px;
      }



      /* TABLE */

      .analytics-table-wrapper {
        width: 100%;

        overflow-x: auto;
      }


      .analytics-table {
        width: 100%;

        border-collapse: collapse;
      }


      .analytics-table th {
        padding: 14px 20px;

        text-align: left;

        background: #f8fafc;

        color: #7b8798;

        font-size: 10px;

        font-weight: 850;

        text-transform: uppercase;

        letter-spacing: 0.5px;

        border-bottom:
          1px solid #e9edf3;
      }


      .analytics-table td {
        padding: 17px 20px;

        border-bottom:
          1px solid #f0f2f6;

        color: #475569;

        font-size: 12px;
      }


      .analytics-table tbody tr {
        transition:
          background 0.15s ease;
      }


      .analytics-table tbody tr:hover {
        background: #fafbff;
      }


      .analytics-intervention {
        display: flex;
        align-items: center;

        gap: 11px;
      }


      .analytics-intervention-icon {
        width: 38px;
        height: 38px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 11px;

        background:
          linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );

        color: white;

        font-size: 10px;

        font-weight: 900;

        box-shadow:
          0 5px 14px
          rgba(79,70,229,0.20);
      }


      .analytics-intervention strong {
        display: block;

        color: #172033;

        font-size: 13px;
      }


      .analytics-intervention span {
        margin-top: 3px;

        color: #a0a9b7;

        font-size: 9px;
      }


      .analytics-number {
        font-weight: 800;

        color: #334155;
      }


      .analytics-result {
        display: inline-block;

        min-width: 48px;

        padding: 6px 9px;

        border-radius: 7px;

        font-size: 11px;

        font-weight: 800;
      }


      .analytics-result-good {
        color: #15803d;

        background: #f0fdf4;
      }


      .analytics-result-neutral {
        color: #64748b;

        background: #f8fafc;
      }


      .analytics-result-bad {
        color: #b91c1c;

        background: #fef2f2;
      }



      /* EFFECTIVENESS */

      .analytics-effectiveness-wrapper {
        min-width: 115px;
      }


      .analytics-effectiveness {
        display: inline-block;

        margin-bottom: 7px;

        padding: 5px 9px;

        border-radius: 999px;

        font-size: 10px;

        font-weight: 900;
      }


      .analytics-good {
        color: #15803d;

        background: #dcfce7;
      }


      .analytics-medium {
        color: #b45309;

        background: #fef3c7;
      }


      .analytics-poor {
        color: #b91c1c;

        background: #fee2e2;
      }


      .analytics-mini-track {
        width: 100%;
        height: 4px;

        overflow: hidden;

        border-radius: 50px;

        background: #edf0f5;
      }


      .analytics-mini-track div {
        height: 100%;

        border-radius: 50px;

        background:
          linear-gradient(
            90deg,
            #818cf8,
            #4f46e5
          );
      }



      /* INSIGHT */

      .analytics-insight {
        display: flex;

        gap: 20px;

        padding: 27px;

        border-radius: 20px;

        color: white;

        background:
          linear-gradient(
            135deg,
            #312e81,
            #4338ca
          );

        box-shadow:
          0 16px 45px
          rgba(49,46,129,0.16);
      }


      .analytics-insight-icon {
        width: 48px;
        height: 48px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 14px;

        background:
          rgba(255,255,255,0.13);

        font-size: 20px;
      }


      .analytics-insight-label {
        display: block;

        margin-bottom: 5px;

        color: #c7d2fe;

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 1.5px;
      }


      .analytics-insight h2 {
        margin: 0;

        font-size: 20px;
      }


      .analytics-insight p {
        max-width: 850px;

        margin: 10px 0 0;

        color: #dbe1ff;

        font-size: 13px;

        line-height: 1.7;
      }


      .analytics-insight strong {
        color: white;
      }



      /* EMPTY */

      .analytics-empty {
        padding: 60px;

        text-align: center;
      }


      .analytics-empty > div {
        font-size: 35px;

        color: #6366f1;
      }


      .analytics-empty h3 {
        margin: 12px 0 5px;

        color: #334155;
      }


      .analytics-empty p {
        margin: 0;

        color: #94a3b8;

        font-size: 12px;
      }



      /* FOOTER */

      .analytics-footer {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 7px;

        margin-top: 18px;

        color: #94a3b8;

        font-size: 10px;
      }


      .analytics-footer span {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: #22c55e;
      }



      /* LOADER */

      .analytics-loading {
        min-height: 70vh;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        color: #334155;
      }


      .analytics-loading p {
        margin-top: 5px;

        color: #94a3b8;

        font-size: 12px;
      }


      .analytics-loader {
        width: 42px;
        height: 42px;

        margin-bottom: 15px;

        border-radius: 50%;

        border:
          4px solid #e0e7ff;

        border-top-color:
          #4f46e5;

        animation:
          analytics-spin
          0.8s linear infinite;
      }


      @keyframes analytics-spin {
        to {
          transform:
            rotate(360deg);
        }
      }



      /* RESPONSIVE */

      @media (max-width: 1050px) {

        .analytics-stats {
          grid-template-columns:
            repeat(2, 1fr);
        }

      }


      @media (max-width: 750px) {

        .analytics-page {
          padding:
            20px 14px 50px;
        }

        .analytics-hero {
          flex-direction: column;

          align-items:
            flex-start;

          padding:
            28px 23px;
        }

        .analytics-hero-score {
          align-items:
            flex-start;
        }

        .analytics-stats {
          grid-template-columns:
            1fr;
        }

        .analytics-panel-header {
          flex-direction:
            column;

          align-items:
            flex-start;
        }

        .analytics-chart-wrapper {
          height: 340px;
        }

        .analytics-insight {
          flex-direction:
            column;
        }

      }

    `}</style>
  );
}

export default Analytics;