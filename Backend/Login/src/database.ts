
interface User {
  email: string;
  password: string;
}

// Mock database
const users: User[] = [];

// Add a user to the mock database
export const addUser = async (email: string, password: string) => {
  users.push({ email, password });
};

// Find a user by email
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};