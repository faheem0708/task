"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { auth, googleProvider } from "@/lib/firebase"
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from 'react-toastify';
import { AuthErrorMessage } from "@/lib/firebaseErrors"
import { FirebaseError } from 'firebase/app';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [variant, setVariant] = useState('login');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVairent = () => {
    setName('');
    setEmail('');
    setPassword('');
    setVariant((currentValue) => currentValue === 'login' ? 'register' : 'login');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (variant === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
          setEmail('');
          setPassword('');
          router.push("/dashboard");
          toast.success('Login successful!');
      } else {
        // Register user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            name,
            email,
            createdAt: serverTimestamp(),
          });
          setName('');
          setEmail('');
          setPassword('');
          setVariant('register');
          toast.success('Registration successful!');
        }
      }
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code) {
          toast.error(AuthErrorMessage(err.code));
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const user = data.user;
      if (user) {
        toast.success('Google sign-in successful!');
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        if (err.code) {
          toast.error(AuthErrorMessage(err.code));
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{variant === 'login' ? "Login to your account" : 'Register to your account'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {variant === 'register' && (
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    placeholder="john"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {variant === 'login' && (
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {variant === 'login' ? 'Login' : 'Register'}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm" onClick={toggleVairent}>
              {variant === 'login' ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button className="underline underline-offset-4">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button className="underline underline-offset-4">
                    Login in
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
