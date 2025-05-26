import { useState, useCallback, useEffect } from "react";
import { City, fetchCity, CITIES } from "../cityData";

export interface CitySlot {
  id: string;
  cityName: string | null;
  city: City | null;
  isLoading: boolean;
  error: string | null;
}

export interface MultiCityState {
  slots: CitySlot[];
  layout: "grid" | "horizontal" | "vertical";
  syncAnimation: boolean;
  showLabels: boolean;
}

export interface MultiCityControls {
  addCity: (cityName: string) => void;
  removeCity: (slotId: string) => void;
  updateCity: (slotId: string, cityName: string) => void;
  setLayout: (layout: MultiCityState["layout"]) => void;
  setSyncAnimation: (sync: boolean) => void;
  setShowLabels: (show: boolean) => void;
  clearAll: () => void;
}

const generateSlotId = () =>
  `slot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useMultiCityComparison = () => {
  const [state, setState] = useState<MultiCityState>({
    slots: [],
    layout: "grid",
    syncAnimation: true,
    showLabels: true,
  });

  const loadCity = useCallback(async (slotId: string, cityName: string) => {
    setState((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.id === slotId
          ? { ...slot, isLoading: true, error: null, cityName }
          : slot
      ),
    }));

    try {
      const city = await fetchCity(cityName);
      setState((prev) => ({
        ...prev,
        slots: prev.slots.map((slot) =>
          slot.id === slotId
            ? { ...slot, city, isLoading: false, error: null }
            : slot
        ),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        slots: prev.slots.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                city: null,
                isLoading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to load city",
              }
            : slot
        ),
      }));
    }
  }, []);

  const controls: MultiCityControls = {
    addCity: useCallback(
      (cityName: string) => {
        const newSlot: CitySlot = {
          id: generateSlotId(),
          cityName,
          city: null,
          isLoading: false,
          error: null,
        };

        setState((prev) => ({
          ...prev,
          slots: [...prev.slots, newSlot],
        }));

        loadCity(newSlot.id, cityName);
      },
      [loadCity]
    ),

    removeCity: useCallback((slotId: string) => {
      setState((prev) => ({
        ...prev,
        slots: prev.slots.filter((slot) => slot.id !== slotId),
      }));
    }, []),

    updateCity: useCallback(
      (slotId: string, cityName: string) => {
        loadCity(slotId, cityName);
      },
      [loadCity]
    ),

    setLayout: useCallback((layout: MultiCityState["layout"]) => {
      setState((prev) => ({ ...prev, layout }));
    }, []),

    setSyncAnimation: useCallback((sync: boolean) => {
      setState((prev) => ({ ...prev, syncAnimation: sync }));
    }, []),

    setShowLabels: useCallback((show: boolean) => {
      setState((prev) => ({ ...prev, showLabels: show }));
    }, []),

    clearAll: useCallback(() => {
      setState((prev) => ({ ...prev, slots: [] }));
    }, []),
  };

  // Helper functions
  const getAvailableCities = useCallback(() => {
    const usedCities = new Set(
      state.slots.map((slot) => slot.cityName).filter(Boolean)
    );
    return Object.keys(CITIES).filter((cityName) => !usedCities.has(cityName));
  }, [state.slots]);

  const getLoadedCities = useCallback(() => {
    return state.slots.filter((slot) => slot.city !== null);
  }, [state.slots]);

  const isMaxCapacityReached = state.slots.length >= 4; // Limit to 4 cities for performance

  return {
    state,
    controls,
    getAvailableCities,
    getLoadedCities,
    isMaxCapacityReached,
  };
};
