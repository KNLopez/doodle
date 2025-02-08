import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DrawingCanvas, { DrawingCanvasRef } from "./DrawingCanvas";
import { SettingsPanel } from "./drawing/SettingsPanel";

const COLORS = [
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  // Add more colors
  "#FFA500",
  "#800080",
  "#008080",
  "#FFC0CB",
  "#A52A2A",
];

const STROKE_WIDTHS = [2, 4, 6, 8, 10, 12, 14];
const SHAPES = ["rectangle", "circle", "line", "triangle"] as const;
type ShapeType = (typeof SHAPES)[number];

interface SettingsPopupProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: { x: number; y: number };
}

function SettingsPopup({
  visible,
  onClose,
  title,
  children,
  position,
}: SettingsPopupProps) {
  const modalStyle = position
    ? [
        styles.modalContent,
        {
          position: "absolute" as const,
          left: position.x,
          top: position.y,
          width: "auto",
          minWidth: 250,
        },
      ]
    : styles.modalContent;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={modalStyle} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </Pressable>
    </Modal>
  );
}

export default function DrawingScreen() {
  const canvasRef = useRef<DrawingCanvasRef>(null);
  const [selectedTool, setSelectedTool] = useState<"pen" | "shape" | "select">(
    "pen"
  );
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(
    STROKE_WIDTHS[0]
  );
  const [selectedShape, setSelectedShape] = useState<ShapeType>("rectangle");
  const [fillColor, setFillColor] = useState("transparent");
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    setSelectedPath(null);
  };

  const handleLongPress = (type: string, event: any) => {
    const { pageX, pageY } = event.nativeEvent;

    let settingsType = type;
    if (type === "pen") {
      settingsType = "stroke";
    } else if (type === "shape") {
      settingsType = "shape";
    }

    setSettingsVisible(true);
  };

  const handlePathSelect = (index: number | null) => {
    setSelectedPath(index);
    if (index !== null) {
      setSettingsVisible(true);
    }
  };

  const updateSelectedPath = (
    color: string,
    strokeWidth: number,
    fillColor?: string
  ) => {
    canvasRef.current?.updateSelectedPath?.(color, strokeWidth, fillColor);
  };

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.toolSection}>
          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "pen" && styles.selectedTool,
            ]}
            onPress={() => setSelectedTool("pen")}
            onLongPress={(e) => handleLongPress("pen", e)}
          >
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "shape" && styles.selectedTool,
            ]}
            onPress={() => setSelectedTool("shape")}
            onLongPress={(e) => handleLongPress("shape", e)}
          >
            <MaterialIcons name="category" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "select" && styles.selectedTool,
            ]}
            onPress={() => setSelectedTool("select")}
          >
            <MaterialIcons name="pan-tool" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.toolButton} onPress={handleClear}>
          <MaterialIcons name="clear" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <DrawingCanvas
        ref={canvasRef}
        mode={selectedTool}
        color={selectedColor}
        strokeWidth={selectedStrokeWidth}
        fillColor={fillColor}
        shapeType={selectedShape}
        selectedPath={selectedPath}
        onSelectPath={handlePathSelect}
      />

      <SettingsPanel
        visible={settingsVisible}
        type={selectedTool === "shape" ? "shape" : "stroke"}
        selectedColor={selectedColor}
        strokeWidth={selectedStrokeWidth}
        fillColor={fillColor}
        selectedShape={selectedShape}
        onColorChange={setSelectedColor}
        onStrokeWidthChange={setSelectedStrokeWidth}
        onFillColorChange={setFillColor}
        onShapeChange={(shape: ShapeType) => setSelectedShape(shape)}
        colors={COLORS}
        shapes={[...SHAPES]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  toolbar: {
    width: 60,
    backgroundColor: "#f8f8f8",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    padding: 10,
    gap: 20,
    alignItems: "center",
  },
  toolSection: {
    gap: 10,
    alignItems: "center",
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedTool: {
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsContent: {
    gap: 15,
  },
  settingsLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
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
  strokeGrid: {
    gap: 10,
  },
  strokeButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  selectedStroke: {
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: "#000",
  },
  strokePreview: {
    backgroundColor: "#000",
    borderRadius: 2,
  },
  shapeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
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
