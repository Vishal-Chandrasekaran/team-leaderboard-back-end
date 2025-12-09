import {prisma} from '../../config/db.js';

export const TeamModel = {
  findAll: async ({offset = 0, limit = 10} = {}) => {
    const [teams, total] = await prisma.$transaction([
      prisma.domain.findMany({
        select: {id: true, name: true},
        orderBy: {name: 'asc'},
        skip: offset,
        take: limit
      }),
      prisma.domain.count()
    ]);

    return {teams, total};
  }
};
