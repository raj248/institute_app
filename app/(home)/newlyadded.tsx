import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { getNewlyAddedItems } from "~/lib/api"; // adjust path if needed
import type { NewlyAdded } from "~/types/entities";

const NewlyAddedScreen = () => {
  const [data, setData] = useState<NewlyAdded[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNewlyAddedItems();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error ?? "Unknown error");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.center} />;
  if (error) return <Text style={styles.center}>Error: {error}</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.table}>{item.tableName.toUpperCase()}</Text>
          <Text style={styles.id}>Entity ID: {item.entityId}</Text>
          <Text style={styles.date}>{new Date(item.addedAt).toLocaleString()}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  container: { padding: 16 },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  table: { fontWeight: "bold", fontSize: 16 },
  id: { fontSize: 14, color: "#555" },
  date: { fontSize: 12, color: "#999" },
});

export default NewlyAddedScreen;
