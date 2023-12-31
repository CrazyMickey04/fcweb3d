import EventEmitter from 'events';
import { Loaders } from './loaders';
import { Texture } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
export type ResourceAssetType = '' | 'texture' | 'gltf' | 'glb';
export type ResourceAsset = {
  type: ResourceAssetType;
  url: string;
  name: string;
}

export class Resource extends EventEmitter {
  loaders!: Loaders;
  assets!: ResourceAsset[];
  textures!: Texture[];
  models!: GLTF[];

  constructor(assets: ResourceAsset[]) {
    super();
    this.assets = assets;
    this.textures = [];
    this.models = [];
    this.loaders = new Loaders();
    this.initAssets();
  }

  async initAssets() {
    await this.loadAssets();
    this.emit('loaded');
  }

  async loadAssets() {
    this.emit('beforeLoad');
    for (const asset of this.assets) {
      await this.load(asset);
      this.emit('itemLoaded');
    }
  }

  async load(asset: ResourceAsset) {
    const { type, url, name } = asset;
    this.emit('itemProgress', url, 0, 1);
  
    let texture;
    let gltf;
    let glb;
  
    switch (type) {
    case 'texture':
      texture = await this.loaders.getTextureLoader().loadAsync(url, progress => {
        this.emit('itemProgress', url, progress.loaded, progress.total);
      });
      texture.name = name;
      this.textures.push(texture);
      break;
    case 'gltf':
      gltf = await this.loaders.getGLTFLoader().loadAsync(url, progress => {
        this.emit('itemProgress', url, progress.loaded, progress.total);
      });
      gltf.userData.name = name;
      this.models.push(gltf);
      break;
    case 'glb':
      glb = await this.loaders.getGLBLoader().loadAsync(url, progress => {
        this.emit('itemProgress', url, progress.loaded, progress.total);
      });
      glb.userData.name = name;
      console.log('glbname', name);
      this.models.push(glb);
      break;
    }
  }

  getTexture(name: string) {
    return this.textures.find(texture => texture.name === name);
  }

  getModel(name: string) {
    return this.models.find(model => model.userData.name === name);
  }


  update() { }
}
