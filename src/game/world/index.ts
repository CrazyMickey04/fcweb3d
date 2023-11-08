import EventEmitter from 'events';
import { SkyBox } from './sky-box';
import { Game } from '../index';
import { People } from './people';
import { Grid } from './grid';
import * as THREE from 'three';
import type {  Raycaster  } from 'three';
export class GameWorld extends EventEmitter {
  game: Game;
  sky: SkyBox;
  people!: People;
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
  handleRaycaster(event:any) {
    console.log(this);
    const pointer = {};
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    const vector = new THREE.Vector2(pointer.x, pointer.y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(vector, this.game.gameCamera && this.game.gameCamera.camera);
    const intersects = raycaster.intersectObjects(this.people.FcModel.scenes);
    console.log(this.people.FcModel.scenes);
    console.log(intersects);
    for (const item of intersects) {
      if (item.object.name.includes('Cylinder')) {
        // const resut = confirm("是否进入美孚1号车养护？");
        // if (resut) {
        //   window.location.href = window.location.origin + '/roam';
        // }
        break; // 跳出循环
      }
    }
  }
  addGrid() {
    this.grid = new Grid();
  }

  addPeople() {
    this.people = new People();
  }

  update() {
    this.people && this.people.update();
  }
}
