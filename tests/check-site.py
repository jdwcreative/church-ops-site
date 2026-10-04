#!/usr/bin/env python3
"""Dependency-free checks for preserved routes, page structure, and local links."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[1]
PAGES=['index.html','churchops.html','staff-portal.html','count.html','request-portal.html','resources.html','contact.html']
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=[];self.links=[];self.assets=[];self.h1=0;self.labels=[];self.fields=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'): self.ids.append(a['id'])
  if tag=='a' and a.get('href'): self.links.append(a['href'])
  if tag in ['script','img'] and a.get('src'): self.assets.append(a['src'])
  if tag=='link' and a.get('rel') in ['stylesheet','icon']:self.assets.append(a['href'])
  if tag=='h1':self.h1+=1
  if tag=='label':self.labels.append(a.get('for'))
  if tag in ['input','textarea','select']:self.fields.append(a.get('id'))
errors=[];checks=0
original=json.loads((ROOT/'tests/original-files.json').read_text())
for name,digest in original.items():
 p=ROOT/('support-center.html' if name=='index.html' else name)
 checks+=1
 if not p.exists() or hashlib.sha256(p.read_bytes()).hexdigest()!=digest:errors.append('Original content changed/missing: '+name)
parsed={}
for p in ROOT.glob('*.html'):
 parser=Page();parser.feed(p.read_text());parsed[p.name]=parser
for name in PAGES:
 p=parsed[name];checks+=3
 if p.h1!=1:errors.append(name+': must have exactly one h1')
 if len(p.ids)!=len(set(p.ids)):errors.append(name+': duplicate IDs')
 if any(f not in p.labels for f in p.fields):errors.append(name+': form control missing label')
 for href in p.links+p.assets:
  u=urlsplit(href)
  if u.scheme or u.netloc:continue
  checks+=1
  path=(unquote(u.path).lstrip('/') or 'index.html') if u.path else name
  target=ROOT/path
  if not target.exists():errors.append(name+': missing target '+href)
  if u.fragment and target.suffix=='.html' and u.fragment not in parsed[target.name].ids:errors.append(name+': missing anchor '+href)
print(json.dumps({'checks':checks,'preserved_original_files':len(original),'product_info_pages':len(PAGES),'errors':errors},indent=2))
sys.exit(bool(errors))
