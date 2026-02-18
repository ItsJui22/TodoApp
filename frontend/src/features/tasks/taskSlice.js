import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    setTasks: (state, action) => action.payload,
    addTask: (state, action) => {
      state.push(action.payload);
    },
    updateTask: (state, action) => {
      const idx = state.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteTask: (state, action) => state.filter(t => t.id !== action.payload),
    removeTasks: (state, action) => {
      // action.payload = array of task ids to remove
      return state.filter(t => !action.payload.includes(t.id));
    }
  }
});

export const { setTasks, addTask, updateTask, deleteTask, removeTasks } = taskSlice.actions;
export default taskSlice.reducer;
