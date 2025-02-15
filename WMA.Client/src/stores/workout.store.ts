import { create } from "zustand";
import {
  ExerciseGroup,
  ExerciseGroupDto,
  ExerciseSet,
  ExerciseSetDto,
  WorkoutFilterDto,
  WorkoutSession,
  WorkoutSessionDto,
  WorkoutStoreConfig,
  WorkoutTemplate,
  WorkoutTemplateDto,
} from "./@types/workout.store";
import { api, AxiosError } from "@/utils/fetcher";
import { useExerciseStore } from "./exercise.store";

export const useWorkoutStore = create<WorkoutStoreConfig>((set, get) => ({
  // Template CRUD
  workoutTemplates: [], // All workout templates (consider removing this, since users should have no use for other users' workout templates)
  userWorkoutTemplates: [], // Workout templates for this user
  filteredWorkoutTemplates: [], // Filtered workout templates of userWorkoutTemplates.
  getWorkoutTemplates: async () => {
    const request = api.get("/workout/template");
    return await request
      .then(async (res) => {
        const workoutTemplates = await workoutTemplatesDTOToEntity(
          res.data as WorkoutTemplateDto[]
        );
        set({ workoutTemplates });
        return res.data as WorkoutTemplateDto[];
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to get all Workout Templates: [GET /workout/templates]",
          err
        );
        throw err;
      });
  },
  getWorkoutTemplatesFiltered: async (filter: WorkoutFilterDto) => {
    const data = JSON.stringify(filter);
    const headers = { "Content-Type": "application/json" };
    const request = api.post(`/workout/template/filter`, data, { headers });
    return await request
      .then(async (res) => {
        set({
          filteredWorkoutTemplates: await workoutTemplatesDTOToEntity(
            res.data as WorkoutTemplateDto[]
          ),
        });
        return res.data as WorkoutTemplateDto[];
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to filter for Workout Templates: [POST /workout/template/filter] ",
          err
        );
        throw err;
      });
  },
  addWorkoutTemplate: async (workout: WorkoutTemplateDto) => {
    const data = JSON.stringify(workout);
    const headers = { "Content-Type": "application/json" };
    const request = api.post("/workout/template", data, { headers });

    //TODO: Add to store in advance, so that the user can see the new template immediately.

    return await request
      .then(async (res) => {
        const newTemplateDto = res.data as WorkoutTemplateDto;
        const newTemplate = await workoutTemplateDTOToEntity(newTemplateDto);
        set({ workoutTemplates: [...get().workoutTemplates, newTemplate] });
        return res.data as WorkoutTemplateDto;
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to add a new Workout Template: [POST /workout/template]",
          err
        );
        throw err;
      });
  },
  removeWorkoutTemplate: (id: string) => {
    const request = api.delete(`/workout/template/${id}`);
    return request
      .then(() => {
        set({
          workoutTemplates: get().workoutTemplates.filter(
            (workout) => workout.id !== id
          ),
        });
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to delete a Workout Template: [DELETE /workout/template/:id]",
          err
        );
        throw err;
      });
  },
  editWorkoutTemplate: async (
    templateId: string,
    patchWorkout: WorkoutTemplateDto
  ) => {
    const data = JSON.stringify(patchWorkout);
    const headers = { "Content-Type": "application/json" };
    const request = api.patch(`/workout/template/${templateId}`, data, {
      headers,
    });
    return await request
      .then(async (res) => {
        const updatedTemplateDto = res.data as WorkoutTemplateDto;
        const updatedTemplate =
          await workoutTemplateDTOToEntity(updatedTemplateDto);
        set({
          workoutTemplates: get().workoutTemplates.map((template) =>
            template.id === patchWorkout.id.toString()
              ? updatedTemplate
              : template
          ),
        });
        return res.data as WorkoutTemplateDto;
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to update a Workout Template: [PATCH /workout/template/:id]",
          err
        );
        throw err;
      });
  },

  // Session CRUD
  workoutSessions: [], // All workout sessions (consider removing this, since users should have no use for other users' workout sessions
  userWorkoutSessions: [], // Workout sessions for this user
  filteredWorkoutSessions: [], // Filtered workout sessions of userWorkoutSessions.

  getWorkoutSessions: async () => {
    const request = api.get("/workout/session");
    return await request
      .then(async (res) => {
        const workoutSessions = await workoutSessionsDTOToEntity(
          res.data as WorkoutSessionDto[]
        );
        set({ workoutSessions });
        return res.data as WorkoutSessionDto[];
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to get all Workout Sessions: [GET /workout/session]",
          err
        );
        throw err;
      });
  },
  getWorkoutSessionsFiltered(filter: WorkoutFilterDto) {
    const data = JSON.stringify(filter);
    const headers = { "Content-Type": "application/json" };
    const request = api.post(`/workout/session/filter`, data, { headers });
    return request
      .then(async (res) => {
        const filteredWorkoutSessions = await workoutSessionsDTOToEntity(
          res.data as WorkoutSessionDto[]
        );
        set({ filteredWorkoutSessions });
        return res.data as WorkoutSessionDto[];
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to filter for Workout Sessions: [POST /workout/session/filter]",
          err
        );
        throw err;
      });
  },
  startWorkoutSession(workout: WorkoutSessionDto) {
    const data = JSON.stringify(workout);
    const headers = { "Content-Type": "application/json" };
    const request = api.post("/workout/session", data, { headers });
    return request
      .then((res) => {
        set({ workoutSessions: [...get().workoutSessions, res.data] });
        return res.data as WorkoutSessionDto;
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to start a new Workout Session: [POST /workout/session]",
          err
        );
        throw err;
      });
  },
  completeWorkoutSession(id: string) {
    const request = api.patch(`/workout/session/completion/${id}`);
    return request
      .then((res) => {
        set({
          workoutSessions: get().workoutSessions.map((session) =>
            session.id === id ? res.data : session
          ),
        });
        return res.data as WorkoutSessionDto;
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to complete a Workout Session: [PATCH /workout/session/completion/:id]",
          err
        );
        throw err;
      });
  },
  cancelWorkoutSession(id: string) {
    const request = api.patch(`/workout/session/cancel/${id}`);
    return request
      .then((res) => {
        set({
          workoutSessions: get().workoutSessions.map((session) =>
            session.id === id ? res.data : session
          ),
        });
        return res.data as WorkoutSessionDto;
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to cancel a Workout Session: [PATCH /workout/session/cancel/:id]",
          err
        );
        throw err;
      });
  },
  editWorkoutSession(sessionId: string, workout: WorkoutSessionDto) {
    const data = JSON.stringify(workout);
    const headers = { "Content-Type": "application/json" };
    const request = api.patch(`/workout/session/${sessionId}`, data, {
      headers,
    });
    return request
      .then((res) => {
        set({
          workoutSessions: get().workoutSessions.map((session) =>
            session.id === sessionId ? res.data : session
          ),
        });
        return res.data as WorkoutSessionDto;
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to update a Workout Session: [PATCH /workout/session/:id]",
          err
        );
        throw err;
      });
  },
  async removeWorkoutSession(id: string) {
    const request = api.delete(`/workout/session/${id}`);
    request
      .then(() => {
        set({
          workoutSessions: get().workoutSessions.filter(
            (session) => session.id !== id
          ),
        });
      })
      .catch((err: AxiosError) => {
        console.log(
          "Error occured when trying to delete a Workout Session: [DELETE /workout/session/:id]",
          err
        );
        throw err;
      });
  },
}));

// ENTITY TO DTO
// NOTE: We unassign all ids from the entities, since the server should assign them.
//       Leaving ids in the DTOs would cause the server to throw an error, since it cannot serialize a string into a long.

export function workoutSessionEntityToDTO(
  entity: WorkoutSession
): WorkoutSessionDto {
  return {
    id: -1,
    userId: entity.userId,
    templateId: entity.templateId ?? undefined, // TODO-OPT: think about if workout session needs reference to template instead of id.
    exerciseGroups: exerciseGroupsEntityToDTO(entity.exerciseGroups),
    startedAt: entity.startedAt,
    completedAt: entity.completedAt,
    duration: entity.duration,
    name: entity.name,
    isCompleted: entity.isCompleted,
  };
}

export function workoutTemplateEntityToDTO(
  entity: WorkoutTemplate
): WorkoutTemplateDto {
  return {
    id: -1,
    userId: entity.userId,
    name: entity.name,
    exerciseGroups: exerciseGroupsEntityToDTO(entity.exerciseGroups),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function exerciseGroupsEntityToDTO(
  entities: ExerciseGroup[]
): ExerciseGroupDto[] {
  return entities.map((entity) => exerciseGroupEntityToDTO(entity));
}

export function exerciseGroupEntityToDTO(
  entity: ExerciseGroup
): ExerciseGroupDto {
  return {
    id: -1,
    exerciseId: entity.exercise.exerciseId,
    displayOrder: entity.displayOrder,
    exerciseSets: exerciseSetsEntityToDTO(entity.exerciseSets),
    workoutId: -1,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function exerciseSetsEntityToDTO(
  entities: ExerciseSet[]
): ExerciseSetDto[] {
  return entities.map((entity) => exerciseSetEntityToDTO(entity));
}

export function exerciseSetEntityToDTO(entity: ExerciseSet): ExerciseSetDto {
  return {
    id: -1,
    exerciseGroupId: -1,
    reps: entity.reps,
    weightKG: entity.weightKG,
    negativeWeightKG: entity.negativeWeightKG,
    addOnWeightKG: entity.addOnWeightKG,
    duration: entity.duration,
    rpe: entity.rpe,
    distance: entity.distance,
    displayOrder: entity.displayOrder,
    completed: entity.completed,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

// DTO TO ENTITY

export async function workoutSessionsDTOToEntity(
  dtos: WorkoutSessionDto[]
): Promise<WorkoutSession[]> {
  return await Promise.all(dtos.map((dto) => workoutSessionDTOToEntity(dto)));
}

export async function workoutSessionDTOToEntity(
  dto: WorkoutSessionDto
): Promise<WorkoutSession> {
  return {
    id: dto.id.toString(),
    userId: dto.userId,
    templateId: dto.templateId,
    exerciseGroups: await exerciseGroupsDTOToEntity(dto.exerciseGroups),
    startedAt: dto.startedAt,
    completedAt: dto.completedAt,
    duration: dto.duration,
    name: dto.name,
    isCompleted: dto.isCompleted,
  };
}

export async function workoutTemplatesDTOToEntity(
  dtos: WorkoutTemplateDto[]
): Promise<WorkoutTemplate[]> {
  return await Promise.all(dtos.map((dto) => workoutTemplateDTOToEntity(dto)));
}

export async function workoutTemplateDTOToEntity(
  dto: WorkoutTemplateDto
): Promise<WorkoutTemplate> {
  return {
    id: dto.id.toString(),
    userId: dto.userId,
    name: dto.name,
    exerciseGroups: await exerciseGroupsDTOToEntity(dto.exerciseGroups),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export async function exerciseGroupsDTOToEntity(
  dtos: ExerciseGroupDto[]
): Promise<ExerciseGroup[]> {
  return await Promise.all(dtos.map((dto) => exerciseGroupDTOToEntity(dto)));
}

export async function exerciseGroupDTOToEntity(
  dto: ExerciseGroupDto
): Promise<ExerciseGroup> {
  const exercise = await useExerciseStore
    .getState()
    .getExerciseById(dto.exerciseId);

  if (!exercise) {
    throw new Error(`Exercise with id ${dto.exerciseId} not found`);
  }

  return {
    id: dto.id.toString(),
    exercise: exercise,
    workoutId: dto.workoutId.toString(),
    displayOrder: dto.displayOrder,
    exerciseSets: exerciseSetsDTOToEntity(dto.exerciseSets),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function exerciseSetsDTOToEntity(dtos: ExerciseSetDto[]): ExerciseSet[] {
  return dtos.map((dto) => exerciseSetDTOToEntity(dto));
}

export function exerciseSetDTOToEntity(dto: ExerciseSetDto): ExerciseSet {
  return {
    id: dto.id.toString(),
    exerciseGroupId: dto.exerciseGroupId.toString(),
    reps: dto.reps,
    weightKG: dto.weightKG,
    negativeWeightKG: dto.negativeWeightKG,
    addOnWeightKG: dto.addOnWeightKG,
    duration: dto.duration,
    rpe: dto.rpe,
    distance: dto.distance,
    displayOrder: dto.displayOrder,
    completed: dto.completed,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
