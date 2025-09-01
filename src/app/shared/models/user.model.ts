export interface User{
  id?: number;
  username: string;
  email: string;
  role: string;
  enabled?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
}
