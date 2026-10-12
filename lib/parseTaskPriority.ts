import { TaskRecommendation } from "@/types/task-types";

export const parseTaskPriority = (
  answer: string
): TaskRecommendation[] => {
  const tableRows = answer
    .split("\n")
    .filter((line) => /^\|\s*\d+\s*\|/.test(line));

  return tableRows
    .map((line) => {
      const columns = line
        .split("|")
        .slice(1, -1)
        .map((column) => column.trim());

      if (columns.length < 5) return null;

      const [rank, taskId, title, score, urgency, reason] = columns;

      if (
        !/^\d+$/.test(rank) ||
        !/^\d+$/.test(score) ||
        !/^[0-9a-f-]{36}$/i.test(taskId)
      ) {
        return null;
      }

      return {
        rank: Number(rank),
        taskId,
        title,
        score: Number(score),
        urgency: urgency as TaskRecommendation["urgency"],
        reason: reason
          .replace(/\*\*/g, "")
          .replace(/<[^>]*>/g, ""),
      };
    })
    .filter(
      (item): item is TaskRecommendation => item !== null
    );
};
