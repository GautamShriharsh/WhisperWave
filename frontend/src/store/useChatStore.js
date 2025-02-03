import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch {
          toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
        if (!userId) return; // ✅ Prevent API call if userId is missing        
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data || [] }); // ✅ Ensure messages is always an array
        } catch (error) {
            toast.error(error.response.data.message);
            set({ messages: [] }); // ✅ Prevent undefined state
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser?._id) {
            toast.error("No user selected.");
            return;
          }
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: Array.isArray(messages) ? [...messages, res.data] : [res.data] });
        } catch (error) {
            console.error("Message send error:", error);
            
            const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
            toast.error(errorMessage);
          }
      },
    // todo: optimize this one later
    setSelectedUser: (selectedUser) => set({selectedUser}),
          
}));