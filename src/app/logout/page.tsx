"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

export default function Page() {
  const router = useRouter();
  const [{ token }, , removeCookie] = useCookies(["token"]);

  useEffect(() => {
    if (token) removeCookie("token");
    router.replace("/login");
  }, [token, removeCookie, router]);

  return <>Logging out..</>;
}
