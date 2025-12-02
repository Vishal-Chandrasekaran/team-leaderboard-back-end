import { prisma } from '../../config/db.js';

export const SubmissionModel = {
  create: (data) => prisma.userSubmission.create({ data }),
  findByUser: (userId) =>
    prisma.userSubmission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
  findAll: (status) =>
    prisma.userSubmission.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    }),
  findById: (id) => prisma.userSubmission.findUnique({ where: { id } }),
  update: (id, data) =>
    prisma.userSubmission.update({
      where: { id },
      data,
    }),
};

