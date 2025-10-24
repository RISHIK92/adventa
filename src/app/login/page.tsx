"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { BrainCircuit } from "lucide-react";

import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { TricolorSpinner } from "@/components/ui/tricolor-spinner";

import { loginUser } from "@/lib/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

const GoogleIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
  >
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.84-4.25 1.84-5.18 0-9.4-4.22-9.4-9.4s4.22-9.4 9.4-9.4c2.6 0 4.92 1.02 6.57 2.6l2.5-2.5C19.05 1.18 15.98 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c7.2 0 12.03-4.92 12.03-12.03 0-.8-.08-1.55-.2-2.3H12.48z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleLogin = async () => {
    try {
      const token = await loginUser();
      console.log("JWT from backend:", token);
      localStorage.setItem("jwt", token);
      return token;
    } catch (err: any) {
      console.error(err.message);
      return null;
    }
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      const token = await handleLogin();
      if (!token) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Failed to authenticate with backend.",
        });
        return; // Exit early if backend authentication fails
      }
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/test-dashboard"); // Only redirect on success
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const token = await handleLogin();
      if (!token) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Failed to authenticate with backend.",
        });
        return; // Exit early if backend authentication fails
      }
      toast({
        title: "Login Successful",
        description: "Welcome!",
      });
      router.push("/test-dashboard"); // Only redirect on success
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Could not sign in with Google.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <BrainCircuit className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue your learning journey.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        disabled={isGoogleLoading}
                      />
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
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isGoogleLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading && <TricolorSpinner size={24} />}
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Form>
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#f7f7f7] px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <CardFooter className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? <TricolorSpinner size={24} /> : <GoogleIcon />}
            Google
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0">
              <Link href="/signup">Sign up</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
