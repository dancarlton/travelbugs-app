import { useState, useEffect } from "react";

type User = { id: string; email?: string } | null;

export function useUser(): { user: User; isLoading: boolean } {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fake delay then "log in"
    const t = setTimeout(() => {
      setUser({ id: "dev-user" }); // change to null to simulate logged-out
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return { user, isLoading };
}
