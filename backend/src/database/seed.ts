import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/enums/role.enum';
import dataSource from './data-source';

async function main() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(User);
  const password = await bcrypt.hash('Passw0rd!', 10);

  const seeds = [
    { email: 'admin@cloudops.com', firstName: 'Admin', lastName: 'Root', role: Role.ADMIN },
    { email: 'devops@cloudops.com', firstName: 'Dev', lastName: 'Ops', role: Role.DEVOPS },
    { email: 'viewer@cloudops.com', firstName: 'View', lastName: 'Er', role: Role.VIEWER },
  ];

  for (const s of seeds) {
    if (!(await repo.findOneBy({ email: s.email }))) {
      await repo.save(repo.create({ ...s, password }));
    }
  }
  await dataSource.destroy();
  console.log('Seed done');
}

main();