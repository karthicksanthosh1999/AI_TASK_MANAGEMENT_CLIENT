import { z } from "zod";

export const addTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Project name is required")
      .min(3, "Project name must be at least 3 characters"),

    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters"),
    status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"], { error: "Please select a valid project status" }),
    priority: z.enum(["LOW", "HIGH", "CRITICAL"], { error: "Please select a valid project priority" }),
    projectId: z.string({ error:  "Project Id is required"  }),
    userId: z.string({ error:  "User Id is required"  }),
    startDate: z.string({ error:  "Start date is required"  }),
    endDate: z.string({ error: "End date is required" }),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true

      return new Date(data.endDate) >= new Date(data.startDate)
    },
    {
      message: "End date must be greater than or equal to start date",
      path: ["endDate"],
    }
  )

export type AddTaskForm = z.infer<typeof addTaskSchema>