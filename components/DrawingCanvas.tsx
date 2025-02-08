import { Canvas, Path, useCanvasRef } from "@shopify/react-native-skia";
import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import { useDrawing } from "./hooks/useDrawing";

interface DrawingCanvasProps {
  mode: "pen" | "shape" | "select";
  color: string;
  strokeWidth: number;
  fillColor?: string;
  shapeType?: "rectangle" | "circle" | "line" | "triangle";
  selectedPath?: number | null;
  onSelectPath: (
    index: number | null,
    boundingBox?: { x: number; y: number; width: number; height: number }
  ) => void;
}

export interface DrawingCanvasRef {
  clearCanvas: () => void;
  updateSelectedPath: (
    color: string,
    strokeWidth: number,
    fillColor?: string
  ) => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  (
    {
      mode,
      color,
      strokeWidth,
      fillColor,
      shapeType,
      selectedPath,
      onSelectPath,
    },
    ref
  ) => {
    const canvasRef = useCanvasRef();
    const {
      paths,
      currentPath,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      clearCanvas,
      updatePath,
      handlePathSelection,
    } = useDrawing({
      mode,
      color,
      strokeWidth,
      fillColor,
      shapeType,
      onSelectPath,
    });

    useImperativeHandle(ref, () => ({
      clearCanvas,
      updateSelectedPath: (
        color: string,
        strokeWidth: number,
        fillColor?: string
      ) => {
        if (selectedPath !== null && selectedPath !== undefined) {
          updatePath(selectedPath, { color, strokeWidth, fillColor });
        }
      },
    }));

    const handleTouch = (event: any) => {
      if (mode === "select") {
        handlePathSelection(event);
      } else {
        onTouchStart(event);
      }
    };

    return (
      <View style={styles.container}>
        <Canvas
          ref={canvasRef}
          style={styles.canvas}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={handleTouch}
          onResponderMove={mode !== "select" ? onTouchMove : undefined}
          onResponderRelease={mode !== "select" ? onTouchEnd : undefined}
        >
          {paths.map(({ path, color, strokeWidth, fillColor, type }, index) => (
            <React.Fragment key={index}>
              {type === "shape" && fillColor && fillColor !== "transparent" && (
                <Path path={path} style="fill" color={fillColor} opacity={1} />
              )}
              <Path
                path={path}
                strokeWidth={strokeWidth}
                style="stroke"
                color={color}
                opacity={1}
              />
            </React.Fragment>
          ))}
          {currentPath && (
            <React.Fragment>
              {mode === "shape" && fillColor && fillColor !== "transparent" && (
                <Path
                  path={currentPath}
                  style="fill"
                  color={fillColor}
                  opacity={1}
                />
              )}
              <Path
                path={currentPath}
                strokeWidth={strokeWidth}
                style="stroke"
                color={color}
                opacity={1}
              />
            </React.Fragment>
          )}
        </Canvas>
      </View>
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  canvas: {
    flex: 1,
  },
});

export default DrawingCanvas;
