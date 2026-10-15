"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { useGetTaskStatusByCount } from "../../task/_hooks/task-hooks";
import { TaskStatusByCountType } from "@/types/task-types";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const COLORS: Record<string, string> = {
  PLANNED: "#F59E0B",
  IN_PROGRESS: "#3B82F6",
  COMPLETED: "#22C55E"
};

const PieChart = () => {

    const { data } = useGetTaskStatusByCount();

    const tasks: TaskStatusByCountType = data ?? {
      PLANNED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

  const statuses = ["PLANNED", "IN_PROGRESS", "COMPLETED"] as const;

  const chartData = statuses.map((status) => ({
    name: status.replace("_", " "),
    value: tasks[status],
    color: COLORS[status],
  }));

  return (
    <Card className="rounded-xs border shadow-sm md:w-[25%] w-full">
      <CardHeader className="text-lg font-semibold">
        Task Status Overview
      <CardDescription className="text-xs">Total Tasks: {tasks.ALL}</CardDescription>
      </CardHeader>
      <Separator/>
      <CardContent>
        {tasks.ALL === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            No tasks available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chartData.filter((item) => item.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null;
                  }

                  const { cx, cy } = viewBox;

                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-100"
                        style={{ fontSize: 28, fontWeight: 700 }}
                      >
                        {tasks.ALL}
                      </text>

                      <text
                        x={cx}
                        y={cy + 20}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-400"
                        style={{ fontSize: 12 }}
                      >
                        Total Tasks
                      </text>
                    </g>
                  );
                }}
              />
                {chartData
                  .filter((item) => item.value > 0)
                  .map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
              </Pie>

              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PieChart;