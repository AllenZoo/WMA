type RootStackNavigatorParamsList = {
  Main: undefined;
  MainPageTabNavigator: undefined;

  Home: undefined;
  History: undefined;
  Workouts: undefined;
  Exercises: undefined;
  Profile: undefined;

  LoginMain: undefined;
  LoginSignIn: undefined;
  LoginSignUp: undefined;
  LoginSignUp2: LoginSignUpForm;
  LoginSignUp3: LoginSignUpForm;
  LoginSignUp4: LoginSignUpForm;

  TermsOfService: undefined;
  PrivacyPolicy: undefined;
};

type MainPageTabParamList = {
  Home: undefined;
  History: undefined;
  Workouts: undefined;
  Exercises: undefined;
  Profile: undefined;
};

type WorkoutStackParams = {
  addedExercises?: Exercise[];
  workoutName?: string;
  modifyRequest?: {
    edit: boolean;
    template: WorkoutTemplate;
  }; // If instead of creation, we simply want modification
};

type WorkoutStackNavigatorParamsList = {
  WorkoutMain: undefined;
  WorkoutCreate1: undefined;
  WorkoutCreate2: WorkoutStackParams;
  WorkoutCreate3: WorkoutStackParams;
  WorkoutCreate4: WorkoutStackParams;
};

type ExerciseStackNavigatorParamsList = {
  ExerciseMain: undefined;
};

type ProfileStackNavigatorParamsList = {
  ProfileMain: undefined;
};

type HistoryStackNavigatorParamsList = {
  HistoryMain: undefined;
};

type HomeStackNavigatorParamsList = {
  HomeMain: undefined;
};

type LoginSignUpForm = {
  username: string;
  email: string;
  password?: string;
};
