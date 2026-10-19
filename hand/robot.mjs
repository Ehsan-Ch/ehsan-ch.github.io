import * as THREE from '../vendor/three/build/three.module.js';
export class RobotView {
 constructor(canvas) {
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#101c23');
  this.camera=new THREE.PerspectiveCamera(38,1,.01,100);this.camera.position.set(.27,.24,.43);this.camera.lookAt(0,.10,0);
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  this.scene.add(new THREE.HemisphereLight(0xc9eeff,0x15262c,2.6));
  const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(1,2,3);this.scene.add(light);
  const rim=new THREE.DirectionalLight(0x61ffcf,2);rim.position.set(-1,1,-1);this.scene.add(rim);
  this.root=new THREE.Group();this.scene.add(this.root);this.joints=[];
  const shell=new THREE.MeshStandardMaterial({color:0xc8d6df,metalness:.65,roughness:.35});
  const jointMat=new THREE.MeshStandardMaterial({color:0x57d9bd,metalness:.45,roughness:.28});
  const dark=new THREE.MeshStandardMaterial({color:0x243e4b,metalness:.7,roughness:.35});
  const box=(w,h,d,mat)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  const palm=box(.112,.075,.026,shell);palm.position.y=.04;this.root.add(palm);
  const plate=box(.08,.045,.005,dark);plate.position.set(0,.043,.016);this.root.add(plate);
  const stripe=box(.05,.004,.002,jointMat);stripe.position.set(0,.043,.020);this.root.add(stripe);
  const wrist=box(.056,.04,.035,dark);wrist.position.y=-.015;this.root.add(wrist);
  for(let f=0;f<5;f++) {
   let parent=new THREE.Group();parent.position.set(f===0?-.068:(f-2.5)*.028,f===0?.035:.080-Math.abs(f-2)*.004,0);parent.rotation.z=f===0?.80:-(f-2.5)*.06;this.root.add(parent);
   const lengths=f===0?[.031,.025,.022]:[.041,.028,.023];
   for(let j=0;j<3;j++) {
    const hinge=new THREE.Group();parent.add(hinge);this.joints.push(hinge);
    const pin=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,.022,16),jointMat);pin.rotation.z=Math.PI/2;hinge.add(pin);
    const seg=box(.019,lengths[j]-.005,.021,shell);seg.position.y=lengths[j]/2;hinge.add(seg);
    const inset=box(.012,lengths[j]-.015,.003,dark);inset.position.set(0,lengths[j]/2,.012);hinge.add(inset);
    const end=new THREE.Group();end.position.y=lengths[j];hinge.add(end);parent=end;
   }
  }
  const base=box(.15,.015,.11,dark);base.position.y=-.045;this.root.add(base);
  const grid=new THREE.GridHelper(1,30,0x38595f,0x223740);grid.position.y=-.054;this.scene.add(grid);this.rotate=false;
  new ResizeObserver(()=>{const w=canvas.clientWidth,h=canvas.clientHeight;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}).observe(canvas);
 }
 render(q,t){this.joints.forEach((joint,i)=>joint.rotation.x=q[i]);this.root.rotation.y=this.rotate?Math.sin(t*.4)*.8:0;this.renderer.render(this.scene,this.camera);}
}
