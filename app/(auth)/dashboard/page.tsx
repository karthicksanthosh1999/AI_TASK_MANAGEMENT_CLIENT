import React from 'react'

import RecentTasks from './_component/recent-tasks';
import TasksStatus from './_component/tasks-status';

const DashboardPage = () => {
  return (
    <div>
      <TasksStatus />
      <div className="h-15">
        <RecentTasks />
      </div>
    </div>
  )
}

export default DashboardPage;
