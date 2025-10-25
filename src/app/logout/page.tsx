"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

export default function Page() {
  const router = useRouter();
  const [cookies, , removeCookie] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      // Remove cookie explicitly with matching options
      removeCookie("token", { path: "/" });
    }

    // Small timeout ensures state updates before redirect
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 200);

    return () => clearTimeout(timer);
  }, [cookies, removeCookie, router]);

  return <>Logging out...</>;
}
