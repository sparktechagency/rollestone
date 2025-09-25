import { howl } from "@/lib/utils"

// >>>>>>>>>>>>>>>>> AUTH <<<<<<<<<<<<<<<<<<<<



export const driverLoginApi = async ({
  body,
  companyID,
}: { body: { staff_number: string; pin_code: string,fcm_token?:string }; companyID: string }) => {
  return howl("/v1/auth/driver/login", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
  });
};


export const loginApi = async ({
  body,
  companyID,
}: { body: { email: string; password: string }; companyID: string }) => {
  return howl("/v1/auth/login", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
  });
};

export const logoutApi = async () => {
  return howl("/v1/auth/logout", {
    method: "POST",
    body:{}
  });
};

export const verifyEmailApi = async ({
  body,
  companyID,
}: { body: { email: string; otp: string }; companyID: string }) => {
  return howl("/v1/auth/verify", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
  });
};

export const resendVerificationApi = async ({
  body,
  companyID,
}: { body: { email: string }; companyID: string }) => {
  return howl("/v1/auth/resend-verification", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
  });
};

export const forgotPasswordApi = async ({
  body,
  companyID,
}: { body: { email: string }; companyID: string }) => {
  return howl("/v1/auth/forgot-password", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
  });
};

export const verifyPasswordOtpApi = async ({
  body,
  companyID,
}: { body: { email: string; otp: string }; companyID: string }) => {
  return howl("/v1/auth/verify-password-otp", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
  });
};

export const resetPasswordWithTokenApi = async ({
  body,
  companyID,
}: {
  body: {
    email: string;
    reset_token: string;
    password: string;
    password_confirmation: string;
  };
  companyID: string;
}) => {
  return howl("/v1/auth/reset-password-with-token", {
    method: "POST",
    body,
    headers: { "X-Company-ID": String(companyID) },
  });
};


// >>>>>>>>>>>> PROFILE <<<<<<<<<<<<<<<<<

export const getProfileApi = async ({token }: {token:string }) => {
  return howl("/v1/profile/me", {
    method: "GET",
    ...(token && { token }),
  });
};

// >>>>>>>>>>>> COMPANY <<<<<<<<<<<<<<<<<

export const getCompaniesApi = async () => {
  return howl("/v1/companies");
};