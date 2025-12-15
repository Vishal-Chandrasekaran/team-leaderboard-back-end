import {prisma} from '../../config/db.js';

export const SubmissionModel = {
  create: (data) => prisma.userSubmission.create({data}),
  findByUser: async (userId, {offset = 0, limit = 10} = {}) => {
    const [submissions, total] = await prisma.$transaction([
      prisma.userSubmission.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'},
        skip: offset,
        take: limit
      }),
      prisma.userSubmission.count({where: {userId}})
    ]);
    return {submissions, total};
  },
  findAll: async (status, {offset = 0, limit = 10} = {}) => {
    const where = status ? {status} : undefined;
    const [submissions, total] = await prisma.$transaction([
      prisma.userSubmission.findMany({
        where,
        orderBy: {createdAt: 'desc'},
        skip: offset,
        take: limit
      }),
      prisma.userSubmission.count({where})
    ]);
    return {submissions, total};
  },
  findById: (id) => prisma.userSubmission.findUnique({where: {id}}),
  update: (id, data) =>
    prisma.userSubmission.update({
      where: {id},
      data
    })
};
