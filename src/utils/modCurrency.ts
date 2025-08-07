export default function modCurrency(val: number) {
  const modifiedVal = val.toString();
  const mod = modifiedVal.length % 3
  let currency = modifiedVal.substr(0, mod)
  const thousand = modifiedVal.substr(mod).match(/\d{3}/g)
  let separator = '';
  if (thousand) {
    separator = mod ? '.' : '';
    currency += separator + thousand.join('.');
  }

  return currency;
}