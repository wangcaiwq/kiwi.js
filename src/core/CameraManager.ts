/// <reference path="Game.ts" />


/**
 *	Kiwi - Core - CameraManager
 *
 *	@desc 		
 *
 *	@version 	1.0 - 11th January 2013
 *
 *	@author 	Ross Kettle
 *
 *	@url 		http://www.kiwijs.org
 */

module Kiwi {

    export class CameraManager {

        /**
		* 
        * @constructor
        * @param {Kiwi.Game} game
        * @return {Kiwi.CameraManager}
    	*/
        constructor(game: Kiwi.Game,multiCameraMode:bool) {

            klog.info('Layer Manager created');

            this._game = game;

            
            this._cameras = [];

            this._nextCameraID = 0;

            this._multiCameraMode = multiCameraMode;


        }

        /**
        * Returns the type of this object
        * @return {String} The type of this object
        */
        public objType():string {
            return "CameraManager";
        }

        /**
		* The game this object belongs to
        * @property _game
        * @type Kiwi.Game
        * @private
    	*/
        private _game: Kiwi.Game;

        /**
		* The div element which holds the dom camera
        * @property _domCamera
        * @type HTMLDivElement
        * @private
    	*/
        private _domCamera: HTMLDivElement;

        /**
		* Whether this manager supports multiple cameras or not.
        * @property _multiCameraMode
        * @type Boolean
        * @private
    	*/
        private _multiCameraMode: bool;

        /**
		* A collection of cameras
        * @property _cameras
        * @type Array
        * @private
    	*/
        private _cameras: Kiwi.Camera[];

        /**
		* The id which will be used when next creating a camera
        * @property _nextCameraID
        * @type Number
        * @private
    	*/
        private _nextCameraID: number;

        /**
		* The default camera of this camera manager.
        * @property defaultCamera
        * @type Kiwi.Layer
    	*/
        public defaultCamera: Kiwi.Camera;

        /**
		* 
        * @property currentLayer
        * @type Kiwi.Layer
    	*/
        //public currentLayer: Kiwi.Layer;

        /**
        * Returns the current state of the multiCameraMode or sets is if a value is given
        * @param {Boolean} val. The new value of multiCameraMode
        * @return {Boolean} The current value.
        */
        public multiCameraMode(val?: bool): bool {
            // this needs to have rules for what happens if changed part way through a game
            // - set to false -> remove all cameras except default
            // - set to true -> remove all DOM layers

            if (val !== undefined) {
                this._multiCameraMode = val;
            }
            return this._multiCameraMode;
        }


        /**
		* Initializes the CameraManager, creates a new camera and assigns it to the defaultCamera
        * @method boot
        * @param {HTMLDivElement} domCamera
    	*/
        public boot(domCamera: HTMLDivElement) {

            this.create("defaultCamera", 0, 0, this._game.stage.size.width(), this._game.stage.size.height());

            this.defaultCamera = this._cameras[0];
            this._domCamera = domCamera;

        }

        /**
        * Creates a new Camera and adds it to the collection of cameras.
        * @param {String} name. The name of the new camera.
        * @param {Number} x. The x position of the new camera.
        * @param {Number} y. The y position of the new camera.
        * @param {Number} width. The width of the new camera.
        * @param {Number} height. The height of the new camera.
        * @return {Kiwi.Camera} The new camera object.
        */
        public create(name: string, x: number, y: number, width: number, height: number): Kiwi.Camera {
            if (this._multiCameraMode === false && this._cameras.length > 0) {
                klog.error("Cannot add additional cameras in single camera mode. You can create other cameras assign them as default.");
                return null;
            }

            var newCamera: Kiwi.Camera = new Kiwi.Camera(this._game, this._nextCameraID++,name,x,y,width,height);
            
            //newCamera.parent = state;

            this._cameras.push(newCamera);

            return newCamera;

        }

        /**
		* Removes the given camera, if it is present in the camera managers camera collection.
        * @method remove
        * @param {Kiwi.Camera} camera
        * @return {Boolean} True if the camera was removed, false otherwise.
    	*/
        public remove(camera: Kiwi.Camera):bool {

            klog.info('Remove camera');

            var i = this._cameras.indexOf(camera);

            if (i !== -1) {
                //  Send Layer a killed call
                this._cameras.splice(i, 1);
                return true;
            }

            return false;
        }

        /**
		* Calls update on all the cameras.
        * @method update
    	*/
        public update() {

            if (this._cameras.length === 0) {
                return false;
            }

            if (!this._multiCameraMode) {
                this._cameras[0].update();
                // move the domCamera 
                this._domCamera.style.left = (-this._cameras[0].position.x()) + "px";
                this._domCamera.style.top = (-this._cameras[0].position.y()) + "px";
                // move any canvas layers to offset domCamera
                 
                for (var i = 0; i < this._game.layers.layers.length; i++) {
                    var layer: Kiwi.Layer = this._game.layers.layers[i];
                    //layer.domContainer.style.left = (-this._cameras[0].position.x()) + "px";
                    //layer.domContainer.style.top = (-this._cameras[0].position.y()) + "px";


                }

                this._game.layers.offsetCanvasLayers(this._cameras[0].position.x(),this._cameras[0].position.y());

                // the first child of domcam must be layers so get that
                //var layerContainer: HTMLDivElement = <HTMLDivElement>this._domCamera.firstChild;
                
                //console.log(layerContainer);

                return;
            } else {

                for (var i = 0; i < this._cameras.length; i++) {
                    this._cameras[i].update();
                }
            }

        }

        /**
		* Calls the render method on all the cameras
        * @method render
    	*/
        public render() {

            if (this._cameras.length === 0) {
                return false;
            }


            //render each camera
            for (var i = 0; i < this._cameras.length; i++) {
                //render each layer
                this._game.layers.render(this._cameras[i]);

                this._cameras[i].render();
            }

        }

        

        /**
		* Removes all cameras in the camera Manager except the default camera. Does nothing if in multi camera mode.
        * @method removeAll - note should not remove default
    	*/
        public removeAll() {

            this._cameras.length = 0;
            klog.info('TODO removeAll');

        }

    }
}