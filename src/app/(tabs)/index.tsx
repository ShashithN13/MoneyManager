import { useState } from "react";
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";
import { router } from "expo-router";
import { Transaction, TransactionType, useTransactions, } from "../../context/TransactionContext";
import { sendTransactionNotification } from "../../utils/notifications";

const categories = ["Food", "Transport", "Bills", "Shopping", "Salary", "Other"];

function formatMoney(amount: number) {
  return `Rs. ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";

  return (
    <Pressable
      style={styles.transactionRow}
      onPress={() =>
        router.push({
          pathname: "/transaction/[id]",
          params: { id: transaction.id },
        })
      }
    >
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryIconText}>
          {isIncome ? "+" : transaction.category.slice(0, 1)}
        </Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionSubtitle}>
          {transaction.category} ·{" "}
          {new Date(transaction.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? "+" : "-"}
        {formatMoney(transaction.amount)}
      </Text>
    </Pressable>
  );
}

export default function TransactionsScreen() {
  const { transactions, addTransaction, appStateMessage } = useTransactions();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState<TransactionType>("expense");
  const [note, setNote] = useState("");

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  function closeModal() {
    setModalVisible(false);
    setTitle("");
    setAmount("");
    setNote("");
    setCategory(categories[0]);
    setType("expense");
  }

  async function saveTransaction() {
    const numberAmount = Number(amount);

    if (!title.trim() || !Number.isFinite(numberAmount) || numberAmount <= 0) {
      Alert.alert("Check your entry", "Enter a title and an amount greater than zero.");
      return;
    }

    addTransaction({
      title: title.trim(),
      amount: numberAmount,
      category,
      type,
      note: note.trim(),
    });
    closeModal();

    try {
      const notificationSent = await sendTransactionNotification(title.trim());
      if (notificationSent) {
        Alert.alert("Transaction added", "Your transaction was saved and a notification was sent.");
      } else {
        Alert.alert(
          "Transaction added",
          "Your transaction was saved. Notifications are unavailable on web or permission was not granted.",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown notification error.";
      Alert.alert(
        "Transaction added",
        `Your transaction was saved, but the notification could not be sent: ${message}`,
      );
    }
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionRow transaction={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.appStateBanner}>
              <Text style={styles.appStateText}>{appStateMessage}</Text>
            </View>

            <Text style={styles.greeting}>Good day 👋</Text>
            <Text style={styles.heading}>Your money, made simple.</Text>

            <View style={styles.balanceCard}>
              <Text style={styles.cardLabel}>TOTAL BALANCE</Text>
              <Text style={styles.balance}>
                {formatMoney(income - expenses)}
              </Text>
              <View style={styles.totalsRow}>
                <View>
                  <Text style={styles.lightLabel}>Income</Text>
                  <Text style={styles.lightAmount}>{formatMoney(income)}</Text>
                </View>
                <View>
                  <Text style={styles.lightLabel}>Expenses</Text>
                  <Text style={styles.lightAmount}>{formatMoney(expenses)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Recent transactions</Text>
              <Pressable onPress={() => setModalVisible(true)}>
                <Text style={styles.addLink}>+ Add</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions yet. Add your first one.</Text>
        }
      />

      <Pressable
        accessibilityRole="button"
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add transaction</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.modalHeading}>
                <Text style={styles.modalTitle}>New transaction</Text>
                <Pressable onPress={closeModal}>
                  <Text style={styles.closeButton}>✕</Text>
                </Pressable>
              </View>

              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.choiceRow}>
                {(["expense", "income"] as const).map((transactionType) => (
                  <Pressable
                    key={transactionType}
                    style={[
                      styles.choiceButton,
                      type === transactionType && styles.selectedChoice,
                    ]}
                    onPress={() => setType(transactionType)}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        type === transactionType && styles.selectedChoiceText,
                      ]}
                    >
                      {transactionType === "expense" ? "Expense" : "Income"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Lunch"
                value={title}
                onChangeText={setTitle}
                maxLength={40}
              />

              <Text style={styles.inputLabel}>Amount (Rs.)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryChoices}>
                {categories.map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.categoryChoice,
                      category === item && styles.selectedCategory,
                    ]}
                    onPress={() => setCategory(item)}
                  >
                    <Text
                      style={[
                        styles.categoryChoiceText,
                        category === item && styles.selectedChoiceText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>Note (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Add a short note"
                value={note}
                onChangeText={setNote}
                maxLength={80}
              />

              <Pressable style={styles.saveButton} onPress={saveTransaction}>
                <Text style={styles.saveButtonText}>Save transaction</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5FAF7" },
  listContent: { padding: 20, paddingBottom: 110 },
  appStateBanner: {
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    marginBottom: 18,
    padding: 10,
  },
  appStateText: { color: "#245B7A", fontSize: 12 },
  greeting: { color: "#087F5B", fontSize: 14, fontWeight: "700" },
  heading: { color: "#18352B", fontSize: 24, fontWeight: "700", marginTop: 5 },
  balanceCard: {
    backgroundColor: "#087F5B",
    borderRadius: 18,
    marginTop: 22,
    padding: 20,
  },
  cardLabel: { color: "#D4F5E8", fontSize: 12, fontWeight: "700" },
  balance: { color: "#FFFFFF", fontSize: 30, fontWeight: "700", marginTop: 8 },
  totalsRow: {
    borderTopColor: "#FFFFFF44",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
  },
  lightLabel: { color: "#D4F5E8", fontSize: 12 },
  lightAmount: { color: "#FFFFFF", fontSize: 15, fontWeight: "600", marginTop: 4 },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 26,
  },
  sectionTitle: { color: "#18352B", fontSize: 18, fontWeight: "700" },
  addLink: { color: "#087F5B", fontSize: 15, fontWeight: "700" },
  transactionRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    flexDirection: "row",
    marginBottom: 10,
    padding: 14,
  },
  categoryIcon: {
    alignItems: "center",
    backgroundColor: "#E7F5EF",
    borderRadius: 12,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  categoryIconText: { color: "#087F5B", fontSize: 18, fontWeight: "700" },
  transactionInfo: { flex: 1, marginLeft: 12 },
  transactionTitle: { color: "#18352B", fontSize: 14, fontWeight: "600" },
  transactionSubtitle: { color: "#78909C", fontSize: 12, marginTop: 5 },
  amount: { fontSize: 13, fontWeight: "700" },
  income: { color: "#087F5B" },
  expense: { color: "#C2413B" },
  emptyText: { color: "#78909C", paddingVertical: 20, textAlign: "center" },
  addButton: {
    alignItems: "center",
    backgroundColor: "#087F5B",
    borderRadius: 14,
    bottom: 14,
    left: 20,
    padding: 15,
    position: "absolute",
    right: 20,
  },
  addButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  modalBackground: {
    backgroundColor: "#00000066",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#F5FAF7",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: "90%",
    padding: 22,
  },
  modalHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  modalTitle: { color: "#18352B", fontSize: 20, fontWeight: "700" },
  closeButton: { color: "#607D73", fontSize: 20, padding: 4 },
  inputLabel: {
    color: "#34564A",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE8E1",
    borderRadius: 10,
    borderWidth: 1,
    color: "#18352B",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  choiceRow: { flexDirection: "row", gap: 10 },
  choiceButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE8E1",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  selectedChoice: { backgroundColor: "#087F5B", borderColor: "#087F5B" },
  choiceText: { color: "#34564A", fontWeight: "600" },
  selectedChoiceText: { color: "#FFFFFF" },
  categoryChoices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChoice: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE8E1",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedCategory: { backgroundColor: "#087F5B", borderColor: "#087F5B" },
  categoryChoiceText: { color: "#34564A", fontSize: 12 },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#087F5B",
    borderRadius: 12,
    marginBottom: 14,
    marginTop: 22,
    padding: 15,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
