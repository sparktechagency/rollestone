"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Image
            src={"/logo.png"}
            height={300}
            width={900}
            alt="logo"
            className="w-2/3"
          />
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                OTP Verification
              </h1>
              <p className="text-gray-500 text-sm w-full">
                We have sent a verification code to william***@gmail.com
              </p>
            </div>
            <form className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-center items-center w-full">
                  <InputOTP
                    maxLength={6}
                    className="flex gap-2 justify-center items-center"
                  >
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center text-2xl font-sans text-gray-800"
                      ></InputOTPSlot>
                    ))}
                  </InputOTP>
                </div>
              </div>

              <Button
                asChild
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                <Link href={"/admin/reset"}>Verify</Link>
              </Button>
            </form>
            <p className="ml-auto text-sm font-semibold flex justify-end items-center gap-2 mt-2">
              Didn’t received code?{" "}
              <Button variant={"link"} className="px-0 text-blue-700">
                Send again
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
