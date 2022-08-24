import * as THREE from './libs/three125/three.module.js';
import { OrbitControls } from './libs/three125/OrbitControls.js';
import { ARButton } from './libs/ARButton.js';

class App{
    constructor(){
        const container = document.createElement( 'div' );
        //var text = document.getElementByID("distanceDisplay");
        //text.innerHTML = "THREE THREE";
        document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
        
        this.scene = new THREE.Scene();
        
        this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light );
            
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();
        
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
    }   
    
    initScene(){
        const loader = new FontLoader();

        loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const textTHREE = new TextGeometry( 'Hello three.js!', {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
            } );
        } );

        this.geometry = new THREE.BoxBufferGeometry( 0.06, 0.06, 0.06 ); 
        this.meshes = [];
    }
    
    setupXR(){
        this.renderer.xr.enabled = true;

        const self = this;

        let controller;
                
        function onSelect()
        {
            const material = new THREE.MeshPhongMaterial({color: 0xFFFFFF * Math.random()});

            const mesh = new THREE.Mesh(textTHREE, material);
            mesh.position.set(0, 0, -0.3).applyMatrix4(controller.matrixWorld);
            mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
            self.scene.add(mesh);
            self.meshes.push(mesh);
        }

        const btn = new ARButton(this.renderer);

        controller = this.renderer.xr.getController(0);
        controller.addEventListener('select', onSelect);        

        this.scene.add(controller);

        this.renderer.setAnimationLoop( this.render.bind(this) );

        //const material = new THREE.MeshPhongMaterial({color: 0xFFFFFF * Math.Random()});

        //const mesh = new THREE.Mesh(self.geometry, material);
        //mesh.position.set(0, 0, -0.3).applyMatrix4(controller) = this.Random(-2, 2);
        //mesh.position.y = this.Random(-2, 2);
        //mesh.position.z = this.Random(-2, 2);
        //self.scene.add(mesh);
        //self.meshes.push(mesh);
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
    render( ) {

        this.meshes.forEach( (mesh) => { mesh.rotateY( 0.01 ); });
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };