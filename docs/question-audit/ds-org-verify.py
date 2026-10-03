"""Read-only audit validation, independent small-case calculations; no runtime changes."""
import json, math, heapq
from pathlib import Path
from collections import Counter, deque
r=Path(__file__).resolve().parents[2]
a=json.loads((r/'docs/question-audit/ds-org-review.json').read_text(encoding='utf-8'))
nodes=[]
for subject in ['data-structures','computer-organization']:
 nodes+=json.loads((r/f'tmp/question-audit-20261002/{subject}.json').read_text(encoding='utf-8-sig'))['nodes']
expected={(n['nodeId'],bank,q['id']) for n in nodes for bank in ['practice','past'] for q in n[bank]}
actual=[(e['nodeId'],e['bank'],e['id']) for e in a['original']]
assert len(actual)==707 and len(set(actual))==707 and set(actual)==expected
assert len(a['additions'])==101
assert Counter(e['nodeId'] for e in a['additions'])==Counter(n['nodeId'] for n in nodes)
retained_ids=[e['id'] for e in a['original'] if e['action']=='retain']
new_questions=[e['replacement'] for e in a['original'] if e['action']=='revise']+[e['question'] for e in a['additions']]
ids=retained_ids+[q['id'] for q in new_questions]
assert len(ids)==len(set(ids))
for e in a['original']:
 assert e['reason'] and e['verification']
 if e['action']=='revise':
  assert e['replacement']['id']==e['id']+'-r2'
 if e['bank']=='past':
  assert e['action']!='retain'
  if e['action']=='revise': assert 'source' not in e['replacement']
for q in new_questions:
 assert {'id','type','stem','options','answer','explanation'}<=set(q)
 assert q['type'] in ['single','judge']
 assert q['answer'] in q['options'] and len(set(q['options'].values()))==len(q['options'])
 assert len(q['options'])==(4 if q['type']=='single' else 2)

# Independently execute arithmetic/sequence examples; these check results, not string format.
arr=[2,4,6,8]; moves=len(arr)-2; arr.insert(2,5); moves+=len(arr)-2; arr.pop(1); assert moves==5
people=list(range(1,6)); cursor=0
while len(people)>1: cursor=(cursor+2)%len(people); people.pop(cursor)
assert people==[4]
q=deque([1,2,3]); assert len(q)+2-1==4
weights=[1,2,3,7]; heapq.heapify(weights); wpl=0
while len(weights)>1:
 w=heapq.heappop(weights)+heapq.heappop(weights); wpl+=w; heapq.heappush(weights,w)
assert wpl==22
assert (3+6+1)/6==5/3
assert 12//math.gcd(12,8)==3
text='aaaaab'; pat='aaab'; comparisons=0; found=None
for start in range(len(text)-len(pat)+1):
 for k in range(len(pat)):
  comparisons+=1
  if text[start+k]!=pat[k]: break
 else: found=start; break
assert found==2 and comparisons==12
array=[4,1,3,2]; moved=0
for i in range(1,len(array)):
 key=array[i]; j=i-1
 while j>=0 and array[j]>key: array[j+1]=array[j]; moved+=1; j-=1
 array[j+1]=key
assert moved==4
array=[3,1,2,4]; comparisons=0
for end in range(len(array)-1,0,-1):
 changed=False
 for j in range(end):
  comparisons+=1
  if array[j]>array[j+1]: array[j],array[j+1]=array[j+1],array[j]; changed=True
 if not changed: break
assert comparisons==5
array=[5,4,3,2,1]
for start in [0,1]:
 vals=sorted(array[start::2]); array[start::2]=vals
assert array==[1,2,3,4,5]
assert (20-7+1)//2==7
segments=17; passes=0
while segments>1: segments=math.ceil(segments/4); passes+=1
assert passes==3
assert math.isclose(2e6*1.5/3e9,0.001)
assert int('2A',16)+8/16==42.5
assert 160-256==-96
assert 64e-3/1024==62.5e-6
assert (8//2)*(16//8)==8
assert math.isclose(8+60000/7200/2+1,13.166666666666666)
assert 2+0.05*80==6
assert [32-int(math.log2(4096/64))-6,int(math.log2(4096/64)),6]==[20,6,6]
assert 0x9000+0x234==0x9234
assert (256-250)*16==96
assert sum(math.ceil(math.log2(x+1)) for x in [3,7,1,5])==9
assert (4+7-1)*2==20 and 7*4*2/20==2.8
assert 1/(0.2+0.8/4)==2.5
assert 32/8*100e6*2==800e6
assert math.isclose(32/(6/100e6),533333333.3333333)
assert 40*500000/2e9==0.01
assert 1000*20e-6==0.02
assert 4096/4==1024 and math.isclose(1024/100e6,10.24e-6)
print(json.dumps({'originalCoverage':707,'nodeCoverage':101,'additions':101,'revised':sum(e['action']=='revise' for e in a['original']),'removed':sum(e['action']=='remove' for e in a['original']),'unverifiedPastRetained':0,'checks':'schema, exact snapshot coverage, ID uniqueness, source removal, distinct options, independent numerical simulations passed'},ensure_ascii=False))
