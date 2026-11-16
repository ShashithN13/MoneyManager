import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTransactions } from "../../context/TransactionContext";

function formatMoney(amount: number) {
  return `Rs. ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function SummaryScreen() {
  const { transactions } = useTransactions();
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const categories = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, number>>((totals, transaction) => {
      totals[transaction.category] =
        (totals[transaction.category] ?? 0) + transaction.amount;
      return totals;
    }, {});
  const categoryRows = Object.entries(categories).map(([name, amount]) => ({
    name,
    amount,
  }));

  return (
    <View style={styles.screen}>
      <FlatList
        data={categoryRows}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Monthly overview</Text>
            <Text style={styles.description}>
              A quick look at the money you have recorded.
            </Text>
            <View style={styles.balanceCard}>
              <Text style={styles.cardLabel}>BALANCE</Text>
              <Text style={styles.balance}>{formatMoney(income - expenses)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={[styles.summaryAmount, styles.income]}>
                  {formatMoney(income)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Expenses</Text>
                <Text style={[styles.summaryAmount, styles.expense]}>
                  {formatMoney(expenses)}
                </Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Spending by category</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.categoryRow}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryAmount}>{formatMoney(item.amount)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Add an expense to see categories here.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#F5FAF7", flex: 1 },
  content: { padding: 20, paddingBottom: 30 },
  title: { color: "#18352B", fontSize: 25, fontWeight: "700" },
  description: { color: "#78909C", fontSize: 14, marginTop: 7 },
  balanceCard: {
    backgroundColor: "#087F5B",
    borderRadius: 18,
    marginTop: 22,
    padding: 20,
  },
  cardLabel: { color: "#D4F5E8", fontSize: 12, fontWeight: "700" },
  balance: { color: "#FFFFFF", fontSize: 28, fontWeight: "700", marginTop: 10 },
  summaryRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    flex: 1,
    padding: 15,
  },
  summaryLabel: { color: "#78909C", fontSize: 13 },
  summaryAmount: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  income: { color: "#087F5B" },
  expense: { color: "#C2413B" },
  sectionTitle: {
    color: "#18352B",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 26,
  },
  categoryRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
    padding: 16,
  },
  categoryName: { color: "#34564A", fontSize: 14, fontWeight: "600" },
  categoryAmount: { color: "#18352B", fontSize: 14, fontWeight: "700" },
  emptyText: { color: "#78909C", paddingVertical: 15 },
});
