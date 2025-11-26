/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiConfig } from "@/lib/config";
import { howl, idk } from "@/lib/utils";


//>>>>>>>>>>>>>>> DASHBOARD <<<<<<<<<<<<<<<<<

export const getLiveDashboardDataApi = async ({
  filter,
  companyID,
  token,
}: {
  filter:"all"|"ongoing"|"completed"|"blocked"|"cancelled",
  companyID?: string;
  token: string;
}) => {
  return howl(`/v1/admin/dashboard/live-data?filter=${filter}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    token,
  });
};

export const getDashboardStatsApi = async ({
  companyID,
  token,
}: {
  companyID?: string;
  token: string;
}) => {
  return howl("/v1/admin/dashboard/stats", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    token,
  });
};

// ------------------ Driver Management APIs ------------------

// 1. Get paginated drivers
export const getDriversApi = async ({
  search,
  companyID,
  token,
}: {
  search:string

  companyID: string;
  token?: string;
}) => {

  return howl(`/v1/admin/drivers?per_page=10&search=${search}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Get driver by ID
export const getDriverByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/drivers/${id}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Delete driver by ID
export const deleteDriverByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/drivers/${id}`, {
    method: "DELETE",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Create new driver (with FormData)
export const createDriverApi = async ({
  formData,
  companyID,
  token,
}: {
  formData: FormData;
  companyID: string;
  token?: string;
}) => {
  const headers: Record<string, string> = { "X-Company-ID": String(companyID) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${apiConfig.baseUrl}/v1/admin/drivers`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error((errorData as any).message || "API request failed");
  }

  return res.json();
};

// 5. Update driver (with FormData and _method: PUT)
export const updateDriverApi = async ({
  formData,
  companyID,
  token,
}: {
  formData: FormData;
  companyID: string;
  token?: string;
}) => {
  formData.append("_method", "PUT");

  const headers: Record<string, string> = { "X-Company-ID": String(companyID) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${apiConfig.baseUrl}/v1/admin/drivers`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error((errorData as any).message || "API request failed");
  }

  return res.json();
};


// ------------------ Company Management APIs (with FormData) ------------------
// 1. Get all companies
export const getCompaniesApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/companies", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Get company by ID
export const getCompanyByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/companies/${id}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Create new company (with FormData)
export const createCompanyApi = async ({
  formData,
  companyID,
  token,
}: {
  formData: FormData;
  companyID: string;
  token?: string;
}) => {
  const headers: Record<string, string> = { "X-Company-ID": String(companyID) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${apiConfig.baseUrl}/v1/admin/companies`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error((errorData as any).message || "API request failed");
  }

  return res.json();
};

// 4. Update company (with FormData + _method: PUT)
export const updateCompanyApi = async ({
  formData,
  id,
  companyID,
  token,
}: {
  formData: FormData;
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  formData.append("_method", "PUT");

  const headers: Record<string, string> = { "X-Company-ID": String(companyID) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${apiConfig.baseUrl}/v1/admin/companies/${id}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error((errorData as any).message || "API request failed");
  }

  return res.json();
};

// 5. Delete company by ID
export const deleteCompanyByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/companies/${id}`, {
    method: "DELETE",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};


// ------------------ Route Management APIs ------------------
// 1. Get all routes
export const getRoutesApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/routes", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Get route by ID
export const getRouteByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/routes/${id}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Delete route by ID
export const deleteRouteByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/routes/${id}`, {
    method: "DELETE",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Create new route (with howl)
export const createRouteApi = async ({
  body,
  companyID,
  token,
}: {
  body: idk
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/routes", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 5. Update route using howl
export const updateRouteApi = async ({
  body,
  id,
  companyID,
  token,
}: {
  body: {
    name: string;
    route_prefix: string;
    google_map_link: string;
    status: number;
    stops: {
      location_name: string;
      stop_order: number;
      minutes_from_start: number;
      latitude: number;
      longitude: number;
    }[];
    fares: {
      passenger_type: string;
      cash_amount: number;
      app_amount: number;
    }[];
  };
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  const bodyWithMethod = { ...body, _method: "PUT" };

  return howl(`/v1/admin/routes/${id}`, {
    method: "POST", // POST + _method override
    body: bodyWithMethod,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};


// ------------------ Trip Management APIs ------------------
// 1. Get all trips
export const getTripsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/trips", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Get trip by ID
export const getTripByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/trips/${id}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Delete trip by ID
export const deleteTripByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/trips/${id}`, {
    method: "DELETE",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Create new trip
export const createTripApi = async ({
  body,
  companyID,
  token,
}: {
  body: {
    route_id: number | string;
    departure_time: string;
    direction: string;
    is_active: number;
  };
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/trips", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 5. Update trip
export const updateTripApi = async ({
  body,
  id,
  companyID,
  token,
}: {
  body: {
    route_id: number | string;
    departure_time: string;
    direction: string;
    is_active: number;
  };
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  const bodyWithMethod = { ...body, _method: "PUT" };
  return howl(`/v1/admin/trips/${id}`, {
    method: "POST", // POST + _method override
    body: bodyWithMethod,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// ------------------ Passenger Management APIs ------------------
// 1. Get all passengers
export const getPassengersApi = async ({
  companyID,
  token,
  search
}: {
  companyID: string;
  token?: string;
  search?:string
}) => {
  return howl(`/v1/admin/passengers?search=${search??""}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Get passenger by ID
export const getPassengerByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/passengers/${id}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Delete passenger by ID
export const deletePassengerByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/passengers/${id}`, {
    method: "DELETE",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Create new passenger
export const createPassengerApi = async ({
  body,
  companyID,
  token,
}: {
  body: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    rider_type: "adult"|"child"|"student";
    phone_number?: string;
    address?: string;
  };
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/passengers", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 5. Update passenger
export const updatePassengerApi = async ({
  body,
  id,
  companyID,
  token,
}: {
  body: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    rider_type: string | string[];
    phone_number?: string;
    address?: string;
  };
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  const bodyWithMethod = { ...body, _method: "PUT" };
  return howl(`/v1/admin/passengers/${id}`, {
    method: "POST", // POST + _method override
    body: bodyWithMethod,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// ------------------ Wallet Management APIs ------------------

// 1. Top-up passenger wallet
export const topUpPassengerWalletApi = async ({
  passengerId,
  body,
  companyID,
  token,
}: {
  passengerId: number | string;
  body: { amount: number };
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/passengers/${passengerId}/top-up`, {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Refund passenger wallet
export const refundPassengerWalletApi = async ({
  passengerId,
  body,
  companyID,
  token,
}: {
  passengerId: number | string;
  body: { amount: number };
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/passengers/${passengerId}/refund`, {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// ------------------ Settings Management APIs ------------------

// 1. Get current settings
export const getSettingsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/settings", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Update settings
export const updateSettingsApi = async ({
  body,
  companyID,
  token,
}: {
  body: {
    stripe_publishable_key?: string;
    stripe_secret_key?: string;
    stripe_webhook_secret?: string;
    fare_rules?: number;
    zello_channel?: string;
  };
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/settings", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Test Stripe settings (blank POST)
export const testStripeSettingsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/settings/test-stripe", {
    method: "POST",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// ------------------ Message / Alert Management APIs ------------------

// 1. Get all messages with optional status
export const getMessagesApi = async ({
  status,
  companyID,
  token,
}: {
  status?: "sent" | "draft" | "schedule";
  companyID: string;
  token?: string;
}) => {
  const query = status ? `?status=${status}` : "";
  return howl(`/v1/admin/messages${query}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Get message by ID with optional status
export const getMessageByIdApi = async ({
  id,
  status,
  companyID,
  token,
}: {
  id: number | string;
  status?: "sent" | "draft" | "schedule";
  companyID: string;
  token?: string;
}) => {
  const query = status ? `?status=${status}` : "";
  return howl(`/v1/admin/messages/${id}${query}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Delete message by ID
export const deleteMessageByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/messages/${id}`, {
    method: "DELETE",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Get dashboard stats for messages
export const getMessagesDashboardStatsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/messages/dashboard/stats", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 5. Create new message
export const createMessageApi = async ({
  body,
  companyID,
  token,
}: {
  body: {
    subject: string;
    body: string;
    message_type: string;
    recipient_type: string;
    action: string;
    scheduled_at?: string;
  };
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/messages", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 6. Update message
export const updateMessageApi = async ({
  body,
  id,
  companyID,
  token,
}: {
  body: {
    subject: string;
    body: string;
    message_type: string;
    recipient_type: string;
    action: string;
    scheduled_at?: string;
  };
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  const bodyWithMethod = { ...body, _method: "PUT" };
  return howl(`/v1/admin/messages/${id}`, {
    method: "POST", // POST + _method override
    body: bodyWithMethod,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// ------------------ Reporting APIs ------------------

// 1. Revenue by route
export const getRevenueByRouteApi = async ({
  filter,
  companyID,
  token,
}: {
  filter?: "daily" | "weekly" | "monthly";
  companyID: string;
  token?: string;
}) => {
  const query = filter ? `?filter=${filter}` : "";
  return howl(`/v1/admin/reports/revenue-by-route${query}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Monthly trends
export const getMonthlyTrendsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/reports/monthly-trends", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Cash reconciliation
export const getCashReconciliationApi = async ({
  date,
  companyID,
  token,
}: {
  date?: string;
  companyID: string;
  token?: string;
}) => {
  const query = date ? `?date=${date}` : "";
  return howl(`/v1/admin/reports/cash-reconciliation${query}`, {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Passenger analytics
export const getPassengerAnalyticsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/passengers/dashboard/state", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 5. Route statistics
export const getRouteStatisticsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/reports/route-statistics", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};
export const getRouteAnalytics = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/reports/passenger-analytics", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 6. Check cash reconciliation
export const checkCashReconciliationApi = async ({
  body,
  companyID,
  token,
}: {
  body: {
    driver_id: number | string;
    date: string;
    cash_processed: number;
    received_cash: number;
  };
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/reports/cash-reconciliation/check", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// ------------------ FAQ Management APIs ------------------

// 1. Get all FAQs
export const getFaqsApi = async ({
  companyID,
  token,
}: {
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/faqs", {
    method: "GET",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 2. Delete FAQ by ID
export const deleteFaqByIdApi = async ({
  id,
  companyID,
  token,
}: {
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  return howl(`/v1/admin/faqs/${id}`, {
    method: "DELETE",
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 3. Create new FAQ
export const createFaqApi = async ({
  body,
  companyID,
  token,
}: {
  body: {
    question: string;
    answer: string;
    is_active: number;
  };
  companyID: string;
  token?: string;
}) => {
  return howl("/v1/admin/faqs", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};

// 4. Update FAQ
export const updateFaqApi = async ({
  body,
  id,
  companyID,
  token,
}: {
  body: {
    question: string;
    answer: string;
    is_active: number;
  };
  id: number | string;
  companyID: string;
  token?: string;
}) => {
  const bodyWithMethod = { ...body, _method: "PUT" };
  return howl(`/v1/admin/faqs/${id}`, {
    method: "POST", // POST + _method override
    body: bodyWithMethod,
    headers: { "X-Company-ID": String(companyID) },
    ...(token && { token }),
  });
};
