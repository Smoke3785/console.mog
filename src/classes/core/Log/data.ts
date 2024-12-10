export const LINES = {
  CHILD: "├─",
  LAST_CHILD: "└─",
  DIRECTORY: "│ ",
  EMPTY: "   ",
};

export function replaceLineComponent(str: string, component: string): string {
  return str
    .replaceAll(LINES.CHILD, component)
    .replaceAll(LINES.LAST_CHILD, component)
    .replaceAll(LINES.DIRECTORY, component)
    .replaceAll(LINES.EMPTY, component);
}
