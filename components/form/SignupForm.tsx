"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FormSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SigninForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });
    if (response.ok) {
      toast.success("Congratulations! Signup Successfull!", {
        duration: 2000,
        style: {
          backgroundColor: "green",
          color: "white",
        },
        action: {
          label: "✖",
          onClick: () => toast.dismiss(),
        },
      });
      router.push("/signin");
    } else {
      toast.error("Registration Failed!", {
        duration: 2000,
        style: {
          backgroundColor: "red",
          color: "white",
        },
        action: {
          label: "✖",
          onClick: () => toast.dismiss(),
        },
      });
      console.log("Registration failed");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Password"
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter Your Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Re-Enter Your Password"
                    type="password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-full mt-6 cursor-pointer hover:bg-gray-600"
          type="submit"
        >
          Submit
        </Button>
        <div
          className="mx-auto my-4 flex w-full items-center justify-evenly
before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400
after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400"
        >
          or
        </div>
        <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
        <p className="text-center text-sm text-gray-600 mt-2">
          If you dont have an account, please &nbsp;
          <Link className="text-blue-500 hover:underline" href="/signin">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SigninForm;
