"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: number;
  company_id: number;
  name: string;
  username: string;
  email: string;
  email_verified_at: string;
  phone_number: string;
  avatar: string;
  address: string;
  rider_type: string;
  qr_code_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  balance: string;
  is_auto_top_up_enabled: boolean;
  auto_top_up_amount: string;
  auto_top_up_threshold: string;
  roles: Array<{
    id: number;
    name: string;
  }>;
  permissions: Array<string>;
  total_trips: number;
  total_spent: number;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
