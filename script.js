 (function(){
            var width = 1000,
                height = 600,
                mesh;

            var clock = new THREE.Clock();

            //scene
            var scene = new THREE.Scene();

            //model
            var onProgress = function (xhr) {
                if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
                }
            };

            var onError = function (xhr) {
            };

            var pgeometry = new THREE.PlaneGeometry(500, 500, 1, 1);
            var pmaterial = new THREE.MeshLambertMaterial({ color: '#82ff90', side: THREE.DoubleSide });
            var plane = new THREE.Mesh(pgeometry, pmaterial);
            plane.receiveShadow = true;
            plane.position.set(0, 0, 0);//rotate,scale
            plane.rotation.x = 90 * Math.PI / 180;
            scene.add(plane);

            //light
            var light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(40, 100, 60);
            light.castShadow = true;
            light.shadow.camera.top = 30;
            light.shadow.camera.bottom = -30;
            light.shadow.camera.left = -30;
            light.shadow.camera.right = 30;

            scene.add(light);
            var ambient = new THREE.AmbientLight(0x550000);
            scene.add(ambient);

            //camera
            var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
            camera.position.set(0, 25, 30);

            //helper
            var axis = new THREE.AxisHelper(1000);
            axis.position.set(0, 0, 0);
            //scene.add(axis);

            var directionalLightShadowHelper = new THREE.CameraHelper( light.shadow.camera);
            scene.add( directionalLightShadowHelper);

            var directionalLightHelper = new THREE.DirectionalLightHelper( light);
            scene.add( directionalLightHelper);

            //rendering
            var renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setSize(width, height);
            renderer.setClearColor(0xeeeeee, 1);
            renderer.shadowMap.enabled = true;
            document.getElementById('stage').appendChild(renderer.domElement);
            renderer.render(scene, camera);

            //control
            //モバイルデバイス時
            if(isMobileDevie()){
                var controls = new THREE.DeviceOrientationControls(camera, renderer.domElement);
            }
            //PC時
            else{
                var controls = new THREE.OrbitControls(camera, renderer.domElement);
                camera.position.set(0, 40, 30);

            }

            function render(){
                renderer.render(scene, camera);
                controls.update();

                if (mesh) {
                    helper.animate( clock.getDelta() );
                    helper.render( scene, camera );
                }
                else {
                    renderer.clear();
                    renderer.render( scene, camera );
                }
            }

            //animate
            function animate(){
                requestAnimationFrame(animate);
                render();
            }
            animate();

            //mesh
            var modelFile = "./mmd/pmd/Lat式ミクVer2.31/Lat_Miku_Ver2.31_Normal.pmd";
            var vmdFiles = ['./mmd/vmd/Torino_motion/Torinoko_Miku_20101228.vmd'];

            helper = new THREE.MMDHelper(renderer);
            var loader = new THREE.MMDLoader();
            loader.setDefaultTexturePath('./three-js/examples/models/mmd/default/');

            loader.load(modelFile, vmdFiles, function(object){
                mesh = object;
                mesh.castShadow = true;
                mesh.position.y = 0;

                helper.add(mesh);
                helper.setAnimation(mesh);
                helper.setCamera(camera);

                //モバイルデバイス時は重力処理を無しにする
                if(!isMobileDevie()){
                    helper.setPhysics(mesh);
                }

                helper.unifyAnimationDuration({afterglow: 2.0});

                scene.add(mesh);
            }, onProgress, onError);

        })();

        //モバイルデバイスを検知する
        function isMobileDevie(){
            if(navigator === undefined || navigator.userAgent === undefined){
                return true;
            }

            var s = navigator.userAgent;

            if(s.match(/iPhone/i) || s.match(/iPod/i) || s.match(/webOS/i) || s.match(/BlackBerry/i) || (s.match(/Windows/i)) && (s.match(/Phone/i)) || (s.match(/Android/i)) && (s.match(/Mobile/i))){
               return true;
            }
            else{
               return false;
            }
        }