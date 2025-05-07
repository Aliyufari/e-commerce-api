import { Role } from '../models/Role';
import { Permission } from '../models/Permission';

export const seedRoles = async () => {
  const permissions = await Permission.find();

  const roles = [
    { name: 'admin', permissions: permissions.map(p => p._id) },
    { name: 'user', permissions: [] },
  ];

  await Role.insertMany(roles);
  console.log('Roles seeded!');
};
