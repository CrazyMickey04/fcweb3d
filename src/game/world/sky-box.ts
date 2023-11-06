import { EventEmitter } from 'events';
import { MathUtils, Scene, Vector3 } from 'three';
import { Game } from '../index';
import { Sky } from 'three/examples/jsm/objects/Sky';

export class SkyBox extends EventEmitter {
  game: Game;
  scene: Scene;
  sky!: Sky;
  sun!: Vector3;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 1,
      azimuth: 180,
      exposure: this.game.gameRenderer.renderer.toneMappingExposure
    };
    this.sky = new Sky();
    this.sky.scale.setScalar(1000);
    this.sky.rotation.x = Math.PI; 
    this.scene.add(this.sky);
    // 创建太阳位置向量
    this.sun = new Vector3();
    const uniforms = this.sky.material.uniforms;
    // 设置天空盒子材质的uniforms属性
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
    // 计算太阳位置
    const phi = MathUtils.degToRad(90 - effectController.elevation);
    const theta = MathUtils.degToRad(effectController.azimuth);
    this.sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(this.sun);
  }

  update() { }
}