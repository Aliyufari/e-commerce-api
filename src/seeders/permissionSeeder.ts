import { Permission } from '../models/Permission';

export const seedPermissions = async () => {
  const permissions = [
    { name: 'create-user' },
    { name: 'delete-user' },
    { name: 'view-dashboard' },
  ];

  await Permission.insertMany(permissions);
  console.log('Permissions seeded!');
};
