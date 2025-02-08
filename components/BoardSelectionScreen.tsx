import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data for boards - replace with real data later
const mockBoards = [
  { id: "1", name: "Board 1" },
  { id: "2", name: "Board 2" },
  { id: "3", name: "Board 3" },
];

export default function BoardSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dooodle Boards</Text>
      <FlatList
        data={mockBoards}
        renderItem={({ item }) => (
          <Link href={`/board/${item.id}`} asChild>
            <TouchableOpacity style={styles.boardItem}>
              <Text style={styles.boardText}>{item.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create New Board</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
  },
  boardItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  boardText: {
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
