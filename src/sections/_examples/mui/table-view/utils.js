// ----------------------------------------------------------------------

import { status } from "nprogress";

export default function createData(batch_name, created_date, total_initiated, un_attempted, in_progress, completed) {
  return {
    batch_name, 
    created_date, 
    total_initiated,
    un_attempted,
    in_progress,
    completed,
    // history: [
    //   {
    //     candidate_id: '11091700',
    //     candidate_name: 'John Doe',
    //     date: '20-06-2024',
    //     skill: 'React',
    //     proctoring: 'True',
    //     hiring_status: 'Recommended',
    //   }, 
    //   {
    //     candidate_id: '11091702',
    //     candidate_name: 'Karthik Kumar',
    //     date: '20-06-2024',
    //     skill: 'Python Engineer',
    //     proctoring: 'False',
    //     hiring_status: 'Not-Recommended',
    //   }, 
    // ],
  };
}
