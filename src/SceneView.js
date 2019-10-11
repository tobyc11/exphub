import React from 'react';
import { Card } from '@material-ui/core';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

class SceneView extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
        this.container.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        const size = 10;
        const divisions = 10;
        const gridHelper = new THREE.GridHelper(size, divisions);
        scene.add(gridHelper);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, emissive: 0x101010, emissiveIntensity: 2 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        const light = new THREE.PointLight({ color: 0xffffff });
        light.position.set(10, 20, 30);
        scene.add(light);

        camera.position.z = 5;
        controls.update();

        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }

    render() {
        return (
            <Card style={{paddingTop: 4, margin: 12}}>
                <div ref={this.container}>
                </div>
            </Card>
        );
    }
}

export default SceneView;
