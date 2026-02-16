// Global uygulama state'i
// Bildirimler, global UI durumları ve uygulama genelinde paylaşılan state

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface AppState {
  // Bildirimler
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: () => number;

  // Global UI
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ─── Bildirimler ───────────────────────────────
      notifications: [],

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearNotifications: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      // ─── Global UI ─────────────────────────────────
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
    }),
    {
      name: "nexus-app-store",
      partialize: (state) => ({
        notifications: state.notifications,
      }),
    }
  )
);
