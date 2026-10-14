import RecentTasks from './_component/recent-tasks';
import TasksStatus from './_component/tasks-status';
import PieChart from './_component/pie-chart';
import { TaskDue } from './_component/task-due';

const DashboardPage = () => {
  return (
    <div className="space-y-2">
      <TasksStatus />
      <div className="gap-2 w-full flex">
        {/* <TaskPriority/> */}
        <PieChart />
        <TaskDue />
      </div>
      <div className="h-15">
        <RecentTasks />
      </div>
    </div>
  )
}

export default DashboardPage;
