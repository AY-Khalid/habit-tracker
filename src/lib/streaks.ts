export function calculateCurrentStreak(completions: string[], today?: string): number {

  const todayStr = today ?? new Date().toISOString().split('T')[0];
  const unique = new Set(completions);


  if (!unique.has(todayStr)) {
    return 0;
  }

  let streak = 0;
  

  const [year, month, day] = todayStr.split('-').map(Number);
  const current = new Date(year, month - 1, day); 

  while (true) {

    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    if (unique.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break; 
    }
  }

  return streak;
}
