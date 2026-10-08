import React from 'react'

import RecentTasks from './_component/recent-tasks';
import TasksStatus from './_component/tasks-status';
import TaskPriority from './_component/task-priority';

const DashboardPage = () => {
  return (
    <div>
      <TasksStatus />
      <div>
        <TaskPriority/>
      </div>
      <div className="h-15">
        <RecentTasks />
      </div>
    </div>
  )
}

export default DashboardPage;
