"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTaskByStatusMutation } from "../../task/_hooks/task-hooks";
import { formatDate } from "@/lib/dateFormater";
import { TaskStatusType } from "@/types/task-types";

const getDeadlineInfo = (
  startDate: Date,
  endDate: Date,
  now: number
) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return {
      progress: 0,
      label: "Invalid deadline",
      remaining: "",
      variant: "secondary" as const,
    };
  }

  if (end <= start) {
    const passed = now >= end;

    return {
      progress: passed ? 100 : 0,
      label: passed ? "Overdue" : "Due now",
      remaining: "",
      variant: passed ? "destructive" as const : "secondary" as const,
    };
  }

  const progress = Math.min(
    100,
    Math.max(0, ((now - start) / (end - start)) * 100)
  );

  const remainingMs = end - now;

  let remaining = "";

  if (remainingMs <= 0) {
    remaining = "Overdue";
  } else {
    const totalHours = Math.floor(
      remainingMs / (1000 * 60 * 60)
    );

    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    remaining =
      days > 0
        ? `${days}d ${hours}h left`
        : `${hours}h left`;
  }

  return {
    progress: Math.round(progress),
    label:
      now < start
        ? "Not started"
        : now >= end
          ? "Deadline passed"
          : "Time elapsed",
    remaining,
    variant:
      remainingMs <= 0 || progress >= 80
        ? "destructive" as const
        : "secondary" as const,
  };
};

export function TaskDue() {
  const [now, setNow] = useState(() => Date.now());

  const {
    mutate: taskByStatusMutation,
    data: tasks,
    isPending,
  } = useTaskByStatusMutation();

  useEffect(() => {
    taskByStatusMutation(TaskStatusType.IN_PROGRESS);
  }, [taskByStatusMutation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="rounded-sm md:w-[50%] w-full h-110 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          Task Deadline Tracking
        </CardTitle>

        <CardDescription>
          Monitor deadlines for in-progress tasks
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {isPending ? (
          <p className="p-5 text-sm text-muted-foreground">
            Loading tasks...
          </p>
        ) : !tasks || tasks.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground text-center">
            No in-progress tasks found.
          </p>
        ) : (
            <div className="divide-y h-87.5 transition duration-300 ease-in-out hover:overflow-y-auto">
            {tasks.map((task) => {
              const deadline = getDeadlineInfo(
                task.startDate,
                task.endDate,
                now
              );
              return (
                <div
                  key={task.id}
                  className="space-y-3 p-4 transition-colors hover:bg-muted/40"
                >
                  {/* Task title and status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-semibold">
                        {task.title ?? "Untitled task"}
                      </p>

                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {task.description ?? "No description"}
                      </p>
                    </div>

                    <Badge variant="outline" className="shrink-0">
                      {task.status.replaceAll("_", " ")}
                    </Badge>
                  </div>

                  {/* Progress percentage */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Deadline progress
                    </span>

                    <span className="font-semibold tabular-nums">
                      {deadline.progress}%
                    </span>
                  </div>

                  <Progress
                    value={deadline.progress}
                    className="h-2"
                  />

                  {/* Remaining time and priority */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant={deadline.variant}>
                      {deadline.remaining || deadline.label}
                    </Badge>

                    <Badge
                      variant={
                        task.priority === "HIGH"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      Start: {formatDate(task.startDate)}
                    </span>

                    <span>
                      Due: {formatDate(task.endDate)}
                    </span>
                  </div>
                </div>
              );
            })}
            </div>
        )}
      </CardContent>
    </Card>
  );
}