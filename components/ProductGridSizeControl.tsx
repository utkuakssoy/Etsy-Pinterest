"use client";

import { useEffect, useState } from "react";

const GRID_SIZE_KEY = "pinpilot:product-grid-size";
const GRID_SIZE_EVENT = "pinpilot:product-grid-size-changed";
const DEFAULT_GRID_SIZE = 220;

export function useProductGridSize() {
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);

  useEffect(() => {
    const readSize = () => {
      const value = Number(window.localStorage.getItem(GRID_SIZE_KEY));
      setGridSize(Number.isFinite(value) && value >= 150 ? value : DEFAULT_GRID_SIZE);
    };

    readSize();
    window.addEventListener(GRID_SIZE_EVENT, readSize);
    return () => window.removeEventListener(GRID_SIZE_EVENT, readSize);
  }, []);

  return gridSize;
}

export function ProductGridSizeControl() {
  const gridSize = useProductGridSize();

  function handleChange(value: string) {
    window.localStorage.setItem(GRID_SIZE_KEY, value);
    window.dispatchEvent(new Event(GRID_SIZE_EVENT));
  }

  return (
    <label className="flex items-center gap-3 text-xs font-medium text-neutral-500">
      Grid size
      <input
        type="range"
        min="150"
        max="340"
        step="10"
        value={gridSize}
        onChange={(event) => handleChange(event.target.value)}
        className="h-1.5 w-32 accent-white"
      />
    </label>
  );
}
