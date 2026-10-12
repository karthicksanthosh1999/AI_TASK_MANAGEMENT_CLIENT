
'use client';

import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import type {
  TaskPriorityApiResponse,
  TaskRecommendation,
} from "@/types/task-types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";

const TaskPriority = () => {
  const [recommendations, setRecommendations] = useState<
    TaskRecommendation[]
  >([]);

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<TaskPriorityApiResponse>(
        "/api/ai/task-prioritization"
      );

      const result:TaskPriorityApiResponse = response.data;

      console.log("RESULT :", result)

      if (!result.success) {
        throw new Error(result.message || "AI analysis failed.");
      }

      setRecommendations(result.data.recommendations);
      setSummary(result.data.summary);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void analyzeTasks();
  }, [analyzeTasks]);
  console.log("recommendations",recommendations)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Task Prioritization
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recommended tasks based on urgency and importance.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void analyzeTasks()}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Analyzing..." : "Refresh"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && recommendations.length === 0 && (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => void analyzeTasks()}
              disabled={loading}
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No task recommendations available.
          </p>
        )}

        {recommendations.map((task: TaskRecommendation) => (
          <div
            key={task.taskId}
            className="rounded-xl border p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <h3 className="font-semibold">
                  #{task.rank} — {task.taskId}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {task.reason}
                </p>
              </div>

              <div className="shrink-0 space-y-2 text-right">
                <p className="text-lg font-semibold">
                  {task.score}
                  <span className="text-xs text-muted-foreground">
                    /100
                  </span>
                </p>

                <Badge
                  variant="outline"
                  className={
                    task.urgency === "HIGH"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : task.urgency === "MEDIUM"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                  }
                >
                  {task.urgency}
                </Badge>
              </div>
            </div>
          </div>
        ))}

        {summary && (
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <Sparkles className="size-4 text-primary" />
              AI Recommendation
            </div>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskPriority;
