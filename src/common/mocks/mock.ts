import { UserEntity } from '../../users/entities/user.entity';
import { RoleEntity } from '../entities/role.entity';

const now = new Date();

export const roleMock: RoleEntity = {
  name: 'Client',
  id: 2,
  slug: 'client',
  createdAt: now,
  updatedAt: now,
};

export const userMock: UserEntity = {
  id: 1,
  roleId: 2,
  firstName: 'Carlos',
  lastName: 'Pena',
  address: 'Fake address at 123 main st',
  phoneNumber: '+51987654321',
  email: 'carlospena@yopmail.com',
  password: 'Nestjs1*',
  resetPasswordToken: null,
  createdAt: now,
  updatedAt: now,
  deletedAt: null,
  role: roleMock,
};
