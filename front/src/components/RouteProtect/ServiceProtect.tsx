/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { ServiceProfileStatus } from "@/helpers/typeMock";

const ServiceProtect = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && (!isAuthenticated || !user)) {
      router.push("/login");
    } else if (
      user &&
      (!user.serviceProfile ||
        user.serviceProfile.status == ServiceProfileStatus.PENDING ||
        user.serviceProfile.status == ServiceProfileStatus.REJECTED)
    ) {
      router.push("/dashboard");
    }
  }, [isClient, isAuthenticated, loading, user]);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <svg
          className="mr-1 inline w-8 h-8 animate-spin text-primary dark:text-secondary fill-quaternary"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        Cargando...
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  return null;
};

export default ServiceProtect;
