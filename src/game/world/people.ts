import { EventEmitter } from 'events';
import * as THREE from 'three';
import { AnimationAction, AnimationClip, AnimationMixer, BoxGeometry, Mesh, MeshNormalMaterial, Quaternion, Scene, Vector3 } from 'three';
import { Game } from '../index';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Octree } from 'three/examples/jsm/math/Octree';
enum PeopleStatus {
  IDLE = 'Armature|mixamo.com|Layer0',
  WALK = 'walk',
  RUN = 'Run'
}

type DirectionKeypress = { a: boolean, w: boolean, d: boolean, s: boolean };

export class People extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  FcModel!: GLTF;
  SHmodel!: GLTF;
  octree!: Octree;
  mixer!: AnimationMixer;
  animationMap: Map<string, AnimationAction> = new Map();
  activeAction!: AnimationAction;
  customer!: GLTF;
  customerMixer!: AnimationMixer;
  customerAnimationMap: Map<string, AnimationAction> = new Map();
  customerActiveAction!: AnimationAction;
  status: PeopleStatus = PeopleStatus.IDLE;
  fadeDuration: number = 0.2;
  directionKeypress: DirectionKeypress = { a: false, w: false, d: false, s: false };
  quaternion: Quaternion = new Quaternion();
  walkVelocity: number = 2;
  runVelocity: number = 5;
  walkDirection: Vector3 = new Vector3();
  constructor() {
    super();
    this.game = Game.getInstance();
    this.octree = new Octree();
    this.scene = this.game.gameScene.scene;
    this.init();
  }
  init() {
    this.initSHModel();
    this.initFCModel();
    this.initModel();
    this.initCustomer();
    // 单独添加video mesh
    // this.initVideo();
    this.initEvents();
  }

  initModel() {
    this.model = this.game.resource.getModel('jay_animate_walk2') as GLTF;
    this.model.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    console.log(this.model);
    this.mixer = new AnimationMixer(this.model.scene);
    this.mixer.timeScale = 0.001;
    console.log('动画片断',  this.model.animations);
    this.model.animations.forEach(clip => {
      const action = this.mixer.clipAction(clip);
      this.animationMap.set(clip.name, action);
    });
    this.model.scene.position.x = -50;
    this.model.scene.position.y = 0.1;
    this.model.scene.position.z = 30;
    this.model.scene.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.model.scene);
  }
  initCustomer() {
    this.customer = this.game.resource.getModel('customer') as GLTF;
    this.customer.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    console.log(this.customer);
    this.customerMixer = new AnimationMixer(this.customer.scene);
    this.customerMixer.timeScale = 0.001;
    console.log('customer动画片断',  this.customer.animations);
    this.customer.animations.forEach(clip => {
      const action = this.customerMixer.clipAction(clip);
      this.customerAnimationMap.set(clip.name, action);
    });
    // this.customerMixer.clipAction(this.customer.animations[1]).play();
    this.customer.scene.position.x = -50;
    this.customer.scene.position.y = 0.1;
    this.customer.scene.position.z = 30;
    this.customer.scene.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.customer.scene);
  }
  initSHModel() {
    this.SHmodel = this.game.resource.getModel('shanghai') as GLTF;
    this.octree.fromGraphNode(this.SHmodel.scene);
    console.log(this.SHmodel);
    this.SHmodel.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    this.SHmodel.scene.position.y = 34.42;
    this.SHmodel.scene.scale.set(100, 100, 100);
    this.scene.add(this.SHmodel.scene);
  }
  initFCModel() {
    this.FcModel = this.game.resource.getModel('fcbox3') as GLTF;
    this.octree.fromGraphNode(this.FcModel.scene);

    // 创建视频元素
    let video = document.getElementById( 'video' );
    video.autoplay = true;
    video.loop = true;
    // 创建视频纹理
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.center.set(0.5, 0.5);
    videoTexture.rotation = -Math.PI / 2;
    this.FcModel.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
        console.log('fcbox3 name:', item.name);
        // 查找videoFc的面。 videoFc在blender 中建模的时候设置
        if (item.name === 'videoFC') {
          item.material.map = videoTexture;
          item.material.needsUpdate = true; // 手动更新材质
        }
      }
    });

    this.FcModel.scene.name = 'fcbox3';
    this.FcModel.scene.position.set(35, 0.6, 306);
    this.FcModel.scene.scale.set(100, 100, 100);
    this.FcModel.scene.scale.set(100, 100, 100);
    this.scene.add(this.FcModel.scene);
  }
  // 单独给mesh添加视频
  initVideo() {
    // 创建视频元素
    const video = document.getElementById( 'video' );

    const videoTexture = new THREE.VideoTexture(video);
    // 创建材质
    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    // 创建几何体,
    const geometry = new THREE.PlaneGeometry(4, 3);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(35, 0.6, 306);
    mesh.rotation.y = Math.PI / 2;
    console.log(mesh, 'mesh');
    // 添加到场景中
    this.scene.add(mesh);
  }
  initEvents() {
    document.addEventListener('keydown', evt => {
      const key = evt.key.toLocaleLowerCase();
      if (['a', 'w', 'd', 's'].includes(key)) {
        this.status = PeopleStatus.WALK;
        this.directionKeypress[key as keyof DirectionKeypress] = true;
        this.runAnimation();
      } else if (key === 'shift' && this.status === PeopleStatus.WALK) {
        this.status = PeopleStatus.RUN;
        this.runAnimation();
      }
      // 客服跳舞
      if (key === 't') {
        this.customerAnimation('talking');
      }
      // 客服跳舞
      if (key === 'q') {
        this.customerAnimation('dance');
      }
      evt.preventDefault();
    });

    document.addEventListener('keyup', evt => {
      const key = evt.key.toLocaleLowerCase();
      if (['a', 'w', 'd', 's'].includes(key)) {
        this.status = PeopleStatus.IDLE;
        this.directionKeypress[key as keyof DirectionKeypress] = false;
        this.runAnimation();
      } else if (key === 'shift') {
        this.status = this.status === PeopleStatus.RUN ? PeopleStatus.WALK : PeopleStatus.IDLE;
        this.runAnimation();
      }
      evt.preventDefault();
    });
  }

  getOffsetDirection() {
    let offsetDirection: number;
    if (this.directionKeypress['w']) {
      if (this.directionKeypress['a']) {
        offsetDirection = Math.PI * 0.25;
      } else if (this.directionKeypress['d']) {
        offsetDirection = -Math.PI * 0.25;
      } else {
        offsetDirection = 0;
      }
    } else if (this.directionKeypress['s']) {
      if (this.directionKeypress['a']) {
        offsetDirection = Math.PI * 0.75;
      } else if (this.directionKeypress['d']) {
        offsetDirection = -Math.PI * 0.75;
      } else {
        offsetDirection = -Math.PI;
      }
    } else if (this.directionKeypress['a']) {
      offsetDirection = Math.PI * 0.5;
    } else if (this.directionKeypress['d']) {
      offsetDirection = -Math.PI * 0.5;
    } else {
      offsetDirection = 0;
    }
    return offsetDirection;
  }
  customerAnimation(type: string) {
    console.log('this.customerAnimationMap:', this.customerAnimationMap);
    const customerAction = this.customerAnimationMap.get(type) as AnimationAction;
    customerAction.reset().play();
  }
  runAnimation() {
    const action = this.animationMap.get(this.status) as AnimationAction;
    if (this.activeAction === action) {
      return;
    }
    if (this.activeAction) {
      this.activeAction.fadeOut(this.fadeDuration);
    }
    action.reset().fadeIn(this.fadeDuration).play();
    this.activeAction = action;
  }

  update() {
    const camera = this.game.gameCamera.camera;
    const delta = this.game.time.delta;
    this.mixer && this.mixer.update(delta);
    this.customerMixer && this.customerMixer.update(delta);
    if (this.status === PeopleStatus.WALK || this.status === PeopleStatus.RUN) {
      const angleYCameraDirection = Math.atan2(
        camera.position.x - this.model.scene.position.x,
        camera.position.z - this.model.scene.position.z
      );
      const offsetDirection = this.getOffsetDirection();
      this.quaternion.setFromAxisAngle(new Vector3(0, 1, 0), angleYCameraDirection + offsetDirection);
      this.model.scene.quaternion.rotateTowards(this.quaternion, 0.5);
      let speed = 0;
      if (this.status === PeopleStatus.WALK) {
        speed = this.walkVelocity * delta * 0.005;
      } else if (this.status === PeopleStatus.RUN) {
        speed = this.runVelocity * delta * 0.005;
      }

      camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(new Vector3(0, 1, 0), offsetDirection);

      const moveX = this.walkDirection.x * speed;
      const moveZ = this.walkDirection.z * speed;
      this.model.scene.position.x += moveX;
      this.model.scene.position.z += moveZ;
      console.log(this.model.scene.position);
      camera.position.x += moveX;
      camera.position.z += moveZ;
      if (this.game.gameControls.controls) {
        const target = this.model.scene.position.clone();
        target.y += 1;
        this.game.gameControls.controls.target = target;
      }
    }
  }
}
