export default function uniqueArray(array: string[]) {
  return array.filter((value, i, a) => a.indexOf(value) === i);
}
