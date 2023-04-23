// Zustand
import { create } from "zustand";

const useChatStore = create((set) => ({
  conversationID: null,
  user: null,
  userImg: "",
  updateConversation: (ID, user, img) => set({ conversationID: ID, user: user, userImg: img }),
}));

export default useChatStore;
