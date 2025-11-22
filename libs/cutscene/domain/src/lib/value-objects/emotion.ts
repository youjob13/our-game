export const EMOTIONS = [
  'neutral',
  'happy',
  'sad',
  'angry',
  'surprised',
  'confused',
  'excited',
] as const;

export type Emotion = (typeof EMOTIONS)[number];

export function isValidEmotion(value: string): value is Emotion {
  return EMOTIONS.includes(value as Emotion);
}
