import { IUser, User } from '../models/User';

// Pendiente: hashear password con bcrypt antes de crear/actualizar,
// y lógica cross-módulo (ej. disparar achievements al crear registros relacionados).

export function createUser(data: Partial<IUser>) {
  return User.create(data);
}

export function getAllUsers() {
  return User.find();
}

export function getUserById(id: string) {
  return User.findById(id);
}

export function updateUser(id: string, data: Partial<IUser>) {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export function deleteUser(id: string) {
  return User.findByIdAndDelete(id);
}
