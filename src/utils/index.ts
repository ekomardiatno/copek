import { themeColors } from "../constants";

export function colorYiq(hex: string): string {
  var r = parseInt(hex.substr(1, 2), 16),
      g = parseInt(hex.substr(3, 2), 16),
      b = parseInt(hex.substr(5, 2), 16),
      yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 196) ? themeColors.black : themeColors.white;
}