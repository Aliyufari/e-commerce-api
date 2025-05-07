import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Role } from '../models/Role';

export const seedUsers = async () => {
  const role = await Role.findOne({ name: 'user' });

  if (!role) {
    console.error('Role not found!');
    return;
  }

  const hashedPassword = await bcrypt.hash('password', 10);

  const users = [
    { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: role._id },
    { name: 'Jane Doe', email: 'jane@example.com', password: hashedPassword, role: role._id },
  ];

  await User.insertMany(users);
  console.log('Users seeded!');
};
