import { Skia } from "@shopify/react-native-skia";
import { useMemo, useState } from "react";

interface PathData {
  path: string;
  color: string;
  strokeWidth: number;
  fillColor?: string;
  type: "pen" | "shape";
}

interface UseDrawingProps {
  mode: "pen" | "shape" | "select";
  color: string;
  strokeWidth: number;
  fillColor?: string;
  shapeType?: "rectangle" | "circle" | "line" | "triangle";
  onSelectPath?: (index: number | null) => void;
}

export function useDrawing({
  mode,
  color,
  strokeWidth,
  fillColor,
  shapeType,
  onSelectPath,
}: UseDrawingProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  // Create memoized path commands
  const pathCommands = useMemo(
    () => ({
      createRectangle: (
        start: { x: number; y: number },
        end: { x: number; y: number }
      ) => {
        const path = Skia.Path.Make();
        path.moveTo(start.x, start.y);
        path.lineTo(end.x, start.y);
        path.lineTo(end.x, end.y);
        path.lineTo(start.x, end.y);
        path.close();
        return path.toSVGString();
      },
      createCircle: (
        start: { x: number; y: number },
        end: { x: number; y: number }
      ) => {
        const path = Skia.Path.Make();
        const radius = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );
        path.addCircle(start.x, start.y, radius);
        return path.toSVGString();
      },
      createLine: (
        start: { x: number; y: number },
        end: { x: number; y: number }
      ) => {
        // Force a new path creation each time
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      },
      createTriangle: (
        start: { x: number; y: number },
        end: { x: number; y: number }
      ) => {
        const path = Skia.Path.Make();
        path.moveTo(start.x, start.y);
        path.lineTo(end.x, end.y);
        path.lineTo(start.x + (start.x - end.x), end.y);
        path.close();
        return path.toSVGString();
      },
    }),
    []
  );

  const onTouchStart = (event: any) => {
    const { locationX: x, locationY: y } = event.nativeEvent;
    setStartPoint({ x, y });

    if (mode === "pen") {
      // Use direct SVG path string for pen tool as well
      setCurrentPath(`M ${x} ${y}`);
    } else if (mode === "shape" && shapeType) {
      // Create initial path at the touch point
      let newPath;
      switch (shapeType) {
        case "rectangle":
        case "circle":
        case "line":
        case "triangle":
          newPath = pathCommands[
            `create${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}`
          ]({ x, y }, { x, y });
          break;
      }
      setCurrentPath(newPath);
    }
  };

  const onTouchMove = (event: any) => {
    if (!startPoint) return;
    const { locationX: x, locationY: y } = event.nativeEvent;

    if (mode === "pen") {
      // Append line segment to the existing path string
      setCurrentPath((prev) => `${prev} L ${x} ${y}`);
    } else if (mode === "shape" && shapeType) {
      let newPath;
      switch (shapeType) {
        case "rectangle":
          newPath = pathCommands.createRectangle(startPoint, { x, y });
          break;
        case "circle":
          newPath = pathCommands.createCircle(startPoint, { x, y });
          break;
        case "line":
          newPath = pathCommands.createLine(startPoint, { x, y });
          break;
        case "triangle":
          newPath = pathCommands.createTriangle(startPoint, { x, y });
          break;
      }
      setCurrentPath(newPath);
    }
  };

  const onTouchEnd = () => {
    if (currentPath) {
      setPaths([
        ...paths,
        {
          path: currentPath,
          color,
          strokeWidth,
          fillColor: mode === "shape" ? fillColor : undefined,
          type: mode,
        },
      ]);
    }
    setCurrentPath(null);
    setStartPoint(null);
  };

  const handlePathSelection = (event: any) => {
    const { locationX: x, locationY: y } = event.nativeEvent;

    // Find the last path that contains the touch point
    for (let i = paths.length - 1; i >= 0; i--) {
      const pathData = paths[i];
      const path = Skia.Path.MakeFromSVGString(pathData.path);

      if (path && path.contains(x, y)) {
        onSelectPath?.(i);
        return;
      }
    }
    onSelectPath?.(null);
  };

  const updatePath = (
    index: number,
    updates: { color?: string; strokeWidth?: number; fillColor?: string }
  ) => {
    setPaths(
      paths.map((path, i) => (i === index ? { ...path, ...updates } : path))
    );
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
    setStartPoint(null);
  };

  return {
    paths,
    currentPath,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    clearCanvas,
    updatePath,
    handlePathSelection,
  };
}
