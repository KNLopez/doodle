import React from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface BoundingBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  onResize: (newBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

export function BoundingBox({
  x,
  y,
  width,
  height,
  onResize,
}: BoundingBoxProps) {
  const startX = useSharedValue(x);
  const startY = useSharedValue(y);
  const startWidth = useSharedValue(width);
  const startHeight = useSharedValue(height);

  const handleCornerGesture = (
    corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  ) =>
    useAnimatedGestureHandler({
      onStart: () => {
        startX.value = x;
        startY.value = y;
        startWidth.value = width;
        startHeight.value = height;
      },
      onActive: (event) => {
        let newBounds = { x, y, width, height };

        switch (corner) {
          case "topLeft":
            newBounds = {
              x: startX.value + event.translationX,
              y: startY.value + event.translationY,
              width: startWidth.value - event.translationX,
              height: startHeight.value - event.translationY,
            };
            break;
          case "topRight":
            newBounds = {
              x: startX.value,
              y: startY.value + event.translationY,
              width: startWidth.value + event.translationX,
              height: startHeight.value - event.translationY,
            };
            break;
          case "bottomLeft":
            newBounds = {
              x: startX.value + event.translationX,
              y: startY.value,
              width: startWidth.value - event.translationX,
              height: startHeight.value + event.translationY,
            };
            break;
          case "bottomRight":
            newBounds = {
              x: startX.value,
              y: startY.value,
              width: startWidth.value + event.translationX,
              height: startHeight.value + event.translationY,
            };
            break;
        }

        // Ensure minimum size
        if (newBounds.width >= 10 && newBounds.height >= 10) {
          onResize(newBounds);
        }
      },
    });

  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x }, { translateY: y }],
    width,
    height,
  }));

  return (
    <Animated.View style={[styles.boundingBox, boxStyle]}>
      {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((corner) => (
        <PanGestureHandler
          key={corner}
          onGestureEvent={handleCornerGesture(corner as any)}
        >
          <Animated.View
            style={[styles.resizeHandle, styles[corner as keyof typeof styles]]}
          />
        </PanGestureHandler>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  boundingBox: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "dashed",
  },
  resizeHandle: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
  },
  topLeft: {
    left: -6,
    top: -6,
    cursor: "nw-resize",
  },
  topRight: {
    right: -6,
    top: -6,
    cursor: "ne-resize",
  },
  bottomLeft: {
    left: -6,
    bottom: -6,
    cursor: "sw-resize",
  },
  bottomRight: {
    right: -6,
    bottom: -6,
    cursor: "se-resize",
  },
});
