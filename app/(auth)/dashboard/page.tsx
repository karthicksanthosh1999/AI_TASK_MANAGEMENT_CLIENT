import RecentTasks from './_component/recent-tasks';
import TasksStatus from './_component/tasks-status';
import PieChart from './_component/pie-chart';

const DashboardPage = () => {
  return (
    <div className="space-y-2">
      <TasksStatus />
      <div>
        {/* <TaskPriority/> */}
        <PieChart />
      </div>
      <div className="h-15">
        <RecentTasks />
      </div>
    </div>
  )
}

export default DashboardPage;
