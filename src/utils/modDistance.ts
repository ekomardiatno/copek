import { JSX } from "react";

export default function modDistance(val: number) {

  let satuan = 'm';

  let modifiedVal = val.toString()
  if (val >= 500) {
    val = val / 1000;
    modifiedVal = val.toFixed(2);
    satuan = 'km';
  }

  return modifiedVal + ' ' + satuan;
}