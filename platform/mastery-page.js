/* 知序 · 知识版图。只读取现有掌握度接口，不触发付费评估。 */
(function (global) {
  'use strict';
  const P = global.Zhixu = global.Zhixu || {};
  const canSync = location.protocol === 'http:' || location.protocol === 'https:';
  const API_BASE = global.ZHIXU_API_BASE ? String(global.ZHIXU_API_BASE).replace(/\/$/, '') : String(P.root || '').replace(/\/$/, '');
  const escape = P.escape || (value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])));
  const byId = id => document.getElementById(id);
  const labels = {MASTERED:'稳定掌握',PROFICIENT:'熟练掌握',BASIC:'基本掌握',EMERGING:'初步理解',NOT_MASTERED:'未掌握',NONE:'未评估'};
  const legend = [['ALL','全部等级'],['MASTERED','稳定掌握 90+'],['PROFICIENT','熟练掌握 75–89'],['BASIC','基本掌握 60–74'],['EMERGING','初步理解 40–59'],['NOT_MASTERED','未掌握 0–39'],['NONE','未评估']];
  const entries = (P.catalog?.entries || []).map(entry => ({...entry,nodeId:entry.subject+':'+entry.hash.replace(/^#\/?/,'')}));
  const nodeIndex = new Map(entries.map(entry => [entry.nodeId,entry]));
  const state = {records:new Map(),heatmap:null,reviews:[],ready:false,scope:'all',level:'ALL',query:'',selected:null,userSelected:false,loading:false};
  const apiFetch = (path,options) => P.session?.authedFetch ? P.session.authedFetch(path,options) : fetch(API_BASE+path,options);
  const finite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
  const scoreOf = entry => finite(state.records.get(entry.nodeId)?.mastery);
  function levelOf(value) {
    if (value === null) return 'NONE';
    return value >= 90 ? 'MASTERED' : value >= 75 ? 'PROFICIENT' : value >= 60 ? 'BASIC' : value >= 40 ? 'EMERGING' : 'NOT_MASTERED';
  }
  const number = value => value === null ? '--' : Number.isInteger(value) ? String(value) : value.toFixed(1);
  function banner(text) { const host=byId('mpBanner');host.hidden=!text;host.textContent=text||''; }
  function dateLabel(value) {
    if (!value) return '未安排';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '时间待定' : date.toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
  }
  function renderOverview() {
    const score=finite(state.heatmap?.overall?.mastery);
    const evaluated=entries.filter(entry=>scoreOf(entry)!==null).length;
    byId('mpOverallScore').textContent=number(score);
    byId('mpOverallUnit').hidden=score===null;
    byId('mpOverallArc').style.strokeDashoffset=String(502.655*(1-(score??0)/100));
    byId('mpOverallNote').textContent=state.ready ? score===null ? '从一次自测开始点亮版图' : '已评估 '+(state.heatmap?.overall?.evaluatedNodes??evaluated)+' 个节点 · 加权掌握度' : '等待同步学习记录';
    byId('mpCatalogTotal').textContent=entries.length;
    byId('mpEvaluated').textContent=state.ready?evaluated:'--';
    byId('mpCoverage').textContent=state.ready?Math.round(evaluated/Math.max(1,entries.length)*100)+'%':'--';
    byId('mpMastered').textContent=state.ready?entries.filter(entry=>levelOf(scoreOf(entry))==='MASTERED').length:'--';
    byId('mpReviewTotal').textContent=state.ready?state.reviews.length:'--';
  }
  function renderLegend() {
    const focusedLevel=document.activeElement?.closest('[data-filter-level]')?.dataset.filterLevel;
    byId('mpLegend').innerHTML=legend.map(([level,label])=>'<button type="button" class="mp-legend-item" data-filter-level="'+level+'" aria-pressed="'+(state.level===level)+'">'+(level==='ALL'?'':'<i data-level="'+level+'" aria-hidden="true"></i>')+escape(label)+'</button>').join('');
    if(focusedLevel)byId('mpLegend').querySelector('[data-filter-level="'+focusedLevel+'"]')?.focus({preventScroll:true});
    document.querySelectorAll('[data-scope]').forEach(button=>button.setAttribute('aria-pressed',String(state.scope===button.dataset.scope)));
  }
  function visibleEntries() {
    return entries.filter(entry=>{
      const subject=P.subject(entry.subject);
      return (state.scope==='all'||subject?.group===state.scope) &&
        (state.level==='ALL'||levelOf(scoreOf(entry))===state.level) &&
        (!state.query||[entry.title,entry.chapter,subject?.title].join(' ').toLowerCase().includes(state.query));
    });
  }
  function setSelected(nodeId) {
    state.selected=nodeId;
    const previous=document.querySelector('.mp-cell.is-selected');
    if(previous){previous.classList.remove('is-selected');previous.setAttribute('aria-pressed','false');}
    const button=[...document.querySelectorAll('.mp-cell')].find(cell=>cell.dataset.nodeId===nodeId);
    if(button){button.classList.add('is-selected');button.setAttribute('aria-pressed','true');}
    const entry=nodeIndex.get(nodeId);
    if(!entry){
      byId('mpDetailTitle').textContent='没有匹配的节点';byId('mpDetailContext').textContent='调整筛选，继续探索';
      byId('mpDetailScore').textContent='--';byId('mpDetailLevel').textContent='';byId('mpDetailNote').textContent='可以换一个关键词，或恢复全部科目与等级。';
      byId('mpDetailStability').textContent='--';byId('mpDetailReview').textContent='--';byId('mpDetailLink').hidden=true;return;
    }
    const subject=P.subject(entry.subject),record=state.records.get(nodeId),score=scoreOf(entry),level=levelOf(score);
    byId('mpDetailContext').textContent=(subject?.title||entry.subject)+' / '+entry.chapter+' · '+entry.kind;
    byId('mpDetailTitle').textContent=entry.title;
    byId('mpDetailScore').textContent=score===null?'--':number(score)+'%';
    byId('mpDetailLevel').textContent=labels[level];byId('mpDetailLevel').dataset.level=level;
    byId('mpDetailNote').textContent=score===null ? state.ready ? '还没有此节点的评估。进入学习，完成几道自测，让进度逐步形成。' : '尚未读取到评估记录，可以先进入节点继续学习。' : score<60 ? '这里还需要多一点练习。回到知识点，结合讲解和自测查漏补缺。' : score<90 ? '理解已经有了基础。用一次新的练习，检验你是否掌握得更稳。' : '这部分已经掌握得很好，按计划复习，让理解留得更久。';
    const stability=finite(record?.stability);
    byId('mpDetailStability').textContent=stability===null?'--':number(stability)+'%';
    byId('mpDetailReview').textContent=dateLabel(record?.nextReviewAt);
    const link=byId('mpDetailLink');link.href=P.url(entry.subject,entry.hash);link.hidden=false;
  }
  function renderAtlas() {
    const detail=byId('mpDetail');
    const inlineDetail=detail.parentElement!==document.querySelector('.mp-workspace');
    document.querySelector('.mp-workspace').append(detail);
    const visible=visibleEntries();byId('mpShownTotal').textContent=visible.length;
    const host=byId('mpSubjects');
    if(!visible.length){host.innerHTML='<p class="mp-empty">没有匹配的节点。试试其他关键词，或恢复全部科目与等级。</p>';setSelected(null);return;}
    host.innerHTML=(P.subjects||[]).map(subject=>{
      const list=visible.filter(entry=>entry.subject===subject.id);
      if(!list.length)return '';
      const all=entries.filter(entry=>entry.subject===subject.id);
      const evaluated=all.filter(entry=>scoreOf(entry)!==null).length;
      const parent=(state.heatmap?.subjects||[]).find(item=>item.subject===subject.id);
      const subjectScore=finite(parent?.mastery);
      const chapters=new Map();list.forEach(entry=>{if(!chapters.has(entry.chapter))chapters.set(entry.chapter,[]);chapters.get(entry.chapter).push(entry)});
      const rows=[...chapters].map(([chapter,items])=>'<div class="mp-chapter-row"><div class="mp-chapter-label"><small aria-hidden="true">◇</small><span>'+escape(chapter)+'</span></div><div class="mp-grid" role="group" aria-label="'+escape(chapter)+'">'+items.map(entry=>{
        const score=scoreOf(entry),level=levelOf(score),description=entry.title+' · '+labels[level]+(score===null?'':' '+number(score)+'%');
        return '<button type="button" class="mp-cell" data-node-id="'+escape(entry.nodeId)+'" data-level="'+level+'" aria-pressed="false" aria-label="'+escape(description+'，查看详情')+'" title="'+escape(description)+'">'+(score===null?'·':number(score))+'</button>';
      }).join('')+'</div></div>').join('');
      return '<article class="mp-subject" data-subject-id="'+subject.id+'"><div class="mp-subject-head"><div class="mp-subject-ident"><span class="mp-subject-code">'+escape(subject.code)+'</span><div><h3>'+escape(subject.title)+'</h3><p>'+all.length+' 个节点 · 已评估 '+evaluated+'/'+all.length+'</p></div></div><strong class="mp-subject-score">'+number(subjectScore)+(subjectScore===null?'':'<small>%</small>')+'</strong></div>'+rows+'</article>';
    }).join('');
    const selected=visible.some(entry=>entry.nodeId===state.selected)?state.selected:(visible.find(entry=>scoreOf(entry)!==null)||visible[0]).nodeId;
    setSelected(selected);
    if(inlineDetail)revealDetail(false);
  }
  function revealDetail(scroll) {
    if(global.innerWidth>1050)return;
    const button=[...document.querySelectorAll('.mp-cell')].find(cell=>cell.dataset.nodeId===state.selected);
    if(!button)return;
    const detail=byId('mpDetail');button.closest('.mp-chapter-row').after(detail);
    if(scroll)detail.scrollIntoView({block:'nearest',behavior:global.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function renderReviews() {
    const host=byId('mpReviews');byId('mpReviewBlock').hidden=!state.reviews.length;
    host.innerHTML=state.reviews.map(item=>{
      const entry=nodeIndex.get(item.nodeId),url=entry?P.url(entry.subject,entry.hash):null;
      return '<div class="mp-review">'+(url?'<a href="'+escape(url)+'">'+escape(entry.title)+' ↗</a>':'<span>历史学习记录</span>')+'<small>'+escape(dateLabel(item.scheduledAt))+(item.reason?' · '+escape(item.reason):'')+'</small></div>';
    }).join('');
  }
  function renderSections() {
    byId('mpNodeTotal').textContent=entries.length;
    byId('mpSections').innerHTML=(P.subjects||[]).map(subject=>{
      const list=entries.filter(entry=>entry.subject===subject.id),chapters=new Map();
      list.forEach(entry=>{if(!chapters.has(entry.chapter))chapters.set(entry.chapter,[]);chapters.get(entry.chapter).push(entry)});
      return '<section><h2>'+escape(subject.title)+'</h2>'+[...chapters].map(([chapter,items])=>'<div class="mp-chapter"><div class="mp-chapter-head"><h3>'+escape(chapter)+'</h3><span class="mp-muted">'+items.length+' 个节点</span></div><ul class="mp-list">'+items.map(entry=>{
        const score=scoreOf(entry),level=levelOf(score);
        return '<li><a href="'+escape(P.url(entry.subject,entry.hash))+'"><span>'+escape(entry.title)+'</span><span class="'+(score===null?'mp-none':'mp-score')+'" data-level="'+level+'">'+(score===null?'未评估':number(score)+'% · '+labels[level])+'</span></a></li>';
      }).join('')+'</ul></div>').join('')+'</section>';
    }).join('');
  }
  function render() {renderOverview();renderLegend();renderAtlas();renderReviews();renderSections();}
  async function load() {
    if(state.loading)return;
    if(!canSync){byId('mpStatus').textContent='离线目录';banner('当前只显示学习目录。连接网站后即可同步你的掌握度。');render();return;}
    state.loading=true;byId('mpRefresh').disabled=true;byId('mpSubjects').setAttribute('aria-busy','true');byId('mpStatus').textContent='正在读取…';
    try {
      const paths=['/api/learning/heatmap','/api/learning/overview','/api/learning/reviews'];
      const [heatmap,overview,reviews]=await Promise.all(paths.map(async path=>{const response=await apiFetch(path);if(!response.ok)throw new Error('read-failed');return response.json()}));
      if(!state.ready&&!state.userSelected)state.selected=null;
      state.heatmap=heatmap;state.records=new Map((overview.states||[]).map(record=>[record.nodeId,record]));state.reviews=reviews.reviews||[];state.ready=true;
      render();byId('mpStatus').textContent='数据已更新 · '+new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
      banner(entries.some(entry=>scoreOf(entry)!==null)?'':'还没有形成掌握度评估。进入一个知识点完成自测，再回来看看被点亮的地方。');
    } catch(_){
      byId('mpStatus').textContent=state.ready?'更新暂不可用':'暂未读取记录';
      banner(state.ready?'暂时无法更新，已保留上次读取的结果。稍后再刷新即可。':'暂时无法读取学习记录，下面先显示完整学习目录。连接恢复后刷新即可。');
      if(!state.ready)render();
    } finally {state.loading=false;byId('mpRefresh').disabled=false;byId('mpSubjects').setAttribute('aria-busy','false');}
  }
  byId('mpRefresh').addEventListener('click',load);
  document.querySelectorAll('[data-scope]').forEach(button=>button.addEventListener('click',()=>{state.scope=button.dataset.scope;renderLegend();renderAtlas()}));
  byId('mpLegend').addEventListener('click',event=>{const button=event.target.closest('[data-filter-level]');if(!button)return;state.level=button.dataset.filterLevel;renderLegend();renderAtlas()});
  byId('mpSearch').addEventListener('input',event=>{state.query=event.target.value.trim().toLowerCase();renderAtlas()});
  byId('mpSubjects').addEventListener('click',event=>{const button=event.target.closest('.mp-cell');if(button){state.userSelected=true;setSelected(button.dataset.nodeId);revealDetail(true)}});
  byId('mpSubjects').addEventListener('focusin',event=>{if(global.innerWidth<=1050)return;const button=event.target.closest('.mp-cell');if(button){state.userSelected=true;setSelected(button.dataset.nodeId)}});
  byId('mpSubjects').addEventListener('pointerover',event=>{if(event.pointerType!=='mouse'||global.innerWidth<=1050)return;const button=event.target.closest('.mp-cell');if(button&&state.selected!==button.dataset.nodeId){state.userSelected=true;setSelected(button.dataset.nodeId)}});
  global.addEventListener('resize',()=>{if(global.innerWidth>1050)document.querySelector('.mp-workspace').append(byId('mpDetail'));});
  render();load();
})(window);
