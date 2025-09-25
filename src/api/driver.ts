import { howl } from "@/lib/utils";


// ------------------ Blocked Trips / Driver Trip APIs ------------------

// 1. Get available trips for a route
export const getAvailableTripsApi = async ({
  routeId,
  companyID,
  token,
}: { routeId: number | string; companyID: string; token?: string }) => {
  return howl(`/v1/driver/routes/${routeId}/available-trips`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Find trip by trip number
export const findTripApi = async ({
  trip_number,
  companyID,
  token,
}: { trip_number: string; companyID: string; token?: string }) => {
  return howl(`/v1/driver/trips/find?trip_number=${trip_number}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Block a journey/trip
export const blockJourneyApi = async ({
  body,
  companyID,
  token,
}: {
  body: { trip_id: number | string; fleet_number: number | string };
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/driver/trips/block", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};


// ------------------ Driver Schedule / Journey APIs ------------------

// 1. Get driver schedule
export const getDriverScheduleApi = async ({
  companyID,
  token,
}: { companyID: string; token?: string }) => {
  return howl("/v1/driver/journeys/driver-schedule", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Start a journey (blank POST)
export const startJourneyApi = async ({
  journeyID,
  companyID,
  data,
  token,
}: {
  journeyID: number | string; companyID: string; token?: string, data: {
    latitude: number
    longitude: number
  }
}) => {
  return howl(`/v1/driver/journeys/${journeyID}/start`, {
    method: "POST",
    body: data,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. End a journey (blank POST)
export const endJourneyApi = async ({
  journeyID,
  companyID,
  token,
}: { journeyID: number | string; companyID: string; token?: string }) => {
  return howl(`/v1/driver/journeys/${journeyID}/end`, {
    method: "POST",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Update journey location
export const updateJourneyLocationApi = async ({
  journeyID,
  body,
  companyID,
  token,
}: {
  journeyID: number | string;
  body: { latitude: number; longitude: number };
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/driver/journeys/${journeyID}/update-location`, {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

//<<<<<<<<<<<<<<<<<<OTHERS<<<<<<<<<<<<<<<<<<<<


export const getTransitionHistory = async ({
  companyID,
  token,
}: { companyID: string; token?: string }) => {
  return howl("/v1/transactions/history", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

export const getNotifications = async ({
  companyID,
  token,
}: { companyID: string; token?: string }) => {
  return howl("/v1/notifications", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

export const readNotifById = async ({
  id,
  companyID,
  token,
}: { companyID: string; token?: string, id: string }) => {
  return howl(`/v1/notifications/${id}/read`, {
    method: "PATCH",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

export const readAllNotif = async ({
  companyID,
  token,
}: { companyID: string; token?: string }) => {
  return howl(`/v1/notifications/mark-all-as-read`, {
    method: "POST",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

export const checkJourneyApi = async ({
  companyID,
  token,
}: { companyID: string; token?: string }) => {
  return howl("/v1/driver/journeys/active", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};
