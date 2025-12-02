// Submission categories based on Prisma enum
export const CategoryModel = {
  findAll: () => {
    const categories = [
      { value: 'Problem_Solved_Knowledge_Share', label: 'Problem Solved (Knowledge Share)' },
      { value: 'Reusable_Component_Identified', label: 'Reusable Component Identified' },
      { value: 'AI_Workflow_Enhancement', label: 'AI Workflow Enhancement' },
      { value: 'Exceptional_Code_Review', label: 'Exceptional Code Review' },
      { value: 'Mentorship_Moment', label: 'Mentorship Moment' },
      { value: 'Documentation_Hero', label: 'Documentation Hero' },
    ];
    return Promise.resolve(categories);
  },
};


