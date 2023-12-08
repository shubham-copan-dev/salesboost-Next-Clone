"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthorized from "@/hooks/auth";
import { Box } from "@chakra-ui/react";

const Dashboard = () => {
  const router = useRouter();
  const auth = useAuthorized();

  useEffect(() => {
    if (!auth) router.push("/login");
  }, [auth, router]);

  return <Box textAlign="center">Default dashboard page....</Box>;
};

export default Dashboard;
