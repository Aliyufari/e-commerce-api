import { Permission } from '../models/Permission';

export const seedPermissions = async () => {
  const permissions = [
    { name: 'view-role' },
    { name: 'view-user' },
    { name: 'create-user' },
    { name: 'update-user' },
    { name: 'delete-user' },
  ];

  await Permission.insertMany(permissions);
  console.log('Permissions seeded!');
};
