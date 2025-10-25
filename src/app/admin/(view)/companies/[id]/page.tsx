import React from "react";
import CompanySetupForm from "./company-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const store = await params;

  return (
    <main className="p-6">
      <div className="">
        <h2 className="font-bold text-xl">EditCompany</h2>
        <p className="text-sm">
          Edit company with its own admin dashboard and driver console (BDC).
        </p>
      </div>
      <CompanySetupForm id={store.id} />
    </main>
  );
}
