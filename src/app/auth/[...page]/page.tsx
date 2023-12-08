"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const params = new URLSearchParams(location.hash.substring(1));
  const token = params.get("access_token");
  const router = useRouter();
  useEffect(() => {
    if (token) {
      window.localStorage.setItem("token", token);
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } else {
      router.push("/login");
    }
  }, [router, token]);

  return <div>Redirecting...</div>;
};

export default AuthPage;
