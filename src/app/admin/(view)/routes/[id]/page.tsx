import { Loader2Icon } from "lucide-react";
import EditRouteForm from "./edit-route-form";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const container = await params;
  const id = container.id;
  if (!id) {
    return notFound();
  }
  return (
    <Suspense
      fallback={
        <div className={`flex justify-center items-center h-24 mx-auto`}>
          <Loader2Icon className={`animate-spin`} />
        </div>
      }
    >
      <EditRouteForm id={id} />
    </Suspense>
  );
}
