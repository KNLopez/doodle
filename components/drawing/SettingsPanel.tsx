import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingsPanelProps {
  visible: boolean;
  type: string;
  selectedColor: string;
  strokeWidth: number;
  fillColor?: string;
  selectedShape?: string;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onFillColorChange?: (color: string) => void;
  onShapeChange?: (shape: string) => void;
  colors: string[];
  shapes?: string[];
}

export function SettingsPanel({
  visible,
  type,
  selectedColor,
  strokeWidth,
  fillColor,
  selectedShape,
  onColorChange,
  onStrokeWidthChange,
  onFillColorChange,
  onShapeChange,
  colors,
  shapes,
}: SettingsPanelProps) {
  if (!visible) return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Settings
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stroke</Text>
        <View style={styles.strokeSettings}>
          <TextInput
            style={styles.strokeInput}
            value={strokeWidth.toString()}
            onChangeText={(text) => {
              if (text === "") {
                return;
              }
              const width = parseInt(text);
              if (!isNaN(width)) {
                onStrokeWidthChange(Math.min(Math.max(width, 1), 100));
              }
            }}
            onBlur={() => {
              if (!strokeWidth || strokeWidth < 1) {
                onStrokeWidthChange(1);
              }
            }}
            keyboardType="numeric"
          />
          <Text style={styles.strokeUnit}>px</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color</Text>
        <View style={styles.colorGrid}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => onColorChange(color)}
            />
          ))}
        </View>
      </View>

      {(type === "shape" || type === "path") && onFillColorChange && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fill</Text>
          <View style={styles.colorGrid}>
            <TouchableOpacity
              style={[
                styles.colorButton,
                { backgroundColor: "transparent", borderWidth: 1 },
                fillColor === "transparent" && styles.selectedColor,
              ]}
              onPress={() => onFillColorChange("transparent")}
            >
              <MaterialIcons name="block" size={20} color="#999" />
            </TouchableOpacity>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  fillColor === color && styles.selectedColor,
                ]}
                onPress={() => onFillColorChange(color)}
              />
            ))}
          </View>
        </View>
      )}

      {type === "shape" && shapes && onShapeChange && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shape</Text>
          <View style={styles.shapeGrid}>
            {shapes.map((shape) => (
              <TouchableOpacity
                key={shape}
                style={[
                  styles.shapeButton,
                  selectedShape === shape && styles.selectedShape,
                ]}
                onPress={() => onShapeChange(shape)}
              >
                <MaterialIcons
                  name={
                    shape === "rectangle"
                      ? "crop-square"
                      : shape === "circle"
                      ? "radio-button-unchecked"
                      : shape === "line"
                      ? "remove"
                      : "change-history"
                  }
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: 300,
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    padding: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  strokeSettings: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  strokeInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  strokeUnit: {
    fontSize: 16,
    color: "#666",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#000",
  },
  shapeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  shapeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedShape: {
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: "#000",
  },
});
