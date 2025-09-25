"use client";
import { checkJourneyApi, updateJourneyLocationApi } from "@/api/driver";
import { useUser } from "@/context/user-context";
import { idk } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

export default function GlobalJourneyUpdater() {
  const { user } = useUser();
  const [{ token }] = useCookies(["token"]);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["check_journey"],
    queryFn: (): idk => {
      return checkJourneyApi({
        companyID: String(user?.company_id),
        token,
      });
    },
    enabled: !!token && !!user?.company_id,
    refetchInterval: 5000, // auto-poll every 5s
  });

  const { mutate } = useMutation({
    mutationKey: ["update_journey"],
    mutationFn: ({
      dataset,
      journeyId,
    }: {
      dataset: { latitude: number; longitude: number };
      journeyId: string;
    }) =>
      updateJourneyLocationApi({
        journeyID: journeyId,
        body: dataset,
        companyID: String(user?.company_id),
        token,
      }),
  });

  useEffect(() => {
    if (data?.ok) {
      // journey ongoing → get geolocation + update
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          mutate({
            dataset: { latitude, longitude },
            journeyId: data.data.id,
          });
        },
        (err) => {
          console.error("Geo error:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [data, mutate]);

  return null;
}
