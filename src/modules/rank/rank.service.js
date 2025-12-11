import {prisma} from '../../config/db.js';

const STATUS_POINTS = {
  Approved_Gold: 20,
  Approved_Silver: 15,
  Approved_Bronze: 10
};

export const RankService = {
  async getLeaderboard({
    teamId,
    offset = 0,
    limit = 10,
    period,
    viewMode = 'unified'
  } = {}) {
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

    let leaderboard = users.map((user) => {
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
    });

    if (viewMode === 'grouped') {
      // Group by team and sort within teams
      const teamGroups = {};
      leaderboard.forEach((user) => {
        const teamName = user.team || 'Unassigned';
        if (!teamGroups[teamName]) {
          teamGroups[teamName] = [];
        }
        teamGroups[teamName].push(user);
      });

      let groupedLeaderboard = [];
      // To satisfy "Grouped by team", we might want a specific order of teams,
      // but usually alphabetical or just distinct groups is fine.
      // Let's sort teams by name for consistency (or you could filter by team points).
      const sortedTeams = Object.keys(teamGroups).sort();

      sortedTeams.forEach((teamName) => {
        const teamUsers = teamGroups[teamName];
        // Sort users in this team by points
        teamUsers.sort((a, b) => b.points - a.points);
        // Assign rank within team
        teamUsers.forEach((user, index) => {
          user.rank = index + 1;
        });
        groupedLeaderboard = groupedLeaderboard.concat(teamUsers);
      });

      leaderboard = groupedLeaderboard;
    } else {
      // Unified view (default)
      leaderboard
        .sort((a, b) => b.points - a.points)
        .map((entry, index) => {
          entry.rank = index + 1;
          return entry;
        });
    }

    const total = leaderboard.length;
    const paginatedLeaderboard = leaderboard.slice(offset, offset + limit);

    return {leaderboard: paginatedLeaderboard, total};
  }
};
