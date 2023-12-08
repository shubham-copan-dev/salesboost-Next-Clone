"use client";

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, Flex, Grid, GridItem } from "@chakra-ui/react";
import { theme } from "@/chakraConfig/theme";
import Navigation from "@/components/UI/Nav";
import Header from "@/components/UI/Header";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "@/redux/store";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <CacheProvider>
              <ChakraProvider theme={theme}>
                {/* Sidebar Navigation */}
                <Flex justifyContent="space-between">
                  <Navigation />
                  <Box width="100%">{children}</Box>
                </Flex>
              </ChakraProvider>
            </CacheProvider>
          </QueryClientProvider>
        </Provider>
      </body>
    </html>
  );
}
