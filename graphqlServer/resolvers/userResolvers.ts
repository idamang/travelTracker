import * as userService from '../services/userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getUsers = async () => {
  return await userService.getUsers();
};

export const getCurrentUser = async (_: unknown, context: { userId?: number }) => {
  if (!context.userId) {
    throw new Error("Unauthorized access - No user logged in");
  }
  return await userService.getUserById(context.userId);
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const SECRET_KEY = process.env.SECRET_KEY ?? 'P7X36D@FNsk!UfamJEdAGryH4S!PEUGs9bMaYfBkgA62YDj@g!F6EwaX7ZNJVMqBmGgzLVeyma3kps!QcrE46BjTrQx@NpPuhbeXBv4jSyW!zn';
  if (!SECRET_KEY) throw new Error('Secret key is undefined');
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '12h' });

  return { token, user };
};

export const createUser = async (args: {
  name: string;
  email: string;
  password: string;
  address?: string;
  countryId?: number;
}) => {
  return await userService.createUser(args);
};

export const updateUser = async ({
  id, 
  name, 
  email, 
  address, 
  countryId, 
  }:{
  id: number,
  name: string,
  email: string,
  address?: string,
  countryId?: number}
) => {
  return await userService.updateUser(
    id, 
    name, 
    email, 
    address, 
    countryId
  );
};
