"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddTaskForm, addTaskSchema } from "../_validation/task-validation"
import { useCreateTaskMutation, useUpdateTaskMutation } from "../_hooks/task-hooks";
import { useEffect } from "react";
import { Task } from "@/types/task-types";
import { useGetProjectsName } from "../../project/_hooks/project-hooks";
import { useSession } from "@/providers/SessionProvider";

interface AddTaskProps {
  modelOpen: boolean
  modelClose: () => void,
  selectedTask: Task | null,
  setSelectedTask: (task:Task | null) => void;
}

const AddTask = ({ modelOpen, modelClose, selectedTask, setSelectedTask }: AddTaskProps) => {

    const { mutate: createTaskMutation, error } = useCreateTaskMutation();
    const { mutate: updateTaskMutation } = useUpdateTaskMutation();
    const { data: ProjectNames} = useGetProjectsName()
    const { user } = useSession();

    const {
      register,
      handleSubmit,
      reset,
      control,
      formState: {
        errors,
        isSubmitting,
      },
    } = useForm<AddTaskForm>({
      resolver: zodResolver(addTaskSchema),
      defaultValues: {
        title: "",
        description: "",
        status: "PLANNED",
        priority: "LOW",
        projectId: "",
        userId: user?.id,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date().toISOString().slice(0, 16),
      },
    });

    useEffect(() => {
      if (selectedTask) {
        reset({
            title: selectedTask.title || "", 
            description: selectedTask.description || "",
            status: selectedTask.status || "PLANNED",
            priority:selectedTask.priority || "LOW",
            projectId:selectedTask.projectId || "",
            userId: user?.id,
            startDate: selectedTask.startDate
            ? new Date(selectedTask.startDate)
                .toISOString()
                .slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          endDate: selectedTask.endDate
            ? new Date(selectedTask.endDate)
                .toISOString()
                .slice(0, 16)
            : new Date().toISOString().slice(0, 16),
         });
      } else {
        reset({
          title: "",
          description: "",
          status: "PLANNED",
          priority: "LOW",
          projectId: "",
          userId: user?.id,
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date().toISOString().slice(0, 16),
        });
      }
    }, [selectedTask, modelOpen, reset, user]);

  const onSubmit = async (values: AddTaskForm) => {

    if(selectedTask && selectedTask.id){
      updateTaskMutation({ ...values, id: selectedTask.id, startDate: new Date(values.startDate), endDate: new Date(values.endDate), userId: user?.id ?? ""  });
    }else{
      createTaskMutation({...values, startDate: new Date(values.startDate), endDate: new Date(values.endDate), userId: user?.id ?? ""})
      setSelectedTask(null);
    }
    reset()
    modelClose()
  } 

  const handleClose = () => {
    reset()
    modelClose()
    setSelectedTask(null);
  }

  return (
    <Dialog 
      open={modelOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            { selectedTask ? "Edit" : "Add" } Task
          </DialogTitle>

          <DialogDescription>
            Enter the details for your new task.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="space-y-4 pt-2">

              {/* ================= NAME ================= */}

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title
                </Label>

                <Input
                  id="title"
                  placeholder="Enter task name"
                  className="rounded-sm"
                  {...register("title")}
                />

                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* ================= DESCRIPTION ================= */}

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>

                <Input
                  id="description"
                  placeholder="Enter task description"
                  className="rounded-sm"
                  {...register("description")}
                />

                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <Controller
                name="projectId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <Label htmlFor="projectId">Project</Label>

                    <SelectTrigger className="w-full rounded-sm">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>

                    <SelectContent className="rounded-sm p-2">
                      <SelectGroup>
                        <SelectLabel>Projects</SelectLabel>

                        {ProjectNames?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.projectName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                    <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    >
                    <Label htmlFor="status">Status</Label>
                    <SelectTrigger className="w-full rounded-sm">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm p-2">
                        <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {["COMPLETED" , "PLANNED" , "IN_PROGRESS"].map((item) => (
                            <SelectItem key={item} value={item}> {item}</SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                )}/>

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                    <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    >
                    <Label htmlFor="priority">Priority</Label>
                    <SelectTrigger className="w-full rounded-sm">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm p-2">
                        <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        {["LOW" , "HIGH" , "CRITICAL"].map((item) => (
                            <SelectItem key={item} value={item}> {item}</SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                )}/>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Start Date & Time */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate">
                      Start Date & Time
                    </Label>

                    <Input
                      id="startDate"
                      type="datetime-local"
                      {...register("startDate")}
                      className="rounded-sm"
                    />

                    {errors.startDate && (
                      <p className="text-sm text-destructive">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  {/* End Date & Time */}
                  <div className="space-y-2">
                    <Label htmlFor="endDate">
                      End Date & Time
                    </Label>

                    <Input
                      id="endDate"
                      type="datetime-local"
                      {...register("endDate")}
                      className="rounded-sm"
                    />

                    {errors.endDate && (
                      <p className="text-sm text-destructive">
                        {errors.endDate.message}
                      </p>
                    )}
                  </div>
                </div>

              {/* ================= ACTIONS ================= */}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="bg-gray-200 cursor-pointer rounded-sm"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-sm"
                >
                  {isSubmitting
                    ? selectedTask
                      ? "Updating..."
                      : "Creating..."
                    : selectedTask
                      ? "Update Task"
                      : "Create Task"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTask;