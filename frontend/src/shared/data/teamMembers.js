/**
 * Core team. NEEDS_CONFIRMATION before outreach (audit C16):
 *  - roles/titles for each person (not shown until confirmed)
 *  - Harshil's surname
 *  - "Aditya Jain" vs the "aditiya.jain@genesishacks.com" outreach address
 *  - photos and LinkedIn links, if the team wants them public
 */
export const TEAM_MEMBERS = [
  { id: '01', name: 'Harshil', initials: 'H', color: '#c4b5fd' },
  { id: '02', name: 'Moksha Kohli', initials: 'MK', color: '#86efac' },
  { id: '03', name: 'Aditya Jain', initials: 'AJ', color: '#f9a8d4' },
  { id: '04', name: 'Garvit Prakash', initials: 'GP', color: '#7dd3fc' },
];

export const TEAM_COUNT = String(TEAM_MEMBERS.length).padStart(2, '0');
