import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-display font-black text-4xl mb-2">OG MEDIA</h1>
          <p className="text-muted-foreground">Your daily briefing, reimagined.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <AuthForm 
              mode="login" 
              onSubmit={login} 
              isLoading={isLoggingIn} 
            />
          </TabsContent>
          
          <TabsContent value="register">
            <AuthForm 
              mode="register" 
              onSubmit={register} 
              isLoading={isRegistering} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AuthForm({ mode, onSubmit, isLoading }: { 
  mode: "login" | "register", 
  onSubmit: any, 
  isLoading: boolean 
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "login" ? "Welcome back" : "Create an account"}</CardTitle>
        <CardDescription>
          {mode === "login" 
            ? "Enter your credentials to access your bookmarks." 
            : "Sign up to start saving articles and customizing your feed."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-username`}>Username</Label>
            <Input
              id={`${mode}-username`}
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-password`}>Password</Label>
            <Input
              id={`${mode}-password`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
