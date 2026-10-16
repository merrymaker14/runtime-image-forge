import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { basename, join, posix } from 'node:path';
import { Marked } from 'marked';

const baseUrl = 'https://merrymaker14.github.io/runtime-image-forge/';
const locales = ['en', 'ru', 'es', 'zh-Hans'];
const nativeNames = ['English', 'Русский', 'Español', '简体中文'];
const pages = [
 ['index','index.md'],['quick-start','Quick-start.md'],['models-and-styles','Models-and-styles.md'],
 ['api','API.md'],['exporting-images','Exporting-images.md'],['mcp','MCP.md'],
 ['troubleshooting','Troubleshooting.md'],['third-party-notices','Third-party-notices.md']
];
const labels = {
 en: ['Documentation','Quick start','Models and styles','Runtime API','Saving and export','Editor MCP','Troubleshooting','Third-party notices','Skip to content','Main navigation','Companion game','Guides and reference','On this page','Reference table','Documentation home','Product overview','Model and component terms','Language'],
 ru: ['Документация','Быстрый старт','Модели и стили','Runtime API','Сохранение и экспорт','Editor MCP','Решение проблем','Сторонние компоненты','Перейти к содержимому','Основная навигация','Демонстрационная игра','Руководства и справочник','На этой странице','Справочная таблица','Главная документации','Обзор продукта','Условия моделей и компонентов','Язык'],
 es: ['Documentación','Inicio rápido','Modelos y estilos','Runtime API','Guardar y exportar','Editor MCP','Solución de problemas','Avisos de terceros','Ir al contenido','Navegación principal','Juego complementario','Guías y referencia','En esta página','Tabla de referencia','Inicio de la documentación','Resumen del producto','Condiciones de modelos y componentes','Idioma'],
 'zh-Hans': ['文档','快速入门','模型与样式','Runtime API','保存与导出','Editor MCP','故障排查','第三方声明','跳转到正文','主导航','配套游戏','指南与参考','本页内容','参考表格','文档首页','产品概览','模型与组件条款','语言']
};
const escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode = text => text.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const localPath = (locale,page) => (locale==='en'?'':locale+'/')+page;
const relative = (from,to) => posix.relative(posix.dirname(from),to)||basename(to);
const canonical = (locale,page) => baseUrl+localPath(locale,page==='index.html'?'':page);
const alternates = page => locales.map(locale=>'<link rel="alternate" hreflang="'+locale+'" href="'+canonical(locale,page)+'">').join('')+'<link rel="alternate" hreflang="x-default" href="'+canonical('en',page)+'">';
const switcher = (locale,page) => '<nav class="language-switch wrap" aria-label="'+labels[locale][17]+'"><span>'+labels[locale][17]+'</span>'+locales.map((target,i)=>'<a data-language="'+target+'" lang="'+target+'" hreflang="'+target+'" href="'+relative(localPath(locale,page),localPath(target,page))+'"'+(locale===target?' aria-current="page"':'')+'>'+nativeNames[i]+'</a>').join('')+'</nav>';
const byName = new Map(pages.map(([slug,file])=>[file.toLowerCase(),slug+'.html']));
const translations = JSON.parse(await readFile('home-translations.json','utf8'));
const translate = (text,locale) => {
 if(locale==='en')return text;
 const decoded=decode(text.trim());if(!decoded)return text;
 if(!translations[decoded]?.[locale])throw new Error('Missing '+locale+' home text: '+decoded);
 return text.replace(text.trim(),escape(translations[decoded][locale]));
};
const sampleDetails={
 shield:['shield.png','A locally generated bronze shield with a transparent background','Bronze shield · original 1024 × 1024 PNG'],
 ring:['ring.png','A locally generated bronze ring with its original background','Bronze ring · original 1024 × 1024 PNG with background']
};
const homeSource=await readFile('public/index.html','utf8');
await mkdir('docs/docs',{recursive:true});await cp('public','docs',{recursive:true});
for(const locale of locales){
 const prefix=locale==='en'?'':'../';
 let home=homeSource.split(/(<[^>]+>)/g).map(token=>{
  if(!token.startsWith('<'))return translate(token,locale);
  token=token.replace(/\b(alt|aria-label|title)="([^"]+)"/g,(_,key,text)=>key+'="'+translate(text,locale)+'"');
  if(/^<meta\b/.test(token)&&/(?:name="description"|property="og:description")/.test(token))token=token.replace(/content="([^"]+)"/,(_,text)=>'content="'+translate(text,locale)+'"');
  if(prefix)token=token.replace(/\b(src|href|poster)="(assets\/[^" ]+|site\.(?:css|js))"/g,(_,key,value)=>key+'="'+prefix+value+'"');
  if(token.includes('data-item=')){
   const id=token.match(/data-item="([^"]+)"/)[1];const[file,alt,label]=sampleDetails[id];
   token=token.replace(/>$/,' data-file="'+file+'" data-alt="'+translate(alt,locale)+'" data-label="'+translate(label,locale)+'">');
  }
  return token;
 }).join('');
 home=home.replace('<html lang="en">','<html lang="'+locale+'">').replace('href="'+baseUrl+'"','href="'+canonical(locale,'index.html')+'"');
 home=home.replace('</head>',alternates('index.html')+'</head>').replace('</header>','</header>'+switcher(locale,'index.html'));
 await mkdir(join('docs',localPath(locale,'docs')),{recursive:true});
 await writeFile(join('docs',localPath(locale,'index.html')),home);
 for(let p=0;p<pages.length;p++){
  const[slug,file]=pages[p];const title=labels[locale][p];
  const source=await readFile(join('content',locale==='en'?'':locale,file),'utf8');
  const english=await readFile(join('content',file),'utf8');
  const englishHeadings=new Marked().lexer(english).filter(token=>token.type==='heading');
  const sections=[];const ids=new Map();let headingIndex=0;
  const parser=new Marked({gfm:true});
  parser.use({
   walkTokens(token){
    if(token.type==='link'&&!/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(token.href)&&/\.md(?:#.*)?$/i.test(token.href)){
     const[path,hash]=token.href.split('#');const destination=byName.get(basename(path).toLowerCase());
     if(!destination)throw new Error('Unmapped documentation link: '+token.href);
     token.href=destination+(hash?'#'+hash:'');
    }
   },
   renderer:{
    heading({tokens,depth,text}){
     const reference=englishHeadings[headingIndex++];
     if(!reference||depth!==reference.depth)throw new Error('Heading structure differs: '+locale+'/'+file);
     const base=reference.text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';
     const count=ids.get(base)||0;ids.set(base,count+1);const id=base+(count?'-'+count:'');
     if(depth===2)sections.push([id,text]);
     return '<h'+depth+' id="'+id+'">'+this.parser.parseInline(tokens)+'</h'+depth+'>\n';
    }
   }
  });
  let body=parser.parse(source);
  if(headingIndex!==englishHeadings.length)throw new Error('Missing headings: '+locale+'/'+file);
  body=body.replaceAll('<pre>','<pre tabindex="0">').replaceAll('<table>','<div class="table-scroll" tabindex="0" role="region" aria-label="'+labels[locale][13]+'"><table>').replaceAll('</table>','</table></div>');
  const firstHeading=body.indexOf('</h1>')+5;
  if(sections.length)body=body.slice(0,firstHeading)+'<nav class="toc" aria-label="'+labels[locale][12]+'"><ul>'+sections.map(([id,name])=>'<li><a href="#'+id+'">'+escape(name)+'</a></li>').join('')+'</ul></nav>'+body.slice(firstHeading);
  const nav=pages.map(([s],i)=>'<a href="'+s+'.html"'+(s===slug?' aria-current="page"':'')+'>'+labels[locale][i]+'</a>').join('');
  const assets=locale==='en'?'../':'../../';const page='docs/'+slug+'.html';
  const description=locale==='en'?title+' for Runtime Image Forge, local image generation for Unity.':locale==='ru'?title+' — Runtime Image Forge: локальная генерация изображений для Unity.':locale==='es'?title+' — Runtime Image Forge: generación local de imágenes para Unity.':title+' — Runtime Image Forge：Unity 本地图片生成。';
  const html='<!DOCTYPE html><html lang="'+locale+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' — Runtime Image Forge</title><meta name="description" content="'+escape(description)+'"><link rel="stylesheet" href="'+assets+'site.css"><link rel="icon" href="'+assets+'assets/forge-mark.svg"><script src="'+assets+'site.js" defer></script><link rel="canonical" href="'+canonical(locale,page)+'">'+alternates(page)+'</head><body><a class="skip" href="#main">'+labels[locale][8]+'</a><header class="header wrap"><a class="brand" href="../"><img src="'+assets+'assets/forge-mark.svg" width="42" height="42" alt="">Runtime Image Forge</a><nav aria-label="'+labels[locale][9]+'"><a href="../#demo">'+labels[locale][10]+'</a><a href="index.html">'+labels[locale][0]+'</a><a href="api.html">API</a></nav></header>'+switcher(locale,page)+'<main id="main" class="doc-layout wrap"><nav class="doc-nav" aria-label="'+labels[locale][0]+'"><p>'+labels[locale][11]+'</p>'+nav+'</nav><article class="doc-article"><p class="doc-meta">Runtime Image Forge 1.0.0 · Unity 6000.5+</p>'+body+'<div class="doc-bottom"><a href="index.html">'+labels[locale][14]+'</a><a href="../">'+labels[locale][15]+'</a></div></article></main><footer class="footer wrap"><span>© Strange Euphoria XR</span><a href="third-party-notices.html">'+labels[locale][16]+'</a></footer></body></html>';
  await writeFile(join('docs',localPath(locale,page)),html);
 }
}
await writeFile('docs/.nojekyll','');console.log('Собрано языковых версий: '+locales.length+'; HTML-страниц: '+locales.length*(pages.length+1)+'.');

