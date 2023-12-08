export declare interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  phone: string;
}

export declare interface AuthState {
  user: User | null;
}
