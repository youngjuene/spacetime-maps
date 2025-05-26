export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (input) {
      if (typeof input === "string") {
        classes.push(input);
      } else if (Array.isArray(input)) {
        const result = cn(...input);
        if (result) classes.push(result);
      }
    }
  }

  return classes.join(" ");
}
