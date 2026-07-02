import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { success } from '../utils/ApiResponse';
import * as userService from '../services/user.service';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  success(res, 201, user, 'Usuario creado');
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  success(res, 200, users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  success(res, 200, user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  success(res, 200, user, 'Usuario actualizado');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.deleteUser(req.params.id);
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  success(res, 200, null, 'Usuario eliminado');
});
