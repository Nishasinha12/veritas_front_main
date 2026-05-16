import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FeedPost = {
  id: string;
  content: string;
  resultType: string;
  timestamp: number;
  archived: boolean;
};

type PointsStore = {
  points: number;
  searchCount: number;
  feedPosts: FeedPost[];
  addPoints: (amount: number) => void;
  incrementSearch: () => void;
  addFeedPost: (post: Omit<FeedPost, "id" | "timestamp">) => void;
};

const usePointsStore = create<PointsStore>()(
  persist(
    (set) => ({
      points: 0,
      searchCount: 0,
      feedPosts: [],
      addPoints: (amount) =>
        set((state) => ({ points: state.points + amount })),
      incrementSearch: () =>
        set((state) => ({
          searchCount: state.searchCount + 1,
          points: state.points + 10,
        })),
      addFeedPost: (post) =>
        set((state) => ({
          feedPosts: [
            {
              ...post,
              id: `fp-${Date.now()}`,
              timestamp: Date.now(),
            },
            ...state.feedPosts,
          ],
        })),
    }),
    {
      name: "veritas-points",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePointsStore;