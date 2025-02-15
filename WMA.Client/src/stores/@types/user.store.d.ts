interface UserStoreConfig {
  userId: number | null;
  signUp: (loginUser: SignUpUser) => Promise<void>;
  //storeUserDetails: (userDetails: UserDetails) => void;
  storeUserId: (userId: number) => void;
}

interface SignUpUser {
  username: string;
  email: string;
  password: string;
}
