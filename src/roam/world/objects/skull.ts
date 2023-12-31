import { EventEmitter } from 'events';
import { Scene } from 'three';
import { Game } from '../../index';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class Skull extends EventEmitter {
  game: Game;
  scene: Scene;
  model!: GLTF;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.scene = this.game.gameScene.scene;
    this.init();
  }

  init() {
    this.model = this.game.resource.getModel('Lamborghini') as GLTF;
    this.model.scene.position.set(-3.8, 0.2, -3.7);
    this.model.scene.name = 'skull';
    this.model.scene.userData.name = 'skull';
    this.scene.add(this.model.scene);
  }

  update() { }
}