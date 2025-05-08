import { Permission } from '../models/Permission';

export const seedPermissions = async () => {
  const permissions = [
    { name: 'view-dashboard' },
    { name: 'create-user' },
    { name: 'delete-user' },
  ];

  await Permission.insertMany(permissions);
  console.log('Permissions seeded!');
};
