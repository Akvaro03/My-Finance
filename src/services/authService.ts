export interface userData {
  email: string;
  password: string;
}

export async function signUp(data: userData) {
  const res = await fetch("/api/users/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const errorMessage =
      errorData.error ||
      "An unexpected error occurred. Please try again later.";
    throw new Error(errorMessage);
  }

  return res.json();
}
export async function logIn(data: userData) {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const errorMessage =
      errorData.error ||
      "An unexpected error occurred. Please try again later.";
    throw new Error(errorMessage);
  }

  return res.json();
}
