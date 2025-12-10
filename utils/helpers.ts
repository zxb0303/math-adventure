
export const NAMES = ["小明", "小红", "小刚", "小丽", "小华", "天天", "乐乐"];
export const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

export const COLORS = {
  primary: '#6366f1', // Indigo
  highlight: '#f43f5e', // Rose
  secondary: '#eab308', // Yellow
  pale: '#e2e8f0', // Slate 200
  text: '#334155',
  success: '#22c55e'
};

export function getRandomName(exclude: string[] = []): string {
  const available = NAMES.filter(n => !exclude.includes(n));
  return available[Math.floor(Math.random() * available.length)];
}
