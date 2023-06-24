export interface Message {
  role: string;
  content: string;
}

export interface ChatDocument {
  _id: string;
  chatId: number;
  name: string;
  messages: Message[];
}
