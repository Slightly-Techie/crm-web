"use client";
import store from "@/redux";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";

type Props = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

export const Providers = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
    </Provider>
  );
};
