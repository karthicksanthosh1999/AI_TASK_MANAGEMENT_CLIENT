"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useEffect, useState } from "react";
import { Loader, Eye, EyeOff } from "lucide-react";

import {
  useSendEmailMutation,
  useSendOtpMutation,
  useResetPasswordMutation,
} from "../_hooks/login-hooks";
import { useRouter } from "next/navigation";

interface OTPModelInterchange {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type Step = "email" | "otp" | "password";

const OTPModel = ({
  open,
  setOpen,
}: OTPModelInterchange) => {
  const {
    mutate: sendEmailMutation,
    isPending: emailIsPending,
    status,
  } = useSendEmailMutation();

  const {
    mutate: sendOtpMutation,
    isPending: otpIsPending,
    status: otpStatus,
  } = useSendOtpMutation();

  const {
    mutate: resetPasswordMutation,
    isPending: resetPasswordIsPending,
    status: resetPasswordStatus
  } = useResetPasswordMutation();

    const {push} = useRouter()
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<Step>("email");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /**
   * Email successfully sent
   */
  useEffect(() => {
    if (status === "success") {
      setStep("otp");
    }
  }, [status]);

  /**
   * OTP successfully verified
   */
  useEffect(() => {
    if (otpStatus === "success") {
      setStep("password");
    }
  }, [otpStatus]);

  /**
   * Send Email
   */
  const handleEmailVerify = () => {
    if (!email.trim()) return;

    sendEmailMutation({email});
  };

  /**
   * Verify OTP
   */
  const handleOtpVerify = () => {
    if (otp.length !== 6) return;

    sendOtpMutation({email, otp});
  };

  /**
   * Reset Password
   */
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      return;
    }
    resetPasswordMutation({email, password: newPassword});
  };

  /**
   * Go back
   */
  const handleBack = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
    }

    if (step === "password") {
      setStep("otp");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  /**
   * Close + reset everything
   */
  const handleClose = () => {
    setOpen(false);

    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");

    setStep("email");

    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

    useEffect(() => {
  if (resetPasswordStatus === "success") {
    handleClose();
    push("/");
  }
}, [resetPasswordStatus]);

  const passwordsMatch =
    newPassword === confirmPassword;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        } else {
          setOpen(value);
        }
      }}
    >
      <AlertDialogContent>

        {step === "email" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Forgot Password
              </AlertDialogTitle>

              <AlertDialogDescription>
                Enter your email address. We will send you
                a verification OTP.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Field>
              <Input
                id="email"
                type="email"
                className="rounded-sm"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </Field>

            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={handleClose}
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                className="cursor-pointer text-white"
                disabled={
                  emailIsPending || !email.trim()
                }
                onClick={(event) => {
                  event.preventDefault();
                  handleEmailVerify();
                }}
              >
                {emailIsPending ? (
                  <>
                    <Loader className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {step === "otp" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Verify OTP
              </AlertDialogTitle>

              <AlertDialogDescription>
                Enter the 6-digit OTP sent to{" "}
                <strong>{email}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex justify-center py-6">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={handleBack}
              >
                Back
              </AlertDialogCancel>

              <AlertDialogAction
                className="cursor-pointer text-white"
                disabled={
                  otpIsPending ||
                  otp.length !== 6
                }
                onClick={(event) => {
                  event.preventDefault();
                  handleOtpVerify();
                }}
              >
                {otpIsPending ? (
                  <>
                    <Loader className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify OTP</span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}

        {step === "password" && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Create New Password
              </AlertDialogTitle>

              <AlertDialogDescription>
                Enter your new password below.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">
              {/* New Password */}

              <Field>
                <div className="relative">
                  <Input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="New password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    className="rounded-sm pr-10"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() =>
                      setShowNewPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </Field>

              {/* Confirm Password */}

              <Field>
                <div className="relative">
                  <Input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    className="rounded-sm pr-10"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </Field>

              {/* Password mismatch */}

              {confirmPassword &&
                !passwordsMatch && (
                  <p className="text-sm text-red-500">
                    Passwords do not match.
                  </p>
                )}

              {/* Password match */}

              {confirmPassword &&
                passwordsMatch && (
                  <p className="text-sm text-green-600">
                    Passwords match.
                  </p>
                )}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                onClick={handleBack}
              >
                Back
              </AlertDialogCancel>

              <AlertDialogAction
                className="cursor-pointer text-white"
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  !passwordsMatch
                }
                onClick={(event) => {
                  event.preventDefault();
                  handleResetPassword();
                }}
              >
                {resetPasswordIsPending ? (
                  <>
                    <Loader className="animate-spin" />
                    <span>Reset...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
                
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModel;