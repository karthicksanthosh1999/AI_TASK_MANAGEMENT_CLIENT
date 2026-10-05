import { z } from "zod";

export const addProjectSchema = z
  .object({
    projectName: z
      .string()
      .min(1, "Project name is required")
      .min(3, "Project name must be at least 3 characters"),

    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters"),
    projectStatus: z.enum(["PLANNED", "RUNNING", "COMPLETED"], { error: "Please select a valid project status" }),
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

export type AddProjectForm = z.infer<typeof addProjectSchema>