import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, MAX_RECENTLY_VIEWED } from '@/constants/config';
import { GuestViewedItem } from '@/types';

export const storageService = {
  /**
   * Read guest history. If storage is corrupted or missing, returns [] instead
   * of throwing, so the app never crashes on a bad local read.
   */
  async getGuestHistory(): Promise<GuestViewedItem[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_RECENTLY_VIEWED);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed;
    } catch (err) {
      console.warn('[storage] Corrupted guest history, resetting', err);
      return [];
    }
  },

  /**
   * Add/move-to-top a product in guest history. Dedupes and caps at
   * MAX_RECENTLY_VIEWED, mirroring the backend's upsert + trim logic.
   */
  async addToGuestHistory(productId: string): Promise<GuestViewedItem[]> {
    const current = await this.getGuestHistory();

    const withoutDup = current.filter((item) => item.productId !== productId);
    const updated: GuestViewedItem[] = [
      { productId, viewedAt: new Date().toISOString() },
      ...withoutDup,
    ].slice(0, MAX_RECENTLY_VIEWED);

    await this.saveGuestHistory(updated);
    return updated;
  },

  async saveGuestHistory(items: GuestViewedItem[]): Promise<void> {
    try {
      const capped = items.slice(0, MAX_RECENTLY_VIEWED);
      await AsyncStorage.setItem(
        STORAGE_KEYS.GUEST_RECENTLY_VIEWED,
        JSON.stringify(capped)
      );
    } catch (err) {
      console.warn('[storage] Failed to save guest history', err);
    }
  },

  async clearGuestHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GUEST_RECENTLY_VIEWED);
    } catch (err) {
      console.warn('[storage] Failed to clear guest history', err);
    }
  },
};
