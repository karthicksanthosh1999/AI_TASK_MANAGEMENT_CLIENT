"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Check,
  Edit3,
  Mail,
  Phone,
  ShieldCheck,
  User,
  CalendarDays,
  Lock,
  Save,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/providers/SessionProvider";
import { formatDateTime } from "@/lib/dateFormater";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinedDate: string;
};

function UserProfile() {
  const { user: loggedUser } = useSession();

  const getInitialData = (): UserFormData => ({
    firstName: loggedUser?.name ?? "N/A",
    lastName: "N/A",
    email: loggedUser?.email ?? "N/A",
    phone: loggedUser?.mobileNo ?? "N/A",
    role: loggedUser?.role ?? "N/A",
    department: "N/A",
    joinedDate: loggedUser?.createdAt
      ? formatDateTime(loggedUser.createdAt)
      : "N/A",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserFormData>(getInitialData);
  const [formData, setFormData] = useState<UserFormData>(getInitialData);

  useEffect(() => {
    if (!loggedUser) return;

    const data = getInitialData();

    setUser(data);
    setFormData(data);
  }, [loggedUser]);

  const handleChange = (
    field: keyof UserFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      /*
       * TODO:
       * Call update profile API here
       *
       * await updateProfile({
       *   name: formData.firstName,
       *   email: formData.email,
       *   mobileNo: formData.phone,
       * })
       */

      setUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const fullName =
    user.firstName !== "N/A"
      ? user.firstName
      : "N/A";

  return (
    <div className="min-h-full bg-muted/30">
      <div className="mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Profile
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your personal information and account settings.
            </p>
          </div>

          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="gap-2 rounded-xs text-white"
            >
              <Edit3 className="size-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="gap-2 "
              >
                <X className="size-4" />
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                className="gap-2 text-white"
              >
                <Save className="size-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

          {/* Profile Summary */}
          <Card className="h-fit overflow-hidden">

            <div className="h-24 bg-linear-to-r from-primary/80 via-primary to-primary/60" />

            <CardContent className="-mt-12 px-6 pb-6">

              {/* Avatar */}
              <div className="relative w-fit">
                <div className="flex size-24 items-center justify-center rounded-full border-4 border-gray-400 bg-primary text-2xl font-bold text-gray-200 shadow-md">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-foreground text-background shadow-sm transition hover:scale-105"
                  >
                    <Camera className="size-4" />
                  </button>
                )}
              </div>

              {/* User */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold">
                  {fullName}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {user.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {user.role}
                  </Badge>

                  <Badge variant="outline">
                    Active
                  </Badge>
                </div>
              </div>

              <Separator className="my-5" />

              {/* Contact information */}
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Mail className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Email
                    </p>

                    <p className="truncate text-sm font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Phone className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Phone
                    </p>

                    <p className="truncate text-sm font-medium">
                      {user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <CalendarDays className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Joined
                    </p>

                    <p className="text-sm font-medium">
                      {user.joinedDate}
                    </p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Right Side */}
          <div className="space-y-6">

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="size-5 text-primary" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      Personal Information
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      Your basic personal details.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">

                {/* First / Last Name */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name
                    </Label>

                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleChange(
                            "firstName",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm">
                        {user.firstName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address
                    </Label>

                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleChange(
                            "email",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm">
                        {user.email}
                      </div>
                    )}
                  </div>

                </div>

                {/* Email / Phone */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="space-y-2">
                    <Label>Role</Label>

                    <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3 text-sm">
                      {user.role}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number
                    </Label>

                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleChange(
                            "phone",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <div className="flex h-10 items-center rounded-md border bg-muted/30 px-3 text-sm">
                        {user.phone}
                      </div>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <ShieldCheck className="size-5 text-emerald-600" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      Account Security
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      Manage your password and account security.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Lock className="size-4 text-muted-foreground" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Password
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Keep your password secure.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Change Password
                  </Button>

                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="size-4 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Account Status
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Your account is active and in good standing.
                      </p>
                    </div>
                  </div>

                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    Active
                  </Badge>

                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;