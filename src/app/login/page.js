"use client"
import { Clapperboard, GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import getFirebaseConfig from "@/firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { ErrorText } from "@/components/error-text"
import { toast } from "sonner"

export default function LoginPage() {

  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  
  const handleInput = (event) => {
    setForm({
      ...form,
      [event.target.id]: event.target.value
    });
    setErrors({
      ...errors,
      [event.target.id]: ""
    });
  }

  const validate = () => {
    const newErrors = {};
    if(!form.email){
      newErrors.email = "Email must be filled";
    }
    else if (!form.password){
      newErrors.password = "Password must be filled";
    }
    return newErrors;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const validateErr = validate();
    setErrors({custom: ""});
    if(Object.keys(validateErr).length>0){
      setErrors(validateErr);
    }
    else {
      const {auth} = getFirebaseConfig();
      signInWithEmailAndPassword(auth, form.email, form.password).then(()=>{
        toast.success("Successfully logged in!");
        router.push("/");
      }).catch((error)=>{
        console.log(error);
        setErrors({custom: error.message});
      })
    }
  }

  return (
    <div
      className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            {/* ini icon */}
            <Clapperboard className="size-4" /> 
          </div>
          MyMovieList
        </a>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your email and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@example.com" onChange={handleInput} required />
                      {errors.email && <ErrorText message={errors.email}/>}
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" placeholder="Enter 6 characters" onChange={handleInput} required />
                      {errors.password && <ErrorText message={errors.password}/>}
                    </div>
                    {errors.custom && <ErrorText message={errors.custom}/>}
                    <Button type="submit" className="w-full" onClick={handleSubmit}>
                      Login
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="/register" className="underline underline-offset-4">
                      Register
                    </a>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}