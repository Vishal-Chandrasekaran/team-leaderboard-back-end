// Submission categories based on Prisma enum
export const CategoryModel = {
  findAll: ({offset = 0, limit = 10} = {}) => {
    const categories = [
      {
        value: 'Problem_Solved_Knowledge_Share',
        label: 'Problem Solved (Knowledge Share)'
      },
      {
        value: 'Reusable_Component_Identified',
        label: 'Reusable Component Identified'
      },
      {value: 'AI_Workflow_Enhancement', label: 'AI Workflow Enhancement'},
      {value: 'Exceptional_Code_Review', label: 'Exceptional Code Review'},
      {value: 'Mentorship_Moment', label: 'Mentorship Moment'},
      {value: 'Documentation_Hero', label: 'Documentation Hero'}
    ];
    // Simulate pagination
    const paginatedCategories = categories.slice(offset, offset + limit);
    return Promise.resolve({
      categories: paginatedCategories,
      total: categories.length
    });
  }
};
