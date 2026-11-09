import * as bcrypt from 'bcrypt';
import dataSource from './data-source';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';

async function main() {
  await dataSource.initialize();
  await dataSource.runMigrations(); 

  const users = dataSource.getRepository(User);
  const email = (process.env.ADMIN_EMAIL ?? 'admin@cloudops.local').toLowerCase();

  // Idempotent: re-running the seed never overwrites an existing admin.
  const existing = await users.findOneBy({ email });
  if (existing) {
    console.log(`Seed skipped: ${email} already exists`);
  } else {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'ChangeMe123!', 10);
    await users.save(
      users.create({
        email,
        name: process.env.ADMIN_NAME ?? 'Platform Admin',
        passwordHash,
        role: Role.ADMIN,
      }),
    );
    console.log(`Seed OK: admin ${email}`);
  }

  await dataSource.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});