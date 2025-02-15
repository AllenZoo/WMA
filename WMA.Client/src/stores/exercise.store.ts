import { api, AxiosError } from "@/utils/fetcher";
import { create } from "zustand";
import {
  Exercise,
  ExerciseFilter,
  ExerciseStoreConfig,
  // Difficulty,
  // EquipmentType,
  // MuscleGroup,
  // RecoveryDemand,
} from "./@types/exercise.store";

export const useExerciseStore = create<ExerciseStoreConfig>((set, get) => ({
  exercises: [], // All exercises (consider removing this, since users should have no use for other users' exercises)
  userExercises: [], // Exercises for this user
  filteredExercises: [], // Filtered exercises of userExercises.
  getExercises: async (): Promise<Exercise[]> => {
    const request = api.get("/exercise");
    return await request
      .then((res) => {
        set({ exercises: res.data as Exercise[] });
        return res.data as Exercise[];
      })
      .catch((err: AxiosError) => {
        console.log(err);
        throw err;
      });
  },
  getExercisesByUser: async (userId: number) => {
    const request = api.get(`/exercise/${userId}`);
    await request
      .then((res) => {
        console.log(res.data);
        set({ exercises: res.data as Exercise[] });
      })
      .catch((err: AxiosError) => {
        console.log(err);
        console.log(err.response?.data);
      });
  },
  getExerciseByFilter: async (filter: ExerciseFilter): Promise<Exercise[]> => {
    const data = JSON.stringify(filter);
    const headers = {
      "Content-Type": "application/json",
    };
    const request = api.post(`/exercise/filterRequest`, data, { headers });
    return await request
      .then((res) => {
        set({ exercises: res.data as Exercise[] });
        set({ filteredExercises: res.data as Exercise[] });
        return res.data as Exercise[];
      })
      .catch((err: AxiosError) => {
        console.log(err);
        console.log(err.response?.data);
        throw err;
      });
  },

  createExercise: async (exercise: Exercise) => {
    const data = JSON.stringify(exercise);
    const headers = {
      "Content-Type": "application/json",
    };
    const request = api.post("/exercise", data, { headers });
    await request
      .then((res) => {
        get().getExercises();
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to add a new Exercise: [POST /exercise]",
          err
        );
      });
  },

  updateExercise: async (exercise: Exercise) => {
    const data = JSON.stringify(exercise);
    const headers = {
      "Content-Type": "application/json",
    };
    const request = api.put(`/exercise/${exercise.exerciseId}`, data, {
      headers,
    });
    await request
      .then((res) => {
        get().getExercises();
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  },
  deleteExercise: async (id: number) => {
    const request = api.delete(`/exercise/${id}`);
    await request
      .then((res) => {
        get().getExercises();
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  },

  getExerciseById: async (id: number): Promise<Exercise> => {
    // First check cache
    const cachedExercise = get().exercises.find((e) => e.exerciseId === id);
    if (cachedExercise) return cachedExercise;

    // If not in cache, fetch from API
    const request = api.get(`/exercise/${id}`);
    return await request
      .then((res) => {
        const exercise = res.data as Exercise;
        // Update cache
        set({ exercises: [...get().exercises, exercise] });
        return exercise;
      })
      .catch((err: AxiosError) => {
        console.log(`Error fetching exercise with id ${id}:`, err);
        throw err;
      });
  },
}));

// // Exercise Filter Constructor
// export function createExerciseFilter(
//   searchName: string | null,
//   muscleGroup: MuscleGroup | null,
//   difficulty: Difficulty | null,
//   recoveryDemand: RecoveryDemand | null,
//   equipmentType: EquipmentType | null
// ): ExerciseFilter {
//   return {
//     searchName,
//     muscleGroup,
//     difficulty,
//     recoveryDemand,
//     equipmentType,
//   };
// }
