// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { useDispatch, useSelector } from "react-redux";
// import { setTasks, addTask, updateTask, deleteTask as deleteTaskRedux } from "../features/tasks/taskSlice";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../features/auth/authSlice";
// export default function Dashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const tasks = useSelector((state) => state.tasks);
//   const token = useSelector((state) => state.auth.token);

//   const [headline, setHeadline] = useState("");
//   const [description, setDescription] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [selectedTasks, setSelectedTasks] = useState([]);
//   const [bulkStatus, setBulkStatus] = useState("");

//   // Load tasks from backend
//   useEffect(() => {
//     api.get("/tasks", { headers: { Authorization: token } })
//       .then(res => dispatch(setTasks(res.data)))
//       .catch(err => console.error(err));
//   }, []);

//   // Add new task
//   const createTask = async (e) => {
//     e.preventDefault();
//     if (!headline.trim()) return;

//     const today = new Date().toISOString().split("T")[0];

//     const res = await api.post(
//       "/tasks",
//       {
//         title: headline,
//         description,
//         date: deadline,
//         status: "pending",
//         isDueToday: deadline === today,
//       },
//       { headers: { Authorization: token } }
//     );

//     dispatch(addTask(res.data));
//     setHeadline(""); setDescription(""); setDeadline("");
//   };

//   // Select/Deselect tasks
//   const toggleSelect = (id) => {
//     setSelectedTasks(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );
//   };

//   // Bulk move tasks
//   const bulkMove = async () => {
//     if (!bulkStatus || selectedTasks.length === 0) return;

//     await Promise.all(
//       tasks
//         .filter(task => selectedTasks.includes(task.id))
//         .map(task => changeStatus(task.id, bulkStatus))
//     );

//     setSelectedTasks([]);
//     setBulkStatus("");
//   };

//   // Change status
//   const changeStatus = async (id, status) => {
//     await api.put("/tasks/status", { id, status }, { headers: { Authorization: token } });
//     dispatch(updateTask({ id, status }));
//   };

//   // Delete task
//   const deleteTask = async (id) => {
//     await api.delete(`/tasks/${id}`, { headers: { Authorization: token } });
//     dispatch(deleteTaskRedux(id));
//   };

//   // Drag & Drop
//   const onDragEnd = (result) => {
//     if (!result.destination) return;
//     const taskId = Number(result.draggableId);
//     const newStatus = result.destination.droppableId;
//     changeStatus(taskId, newStatus);
//   };

//   // Logout
//   const handleLogout = () => {
//     dispatch(logout()); // clear Redux
//     localStorage.removeItem("token"); // clear any saved token
//     navigate("/login");
//   };

//   const columns = {
//     pending: tasks.filter(t => t.status === "pending"),
//     ongoing: tasks.filter(t => t.status === "ongoing"),
//     completed: tasks.filter(t => t.status === "completed"),
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-indigo-600 to-purple-700 p-10">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl text-white font-bold">Task Board</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>

//         {/* Add Task Form */}
//         <form onSubmit={createTask} className="flex gap-2 mb-4">
//           <input
//             placeholder="Task Headline"
//             value={headline}
//             onChange={(e) => setHeadline(e.target.value)}
//             className="p-4 border rounded flex-1"
//           />
//           <input
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="p-4 border rounded flex-1"
//           />
//           <input
//             type="date"
//             value={deadline}
//             onChange={e => setDeadline(e.target.value)}
//             className="p-2 border rounded"
//           />
//           <button className="bg-white text-indigo-600 px-6 py-2 rounded hover:scale-105 transition">
//             Add
//           </button>
//         </form>

//         {/* Bulk Actions */}
//         {selectedTasks.length > 0 && (
//           <div className="mb-4 flex gap-2 items-center">
//             <select
//               value={bulkStatus}
//               onChange={(e) => setBulkStatus(e.target.value)}
//               className="p-2 rounded border border-gray-300"
//             >
//               <option value="">Move selected to...</option>
//               <option value="pending">Pending</option>
//               <option value="ongoing">Ongoing</option>
//               <option value="completed">Completed</option>
//             </select>
//             <button
//               onClick={bulkMove}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Apply
//             </button>
//           </div>
//         )}

//         {/* Drag & Drop Columns */}
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {Object.entries(columns).map(([key, value]) => (
//               <Droppable key={key} droppableId={key}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl min-h-[400px]"
//                   >
//                     <h2 className="text-xl text-white font-bold mb-4 capitalize">{key}</h2>

//                     {value.map((task, index) => (
//                       <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             className="bg-white p-4 rounded-xl mb-4 shadow-md hover:shadow-xl transition flex justify-between items-start"
//                           >
//                             <div>
//                               <input
//                                 type="checkbox"
//                                 className="mr-2"
//                                 checked={selectedTasks.includes(task.id)}
//                                 onChange={() => toggleSelect(task.id)}
//                               />
//                               <p className="font-semibold">{task.title}</p>
//                               {task.description && <p className="text-gray-600">{task.description}</p>}
//                               {task.date && <p className="text-gray-400 text-sm">{task.date}</p>}
//                             </div>
//                             <button
//                               onClick={() => deleteTask(task.id)}
//                               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             ))}
//           </div>
//         </DragDropContext>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask as deleteTaskRedux,
} from "../features/tasks/taskSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks);
  const token = useSelector((state) => state.auth.token);

  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");

  // Load tasks
  useEffect(() => {
    api
      .get("/tasks", { headers: { Authorization: token } })
      .then((res) => dispatch(setTasks(res.data)))
      .catch((err) => console.error(err));
  }, [dispatch, token]);

  // Add task
  const createTask = async (e) => {
    e.preventDefault();
    if (!headline.trim()) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      const res = await api.post(
        "/tasks",
        {
          title: headline,
          description,
          due_date: deadline,
          status: "pending",
          isDueToday: deadline === today,
        },
        { headers: { Authorization: token } }
      );
      console.log("NEW TASK:", res.data);

      dispatch(addTask(res.data)); // Add to redux
      setHeadline("");
      setDescription("");
      setDeadline("");
    } catch (err) {
      console.error("Add task error:", err.response || err);
      alert("Failed to add task");
    }
  };

  const toggleSelect = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bulkMove = async () => {
    if (!bulkStatus || selectedTasks.length === 0) return;

    await Promise.all(
      tasks
        .filter((t) => selectedTasks.includes(t.id))
        .map((t) => changeStatus(t.id, bulkStatus))
    );

    setSelectedTasks([]);
    setBulkStatus("");
  };

 const changeStatus = async (id, status) => {
  const res = await api.put(
    "/tasks/status",
    { id, status },
    { headers: { Authorization: token } }
  );

  dispatch(updateTask(res.data)); // পুরো updated task পাঠাও
};


  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`, { headers: { Authorization: token } });
    dispatch(deleteTaskRedux(id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const taskId = Number(result.draggableId);
    const newStatus = result.destination.droppableId;
    changeStatus(taskId, newStatus);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const columns = {
    pending: tasks.filter((t) => t.status === "pending"),
    ongoing: tasks.filter((t) => t.status === "ongoing"),
    completed: tasks.filter((t) => t.status === "completed"),
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-700 to-purple-600 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-7xl mb-6">
        <h1 className="text-4xl font-bold text-white">Task Board</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <div className="bg-white/20 backdrop-blur-lg p-9 rounded-2xl shadow mb-6 w-full max-w-2xl">
        <form className="flex flex-col gap-2" onSubmit={createTask}>
          <input
            type="text"
            placeholder="Task Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none text-black"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-lg border resize-none h-20 focus:ring-2 focus:ring-indigo-400 outline-none text-black"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none text-black"
          />
          <button className="w-full  bg-indigo-600 text-white rounded-lg hover:bg-indigo-400 transition">
            Add Task
          </button>
        </form>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="mb-4 flex gap-2 items-center w-full max-w-xl">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="p-2 border rounded flex-1"
          >
            <option value="">Move selected to...</option>
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={bulkMove}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Apply
          </button>
        </div>
      )}

      {/* Task Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {Object.entries(columns).map(([key, value]) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl min-h-[500px] max-h-[70vh] overflow-y-auto"
                >
                  <h2 className="text-xl text-white font-bold mb-4 capitalize">
                    {key}
                  </h2>

                  {value.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 rounded-2xl mb-4 shadow-md hover:shadow-xl transition flex justify-between items-start"
                        >
                          <div>
                            <input
                              type="checkbox"
                              className="w-5 h-5 mr-2"
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => toggleSelect(task.id)}
                            />
                            <p className="font-semibold text-black">{task.title}</p>
                            {task.description && (
                              <p className="text-gray-600">{task.description}</p>
                            )}
                         {task.due_date && (
  <p className="text-gray-500 text-xs mt-1">
    📅 {new Date(task.due_date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
    <br></br>
    ⏰ {new Date(task.created_at).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}
  </p>
)}

                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}


