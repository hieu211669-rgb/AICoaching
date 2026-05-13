/**
 * @interface Video
 * Represents a video tutorial in the system.
 */
export interface Video {
  /** @primaryKey Unique identifier for the video */
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High' | 'Expert';
  focus: string;
  date: Date | string;
}
