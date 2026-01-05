import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type InsertUser } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const res = await fetch(api.auth.me.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
      const res = await fetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.auth.me.path], data);
      toast({ title: "Welcome back!", description: `Logged in as ${data.username}` });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Login failed", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      const res = await fetch(api.auth.register.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Auto-login logic could go here, or just redirect
      toast({ title: "Account created", description: "Please log in with your new account" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Registration failed", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      queryClient.clear(); // Clear all cache on logout
      toast({ title: "Logged out", description: "See you soon!" });
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
