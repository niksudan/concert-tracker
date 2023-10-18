export default function sqliteEscapeString(str: string) {
  return str.replace(/\'/g, "''");
}
