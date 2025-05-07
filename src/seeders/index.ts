import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedPermissions } from './permissionSeeder';
import { seedRoles } from './roleSeeder';
import { seedUsers } from './userSeeder';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');

    console.log('Seeding data...');

    await seedPermissions();
    await seedRoles();
    // await seedUsers();

    console.log('Seeding complete ✅');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed ❌', err);
    process.exit(1);
  }
};

seedData();
