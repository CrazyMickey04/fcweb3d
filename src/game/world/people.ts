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
    this.model.scene.position.z = 30;
    this.model.scene.scale.set(0.5, 0.5, 0.5);
    this.scene.add(this.model.scene);
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
    const video = document.createElement('video');
    video.src = 'path/to/video.mp4';
    video.autoplay = true;
    video.loop = true;
    // 创建视频纹理
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    this.FcModel.scene.traverse(item => {
      if ((item as Mesh).isMesh) {
        item.castShadow = true;
        item.receiveShadow = true;
        console.log('fcbox3 name:', item.name)
        if (item.name === 'videoFC') {
          debugger
          item.material.map = videoTexture;
          item.material.needsUpdate = true;
        }
      }
    });
    // // 获取模型中的特定面的几何体
    // const faceGeometry = model.getObjectByName('videoFace').geometry;

    this.FcModel.scene.name = 'fcbox3';
    this.FcModel.scene.position.set(35, 0.6, 306);
    this.FcModel.scene.scale.set(100, 100, 100);
    this.FcModel.scene.scale.set(100, 100, 100);
    this.scene.add(this.FcModel.scene);
  }
  initVideo() {
    // 创建视频元素
    const video = document.createElement('video');
    video.src = 'path/to/video.mp4';
    video.autoplay = true;
    video.loop = true;

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    // 创建材质
    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    // 创建几何体
    const geometry = new THREE.PlaneGeometry(4, 8);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(35, 0.6, 306);
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
