interface AuthStoreConfig {
  user: null | User;
  isSignedIn: boolean;
  hasTriedCache: boolean;
  setHasTriedCache: (hasTriedCache: boolean) => void;
  authError: null | string;
  setAuthError: (authError: string | null) => void;
  signIn: (loginUser: SignInUser) => Promise<void>;
  signOut: () => void;
  setTokenResponse: (responseToken: TokenResponse) => void;
  tryRestoreSession: () => Promise<void>;
  refresh: () => Promise<void>;
}

interface User {
  accessToken: string;
  decoded: any;
}

interface SignInUser {
  username: string;
  email?: string;
  password: string;
}

interface UserDetails {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

interface NewUser {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  password: string;
}

interface Jwt {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

interface Claims extends Jwt {
  user: UserDetails;
}
