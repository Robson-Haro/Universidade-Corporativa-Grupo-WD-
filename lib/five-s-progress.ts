export type FiveSProgress = { slide: number; answers: Record<string, number>; notes: Record<string, string>; plan: string };
export function assessCourse(results: Record<string, boolean>, ids: string[], plan: string) {
 const mastered = ids.filter(id => results[id] === true).length;
 return { mastered, percent: Math.round(mastered / Math.max(ids.length, 1) * 100), complete: ids.length > 0 && mastered === ids.length && plan.trim().length >= 20 };
}
export function restoreProgress(raw: string | null, count: number): FiveSProgress {
 const empty: FiveSProgress = {slide:0,answers:{},notes:{},plan:''};
 try {
  const p: unknown = JSON.parse(raw || 'null');
  if (!p || typeof p !== 'object') return empty;
  const v=p as Record<string,unknown>;
  return {
   slide:typeof v.slide==='number' && Number.isFinite(v.slide)?Math.max(0,Math.min(count-1,Math.floor(v.slide))):0,
   answers:Object.fromEntries(Object.entries(v.answers && typeof v.answers==='object'?v.answers:{}).filter(([,n])=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=3)) as Record<string,number>,
   notes:Object.fromEntries(Object.entries(v.notes && typeof v.notes==='object'?v.notes:{}).filter(([,n])=>typeof n==='string')) as Record<string,string>,
   plan:typeof v.plan==='string'?v.plan:''
  };
 }catch{return empty;}
}
export function changeAnswer(progress: FiveSProgress, key: string): FiveSProgress {
 const answers = {...progress.answers};
 delete answers[key];
 return {...progress,answers};
}
