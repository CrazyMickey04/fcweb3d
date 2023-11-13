import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Game } from '../index';
import { Model } from './model';
import { Grid } from './grid';
import * as THREE from 'three';
import type {  Raycaster  } from 'three';
export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  model!: Model;
  grid!: Grid;
  raycaster!: Raycaster;
  constructor() {
    super();
    this.game = Game.getInstance();
    this.sky = new SkyBox();
    this.game.onReady(() => {
      this.addGrid();
      this.addPeople();
      window.addEventListener('click', this.handleRaycaster.bind(this));
    });
  }
  // 点击事件，获取鼠标位置，判断是否点击了模型
  handleRaycaster(event:any) {
    console.log(this);
    const pointer = {};
    // 将鼠标点击的屏幕坐标转换为归一化设备坐标（Normalized Device Coordinates，NDC），范围是[-1, 1]。这是因为Three.js的射线投射需要使用NDC坐标
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    // 创建一个二维向量，用于存储转换后的NDC坐标。
    const vector = new THREE.Vector2(pointer.x, pointer.y);
    // 创建一个射线投射器，用于计算从相机到点击位置的射线。
    const raycaster = new THREE.Raycaster();
    // 从相机的位置发射一条射线，射线的方向由鼠标点击的NDC坐标决定。
    raycaster.setFromCamera(vector, this.game.gameCamera && this.game.gameCamera.camera);
    // 检测射线与场景中的对象是否相交，返回一个包含所有相交对象的数组。
    const intersects = raycaster.intersectObjects(this.model.carModel.scenes);
    console.log(this.model.carModel.scenes);
    console.log(intersects);
    // 遍历所有相交的对象。
    for (const item of intersects) {
      console.log('click 模型的name', item.object.name);
      if (item.object.name.includes('Object_')) {
        const resut = confirm("是否进入美孚1号改装定制？");
        if (resut) {
          window.location.href = window.location.origin + '/carshow';
        }
        break;
      }
    }
  }
  addGrid() {
    this.grid = new Grid();
  }

  addPeople() {
    this.model = new Model();
  }

  update() {
    this.model && this.model.update();
  }
}
