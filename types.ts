
export type ImageSize = '1K' | '2K' | '4K';

export interface ColoringPage {
  id: string;
  prompt: string;
  imageUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

export interface BookSettings {
  childName: string;
  theme: string;
  imageSize: ImageSize;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
