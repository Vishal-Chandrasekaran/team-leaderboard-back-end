import { prisma } from '../../config/db.js';

const STATUS_POINTS = {
  Approved_Gold: 20,
  Approved_Silver: 15,
  Approved_Bronze: 10,
};

export const RankService = {
  async getLeaderboard({ teamId } = {}) {
    const [users, domains] = await Promise.all([
      prisma.user.findMany({
        where: teamId ? { teamId } : undefined,
        select: {
          id: true,
          name: true,
          teamId: true,
          submissions: { select: { status: true } },
        },
      }),
      prisma.domain.findMany({ select: { id: true, name: true } }),
    ]);

    const domainMap = new Map(domains.map((domain) => [domain.id, domain.name]));

    const leaderboard = users
      .map((user) => {
        const points = user.submissions.reduce(
          (sum, submission) => sum + (STATUS_POINTS[submission.status] || 0),
          0,
        );
        return {
          userId: user.id,
          name: user.name,
          team: user.teamId ? domainMap.get(user.teamId) || null : null,
          points,
        };
      })
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    return leaderboard;
  },
};

