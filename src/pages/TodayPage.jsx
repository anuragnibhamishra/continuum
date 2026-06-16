import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import FloatingActionButton from "../components/FloatingActionButton";
import DateNavigator from "../components/DateNavigator";
import DateScroller from "../components/DateScroller";
import HabitList from "../components/today/HabitList";
import TaskList from "../components/today/TaskList";
import CreateItemModal from "../components/today/CreateItemModal";
import HabitEditModal from "../features/habits/HabitEditModal";
import TaskEditModal from "../features/tasks/TaskEditModal";
import {
  selectHabitsDueOnDate,
  checkIn,
  uncheck,
  toDateKey,
  setHabitEntryStatus,
} from "../features/habits/habitsSlice";
import { selectTasksDueOnDate, completeTask } from "../features/tasks/tasksSlice";
import { useHabitActions } from "../features/habits/useHabitActions";
import { useTaskActions } from "../features/tasks/useTaskActions";

function TodayPage() {
  const dispatch = useDispatch();
  const { openMobileMenu } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const dateKey = toDateKey(selectedDate);
  const habitsDue = useSelector((state) => selectHabitsDueOnDate(state, selectedDate));
  const tasksDue = useSelector((state) => selectTasksDueOnDate(state, selectedDate));

  const {
    editingHabit,
    editForm: habitEditForm,
    setEditForm: setHabitEditForm,
    openEdit: openHabitEdit,
    closeEdit: closeHabitEdit,
    submitEdit: submitHabitEdit,
    deleteHabit,
  } = useHabitActions();

  const {
    editingTask,
    editForm: taskEditForm,
    setEditForm: setTaskEditForm,
    openEdit: openTaskEdit,
    closeEdit: closeTaskEdit,
    submitEdit: submitTaskEdit,
    deleteTask,
  } = useTaskActions();

  const handleHabitToggle = (habitId, checked) => {
    if (checked) {
      dispatch(uncheck({ habitId, dateKey }));
    } else {
      dispatch(checkIn({ habitId, dateKey }));
    }
  };

  const handleStatusChange = (habitId, status) => {
    dispatch(setHabitEntryStatus({ habitId, dateKey, status }));
  };

  const handleTaskComplete = (taskId) => {
    dispatch(completeTask(taskId));
  };

  return (
    <div className="flex h-full flex-col gap-8">
      <DateNavigator selectedDate={selectedDate} onMenuClick={openMobileMenu} />
      <DateScroller selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <HabitList
        habitsDue={habitsDue}
        dateKey={dateKey}
        onToggle={handleHabitToggle}
        onStatusChange={handleStatusChange}
        onEdit={openHabitEdit}
        onDelete={deleteHabit}
      />

      <TaskList
        tasksDue={tasksDue}
        onComplete={handleTaskComplete}
        onEdit={openTaskEdit}
        onDelete={deleteTask}
      />

      <FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />

      {isCreateModalOpen && (
        <CreateItemModal
          selectedDate={selectedDate}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {editingHabit && (
        <HabitEditModal
          habit={editingHabit}
          form={habitEditForm}
          onChange={setHabitEditForm}
          onClose={closeHabitEdit}
          onSubmit={submitHabitEdit}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          form={taskEditForm}
          onChange={setTaskEditForm}
          onClose={closeTaskEdit}
          onSubmit={submitTaskEdit}
        />
      )}
    </div>
  );
}

export default TodayPage;
