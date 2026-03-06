const setA = [
  "Silent",
  "Swift",
  "Phantom",
  "Rogue",
  "Stealthy",
  "Bold",
  "Cunning",
  "Nimble",
  "Sly",
  "Daring",
  "Covert",
  "Clever",
  "Agile",
  "Brazen",
  "Elusive",
];

const setB = [
  "Crimson",
  "Cobalt",
  "Velvet",
  "Shadow",
  "Golden",
  "Silver",
  "Onyx",
  "Scarlet",
  "Amber",
  "Ivory",
  "Jade",
  "Obsidian",
  "Copper",
  "Azure",
  "Violet",
];

const setC = [
  "Fox",
  "Vault",
  "Eagle",
  "Cipher",
  "Wolf",
  "Ghost",
  "Raven",
  "Hawk",
  "Lynx",
  "Viper",
  "Sphinx",
  "Cobra",
  "Panther",
  "Falcon",
  "Jackal",
];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateCodename(): string {
  return pick(setA) + pick(setB) + pick(setC);
}

export { setA, setB, setC };
