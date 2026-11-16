# Money Manager

**Student name:** H.M.S.N.B Herath  
**Student ID:** PS/2022/150

## About the app

Money Manager is a small Expo and React Native app for recording income and expenses. It starts with sample transactions and lets you add and delete transactions, check your balance, and view spending by category.

The app is written in TypeScript (`.tsx`) because the supplied Expo project uses TypeScript. The screens and examples are kept straightforward for a beginner to follow.

## Screens

- **Transactions:** Shows the current balance, income, expenses, and a FlatList of recent transactions.
- **New transaction:** A modal form for entering income or expenses, category, amount, and an optional note. Saving updates the list and totals.
- **Transaction details:** Open a transaction to see its date and note. The screen has a back button and a delete confirmation.
- **Summary:** Shows the balance, income, expenses, and spending grouped by category.

Amounts are displayed in Sri Lankan rupees (Rs.).

## Components and project structure

- React Native `View`, `Text`, `Pressable`, `TextInput`, `Modal`, `ScrollView`, and `FlatList` build the interface.
- `src/context/TransactionContext.tsx` stores transactions and shares them between screens with React Context and `useState`.
- `src/app/_layout.tsx` creates the root stack and listens for app foreground/background changes through `AppState`.
- `src/app/(tabs)/_layout.tsx` creates the Transactions and Summary tabs.
- `src/app/(tabs)/index.tsx` is the transaction list and add-transaction modal.
- `src/app/(tabs)/summary.tsx` calculates and displays the summary.
- `src/app/transaction/[id].tsx` is the transaction detail screen inside the root stack.
- `src/utils/notifications.ts` requests permission and schedules a local notification when a transaction is added.

Transactions are held in memory while the app is running. The app reloads the hard-coded sample data after a full restart; this assignment version does not use a database.

## Navigation

Expo Router uses the files in `src/app` as routes. A root Stack contains the tab navigator and the transaction details screen. The tab navigator contains Transactions and Summary. Selecting a transaction pushes its detail screen onto the stack; the back button returns to the list.

## App state and notifications

The root layout listens for `AppState` changes. When the app returns to the foreground, a message appears at the top of the Transactions screen. To demonstrate it, send the app to the background and reopen it.

Adding a transaction requests notification permission if needed and schedules an immediate local notification. On Android, the app creates a notification channel. Notifications require a supported iOS or Android device/simulator and permission; the web version explains that local notifications are unavailable there. This uses local notifications only, not a push-notification server.

## Run the app

1. Install Node.js and npm.
2. From the `MoneyManager` project folder, install packages:

   ```sh
   npm install
   ```

3. Start Expo:

   ```sh
   npx expo start
   ```

4. Open the project in Expo Go or an emulator. Allow notifications when prompted, add a transaction, open its detail screen, and switch to Summary to try the main features.

## Assignment submission

- **Repository:** https://github.com/ShashithN13/MoneyManager.git
- **Screen recording:** https://drive.google.com/drive/folders/1_VGNUQlEzoFqjynVpo0RgqWYJohdgPja?usp=drive_link

The recording should show the populated sample list, tab and detail navigation, adding or deleting a transaction, the app returning from the background, and a local notification.
