import { Stack } from "expo-router";
import { AppState } from "react-native";
import { useEffect, useRef } from "react";
import { TransactionProvider, useTransactions } from "../context/TransactionContext";

function AppNavigation() {
  const { setAppStateMessage } = useTransactions();
  const previousState = useRef<string | null>(AppState.currentState ?? null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (previousState.current !== "active" && nextState === "active") {
        setAppStateMessage("Welcome back! The app returned to the foreground.");
      } else if (nextState === "background") {
        setAppStateMessage("The app moved to the background.");
      }

      previousState.current = nextState;
    });

    return () => subscription.remove();
  }, [setAppStateMessage]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="transaction/[id]"
        options={{ title: "Transaction details", presentation: "card" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <TransactionProvider>
      <AppNavigation />
    </TransactionProvider>
  );
}
