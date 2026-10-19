export const FINGERS = ['Thumb','Index','Middle','Ring','Little'];
export const CHAINS = [[0,1,2,3,4],[0,5,6,7,8],[0,9,10,11,12],[0,13,14,15,16],[0,17,18,19,20]];
export const LIMITS = Array.from({length:15},(_,i)=>(i%3===0 ? 75 : i%3===1 ? 100 : 80)*Math.PI/180);
const sub=(a,b)=>[a.x-b.x,a.y-b.y,a.z-b.z];
const norm=v=>Math.hypot(...v);
export const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
export function bend(a,b,c) {
  const u=sub(b,a),v=sub(c,b),d=norm(u)*norm(v);
  if(d<1e-10) throw new Error('Degenerate hand segment');
  return Math.acos(clamp(u.reduce((s,x,i)=>s+x*v[i],0)/d,-1,1));
}
export function anglesFromLandmarks(points, baseline=Array(15).fill(0)) {
  if(!Array.isArray(points)||points.length!==21||points.some(p=>!p||!['x','y','z'].every(k=>Number.isFinite(p[k])))) throw new Error('Expected 21 finite 3D landmarks');
  if(baseline.length!==15||baseline.some(v=>!Number.isFinite(v))) throw new Error('Invalid calibration');
  return CHAINS.flatMap(chain=>[0,1,2].map(j=>bend(points[chain[j]],points[chain[j+1]],points[chain[j+2]]))).map((v,i)=>clamp(v-baseline[i],0,LIMITS[i]));
}
export class HandController {
  constructor({speed=3.14,tau=0.10,hold=0.25,release=0.75}={}) {
    if(![speed,tau,hold,release].every(Number.isFinite)||speed<=0||tau<=0||hold<0||release<hold) throw new Error('Invalid controller settings');
    Object.assign(this,{speed,tau,hold,release});this.q=Array(15).fill(0);this.target=[...this.q];this.lastSeen=-Infinity;this.lastTime=null;this.stopped=false;this.status='WAITING';
  }
  observe(q,time) {
    if(!Number.isFinite(time)||time<this.lastSeen||q.length!==15||q.some(v=>!Number.isFinite(v))) return false;
    this.target=q.map((v,i)=>clamp(v,0,LIMITS[i]));this.lastSeen=time;return true;
  }
  stop(){this.stopped=true;this.status='STOPPED';}
  resume(){this.stopped=false;this.lastSeen=-Infinity;this.target=Array(15).fill(0);}
  step(time) {
    if(!Number.isFinite(time)||(this.lastTime!==null&&time<this.lastTime)) throw new Error('Time must be finite and monotonic');
    const dt=this.lastTime===null?0:Math.min(time-this.lastTime,0.1);this.lastTime=time;
    if(this.stopped){this.status='STOPPED';return [...this.q];}
    const age=time-this.lastSeen;
    this.status=age<=this.hold?'TRACKING':age<=this.release?'HOLDING':'RETURNING';
    const goal=age>this.release?Array(15).fill(0):this.target;
    this.command=[...goal];
    if(this.status!=='HOLDING') this.q=this.q.map((v,i)=>clamp(v+clamp((goal[i]-v)*(1-Math.exp(-dt/this.tau)),-this.speed*dt,this.speed*dt),0,LIMITS[i]));
    return [...this.q];
  }
}
// Synthetic landmarks for deterministic controller demos, not detector evaluation.
export function demoLandmarks(time,pose='wave') {
  const points=[{x:0,y:0,z:0}];
  for(let f=0;f<5;f++) {
    const curl=pose==='open'?0:pose==='fist'?0.95:pose==='point'?(f===1?0:0.9):(0.5+0.5*Math.sin(time*1.8-f*0.65))*0.95;
    const x=(f-2)*0.032, y=f===0?0.040:0.075-Math.abs(f-2)*0.006;
    let p={x,y,z:0}, angle=Math.atan2(x,y);points.push({...p});
    const lengths=f===0?[0.028,0.024,0.021]:[0.036,0.025,0.021];
    let flex=0;
    for(let j=0;j<3;j++) {
      flex+=curl*LIMITS[f*3+j];
      p={x:p.x+Math.sin(angle)*Math.cos(flex)*lengths[j],y:p.y+Math.cos(angle)*Math.cos(flex)*lengths[j],z:p.z+Math.sin(flex)*lengths[j]};points.push({...p});
    }
  }
  return points;
}
export function csv(rows) {
  const header=['seconds','status',...Array.from({length:15},(_,i)=>`joint_${i}_rad`)];
  return [header.join(','),...rows.map(r=>[r.time.toFixed(3),r.status,...r.q.map(v=>v.toFixed(6))].join(','))].join('\n');
}
