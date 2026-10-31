import assert from 'node:assert/strict';
import test from 'node:test';
import { assessCourse, restoreProgress } from '../lib/five-s-progress.ts';

test('requires every topic and a concrete action plan to complete the course', () => {
 const ids=['origem','seiri','seiton','seiso','seiketsu','shitsuke','aplicacao'];
 const results=Object.fromEntries(ids.map(id=>[id,true]));
 assert.equal(assessCourse(results,ids,'').complete,false);
 assert.equal(assessCourse({...results,seiso:false},ids,'Identificar o armário da limpeza até sexta.').complete,false);
 assert.equal(assessCourse(results,ids,'Identificar o armário da limpeza até sexta.').complete,true);
});
test('ignores unknown or corrupted saved progress and clamps the resumed lesson',()=>{
 assert.deepEqual(restoreProgress('{broken',3),{slide:0,answers:{},notes:{},plan:''});
 assert.deepEqual(restoreProgress(JSON.stringify({slide:999,answers:{x:1},notes:{a:'Observação'},plan:'Plano'}),3),{slide:2,answers:{x:1},notes:{a:'Observação'},plan:'Plano'});
});

test('changing an answer invalidates its previous grade and completion', async()=>{
 const { changeAnswer }=await import('../lib/five-s-progress.ts');
 const p={slide:4,answers:{'origem-0':1,'origem-1':0},notes:{origem:'Minha reflexão'},plan:'Meu plano de ação detalhado'};
 assert.deepEqual(changeAnswer(p,'origem-0'),{...p,answers:{'origem-1':0}});
 assert.equal(p.answers['origem-0'],1);
});
