export type PersonLite = {
  id: string;
  name: string;
  birthYear?: string | null;
};

// First letter in NAME is from A to Z
// If there is no NAME return '#'
export function initialKey(name: string): string {
  if (!name) return "#";
  const ch = name.trim().charAt(0).toUpperCase();
  return ch >= "A" && ch <= "Z" ? ch : "#";
}

// sort people by name
export function sortPeopleByName(
  list: PersonLite[],
  asc: boolean,
): PersonLite[] {
  return [...list].sort((a, b) =>
    asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );
}

//grouping by FIRST LETTER
export function groupPeopleByInitial(list: PersonLite[]) {
  return list.reduce<Record<string, PersonLite[]>>((acc, p) => {
    const key = initialKey(p.name);
    (acc[key] ||= []).push(p);
    return acc;
  }, {});
}

// Order of section from A to Z + symbols
export function sortInitials(keys: string[], asc: boolean): string[] {
  const letters = keys
    .filter((k) => k !== "#")
    .sort((a, b) => (asc ? a.localeCompare(b) : b.localeCompare(a)));
  const specials = keys.includes("#") ? ["#"] : [];
  return asc ? [...letters, ...specials] : [...specials, ...letters];
}
