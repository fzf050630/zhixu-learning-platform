(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.DS=root.DS||{};root.DS.Algorithms=root.DS.Algorithms||{};root.DS.Algorithms.stackQueue=api;})(globalThis,function(){
 const snap=(id,line,message,state)=>({id,line,message,state:structuredClone(state)});
 function stackDemo(initial,operations,capacity=6){
  if(!Number.isInteger(capacity)||capacity<1||initial.length>capacity)throw new Error('栈容量无效');
  const values=initial.slice(),state=()=>({kind:'stack',values,capacity,top:values.length-1,bottom:values.length?0:null});
  const out=[snap('stack-start',1,'栈底下标为 0；top 指向栈顶元素，空栈 top=-1',state())];
  operations.forEach((op,i)=>{
   let message,line;
   if(op==='pop'){line=5;message=values.length?values.pop()+' 出栈，top 下移':'空栈：拒绝出栈（下溢），top=-1';}
   else if(op==='peek'){line=2;message=values.length?'读取栈顶 '+values.at(-1)+'，top 不变':'空栈：没有栈顶元素';}
   else {line=3;message=values.length===capacity?'栈满：拒绝入栈（上溢）':op+' 入栈，top 上移';if(values.length<capacity)values.push(op);}
   out.push(snap('stack-'+i,line,message,state()));
  });return out;
 }
 function circularQueueDemo(capacity,initial,operations){
  if(!Number.isInteger(capacity)||capacity<2||initial.length>=capacity)throw new Error('循环队列保留一个空槽，初始元素数必须小于容量');
  const slots=Array(capacity).fill(null);initial.forEach((v,i)=>slots[i]=v);
  let front=0,rear=initial.length;
  const state=()=>{const logical=[];for(let i=front;i!==rear;i=(i+1)%capacity)logical.push(slots[i]);return{kind:'queue',values:slots,front,rear,capacity,logical,tail:logical.length?(rear-1+capacity)%capacity:null};};
  const out=[snap('queue-start',1,'front 指向队头；rear 指向下一写入槽；保留一个空槽区分空满',state())];
  operations.forEach((op,i)=>{
   let message,line;
   if(op==='dequeue'){line=6;if(front===rear)message='队空：拒绝出队，front 与 rear 重合';else{message=slots[front]+' 出队，front=(front+1)%容量';slots[front]=null;front=(front+1)%capacity;}}
   else if(op==='peek'){line=5;message=front===rear?'队空：没有队头元素':'读取队头 '+slots[front]+'，指针不变';}
   else{line=3;if((rear+1)%capacity===front)message='队满：拒绝入队，(rear+1)%容量==front';else{slots[rear]=op;rear=(rear+1)%capacity;message=op+' 入队，rear=(rear+1)%容量';}}
   out.push(snap('queue-'+i,line,message,state()));
  });return out;
 }
 return{stackDemo,circularQueueDemo};
});
