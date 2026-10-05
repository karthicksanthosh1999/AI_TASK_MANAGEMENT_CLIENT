"use client";

import { useGetTask } from "../../task/_hooks/task-hooks";

import {
    Box,
  CheckCircle2,
  CircleAlert,
  ListTodo,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useGetAllProjects } from "../../project/_hooks/project-hooks";

type StatProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  note: string;
  iconClassName: string;
  iconBgClassName: string;
};

function Stat({
  icon: Icon,
  label,
  value,
  note,
  iconClassName,
  iconBgClassName,
}: StatProps) {
  return (
    <Card className="group overflow-hidden border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md mt-2">
      <CardContent className="flex items-center justify-between flex-row-reverse">
        <div className="relative flex items-start justify-between">
          {/* Icon */}
          <div
            className={`flex size-11 items-center justify-center rounded-xl ${iconBgClassName}`}
          >
            <Icon className={`size-5 ${iconClassName}`} />
          </div>
        </div>
        {/* Content */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>

          <p className="text-3xl font-bold tracking-tight">
            {value}
          </p>

          <p className="text-xs text-muted-foreground">
            {note}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const TasksStatus = () => {
  const { data: counts } = useGetTask({
    limit: 10,
    page: 1,
  });

  const { data: criticalTasks } = useGetTask({
    limit: 10,
    page: 1,
    status: "IN_PROGRESS",
    priority: "CRITICAL"
  });

  const { data: projects } = useGetAllProjects();

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {/* Open Tasks */}
      <Stat
        icon={ListTodo}
        label="Open Tasks"
        value={counts?.count?.IN_PROGRESS ?? 0}
        note="Tasks currently in progress"
        iconClassName="text-blue-600 dark:text-blue-400"
        iconBgClassName="bg-blue-100 dark:bg-blue-950/50"
      />

      {/* Completed */}
      <Stat
        icon={CheckCircle2}
        label="Completed"
        value={counts?.count?.COMPLETED ?? 0}
        note="Successfully completed tasks"
        iconClassName="text-emerald-600 dark:text-emerald-400"
        iconBgClassName="bg-emerald-100 dark:bg-emerald-950/50"
      />

      {/* Critical */}
      <Stat
        icon={CircleAlert}
        label="High Priority"
        value={criticalTasks?.data.length ?? 0}
        note="Needs immediate attention"
        iconClassName="text-red-600 dark:text-red-400"
        iconBgClassName="bg-red-100 dark:bg-red-950/50"
      />

      {/* PROJECTS */}
      <Stat
        icon={Box}
        label="All Projects"
        value={projects?.length ?? 0}
        note="Overall Projects"
        iconClassName="text-orange-600 dark:text-orange-400"
        iconBgClassName="bg-orange-100 dark:bg-orange-950/50"
      />
    </div>
  );
};

export default TasksStatus;