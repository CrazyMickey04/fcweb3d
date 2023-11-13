import EventEmitter from 'events';
import { LoadingManager, TextureLoader } from 'three';
import { Game } from '..';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class Loaders extends EventEmitter {
  textureLoader!: TextureLoader;
  gltfLoader!: GLTFLoader;
  glbLoader!: GLTFLoader;
  loadingManager!: LoadingManager;

  constructor() {
    super();
    this.loadingManager = new LoadingManager();

    this.loadingManager.onStart = (url: string, loaded: number, total: number) => {
      this.emit('start', url, loaded, total);
    }
    this.loadingManager.onProgress = (url: string, loaded: number, total: number) => {
      this.emit('progress', url, loaded, total);
    }
    this.loadingManager.onLoad = () => {
      this.emit('loaded');
    }
  }

  getTextureLoader() {
    if (this.textureLoader) {
      return this.textureLoader;
    }
    this.textureLoader = new TextureLoader(this.loadingManager).setPath(Game.BASE_DIR);
    return this.textureLoader;
  }

  getGLTFLoader() {
    if (this.gltfLoader) {
      return this.gltfLoader;
    }
    this.gltfLoader = new GLTFLoader(this.loadingManager).setPath(Game.BASE_DIR);
    return this.gltfLoader;
  }

  getGLBLoader() {
    if (this.glbLoader) {
      return this.glbLoader;
    }
    if (!this.gltfLoader) {
      this.gltfLoader = this.getGLTFLoader();
    }
    // DRACOLoader是Three.js提供的一个加载器，用于加载和解码使用DRACO算法压缩的模型数据。
    const dracoLoader = new DRACOLoader();
    // 设置DRACO解码器的路径。这个路径应该指向包含DRACO解码器文件的目录。
    dracoLoader.setDecoderPath('/draco/');
    this.gltfLoader.setDRACOLoader(dracoLoader);
    return this.gltfLoader;
  }

  update() { }
}
