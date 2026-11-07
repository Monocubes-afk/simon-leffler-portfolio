const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(id, focus=false) {
 const selected = id === 'sports' ? 'sports' : 'academic';
 tabs.forEach(tab => { const active = tab.id === `tab-${selected}`; tab.setAttribute('aria-selected', String(active)); tab.tabIndex=active?0:-1; document.getElementById(tab.getAttribute('aria-controls')).hidden=!active; if(active&&focus)tab.focus(); });
 document.querySelectorAll('video').forEach(video=>video.pause());
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>{const id=tab.getAttribute('aria-controls');history.replaceState(null,'',`#${id}`);selectTab(id)});tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+1)%tabs.length;tabs[next].click();tabs[next].focus();}})});
window.addEventListener('hashchange',()=>selectTab(location.hash.slice(1)));selectTab(location.hash.slice(1));
const container=document.getElementById('seasons');
function textElement(tag, text, className) {
 const element = document.createElement(tag);
 element.textContent = text;
 if (className) element.className = className;
 return element;
}
function seasonGallery(images) {
 const gallery = document.createElement('div');
 gallery.className = `season-gallery${images.length === 1 ? ' single' : ''}`;
 images.forEach(photo => {
  const figure = document.createElement('figure');
  const link = document.createElement('a');
  link.href = photo.src;
  const img = document.createElement('img');
  img.src = photo.src; img.alt = photo.alt; img.loading = 'lazy'; img.decoding = 'async';
  link.append(img);
  const caption = textElement('figcaption', photo.caption);
  if (photo.credit) {
   const credit = textElement(photo.source ? 'a' : 'span', photo.credit, 'photo-credit');
   if (photo.source) { credit.href = photo.source; credit.target = '_blank'; credit.rel = 'noopener noreferrer'; }
   caption.append(credit);
  }
  figure.append(link, caption); gallery.append(figure);
 });
 return gallery;
}
window.seasons.forEach(season => {
 const details = document.createElement('details'); details.className = 'year'; details.id = `season-${season.year}`;
 const summary = document.createElement('summary');
 const plus = textElement('span', '', 'plus'); plus.setAttribute('aria-hidden', 'true');
 summary.append(textElement('span', season.year, 'year-number'), textElement('span', season.title, 'year-title'), plus);
 const body = document.createElement('div'); body.className = 'year-body';
 body.append(textElement('span', season.status, 'badge'));
 if (season.story) body.append(textElement('p', season.story));
 if (season.results.length) {
  const list = document.createElement('ul'); list.className = 'season-results';
  season.results.forEach(result => list.append(textElement('li', result))); body.append(list);
 }
 if (season.gallery) body.append(seasonGallery(season.gallery));
 (season.chapters || []).forEach(chapter => {
  const section = document.createElement('section'); section.className = 'season-chapter';
  section.append(textElement('h3', chapter.title));
  chapter.paragraphs.forEach(paragraph => section.append(textElement('p', paragraph)));
  if (chapter.gallery) section.append(seasonGallery(chapter.gallery));
  body.append(section);
 });
 if (season.pending) body.append(textElement('p', season.pending, 'pending'));
 details.append(summary, body); container.append(details);
});
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(!d.open)d.querySelectorAll('video').forEach(v=>v.pause())}));
