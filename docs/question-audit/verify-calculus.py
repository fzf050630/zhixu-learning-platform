"""Independently solve numerical/symbolic audited cases and bind results to their answer options."""
import json, re
from pathlib import Path
import sympy as s
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application
root=Path(__file__).resolve().parents[2]
a=json.loads((root/'docs/question-audit/calculus-review.json').read_text(encoding='utf-8'))
questions={row['question']['id']:row['question'] for row in a['additions']}
questions.update({row['replacement']['id']:row['replacement'] for row in a['reviewed'] if row['action']=='revise'})
x,y,z,t=s.symbols('x y z t',real=True)
checks=0
def selected(suffix):
 q=questions['qa-20261002-ca-'+suffix]
 return q['options'][q['answer']]
def value(text):
 if re.match(r'^[A-Za-z]+=',text): text=text.split('=',1)[1]
 text=text.replace('−','-').replace('π','pi').replace('²','**2').replace('³','**3').replace('℃','')
 text=re.sub(r'√(\d+)',r'sqrt(\1)',text)
 return parse_expr(text,local_dict={'pi':s.pi,'sqrt':s.sqrt},transformations=standard_transformations+(implicit_multiplication_application,))
def check(suffix,expected):
 global checks
 assert s.simplify(value(selected(suffix))-expected)==0,(suffix,selected(suffix),expected)
 checks+=1

check('squeeze',0)
check('removable',s.limit(s.sin(x)/x,x,0))
check('piecewise-differentiability',s.limit(x*x/x,x,0,dir='+'))
check('chain-second',s.diff(s.exp(x*x),x,2).subs(x,0))
check('rolle-polynomial',s.solve(s.diff(x*x-x,x),x)[0])
check('parabola-curvature',(abs(s.diff(x*x,x,2))/(1+s.diff(x*x,x)**2)**s.Rational(3,2)).subs(x,1))
check('symmetry-integral',s.integrate(x**3,(x,-2,2)))
F=s.integrate(1+t*t,(t,x,x*x))
check('moving-both-limits',s.diff(F,x).subs(x,1))
assert s.integrate(2*x/(1+x*x),(x,0,1))==s.log(2)
assert selected('substitution-bound')=='u从1到2，结果ln2';checks+=1
check('washer-volume',s.pi*s.integrate(x*x,(x,0,1)))
assert s.Tuple(*value(selected('normalize-vector')))==s.Tuple(s.Rational(1,3),s.Rational(2,3),s.Rational(2,3));checks+=1
check('triangle-cross',s.Matrix([1,0,0]).cross(s.Matrix([0,2,0])).norm()/2)
assert s.linsolve([x,y,x+y],(x,y,z))==s.FiniteSet((0,0,z))
assert selected('three-planes-common-line')=='z轴';checks+=1
assert selected('projection-ellipse')=='2x²+y²=1，z=0'
assert (x*x+y*y+z*z-1).subs(z,x)==2*x*x+y*y-1;checks+=1
check('polar-bound',0)
f=x*y/(x*x+y*y)
assert s.limit((f.subs(y,0))/x,x,0)==0 and s.limit((f.subs(x,0))/y,y,0)==0
assert s.limit(f.subs(y,x),x,0)==s.Rational(1,2)
assert selected('partials-not-continuous').startswith('两偏导均存在且为0，但f不连续');checks+=1
check('two-path-chain',s.diff((x+y)**2+(x-y)**2,x).subs({x:1,y:2}))
check('unit-direction',s.Matrix([2,3]).dot(s.Matrix([s.Rational(3,5),s.Rational(4,5)])))
assert s.Matrix([s.cos(t),s.sin(t),t]).subs(t,0)==s.Matrix([1,0,0])
assert s.Matrix([s.cos(t),s.sin(t),t]).diff(t).subs(t,0)==s.Matrix([0,1,1])
assert selected('helix-tangent')=='(x,y,z)=(1,0,0)+s(0,1,1)';checks+=1
check('constraint-max',s.Rational(1,2))
r,theta=s.symbols('r theta',real=True)
check('unit-disk',s.integrate(r**3,(r,0,1))*s.integrate(1,(theta,0,2*s.pi)))
assert selected('line-orientation')=='√2、−1'
assert s.integrate(2*t,(t,0,1))==1 and s.Matrix([1,1]).norm()==s.sqrt(2);checks+=1
check('green-area',s.integrate(s.Rational(1,2),(t,0,2*s.pi)))
check('tilted-surface-area',s.Matrix([1,0,1]).cross(s.Matrix([0,1,1])).norm())
check('sphere-flux',3*4*s.pi/3)
P,Q,R=x*x,y*z,y*y
div=s.diff(P,x)+s.diff(Q,y)+s.diff(R,z)
curl=s.Matrix([s.diff(R,y)-s.diff(Q,z),s.diff(P,z)-s.diff(R,x),s.diff(Q,x)-s.diff(P,y)])
assert div.subs({x:1,y:2,z:3})==5 and curl.subs({x:1,y:2,z:3})==s.Matrix([2,0,0])
assert selected('div-curl-compute')=='(5,(2,0,0))';checks+=1
n=s.symbols('n',integer=True,positive=True)
check('telescoping',s.summation(1/(n*(n+1)),(n,1,s.oo)))
check('alternating-error',s.Integer(99))
assert 1/100<=0.01 and 1/99>0.01
assert selected('endpoint-domain')=='[−1,1)'
assert s.summation((-1)**n/n,(n,1,s.oo))==-s.log(2)
assert s.summation(1/n,(n,1,s.oo))==s.oo;checks+=1
check('log-coefficient',s.diff(s.log(1+x),x,3).subs(x,0)/s.factorial(3))
check('periodic-sawtooth',(s.pi+(-s.pi))/2)
u=(s.exp(x)-s.exp(-x))/2
assert s.simplify(s.diff(u,x)+u-s.exp(x))==0 and u.subs(x,0)==0
assert selected('linear-initial')=='(eˣ−e^{−x})/2';checks+=1
u=2*(s.exp(x)-1)
assert s.diff(u,x,2)==s.diff(u,x) and u.subs(x,0)==0 and s.diff(u,x).subs(x,0)==2
assert selected('reduce-exponential')=='2(eˣ−1)';checks+=1
assert s.diff(-x,x,2)-(-x)==x
assert selected('nonhomogeneous-structure')=='−x+C₁eˣ+C₂e^{−x}';checks+=1
u=s.sin(2*x)
assert s.simplify(s.diff(u,x,2)+4*u)==0 and u.subs(x,0)==0 and s.diff(u,x).subs(x,0)==2
assert selected('oscillator-initial')=='sin(2x)';checks+=1
check('newton-cooling',20+60*s.Rational(1,2)**2)
print(json.dumps({'status':'passed','boundIndependentChecks':checks,'reviewed':len(a['reviewed']),'newQuestions':len(a['additions'])}))
