// ONERIDE PROJECT CONFIGURATION
// ?? DO NOT CHANGE THIS CONFIGURE FILE UNLESS YOU ARE AWARE OF WHAT IT DOES
// ! THINK BEFORE YOU CHANGE THIS FILE


export const base_server = process.env.NEXT_PUBLIC_SERVER!;
const onDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

// Example usage
export const apiConfig = {
  baseUrl: `${base_server}/api`,
  base:base_server,
  isDevelopment: onDev,
}; 

export const blankImg = (
  x?: number | string,
  y?: number | string
) => {
  if (x && y) {
    return `https://placehold.co/${x}x${y}/png`;
  }
  if (x) {
    return `https://placehold.co/${x}x${x}/png`;
  }
  return `https://placehold.co/500x500/png`;
};
