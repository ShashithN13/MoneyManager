import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTransactions } from "../../context/TransactionContext";

function formatMoney(amount: number) {
  return `Rs. ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, removeTransaction } = useTransactions();
  const transaction = transactions.find((item) => item.id === id);

  function confirmDelete() {
    Alert.alert(
      "Delete transaction?",
      "This transaction will be removed from this session.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeTransaction(id);
            router.back();
          },
        },
      ],
    );
  }

  if (!transaction) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Transaction not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Pressable style={styles.backLink} onPress={() => router.back()}>
        <Text style={styles.backLinkText}>‹  Back to transactions</Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text
          style={[
            styles.amount,
            transaction.type === "income" ? styles.income : styles.expense,
          ]}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatMoney(transaction.amount)}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>
          {new Date(transaction.date).toLocaleString()}
        </Text>
        <Text style={styles.label}>Note</Text>
        <Text style={styles.value}>{transaction.note || "No note added"}</Text>
      </View>
      <Pressable style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.deleteButtonText}>Delete transaction</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#F5FAF7", flex: 1, padding: 20 },
  backLink: { marginBottom: 18, paddingVertical: 8 },
  backLinkText: { color: "#087F5B", fontSize: 15, fontWeight: "600" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 20 },
  category: { color: "#78909C", fontSize: 13 },
  title: { color: "#18352B", fontSize: 22, fontWeight: "700", marginTop: 7 },
  amount: { fontSize: 25, fontWeight: "700", marginTop: 15 },
  income: { color: "#087F5B" },
  expense: { color: "#C2413B" },
  divider: { backgroundColor: "#E7EEE9", height: 1, marginVertical: 20 },
  label: { color: "#78909C", fontSize: 12, marginTop: 12 },
  value: { color: "#18352B", fontSize: 15, marginTop: 4 },
  deleteButton: {
    alignItems: "center",
    borderColor: "#C2413B",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 18,
    padding: 14,
  },
  deleteButtonText: { color: "#C2413B", fontSize: 15, fontWeight: "600" },
  backButton: {
    backgroundColor: "#087F5B",
    borderRadius: 10,
    marginTop: 15,
    padding: 12,
  },
  backButtonText: { color: "#FFFFFF", fontWeight: "700", textAlign: "center" },
});
