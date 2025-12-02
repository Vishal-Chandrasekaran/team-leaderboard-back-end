import { prisma } from '../../config/db.js';

export const TeamModel = {
  findAll: () =>
    prisma.domain.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
};

