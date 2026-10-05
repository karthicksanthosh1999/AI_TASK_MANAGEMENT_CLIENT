'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { ChangeEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, EyeIcon } from "lucide-react";

interface ILoginUser {
  email: string,
  password: string,
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const route = useRouter()

  const [loginData, setLoginData] = useState<ILoginUser>({ email:"", password:"" });
  const [eyeOpen, setEyeOpen] = useState(false)

  const handleChange:ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value, name } = event.target;
    setLoginData((preV) =>({...preV, [name]: value}))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login",loginData);
      console.log("LOGIN RESPONSE:", data);
      if(data?.success === true){
        route.push("/dashboard")
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center w-full min-h-screen", className)} {...props}>
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-4xl font-semibold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  name="email"
                  value={loginData?.email}
                  onChange={handleChange}
                  />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative w-fit">
                <Input 
                  id="password" 
                  name="password"
                  value={loginData?.password}
                  onChange={handleChange}
                  type={eyeOpen ? "text" : "password"}
                  placeholder="******"
                  required 
                  />
                  <div className="absolute top-2 right-2 w-fit cursor-pointer" onClick={(preV)=>setEyeOpen(!preV)}>{ eyeOpen ? <EyeIcon /> : <EyeClosed/> }</div>
                  </div>
              </Field>
              <Field>
                <Button type="submit" className={'cursor-pointer rounded-sm text-white text-lg py-2'}>Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
