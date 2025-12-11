import {prisma} from '../../config/db.js';

const STATUS_POINTS = {
  Approved_Gold: 20,
  Approved_Silver: 15,
  Approved_Bronze: 10
};

export const RankService = {
  async getLeaderboard({teamId, offset = 0, limit = 10, period} = {}) {
    let whereClause = {};
    if (period && period !== 'all_time') {
      const now = new Date();
      let startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      if (period === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        startDate.setDate(diff);
      } else if (period === 'month') {
        startDate.setDate(1);
      } else if (period === 'quarter') {
        const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate.setMonth(quarterMonth);
        startDate.setDate(1);
      }
      whereClause = {createdAt: {gte: startDate}};
    }

    const [users, domains] = await Promise.all([
      prisma.user.findMany({
        where: teamId ? {teamId} : undefined,
        select: {
          id: true,
          name: true,
          teamId: true,
          submissions: {
            where: whereClause,
            select: {status: true}
          }
        }
      }),
      prisma.domain.findMany({select: {id: true, name: true}})
    ]);

    const domainMap = new Map(
      domains.map((domain) => [domain.id, domain.name])
    );

    const leaderboard = users
      .map((user) => {
        let points = 0;
        let gold = 0;
        let silver = 0;
        let bronze = 0;

        user.submissions.forEach((submission) => {
          points += STATUS_POINTS[submission.status] || 0;
          if (submission.status === 'Approved_Gold') {
            gold++;
          }
          if (submission.status === 'Approved_Silver') {
            silver++;
          }
          if (submission.status === 'Approved_Bronze') {
            bronze++;
          }
        });

        return {
          userId: user.id,
          name: user.name,
          team: user.teamId ? domainMap.get(user.teamId) || null : null,
          points,
          gold,
          silver,
          bronze
        };
      })
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    const total = leaderboard.length;
    const paginatedLeaderboard = leaderboard.slice(offset, offset + limit);

    return {leaderboard: paginatedLeaderboard, total};
  }
};
