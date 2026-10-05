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

import { addProjectSchema, AddProjectForm } from "../_validation/project-validation"
import { useCreateProjectMutation, useUpdateProjectMutation } from "../_hooks/project-hooks";
import { Project } from "@/types/project-types";
import { useEffect } from "react";

interface AddProjectProps {
  modelOpen: boolean
  modelClose: () => void,
  selectedProject: Project | null,
  setSelectedProject: (project:Project | null) => void;
}

const AddProject = ({ modelOpen, modelClose, selectedProject, setSelectedProject }: AddProjectProps) => {

    const { mutate: createProjectMutation } = useCreateProjectMutation();
    const { mutate: updateProjectMutation } = useUpdateProjectMutation();

    const {
      register,
      handleSubmit,
      reset,
      control,
      formState: {
        errors,
        isSubmitting,
      },
    } = useForm<AddProjectForm>({
      resolver: zodResolver(addProjectSchema),
      defaultValues: {
        projectName: "",
        description: "",
        projectStatus: "PLANNED",
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date().toISOString().slice(0, 16),
      },
    });

    useEffect(() => {
      if (selectedProject) {
        reset({
          projectName: selectedProject.projectName || "",
          description: selectedProject.description || "",
          projectStatus: selectedProject.projectStatus || "PLANNED",
          startDate: selectedProject.startDate
            ? new Date(selectedProject.startDate)
                .toISOString()
                .slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          endDate: selectedProject.endDate
            ? new Date(selectedProject.endDate)
                .toISOString()
                .slice(0, 16)
            : new Date().toISOString().slice(0, 16),
        });
      } else {
        reset({
          projectName: "",
          description: "",
          projectStatus: "PLANNED",
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date().toISOString().slice(0, 16),
        });
      }
    }, [selectedProject, modelOpen, reset]);

  const onSubmit = async (values: AddProjectForm) => {
    if(selectedProject && selectedProject.id){
      updateProjectMutation({ ...values, id: selectedProject.id, startDate: new Date(values.startDate), endDate: new Date(values.endDate) });
    }else{
      createProjectMutation({...values, startDate: new Date(values.startDate), endDate: new Date(values.endDate)})
      setSelectedProject(null);
    }

    reset()
    modelClose()
  }

  const handleClose = () => {
    reset()
    modelClose()
    setSelectedProject(null);
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
            { selectedProject ? "Edit" : "Add" } Project
          </DialogTitle>

          <DialogDescription>
            Enter the details for your new project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="space-y-4 pt-2">

              {/* ================= NAME ================= */}

              <div className="space-y-2">
                <Label htmlFor="projectName">
                  Project Name
                </Label>

                <Input
                  id="projectName"
                  placeholder="Enter project name"
                  className="rounded-sm"
                  {...register("projectName")}
                />

                {errors.projectName && (
                  <p className="text-sm text-destructive">
                    {errors.projectName.message}
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
                  placeholder="Enter project description"
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
                name="projectStatus"
                control={control}
                render={({ field }) => (
                    <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    >
                    <Label htmlFor="projectStatus">Status</Label>
                    <SelectTrigger className="w-full rounded-sm">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm p-2">
                        <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {["COMPLETED" , "PLANNED" , "RUNNING"].map((item) => (
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
                    ? selectedProject
                      ? "Updating..."
                      : "Creating..."
                    : selectedProject
                      ? "Update Project"
                      : "Create Project"}
                </Button>
              </div>

            </CardContent>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProject