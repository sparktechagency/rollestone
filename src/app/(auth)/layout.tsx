import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const token = (await cookies()).get("token")?.value;
  if (token) {
    return redirect("/driver/driver");
  }
  return children;
}
