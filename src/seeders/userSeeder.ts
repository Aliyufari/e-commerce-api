import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Role } from '../models/Role';

export const seedUsers = async () => {
  const adminRole = await Role.findOne({ name: 'admin' });
  const userRole = await Role.findOne({ name: 'user' });

  if (!adminRole || !userRole) {
    console.error('Role not found!');
    return;
  }

  const hashedPassword = await bcrypt.hash('password', 10);

  const users = [
    { 
      name: 'Aliyu Abubakar', 
      email: 'aliyufariglobal@gmail.com', 
      phone: '09021967715', 
      gender: 'Male', 
      password: hashedPassword, 
      role: adminRole._id 
    },
    { 
      name: 'john Doe', 
      email: 'johndoe@email.com', 
      phone: '09000000000', 
      gender: 'Male', 
      password: hashedPassword, 
      role: userRole._id 
    }
  ];

  await User.insertMany(users);
  console.log('Users seeded!');
};
