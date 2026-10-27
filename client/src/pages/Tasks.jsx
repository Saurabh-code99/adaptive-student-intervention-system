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
      console.error(
        "Failed to fetch tasks:",
        error
      );

      setMessage(
        "Failed to load tasks."
      );
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

      setMessage(
        response.data.message
      );

      await fetchTasks();

    } catch (error) {
      console.error(
        "Failed to complete task:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to complete task."
      );
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2>Loading tasks...</h2>
      </div>
    );
  }

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "PENDING"
  );

  const overdueTasks = tasks.filter(
    (task) =>
      task.status === "OVERDUE"
  );

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "COMPLETED"
  );

  const renderTaskCard = (
    task,
    showButton = true
  ) => {
    let badgeClass =
      "badge badge-pending";

    if (task.status === "COMPLETED") {
      badgeClass =
        "badge badge-completed";
    }

    if (task.status === "OVERDUE") {
      badgeClass =
        "badge badge-high";
    }

    return (
      <div
        className="task-card"
        key={task._id}
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "10px"
          }}
        >

          <h3>
            {task.title}
          </h3>

          <span
            className={badgeClass}
          >
            {task.status}
          </span>

        </div>

        <p>
          <strong>
            Student:
          </strong>{" "}
          {task.studentId?.name ||
            "Unknown"}
        </p>

        <p>
          <strong>
            Roll Number:
          </strong>{" "}
          {task.studentId
            ?.rollNumber || "-"}
        </p>

        <p>
          <strong>
            Class:
          </strong>{" "}
          {task.studentId
            ?.className || "-"}
        </p>

        <p>
          <strong>
            Assigned To:
          </strong>{" "}
          {task.assignedTo}
        </p>

        <p>
          <strong>
            Deadline:
          </strong>{" "}
          {new Date(
            task.deadline
          ).toLocaleDateString()}
        </p>

        {task.interventionId
          ?.reason && (
          <p>
            <strong>
              Reason:
            </strong>{" "}
            {
              task
                .interventionId
                .reason
            }
          </p>
        )}

        {showButton &&
          task.status !==
            "COMPLETED" && (
            <button
              className="btn btn-success"
              style={{
                marginTop: "14px"
              }}
              onClick={() =>
                completeTask(
                  task._id
                )
              }
            >
              Mark Completed
            </button>
          )}

      </div>
    );
  };

  return (
    <div className="page">

      <div className="page-header">

        <h1>
          Intervention Task Board
        </h1>

        <p className="subtitle">
          Track approved interventions,
          responsibilities, deadlines
          and completion.
        </p>

      </div>


      {/* SUMMARY */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-title">
            Total Tasks
          </div>

          <div className="stat-value">
            {tasks.length}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-title">
            Pending
          </div>

          <div className="stat-value">
            {pendingTasks.length}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-title">
            Overdue
          </div>

          <div className="stat-value">
            {overdueTasks.length}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-title">
            Completed
          </div>

          <div className="stat-value">
            {completedTasks.length}
          </div>

        </div>

      </div>


      {message && (
        <div
          className="message"
          style={{
            marginBottom:
              "20px"
          }}
        >
          {message}
        </div>
      )}


      {/* OVERDUE */}

      {overdueTasks.length >
        0 && (

        <div className="panel">

          <h2 className="panel-title">
            ⚠ Overdue Tasks
          </h2>

          <p
            className="subtitle"
            style={{
              marginBottom:
                "20px"
            }}
          >
            These interventions
            require immediate
            attention.
          </p>

          <div className="task-grid">

            {overdueTasks.map(
              (task) =>
                renderTaskCard(
                  task
                )
            )}

          </div>

        </div>

      )}


      {/* PENDING */}

      <div className="panel">

        <h2 className="panel-title">
          Pending Tasks
        </h2>

        {pendingTasks.length ===
        0 ? (

          <p className="subtitle">
            No pending tasks.
          </p>

        ) : (

          <div className="task-grid">

            {pendingTasks.map(
              (task) =>
                renderTaskCard(
                  task
                )
            )}

          </div>

        )}

      </div>


      {/* COMPLETED */}

      <div className="panel">

        <h2 className="panel-title">
          Completed Tasks
        </h2>

        {completedTasks.length ===
        0 ? (

          <p className="subtitle">
            No completed tasks yet.
          </p>

        ) : (

          <div className="task-grid">

            {completedTasks.map(
              (task) =>
                renderTaskCard(
                  task,
                  false
                )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Tasks;