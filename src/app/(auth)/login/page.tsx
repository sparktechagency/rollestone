"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { getCompaniesApi } from "@/api/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { idk } from "@/lib/utils";
import { blankImg } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function Page() {
  const [driverId, setDriverId] = useState<string[]>(["", "", "", ""]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<number>(1);
  const navig = useRouter();
  const handleKeypadClick = (value: string) => {
    if (currentIndex < 4) {
      const newDriverId = [...driverId];
      newDriverId[currentIndex] = value;
      setDriverId(newDriverId);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const { data, isPending, isError, error }: idk = useQuery({
    queryKey: ["companies"],
    queryFn: getCompaniesApi,
  });

  useEffect(() => {
    // only run when 4 digits entered and data is ready
    if (currentIndex >= 4 && !isPending && data?.data?.length) {
      const company = data.data.find(
        (x: idk) => x.company_id === selectedCompany
      );

      if (!company) {
        console.warn("Company not found");
        return;
      }

      try {
        const loginInfo = {
          company: {
            id: company.company_id,
            img: company.company_logo,
            name: company.company_name,
          },
          driverID: driverId.join(""), // join digits into string
        };

        console.log("Saving to localStorage:", loginInfo);

        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));

        // small delay to ensure localStorage write
        setTimeout(() => {
          navig.push("login/pin");
        }, 50);
      } catch (err) {
        console.error("Failed to set localStorage:", err);
      }
    }
  }, [currentIndex, data, selectedCompany, isPending, driverId, navig]);

  const handleInputClick = (index: number) => {
    setCurrentIndex(index);
  };

  const keypadButtons = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "*"],
  ];

  if (isError) {
    return (
      <div className="h-dvh w-dvw bg-blue-50 flex justify-center items-center">
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <main className="h-dvh w-dvw bg-blue-50 flex justify-center items-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8">
          <div className="w-full text-center space-y-6 flex flex-col item-center justify-center">
            <div className="w-[200px] mx-auto">
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-lg shadow border-2 p-2 border-foreground hover:shadow-md hover:shadow-black hover:scale-105 transition-all">
                  {!isPending && (
                    <>
                      {(() => {
                        const company = data?.data?.find(
                          (x: idk) => x?.company_id === selectedCompany
                        );
                        if (company) {
                          console.log(company);

                          return (
                            <Image
                              alt="logo"
                              src={company.company_logo}
                              height={300}
                              width={900}
                              className="w-[200px]!"
                            />
                          );
                        } else {
                          console.log(data?.data);
                          return data?.data[0] ? (
                            <Image
                              alt="logo"
                              src={data?.data[0]?.company_logo}
                              height={300}
                              width={900}
                            />
                          ) : null;
                        }
                      })()}
                    </>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {!isPending &&
                    data?.data?.map((x: idk) => (
                      <DropdownMenuItem
                        key={x.company_id}
                        className="w-[200px]!"
                        onClick={() => {
                          setSelectedCompany(x.company_id);
                        }}
                      >
                        <Image
                          alt="logo"
                          src={x.company_logo ?? blankImg(200, 600)}
                          height={300}
                          width={900}
                          className="w-[200px]! aspect-video"
                        />
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-gray-900">
                Bentley Coachlines Ticketing
              </h1>
              <h2 className="text-lg text-gray-700">Driver Portal</h2>
            </div>

            {/* Enter Driver ID */}
            <div className="space-y-4">
              <p className="text-gray-600 font-medium">Enter your Driver ID</p>

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
