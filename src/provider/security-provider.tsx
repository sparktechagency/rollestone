import { getProfileApi } from "@/api/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { UserProvider } from "@/context/user-context";
import { idk } from "@/lib/utils";

export default async function SecurityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 🧩 Important: early redirect, before any async calls
  if (!token) {
    redirect("/login");
  }

  const user: idk = await getProfileApi({ token });

  // If invalid token or failed fetch
  if (!user?.ok) {
    // Delete cookie then redirect
    cookieStore.delete("token");
    redirect("/login");
  }

  return <UserProvider initialUser={user.data}>{children}</UserProvider>;
}
