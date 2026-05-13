export const CATEGORIES = [
  { id: "for-loops", label: "For Loops", description: "Counting, accumulating, iterating through lists" },
  { id: "while-loops", label: "While Loops", description: "Conditions, countdown, input validation" },
  { id: "conditionals", label: "If/Elif/Else", description: "Selection, branching, comparisons" },
  { id: "strings", label: "String Manipulation", description: "Slicing, methods, concatenation, formatting" },
  { id: "lists", label: "Lists", description: "Searching, filtering, building, indexing, append" },
  { id: "dictionaries", label: "Dictionaries", description: "Lookup, iteration, key-value pairs" },
  { id: "functions", label: "Functions", description: "Parameters, return values, multiple returns" },
  { id: "nested-loops", label: "Nested Loops", description: "Loop inside a loop, 2D patterns" },
  { id: "file-handling", label: "File Handling", description: "Open, read, write, close" },
  { id: "validation", label: "Input Validation", description: "While loops for rejecting bad input" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function getCategoryLabel(id: string): string {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat?.label || id;
}
