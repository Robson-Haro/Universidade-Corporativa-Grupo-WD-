'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, BookOpen, House, Stack, Toolbox, ClipboardText, Question, List, X, Check, PlayCircle, ArrowSquareOut, DownloadSimple, MagnifyingGlass, CheckCircle, Circle, Sun, Moon, FloppyDisk } from '@phosphor-icons/react';
import { topics, stages, TOTAL_SCREENS } from '@/lib/five-s-data';
import { assessCourse, restoreProgress, changeAnswer, type FiveSProgress } from '@/lib/five-s-progress';
import './five-s.css';

const initial:FiveSProgress={slide:0,answers:{},notes:{},plan:''};
const iconSet=[BookOpen,Toolbox,Stack,ClipboardText,CheckCircle,CheckCircle,ClipboardText];
export default function FiveSCourse(){
 const [progress,setProgress]=useState<FiveSProgress>(initial);
 const [ready,setReady]=useState(false);
 const [storageKey,setStorageKey]=useState<string | null>(null);
 const [storageError,setStorageError]=useState(false);
 const [name,setName]=useState('');
 const [menu,setMenu]=useState(false);
 const [role,setRole]=useState(0);
 const [selected,setSelected]=useState<Record<string,number>>({});
 const [contrast,setContrast]=useState(false);
 const [message,setMessage]=useState('');
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{
  const frame=requestAnimationFrame(()=>{
   let key:string|null=null;
   // Identity, course state and display preferences are restored independently.
   try{
    const p=JSON.parse(localStorage.getItem('wd_uc_participant')||'null');
    if(p && typeof p.email==='string' && p.email.trim() && typeof p.name==='string' && p.name.trim()){
     key='wd_uc_5s_v1_'+p.email.trim().toLowerCase();setName(p.name);
    }
   }catch{ /* Anonymous work remains in memory; never overwrite a guest record. */ }
   if(key){try{setProgress(restoreProgress(localStorage.getItem(key),TOTAL_SCREENS));}catch{setStorageError(true);key=null;}}
   try{
    const prefs=JSON.parse(localStorage.getItem('wd_uc_5s_display')||'{}');
    setContrast(prefs?.contrast===true);
   }catch{ /* Invalid display preferences do not affect course progress. */ }
   setStorageKey(key);setReady(true);
  });return()=>cancelAnimationFrame(frame);
 },[]);
 useEffect(()=>{
  if(!ready)return;
  try{if(storageKey)localStorage.setItem(storageKey,JSON.stringify(progress));localStorage.setItem('wd_uc_5s_display',JSON.stringify({contrast}));}
  catch{const f=requestAnimationFrame(()=>setStorageError(true));return()=>cancelAnimationFrame(f);}
 },[progress,ready,storageKey,contrast]);
 const slide=progress.slide;
 const cover=slide===0;
 const final=slide===TOTAL_SCREENS-1;
 const ti=Math.max(0,Math.min(topics.length-1,Math.floor((slide-1)/stages.length)));
 const stage=Math.max(0,(slide-1)%stages.length);
 const topic=topics[ti];
 const currentCase=topic.cases[Math.min(role,topic.cases.length-1)];
 const mastered=Object.fromEntries(topics.map(t=>[t.id,t.questions.every((q,i)=>progress.answers[t.id+'-'+i]===q.correct)]));
 const result=assessCourse(mastered,topics.map(t=>t.id),progress.plan);
 const totalCorrect=topics.reduce((n,t)=>n+t.questions.filter((q,i)=>progress.answers[t.id+'-'+i]===q.correct).length,0);
 const completedPercent=Math.round(totalCorrect/14*100);
 function go(next:number){
  const target=Math.max(0,Math.min(TOTAL_SCREENS-1,next));
  setProgress(p=>({...p,slide:target}));setRole(0);setMenu(false);setMessage('');
  requestAnimationFrame(()=>{heading.current?.focus();window.scrollTo({top:0,behavior:'instant'});});
 }
 function answer(key:string){
  if(selected[key]===undefined)return;
  setProgress(p=>({...p,answers:{...p.answers,[key]:selected[key]}}));
 }
 function exportPlan(){
  const lines=['UNIVERSIDADE CORPORATIVA GRUPO WD','5S • A ordem que transforma o trabalho',name?'Participante: '+name:'Plano pessoal de aprendizagem','Data: '+new Date().toLocaleDateString('pt-BR'),'', 'PLANO DE AÇÃO',progress.plan||'Ainda não preenchido.','',...topics.flatMap(t=>['REFLEXÃO • '+t.name,progress.notes[t.id]||'Ainda não preenchida.','']),'Prática do curso: '+totalCorrect+'/14 respostas corretas.','Exemplos didáticos. Combine a execução com a liderança e siga os procedimentos do posto.'];
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='Plano-5S-Grupo-WD.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage('Plano exportado. Confira o arquivo nos downloads do navegador.');
 }
 const noteKey=topic.id;
 return <main className={'five-s'+(cover?' fs-cover':'')+(contrast?' fs-contrast':'')}>
  <a className="fs-skip" href="#fs-content">Pular para o conteúdo</a>
  <div className="fs-background" aria-hidden="true"/>
  <header className="fs-header">
   <Link href="/" className="fs-brand" aria-label="Voltar à Universidade Corporativa Grupo WD"><Image src="/images/5s-logo-wd.png" alt="Grupo WD • Universidade Corporativa" width="290" height="64"/></Link>
   <div className="fs-header-course"><span>5S</span><small>UNIVERSIDADE CORPORATIVA</small></div>
   <div className="fs-header-progress"><label htmlFor="fs-progress">Prática concluída <strong>{completedPercent}%</strong></label><progress id="fs-progress" value={totalCorrect} max={14}/></div>
   <div className="fs-tools">
    <button onClick={()=>setContrast(v=>!v)} aria-pressed={contrast} title="Alternar alto contraste" aria-label="Alternar alto contraste">{contrast?<Sun size={23}/>:<Moon size={23}/>}</button>
    <button className="fs-menu-toggle" aria-expanded={menu} aria-controls="fs-sidebar" onClick={()=>setMenu(v=>!v)} aria-label={menu?'Fechar menu':'Abrir menu'}>{menu?<X size={25}/>:<List size={25}/>}</button>
   </div>
  </header>
  <div className="fs-shell">
   <aside id="fs-sidebar" className={'fs-sidebar'+(menu?' is-open':'')} aria-label="Navegação do treinamento">
    <button className={cover?'is-current':''} onClick={()=>go(0)} aria-current={cover?'page':undefined}><House size={24}/><span>Início da jornada</span></button>
    <p className="fs-nav-label">SEU PERCURSO</p>
    {topics.map((t,i)=>{const Icon=iconSet[i];const active=!cover&&!final&&ti===i;return <button key={t.id} className={active?'is-current':''} onClick={()=>go(i*stages.length+1)} aria-current={active?'page':undefined}><Icon size={23}/><span><strong>{t.name}</strong><small>{t.japanese}</small></span>{mastered[t.id]?<Check size={18} aria-label="Prática concluída"/>:<span className="fs-topic-num">{String(i+1).padStart(2,'0')}</span>}</button>;})}
    <button className={final?'is-current':''} onClick={()=>go(TOTAL_SCREENS-1)}><ClipboardText size={24}/><span>Meu plano de ação</span></button>
    <div className="fs-sidebar-foot"><FloppyDisk size={20}/><p>{storageError?'Não foi possível salvar neste navegador. Exporte seu plano antes de sair.':storageKey?'Seu avanço fica salvo neste navegador.':'Sem identificação, seu avanço dura até fechar ou recarregar esta página. Exporte seu plano.'}</p><Link href="/">{storageKey?'Voltar à universidade':'Identificar-me na universidade'} <ArrowSquareOut size={16}/></Link></div>
   </aside>
   <section id="fs-content" className="fs-content" aria-label="Conteúdo do curso">
    {!ready?<div className="fs-loading" role="status">Preparando sua jornada…</div>:cover?<>
     <div className="fs-hero-copy"><p className="fs-eyebrow">QUALIDADE NO DIA A DIA</p><h1 ref={heading} tabIndex={-1}>5S: a ordem que transforma o trabalho.</h1><p className="fs-hero-subtitle">Menos procura. Mais cuidado. Melhor serviço.</p><div className="fs-hero-meta"><span>7 temas</span><span>37 telas</span><span>Prática em facilities</span></div></div>
     <div className="fs-hero-callout"><Question size={64} weight="light"/><div><h2>Quem paga o preço da desorganização?</h2><button className="fs-primary" onClick={()=>go(1)}>Começar jornada <ArrowRight size={26}/></button></div></div>
     <p className="fs-hero-caption">Portaria · Limpeza · Supervisão · Ronda · Zeladoria · Recepção</p>{!storageKey?<p className="fs-guest-note"><Link href="/">Identifique-se na universidade</Link> para salvar e retomar seu avanço. Sem identificação, você pode explorar e exportar seu plano nesta sessão.</p>:null}
    </>:final?<>
     <div className="fs-breadcrumb">SUA PRÓXIMA AÇÃO <span>37 / 37</span></div>
     <h1 ref={heading} tabIndex={-1}>{result.complete?'O aprendizado ganhou um plano.':'Agora é a sua vez.'}</h1><p className="fs-lead">Uma melhoria concreta para o seu posto, combinada com quem trabalha com você.</p>
     <div className="fs-summary"><CheckCircle size={36}/><div><strong>{totalCorrect} de 14 questões corretas</strong><p>{result.mastered} de 7 práticas concluídas. Você pode revisar cada tema pelo menu.</p></div></div>
     <div className="fs-plan-form"><label htmlFor="fs-plan">Meu plano de ação 5S</label><p>Inclua: posto e problema observado; ação; responsável; prazo; como verificar o resultado.</p><textarea id="fs-plan" rows={7} value={progress.plan} onChange={e=>setProgress(p=>({...p,plan:e.target.value}))} placeholder="No posto…, observamos… A ação será… O responsável é… Até… Vamos verificar por meio de…"/><small>Combine a proposta com a liderança antes de executar. Os exemplos do curso são didáticos e não substituem os procedimentos do contrato.</small></div>
     {!result.complete?<div className="fs-pending"><h2>Para concluir a jornada</h2>{topics.filter(t=>!mastered[t.id]).map(t=><button key={t.id} onClick={()=>go(topics.indexOf(t)*5+4)}><Circle size={18}/> Revisar prática: {t.name}<ArrowRight size={18}/></button>)}{progress.plan.trim().length<20?<p>Preencha um plano de ação com pelo menos 20 caracteres.</p>:null}</div>:<div className="fs-success" role="status"><CheckCircle size={28}/><p><strong>Jornada concluída {storageKey?'neste navegador':'nesta sessão'}.</strong> Agora acompanhe seu plano no posto e converse sobre o resultado com a equipe.</p></div>}
     <button className="fs-primary" onClick={exportPlan}><DownloadSimple size={24}/> Baixar meu plano e reflexões</button>
     <p className="fs-save-note">{name?name+' • ':''}{storageKey?'O registro é local e não sincroniza entre dispositivos.':'Sem identificação, o registro é temporário e será perdido ao fechar ou recarregar esta página.'} Guarde uma cópia do plano exportado.</p>
    </>:<>
     <div className="fs-breadcrumb"><span>TEMA {String(ti+1).padStart(2,'0')} / 07 · {topic.japanese}</span><span>{slide+1} / {TOTAL_SCREENS}</span></div>
     <div className="fs-lesson-controls"><label htmlFor="fs-theme-select" className="fs-sr-only">Escolher tema</label><select id="fs-theme-select" value={ti} onChange={e=>go(Number(e.target.value)*5+1)}>{topics.map((t,i)=><option key={t.id} value={i}>{String(i+1).padStart(2,'0')} · {t.name}</option>)}</select><span>{stages[stage]}</span></div>
     <nav className="fs-stage-nav" aria-label="Etapas do tema">{stages.map((s,i)=><button key={s} onClick={()=>go(ti*5+i+1)} aria-current={stage===i?'step':undefined} className={stage===i?'is-active':''}><span>{i+1}</span>{s}</button>)}</nav>
     <article className="fs-lesson">
      <p className="fs-eyebrow">{topic.name.toUpperCase()}</p>
      <h1 ref={heading} tabIndex={-1}>{stage===0?topic.title:stage===1?'Como colocar em prática.':stage===2?'No seu posto de trabalho.':stage===3?'O que você faria?':'Continue aprendendo.'}</h1>
      <p className="fs-lead">{stage===0?topic.subtitle:stage===1?'Um método simples para conversar, testar e acompanhar.':stage===2?'Escolha um cargo e acompanhe a situação.':stage===3?'Analise as alternativas e explique o motivo da sua decisão.':'Fontes do tema e um vídeo para ampliar a reflexão.'}</p>
      {stage===0?<><div className="fs-theory">{topic.theory.map(p=><p key={p}>{p}</p>)}</div><blockquote className="fs-takeaway"><Question size={32}/><p>{topic.takeaway}</p></blockquote>{ti===0?<div className="fs-five-words">{topics.slice(1,6).map((t,i)=><button key={t.id} onClick={()=>go((i+1)*5+1)}><small>{t.japanese}</small><strong>{t.name}</strong><ArrowRight size={18}/></button>)}</div>:null}</>:null}
      {stage===1?<ol className="fs-method">{topic.method.map((m,i)=><li key={m.title}><span>{String(i+1).padStart(2,'0')}</span><div><h2>{m.title}</h2><p>{m.text}</p></div></li>)}</ol>:null}
      {stage===2?<><div className="fs-role-tabs" role="group" aria-label="Escolha o cargo para o exemplo">{topic.cases.map((c,i)=><button key={c.role} aria-pressed={role===i} className={role===i?'is-selected':''} onClick={()=>setRole(i)}>{c.role}</button>)}</div><div className="fs-case"><div className="fs-case-heading"><MagnifyingGlass size={28}/><span>CENÁRIO DIDÁTICO · {currentCase.role.toUpperCase()}</span></div><div className="fs-case-before"><small>O QUE ACONTECE</small><h2>{currentCase.before}</h2></div><div className="fs-case-action"><span>APLICAÇÃO DO SENSO</span><p>{currentCase.action}</p></div><div className="fs-case-impact"><CheckCircle size={26}/><div><strong>O que muda para a equipe</strong><p>{currentCase.impact}</p></div></div></div><p className="fs-save-note">Exemplo autoral para aprendizagem. Ajuste às atribuições da função e às regras aprovadas do posto.</p></>:null}
      {stage===3?<><div className="fs-question-list">{topic.questions.map((q,i)=>{const key=topic.id+'-'+i;const submitted=progress.answers[key];const choice=selected[key]??submitted;const correct=submitted===q.correct;return <section className="fs-question" key={key} aria-labelledby={'question-'+key}><span className="fs-question-number">DECISÃO {i+1} / 2</span><h2 id={'question-'+key}>{q.prompt}</h2><fieldset><legend className="fs-sr-only">Escolha uma alternativa para a decisão {i+1}</legend>{q.options.map((opt,j)=><label key={opt} className={choice===j?'is-selected':''}><input type="radio" name={key} value={j} checked={choice===j} onChange={()=>{setSelected(p=>({...p,[key]:j}));setProgress(p=>changeAnswer(p,key));}}/><span>{opt}</span></label>)}</fieldset><button className="fs-primary fs-check-answer" disabled={selected[key]===undefined} onClick={()=>answer(key)}>{submitted===undefined?'Analisar minha resposta':'Verificar resposta'}<ArrowRight size={20}/></button>{submitted!==undefined?<div className={'fs-feedback'+(correct?' is-correct':'')} role="status"><strong>{correct?'Boa análise.':'Vamos rever essa decisão.'}</strong><p>{q.feedback}</p>{!correct?<small>Releia as alternativas e tente novamente.</small>:null}</div>:null}</section>;})}</div><div className="fs-reflection"><label htmlFor={'note-'+noteKey}><Question size={27}/>Para levar ao seu posto</label><p>{topic.reflection}</p><textarea id={'note-'+noteKey} rows={4} value={progress.notes[noteKey]||''} onChange={e=>setProgress(p=>({...p,notes:{...p.notes,[noteKey]:e.target.value}}))} placeholder="Registre sua reflexão aqui…"/><small>{storageKey?'Sua reflexão fica salva neste navegador e pode ser exportada com o plano.':'Sua reflexão fica nesta sessão. Exporte o plano para guardar uma cópia.'}</small></div></>:null}
      {stage===4?<><section className="fs-references"><h2><BookOpen size={29}/> Referências deste tema</h2>{topic.references.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"><div><strong>{s.title}</strong><p>{s.detail}</p><small>{new URL(s.url).hostname}</small></div><ArrowSquareOut size={24}/></a>)}<p className="fs-source-note">Conceitos adaptados das fontes indicadas. Exemplos, exercícios e planos são autorais para facilities. Consulta: 31/10/2026.</p></section>{topic.video?<section className="fs-video"><div className="fs-video-art"><PlayCircle size={76} weight="thin"/><span>VÍDEO COMPLEMENTAR</span><small>Espaço preparado para o arquivo aprovado</small></div><div className="fs-video-copy"><p className="fs-eyebrow">CURADORIA PARA AVALIAÇÃO</p><h2>{topic.video.title}</h2><p>{topic.video.prompt}</p><a className="fs-primary" href={topic.video.url} target="_blank" rel="noopener noreferrer">Abrir vídeo na origem <ArrowSquareOut size={23}/></a><label htmlFor={'video-link-'+topic.id}>Link para copiar e avaliar</label><input id={'video-link-'+topic.id} readOnly value={topic.video.url} onFocus={e=>e.currentTarget.select()}/><small>{topic.video.note}</small></div></section>:null}<p className="fs-video-instruction">Para implantação: envie o arquivo autorizado e informe o tema. O vídeo não é obrigatório para concluir os exercícios.</p></>:null}
     </article>
    </>}
    {message?<p className="fs-export-message" role="status">{message}</p>:null}
    {!cover&&ready?<footer className="fs-bottom-nav"><button className="fs-secondary" onClick={()=>go(slide-1)}><ArrowLeft size={23}/>Anterior</button><p>{final?'Aprender. Aplicar. Sustentar.':topic.name+' · '+stages[stage]}</p>{!final?<button className="fs-primary" onClick={()=>go(slide+1)}>{stage===4?(ti===6?'Meu plano':'Próximo tema'):'Continuar'}<ArrowRight size={23}/></button>:<Link className="fs-secondary" href="/">Universidade <House size={22}/></Link>}</footer>:null}
   </section>
  </div>
 </main>;
}
