import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setMessage("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completeTask = async (taskId) => {
    try {
      setMessage("");

      const response = await api.patch(
        `/tasks/${taskId}/complete`
      );

      setMessage(response.data.message);

      await fetchTasks();
    } catch (error) {
      console.error("Failed to complete task:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to complete task."
      );
    }
  };

  if (loading) {
    return (
      <>
        <TaskStyles />

        <div className="tasks-loading">
          <div className="tasks-loader"></div>

          <h2>Loading Task Board</h2>

          <p>
            Fetching intervention tasks...
          </p>
        </div>
      </>
    );
  }

  const pendingTasks = tasks.filter(
    (task) => task.status === "PENDING"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  );

  return (
    <>
      <TaskStyles />

      <div className="tasks-page">

        {/* HERO */}

        <section className="tasks-hero">

          <div>

            <div className="tasks-hero-label">
              ✦ INTERVENTION WORKFLOW
            </div>

            <h1>
              Intervention
              <span> Task Board</span>
            </h1>

            <p>
              Track approved interventions,
              assigned responsibilities,
              deadlines and completion status
              from one coordinated workspace.
            </p>

          </div>


          <div className="tasks-hero-side">

            <div className="tasks-progress-box">

              <div className="tasks-progress-value">
                {tasks.length === 0
                  ? 0
                  : Math.round(
                      (completedTasks.length /
                        tasks.length) *
                        100
                    )}
                %
              </div>

              <div className="tasks-progress-label">
                COMPLETION RATE
              </div>

            </div>

          </div>

        </section>


        {/* SUMMARY */}

        <section className="tasks-stats">

          <div className="tasks-stat-card">

            <div className="tasks-stat-icon tasks-purple">
              ◈
            </div>

            <div>

              <span>
                Total Tasks
              </span>

              <h2>
                {tasks.length}
              </h2>

              <p>
                All intervention actions
              </p>

            </div>

          </div>


          <div className="tasks-stat-card">

            <div className="tasks-stat-icon tasks-orange">
              ◐
            </div>

            <div>

              <span>
                Pending Tasks
              </span>

              <h2>
                {pendingTasks.length}
              </h2>

              <p>
                Awaiting completion
              </p>

            </div>

          </div>


          <div className="tasks-stat-card">

            <div className="tasks-stat-icon tasks-green">
              ✓
            </div>

            <div>

              <span>
                Completed
              </span>

              <h2>
                {completedTasks.length}
              </h2>

              <p>
                Successfully handled tasks
              </p>

            </div>

          </div>


          <div className="tasks-stat-card">

            <div className="tasks-stat-icon tasks-blue">
              →
            </div>

            <div>

              <span>
                Active Workflow
              </span>

              <h3>
                {pendingTasks.length > 0
                  ? "In Progress"
                  : "Up to Date"}
              </h3>

              <p>
                Current intervention status
              </p>

            </div>

          </div>

        </section>


        {/* MESSAGE */}

        {message && (

          <div className="tasks-message">

            <div>
              ✓
            </div>

            <span>
              {message}
            </span>

          </div>

        )}


        {/* PENDING */}

        <section className="tasks-panel">

          <div className="tasks-panel-header">

            <div>

              <div className="tasks-section-label">
                ACTIVE ACTIONS
              </div>

              <h2>
                Pending Tasks
              </h2>

              <p>
                Approved interventions currently
                waiting for action.
              </p>

            </div>

            <div className="tasks-count-badge tasks-count-pending">
              {pendingTasks.length} Pending
            </div>

          </div>


          {pendingTasks.length === 0 ? (

            <div className="tasks-empty">

              <div className="tasks-empty-icon">
                ✓
              </div>

              <h3>
                No pending tasks
              </h3>

              <p>
                All assigned intervention tasks
                have been completed.
              </p>

            </div>

          ) : (

            <div className="tasks-card-grid">

              {pendingTasks.map((task) => (

                <div
                  className="tasks-card"
                  key={task._id}
                >

                  <div className="tasks-card-top">

                    <div className="tasks-card-icon">
                      AI
                    </div>

                    <span className="tasks-status tasks-status-pending">
                      <span></span>
                      PENDING
                    </span>

                  </div>


                  <h3>
                    {task.title}
                  </h3>


                  <div className="tasks-student-box">

                    <div className="tasks-avatar">
                      {task.studentId?.name
                        ? task.studentId.name
                            .split(" ")
                            .map(
                              (word) =>
                                word[0]
                            )
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "ST"}
                    </div>

                    <div>

                      <strong>
                        {task.studentId?.name ||
                          "Unknown"}
                      </strong>

                      <span>
                        {task.studentId?.rollNumber ||
                          "-"}
                        {" • "}
                        {task.studentId?.className ||
                          "-"}
                      </span>

                    </div>

                  </div>


                  <div className="tasks-details">

                    <div>

                      <span className="tasks-detail-label">
                        Assigned To
                      </span>

                      <strong>
                        {task.assignedTo}
                      </strong>

                    </div>


                    <div>

                      <span className="tasks-detail-label">
                        Deadline
                      </span>

                      <strong>
                        {new Date(
                          task.deadline
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                  </div>


                  {task.interventionId?.reason && (

                    <div className="tasks-reason">

                      <span>
                        REASON
                      </span>

                      <p>
                        {
                          task
                            .interventionId
                            .reason
                        }
                      </p>

                    </div>

                  )}


                  <button
                    className="tasks-complete-button"
                    onClick={() =>
                      completeTask(
                        task._id
                      )
                    }
                  >
                    <span>
                      ✓
                    </span>

                    Mark Completed
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* COMPLETED */}

        <section className="tasks-panel">

          <div className="tasks-panel-header">

            <div>

              <div className="tasks-section-label">
                COMPLETED ACTIONS
              </div>

              <h2>
                Completed Tasks
              </h2>

              <p>
                Intervention actions that have
                already been handled.
              </p>

            </div>

            <div className="tasks-count-badge tasks-count-complete">
              {completedTasks.length} Completed
            </div>

          </div>


          {completedTasks.length === 0 ? (

            <div className="tasks-empty">

              <div className="tasks-empty-icon">
                ◈
              </div>

              <h3>
                No completed tasks yet
              </h3>

              <p>
                Completed intervention actions
                will appear here.
              </p>

            </div>

          ) : (

            <div className="tasks-card-grid">

              {completedTasks.map((task) => (

                <div
                  className="tasks-card tasks-card-completed"
                  key={task._id}
                >

                  <div className="tasks-card-top">

                    <div className="tasks-card-icon tasks-complete-icon">
                      ✓
                    </div>

                    <span className="tasks-status tasks-status-complete">
                      <span></span>
                      COMPLETED
                    </span>

                  </div>


                  <h3>
                    {task.title}
                  </h3>


                  <div className="tasks-student-box">

                    <div className="tasks-avatar">
                      {task.studentId?.name
                        ? task.studentId.name
                            .split(" ")
                            .map(
                              (word) =>
                                word[0]
                            )
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "ST"}
                    </div>

                    <div>

                      <strong>
                        {task.studentId?.name ||
                          "Unknown"}
                      </strong>

                      <span>
                        {task.studentId?.rollNumber ||
                          "-"}
                        {" • "}
                        {task.studentId?.className ||
                          "-"}
                      </span>

                    </div>

                  </div>


                  <div className="tasks-details">

                    <div>

                      <span className="tasks-detail-label">
                        Assigned To
                      </span>

                      <strong>
                        {task.assignedTo}
                      </strong>

                    </div>


                    <div>

                      <span className="tasks-detail-label">
                        Deadline
                      </span>

                      <strong>
                        {new Date(
                          task.deadline
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                  </div>


                  <div className="tasks-completed-note">
                    ✓ Intervention task completed
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        <div className="tasks-footer">

          <span></span>

          Tasks are generated after approved
          intervention recommendations.

        </div>

      </div>
    </>
  );
}


function TaskStyles() {
  return (
    <style>{`

      .tasks-page {
        max-width: 1440px;
        margin: 0 auto;
        padding: 34px 34px 70px;
        color: #172033;
      }


      /* HERO */

      .tasks-hero {
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
            rgba(96,165,250,0.30),
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


      .tasks-hero::after {
        content: "";

        position: absolute;

        width: 260px;
        height: 260px;

        right: -100px;
        bottom: -155px;

        border-radius: 50%;

        background:
          rgba(255,255,255,0.07);
      }


      .tasks-hero > div {
        position: relative;
        z-index: 2;
      }


      .tasks-hero-label {
        margin-bottom: 14px;

        color: #c7d2fe;

        font-size: 11px;
        font-weight: 850;

        letter-spacing: 1.8px;
      }


      .tasks-hero h1 {
        margin: 0;

        font-size:
          clamp(32px,4vw,50px);

        line-height: 1.05;

        letter-spacing: -1.5px;
      }


      .tasks-hero h1 span {
        color: #a5b4fc;
      }


      .tasks-hero p {
        max-width: 650px;

        margin-top: 16px;

        color: #d7dcf8;

        line-height: 1.7;

        font-size: 15px;
      }


      .tasks-hero-side {
        min-width: 175px;
      }


      .tasks-progress-box {
        min-width: 150px;

        padding: 20px;

        border-radius: 18px;

        text-align: center;

        background:
          rgba(255,255,255,0.10);

        border:
          1px solid
          rgba(255,255,255,0.14);

        backdrop-filter:
          blur(10px);
      }


      .tasks-progress-value {
        font-size: 35px;

        font-weight: 900;
      }


      .tasks-progress-label {
        margin-top: 4px;

        color: #c7d2fe;

        font-size: 9px;

        font-weight: 850;

        letter-spacing: 1.2px;
      }



      /* STATS */

      .tasks-stats {
        display: grid;

        grid-template-columns:
          repeat(4,minmax(0,1fr));

        gap: 18px;

        margin-bottom: 28px;
      }


      .tasks-stat-card {
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


      .tasks-stat-card:hover {
        transform:
          translateY(-3px);

        box-shadow:
          0 16px 38px
          rgba(15,23,42,0.09);
      }


      .tasks-stat-icon {
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


      .tasks-purple {
        background: #eef2ff;
        color: #4f46e5;
      }


      .tasks-orange {
        background: #fff7ed;
        color: #ea580c;
      }


      .tasks-green {
        background: #f0fdf4;
        color: #16a34a;
      }


      .tasks-blue {
        background: #eff6ff;
        color: #2563eb;
      }


      .tasks-stat-card span {
        display: block;

        color: #64748b;

        font-size: 12px;

        font-weight: 750;
      }


      .tasks-stat-card h2 {
        margin: 6px 0 3px;

        color: #0f172a;

        font-size: 30px;
      }


      .tasks-stat-card h3 {
        margin: 8px 0 3px;

        color: #172033;

        font-size: 16px;
      }


      .tasks-stat-card p {
        margin: 0;

        color: #9aa4b4;

        font-size: 10px;
      }



      /* MESSAGE */

      .tasks-message {
        display: flex;
        align-items: center;

        gap: 10px;

        margin-bottom: 22px;

        padding: 13px 16px;

        border-radius: 12px;

        color: #166534;

        background: #f0fdf4;

        border: 1px solid #bbf7d0;

        font-size: 12px;
        font-weight: 700;
      }


      .tasks-message div {
        width: 25px;
        height: 25px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        color: white;

        background: #22c55e;
      }



      /* PANELS */

      .tasks-panel {
        margin-bottom: 25px;

        overflow: hidden;

        border-radius: 20px;

        background: white;

        border:
          1px solid #e7ebf2;

        box-shadow:
          0 12px 40px
          rgba(15,23,42,0.055);
      }


      .tasks-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 20px;

        padding: 25px 28px;

        border-bottom:
          1px solid #edf0f5;
      }


      .tasks-section-label {
        margin-bottom: 6px;

        color: #6366f1;

        font-size: 10px;

        font-weight: 900;

        letter-spacing: 1.6px;
      }


      .tasks-panel-header h2 {
        margin: 0;

        font-size: 21px;

        color: #172033;
      }


      .tasks-panel-header p {
        margin: 7px 0 0;

        color: #8993a6;

        font-size: 12px;
      }


      .tasks-count-badge {
        padding: 8px 12px;

        border-radius: 999px;

        font-size: 10px;

        font-weight: 850;
      }


      .tasks-count-pending {
        color: #b45309;

        background: #fffbeb;

        border: 1px solid #fde68a;
      }


      .tasks-count-complete {
        color: #15803d;

        background: #f0fdf4;

        border: 1px solid #bbf7d0;
      }



      /* GRID */

      .tasks-card-grid {
        display: grid;

        grid-template-columns:
          repeat(2,minmax(0,1fr));

        gap: 18px;

        padding: 24px;
      }



      /* TASK CARD */

      .tasks-card {
        padding: 21px;

        border-radius: 16px;

        background:
          linear-gradient(
            180deg,
            #ffffff,
            #fbfcff
          );

        border:
          1px solid #e5eaf1;

        box-shadow:
          0 6px 20px
          rgba(15,23,42,0.045);

        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }


      .tasks-card:hover {
        transform:
          translateY(-3px);

        box-shadow:
          0 14px 35px
          rgba(15,23,42,0.08);
      }


      .tasks-card-completed {
        background:
          linear-gradient(
            180deg,
            #ffffff,
            #f8fdf9
          );
      }


      .tasks-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 12px;

        margin-bottom: 15px;
      }


      .tasks-card-icon {
        width: 39px;
        height: 39px;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 11px;

        color: white;

        font-size: 10px;
        font-weight: 900;

        background:
          linear-gradient(
            135deg,
            #4f46e5,
            #7c3aed
          );

        box-shadow:
          0 5px 14px
          rgba(79,70,229,0.20);
      }


      .tasks-complete-icon {
        background:
          linear-gradient(
            135deg,
            #22c55e,
            #15803d
          );
      }


      .tasks-card h3 {
        margin: 0 0 17px;

        color: #172033;

        font-size: 18px;
      }



      /* STATUS */

      .tasks-status {
        display: inline-flex;
        align-items: center;

        gap: 7px;

        padding: 6px 10px;

        border-radius: 999px;

        font-size: 9px;

        font-weight: 900;

        letter-spacing: 0.5px;
      }


      .tasks-status span {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: currentColor;
      }


      .tasks-status-pending {
        color: #b45309;

        background: #fffbeb;

        border: 1px solid #fde68a;
      }


      .tasks-status-complete {
        color: #15803d;

        background: #f0fdf4;

        border: 1px solid #bbf7d0;
      }



      /* STUDENT */

      .tasks-student-box {
        display: flex;
        align-items: center;

        gap: 11px;

        padding: 13px;

        margin-bottom: 16px;

        border-radius: 12px;

        background: #f8fafc;

        border:
          1px solid #edf1f5;
      }


      .tasks-avatar {
        width: 38px;
        height: 38px;

        display: flex;
        align-items: center;
        justify-content: center;

        flex-shrink: 0;

        border-radius: 10px;

        color: #4338ca;

        background: #e0e7ff;

        font-size: 10px;

        font-weight: 900;
      }


      .tasks-student-box strong {
        display: block;

        color: #334155;

        font-size: 12px;
      }


      .tasks-student-box span {
        display: block;

        margin-top: 3px;

        color: #94a3b8;

        font-size: 9px;
      }



      /* DETAILS */

      .tasks-details {
        display: grid;

        grid-template-columns:
          1fr 1fr;

        gap: 13px;

        margin-bottom: 15px;
      }


      .tasks-details > div {
        padding: 11px;

        border-radius: 10px;

        border:
          1px solid #edf0f5;

        background: #ffffff;
      }


      .tasks-detail-label {
        display: block;

        margin-bottom: 5px;

        color: #94a3b8;

        font-size: 8px;

        font-weight: 850;

        letter-spacing: 0.7px;

        text-transform: uppercase;
      }


      .tasks-details strong {
        color: #475569;

        font-size: 11px;
      }



      /* REASON */

      .tasks-reason {
        padding: 12px;

        margin-bottom: 16px;

        border-radius: 10px;

        background: #fafaff;

        border-left:
          3px solid #6366f1;
      }


      .tasks-reason span {
        color: #6366f1;

        font-size: 8px;

        font-weight: 900;

        letter-spacing: 0.9px;
      }


      .tasks-reason p {
        margin: 5px 0 0;

        color: #64748b;

        font-size: 11px;

        line-height: 1.5;
      }



      /* BUTTON */

      .tasks-complete-button {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 8px;

        padding: 11px;

        border: none;

        border-radius: 10px;

        color: white;

        background:
          linear-gradient(
            135deg,
            #16a34a,
            #22c55e
          );

        font-size: 11px;

        font-weight: 850;

        cursor: pointer;

        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }


      .tasks-complete-button:hover {
        transform:
          translateY(-1px);

        box-shadow:
          0 8px 20px
          rgba(34,197,94,0.22);
      }


      .tasks-completed-note {
        padding: 10px;

        border-radius: 9px;

        text-align: center;

        color: #15803d;

        background: #f0fdf4;

        font-size: 10px;

        font-weight: 750;
      }



      /* EMPTY */

      .tasks-empty {
        padding: 55px 20px;

        text-align: center;
      }


      .tasks-empty-icon {
        width: 48px;
        height: 48px;

        margin: auto;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 14px;

        color: #4f46e5;

        background: #eef2ff;

        font-size: 20px;
      }


      .tasks-empty h3 {
        margin: 13px 0 5px;

        color: #334155;
      }


      .tasks-empty p {
        margin: 0;

        color: #94a3b8;

        font-size: 11px;
      }



      /* FOOTER */

      .tasks-footer {
        display: flex;
        align-items: center;
        justify-content: center;

        gap: 7px;

        margin-top: 18px;

        color: #94a3b8;

        font-size: 10px;
      }


      .tasks-footer span {
        width: 6px;
        height: 6px;

        border-radius: 50%;

        background: #22c55e;
      }



      /* LOADER */

      .tasks-loading {
        min-height: 70vh;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        color: #334155;
      }


      .tasks-loading p {
        margin-top: 5px;

        color: #94a3b8;

        font-size: 12px;
      }


      .tasks-loader {
        width: 42px;
        height: 42px;

        margin-bottom: 15px;

        border-radius: 50%;

        border:
          4px solid #e0e7ff;

        border-top-color:
          #4f46e5;

        animation:
          tasks-spin
          0.8s linear infinite;
      }


      @keyframes tasks-spin {
        to {
          transform:
            rotate(360deg);
        }
      }



      /* RESPONSIVE */

      @media (max-width: 1050px) {

        .tasks-stats {
          grid-template-columns:
            repeat(2,1fr);
        }

      }


      @media (max-width: 850px) {

        .tasks-card-grid {
          grid-template-columns: 1fr;
        }

      }


      @media (max-width: 650px) {

        .tasks-page {
          padding:
            20px 14px 50px;
        }

        .tasks-hero {
          flex-direction:
            column;

          align-items:
            flex-start;

          padding:
            28px 23px;
        }

        .tasks-stats {
          grid-template-columns:
            1fr;
        }

        .tasks-panel-header {
          flex-direction:
            column;

          align-items:
            flex-start;
        }

        .tasks-card-grid {
          padding: 15px;
        }

        .tasks-details {
          grid-template-columns:
            1fr;
        }

      }

    `}</style>
  );
}

export default Tasks;