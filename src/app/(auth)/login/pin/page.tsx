"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { idk } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { driverLoginApi } from "@/api/auth";
import { useCookies } from "react-cookie";

export default function Page() {
  const navig = useRouter();
  const [driverId, setDriverId] = useState<string[]>(["", "", "", ""]);
  const [, setCookie] = useCookies(["token"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localData, setLocalData] = useState<{
    company: { img: string; id: string; name: string };
    driverID: string;
  } | null>(null);
  const handleKeypadClick = (value: string) => {
    if (currentIndex < 4) {
      const newDriverId = [...driverId];
      newDriverId[currentIndex] = value;
      setDriverId(newDriverId);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const { mutate } = useMutation({
    mutationKey: ["driver_login"],
    mutationFn: (dataset: {
      staff_number: string;
      pin_code: string;
      fcm_token?: string | undefined;
    }) => {
      return driverLoginApi({
        body: dataset,
        companyID: localData?.company.id ?? "1",
      });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to Log in");
      localStorage.removeItem("loginInfo");
      navig.back();
    },
    onSuccess: (res: idk) => {
      toast.success(
        res.message ?? `Welcome to ${localData?.company.name} Driver Portal`
      );

      try {
        setCookie("token", res.data.access_token);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        return;
      }

      navig.push("/driver/driver");
    },
  });

  useEffect(() => {
    const locData = localStorage.getItem("loginInfo");

    if (locData) {
      const parsed = JSON.parse(locData);
      console.log("Parsed localStorage:", parsed);
      setLocalData(parsed);
    } else {
      toast.error("Something went wrong!", {
        description: "Failed to get Login info, Try again",
      });
    }
  }, []);
  useEffect(() => {
    if (currentIndex >= 4) {
      mutate({
        staff_number: localData?.driverID ?? "",
        pin_code: driverId.join(""),
      });
    }
  }, [currentIndex]);

  const handleInputClick = (index: number) => {
    setCurrentIndex(index);
  };
  const keypadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "*"],
  ];

  return (
    <main className="h-dvh w-dvw bg-blue-50 flex justify-center items-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8">
          <div className="w-full text-center space-y-6 flex flex-col item-center justify-center">
            <div className="w-[200px] mx-auto">
              {localData && (
                <Image
                  alt="logo"
                  src={localData.company.img}
                  height={300}
                  width={900}
                  className="w-[200px] mx-auto"
                />
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-gray-900">
                {localData?.company.name}
              </h1>
              <h2 className="text-lg text-gray-700">Driver Portal</h2>
            </div>

            {/* Enter Driver ID */}
            <div className="space-y-4">
              <p className="text-gray-600 font-medium">
                Enter your 4-digit PIN
              </p>

              {/* Input boxes */}
              <div className="flex justify-center space-x-3">
                {driverId.map((digit, index) => (
                  <button
                    key={index}
                    onClick={() => handleInputClick(index)}
                    className={`w-12 h-12 border-2 rounded-lg text-xl font-semibold bg-white
                      ${
                        currentIndex === index
                          ? "border-purple-500"
                          : "border-gray-300"
                      }
                      hover:border-purple-400 transition-colors`}
                  >
                    {digit}
                  </button>
                ))}
              </div>
            </div>

            {/* Keypad */}
            <div className="bg-gray-200 rounded-lg p-4 space-y-2">
              {keypadButtons.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-2">
                  {row.map((button) => (
                    <Button
                      key={button}
                      variant="secondary"
                      className="w-16 h-12 text-lg font-semibold bg-white hover:bg-gray-50 border border-gray-300"
                      onClick={() => handleKeypadClick(button)}
                      disabled={currentIndex >= 4}
                    >
                      {button}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
