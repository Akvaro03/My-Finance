import { useEffect, useState } from "react";
export type Account = {
  id: string;
  name: string;
  balance: number;
  // agrega más campos según tu modelo en Prisma
};

function useGetAccount() {
  const [data, setData] = useState<Account[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let ignore = false; // para evitar setState después del unmount

    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/account");

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const json: Account[] = await res.json();
        if (!ignore) setData(json);
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch accounts"
          );
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      ignore = true;
    };
  }, []);

  return { accounts: data, isLoadingAccounts: isLoading, errorAccounts: error };
}

export default useGetAccount;
