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
import { ErrorText } from "@/components/error-text"
import getFirebaseConfig from "@/firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RegisterPage() {

  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPass: "",
    role: "",
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
      newErrors.email = "Email should be filled";
    }
    else if(!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)){
      newErrors.email = "Email is invalid";
    }
    else if(!form.username){
      newErrors.username = "Name should be filled";
    }
    else if(!form.password){
      newErrors.password = "Password should be filled";
    }
    else if(form.password.length<6){
      newErrors.password = "Password should be at least 6 characters";
    }
    else if(!form.confirmPass){
      newErrors.confirmPass = "Confirm password should be filled";
    }
    if(form.password!==form.confirmPass){
      newErrors.confirmPass = "Password and Confirm password should be the same";
    }
    return newErrors;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({custom: ""});
    const validateErr =  validate();
    if(Object.keys(validateErr).length!=0){
      setErrors(validateErr);
    }
    else {
      const {db, auth} = getFirebaseConfig();
      createUserWithEmailAndPassword(auth, form.email, form.password).then(async(credentials)=> {
        const user = credentials.user;
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          username: form.username,
          email: form.email,
          role: "user" // set role as user
        });
        toast.success("Successfully registered! Please log in!");
        router.push("/login");
      }).catch((error)=>{
        console.log(error);
        setErrors({custom: error.message});
      });
    }
  } 

  return (
    <div
      className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Clapperboard className="size-4" />
          </div>
          MyMovieList
        </a>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create a new account</CardTitle>
              <CardDescription>
                Enter details below to create your account
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
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" type="text" placeholder="ex. John Doe" onChange={handleInput} required />
                      {errors.username && <ErrorText message={errors.username}/>}
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" placeholder="Enter 6 characters" onChange={handleInput} required />
                      {errors.password && <ErrorText message={errors.password}/>}
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="confirmPass">Confirm Password</Label>
                      </div>
                      <Input id="confirmPass" type="password" placeholder="Type your password again" onChange={handleInput}required />
                      {errors.confirmPass && <ErrorText message={errors.confirmPass}/>}
                    </div>
                    {errors.firebase && <ErrorText message={errors.firebase}/>}
                    {errors.custom && <ErrorText message={errors.custom}/>}
                    <Button type="submit" className="w-full" onClick={handleSubmit}>
                      Register
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="underline underline-offset-4">
                      Login
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
