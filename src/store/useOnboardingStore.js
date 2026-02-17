import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOnboardingStore = create(
  persist(
    (set) => ({
      travelData: {
        location: "",
        accommodation: "", // Optional
        accommodations: [], // Array of {name, startDate, endDate}
        startDate: null,
        endDate: null,
        companions: [], // mixed type
        peopleCount: 1,
        transport: "",
        styles: [],
        budget: 0,
      },
      generatedTripData: null,
      myTrips: [],
      user: null,
      setTravelData: (data) =>
        set((state) => ({
          travelData: { ...state.travelData, ...data },
        })),
      setGeneratedTripData: (data) => set({ generatedTripData: data }),
      setUser: (user) => set({ user }),
      saveTrip: () =>
        set((state) => {
          if (!state.generatedTripData) return {};

          // Helper map for companion labels (Should match CompanionSelection options)
          const COMPANION_MAP = {
            alone: "혼자",
            couple: "연인과",
            friends: "친구와",
            family: "가족과",
            parents: "부모님과",
            etc: "기타",
          };

          // Get primary companion label
          const rawCompanion = state.travelData?.companions?.[0];
          const companionLabel =
            COMPANION_MAP[rawCompanion] || rawCompanion || "나홀로";

          const newTrip = {
            ...state.generatedTripData,
            id: Date.now(),
            createdAt: new Date(),
            tags: ["🌿 자연", "☕️ 카페"], // Mock tags
            totalBudget: 1000000,
            usedBudget: 350000,
            imageUrl: "",
            companion: companionLabel, // Add companion info
          };
          return {
            myTrips: [...state.myTrips, newTrip],
            generatedTripData: null,
          };
        }),
      resetTravelData: () =>
        set({
          travelData: {
            location: "",
            accommodation: "",
            accommodations: [],
            startDate: null,
            endDate: null,
            companions: [],
            peopleCount: 1,
            transport: "",
            styles: [],
            budget: 0,
          },
          generatedTripData: null,
        }),
    }),
    {
      name: "gabojago-travel-storage",
    },
  ),
);
