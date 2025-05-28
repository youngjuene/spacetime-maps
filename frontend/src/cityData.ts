import { GridData } from "./gridData";

export type SoftMobilityMode = "pedestrian" | "runner" | "cyclist";

export type CityMetadata = {
  displayName: string;
  maxTimeness: number;
  mode: SoftMobilityMode;
  country: "USA" | "South Korea";
  population: number;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  // Soft mobility specific metrics
  walkabilityScore?: number;
  bikeInfrastructure?: "excellent" | "good" | "fair" | "poor";
  runningRoutes?: number; // Number of popular running routes
  avgSpeed: {
    kmh: number; // Average speed in km/h for this mobility mode
    description: string;
  };
};

export type City = CityMetadata & {
  mapImage: string;
  data: GridData;
};

// Soft Mobility Focused City Data - New York vs Daejeon Prototype
export const CITIES: Record<string, CityMetadata> = {
  // New York City - Soft Mobility Modes
  newyork_pedestrian: {
    displayName: "New York City",
    maxTimeness: 0.08,
    mode: "pedestrian",
    country: "USA",
    population: 8336817,
    description:
      "Dense urban environment with extensive pedestrian infrastructure",
    coordinates: { lat: 40.7128, lng: -74.006 },
    walkabilityScore: 89,
    bikeInfrastructure: "good",
    runningRoutes: 25,
    avgSpeed: {
      kmh: 5,
      description: "Average walking speed in busy NYC streets",
    },
  },
  newyork_runner: {
    displayName: "New York City",
    maxTimeness: 0.15,
    mode: "runner",
    country: "USA",
    population: 8336817,
    description:
      "Urban running paradise with Central Park and waterfront paths",
    coordinates: { lat: 40.7128, lng: -74.006 },
    walkabilityScore: 89,
    bikeInfrastructure: "good",
    runningRoutes: 25,
    avgSpeed: {
      kmh: 12,
      description: "Moderate jogging pace through city streets and parks",
    },
  },
  newyork_cyclist: {
    displayName: "New York City",
    maxTimeness: 0.08,
    mode: "cyclist",
    country: "USA",
    population: 8336817,
    description: "Expanding bike lane network with Citi Bike sharing system",
    coordinates: { lat: 40.7128, lng: -74.006 },
    walkabilityScore: 89,
    bikeInfrastructure: "good",
    runningRoutes: 15,
    avgSpeed: {
      kmh: 20,
      description: "Urban cycling with traffic considerations",
    },
  },

  // Daejeon - Soft Mobility Modes
  daejeon_pedestrian: {
    displayName: "Daejeon",
    maxTimeness: 0.2,
    mode: "pedestrian",
    country: "South Korea",
    population: 1475221,
    description:
      "Science city with well-planned pedestrian infrastructure and green spaces",
    coordinates: { lat: 36.3504, lng: 127.3845 },
    walkabilityScore: 78,
    bikeInfrastructure: "excellent",
    runningRoutes: 12,
    avgSpeed: {
      kmh: 5.2,
      description: "Comfortable walking in planned urban environment",
    },
  },
  daejeon_runner: {
    displayName: "Daejeon",
    maxTimeness: 0.12,
    mode: "runner",
    country: "South Korea",
    population: 1475221,
    description:
      "Runner-friendly city with riverside paths and mountain trails nearby",
    coordinates: { lat: 36.3504, lng: 127.3845 },
    walkabilityScore: 78,
    bikeInfrastructure: "excellent",
    runningRoutes: 18,
    avgSpeed: {
      kmh: 13,
      description: "Efficient running through less congested streets",
    },
  },
  daejeon_cyclist: {
    displayName: "Daejeon",
    maxTimeness: 0.06,
    mode: "cyclist",
    country: "South Korea",
    population: 1475221,
    description:
      "Excellent cycling infrastructure with dedicated bike lanes and rental system",
    coordinates: { lat: 36.3504, lng: 127.3845 },
    walkabilityScore: 78,
    bikeInfrastructure: "excellent",
    runningRoutes: 12,
    avgSpeed: {
      kmh: 25,
      description: "Fast cycling on dedicated infrastructure",
    },
  },
};

export type CityName = keyof typeof CITIES;

export const DEFAULT_CITY: CityName = "newyork_pedestrian";

// Soft Mobility Helper Functions
export const getCitiesByCountry = (
  country: "USA" | "South Korea"
): CityName[] => {
  return Object.keys(CITIES).filter(
    (cityName) => CITIES[cityName as CityName].country === country
  ) as CityName[];
};

export const getNewYorkCities = (): CityName[] => getCitiesByCountry("USA");
export const getDaejeonCities = (): CityName[] =>
  getCitiesByCountry("South Korea");

export const getCitiesByMode = (mode: SoftMobilityMode): CityName[] => {
  return Object.keys(CITIES).filter(
    (cityName) => CITIES[cityName as CityName].mode === mode
  ) as CityName[];
};

export const getPedestrianCities = (): CityName[] =>
  getCitiesByMode("pedestrian");
export const getRunnerCities = (): CityName[] => getCitiesByMode("runner");
export const getCyclistCities = (): CityName[] => getCitiesByMode("cyclist");

export const getAllSoftMobilityModes = (): SoftMobilityMode[] => [
  "pedestrian",
  "runner",
  "cyclist",
];

// Enhanced city fetching with soft mobility focus
export const fetchCity = async (cityName: CityName): Promise<City> => {
  try {
    const [gridData, mapImage] = await Promise.all([
      import(`./assets/${cityName}/grid_data.json`),
      import(`./assets/${cityName}/map.png`),
    ]);

    return {
      ...CITIES[cityName],
      data: gridData.default as GridData,
      mapImage: mapImage.default as string,
    };
  } catch (error) {
    console.error(`Failed to load soft mobility data for ${cityName}:`, error);
    throw new Error(`Soft mobility data not available for ${cityName}`);
  }
};

// Performance optimization for soft mobility comparisons
export const preloadCities = async (cityNames: CityName[]): Promise<City[]> => {
  const promises = cityNames.map(async (cityName) => {
    try {
      return await fetchCity(cityName);
    } catch (error) {
      console.warn(`Skipping ${cityName} due to loading error:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((city): city is City => city !== null);
};

// Soft Mobility Comparison Utilities
export const getSoftMobilityComparisonPairs = (): Array<{
  newYork: CityName;
  daejeon: CityName;
  mode: SoftMobilityMode;
}> => {
  return [
    {
      newYork: "newyork_pedestrian",
      daejeon: "daejeon_pedestrian",
      mode: "pedestrian",
    },
    { newYork: "newyork_runner", daejeon: "daejeon_runner", mode: "runner" },
    { newYork: "newyork_cyclist", daejeon: "daejeon_cyclist", mode: "cyclist" },
  ];
};

export const getMobilityEfficiencyComparison = (cityName: CityName) => {
  const city = CITIES[cityName];
  const otherCountryCity = Object.entries(CITIES).find(
    ([name, data]) =>
      data.country !== city.country &&
      data.mode === city.mode &&
      name !== cityName
  );

  if (!otherCountryCity) return null;

  const [otherCityName, otherCityData] = otherCountryCity;

  return {
    city: cityName,
    efficiency: {
      maxTimeness: city.maxTimeness,
      avgSpeed: city.avgSpeed,
      walkabilityScore: city.walkabilityScore,
    },
    comparison: {
      city: otherCityName as CityName,
      efficiency: {
        maxTimeness: otherCityData.maxTimeness,
        avgSpeed: otherCityData.avgSpeed,
        walkabilityScore: otherCityData.walkabilityScore,
      },
    },
    insights: {
      fasterCity:
        city.maxTimeness < otherCityData.maxTimeness
          ? cityName
          : (otherCityName as CityName),
      speedDifference: Math.abs(city.avgSpeed.kmh - otherCityData.avgSpeed.kmh),
      walkabilityDifference: Math.abs(
        (city.walkabilityScore || 0) - (otherCityData.walkabilityScore || 0)
      ),
    },
  };
};

// Utility for future global expansion
export const addNewCity = (cityKey: string, cityData: CityMetadata): void => {
  // This function will be used when expanding to other global cities
  (CITIES as any)[cityKey] = cityData;
};

// Soft mobility insights
export const getSoftMobilityInsights = (cityName: CityName) => {
  const city = CITIES[cityName];

  const insights = {
    mobilityType: city.mode,
    efficiency: city.maxTimeness,
    infrastructure: city.bikeInfrastructure,
    walkability: city.walkabilityScore,
    recommendations: [] as string[],
  };

  // Generate recommendations based on mobility mode
  switch (city.mode) {
    case "pedestrian":
      if (city.walkabilityScore && city.walkabilityScore > 80) {
        insights.recommendations.push(
          "Excellent for walking tours and urban exploration"
        );
      }
      insights.recommendations.push(
        "Consider weather and comfortable footwear"
      );
      break;
    case "runner":
      insights.recommendations.push(`Optimal pace: ${city.avgSpeed.kmh} km/h`);
      if (city.runningRoutes && city.runningRoutes > 15) {
        insights.recommendations.push(
          "Rich variety of running routes available"
        );
      }
      break;
    case "cyclist":
      if (city.bikeInfrastructure === "excellent") {
        insights.recommendations.push(
          "Safe and efficient cycling infrastructure"
        );
      }
      insights.recommendations.push(
        `Average cycling speed: ${city.avgSpeed.kmh} km/h`
      );
      break;
  }

  return insights;
};
