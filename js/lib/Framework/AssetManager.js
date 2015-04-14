define(['lib/Framework/MakeEventDispatcher', 'PxLoader', 'PxLoaderImage'], function(MakeEventDispatcher, PxLoader, PxLoaderImage) {
    'use strict';

    /**
     * @constructor
     */
    function AssetManager() {
        // Singleton
        if (AssetManager.instance) {
            throw new Error('AssetManager is a singleton. Use AssetManager.instance.');
        }
        // enforces new
        if (!(this instanceof AssetManager)) {
            return new AssetManager();
        }
        MakeEventDispatcher(this);

        this.IMAGE_PATH = '';
        this.AUDIO_PATH = '';
        this.assets = {};
    }

    //////////////////////////////
    // STATIC PUBLIC ATTRIBUTES //
    //////////////////////////////
    AssetManager.LOADING_COMPLETE = "AssetManager.LOADING_COMPLETE";

    ///////////////////////////////
    // STATIC PRIVATE ATTRIBUTES //
    ///////////////////////////////
    var _pxLoader = new PxLoader();
    var _atlasesJSONRequests = [];


    ////////////
    // PUBLIC METHODS
    //
    /**
     * Loads the images for the game
     */
    AssetManager.prototype.enqueueImages = function(tag) {
        // Declaring all the assets in PxLoader
        this.assets.images = _parseImageData(this.assets.images, tag);
    };

    /**
     * Loads the images for the game
     */
    AssetManager.prototype.enqueueAtlases = function() {
        var jsonReq, current;
        // Declaring all the assets in PxLoader
        for (var prop in this.assets.atlases) {
            if (this.assets.atlases.hasOwnProperty(prop)) {
                current = this.assets.atlases[prop];
                this.assets.images[prop] = _pxLoader.addImage(AssetManager.instance.IMAGE_PATH + current[0] + '.png', current[1]);
            }
        }
    };

    /**
     * Loads the sounds for the game
     */
    AssetManager.prototype.enqueueSounds = function() {
        this.assets.sounds = parseSoundData(this.assets.audio);
    };

    /**
     * Adds all the assets list to the loader
     */
    AssetManager.prototype.enqueueAssets = function(assets, tag) {
        this.assets = assets;
        this.enqueueImages(tag);
        // this.enqueueAtlases();
        // this.enqueueSounds();
    }

    AssetManager.prototype.loadAll = function(progressCallback) {
        // Loader progression
        if (progressCallback) {
            _pxLoader.addProgressListener(progressCallback);
        }

        _pxLoader.addCompletionListener(function(e) {
            AssetManager.instance.dispatch(AssetManager.LOADING_COMPLETE);
        });

        // Starting the loading
        _pxLoader.start();
    };

    AssetManager.prototype.getImage = function(name) {
        
    };

    ////////////
    // PRIVATE METHODS
    //
    /**
     * Parses the images data from the json file and add the images to PxLoader
     * @param  {object} data The file data
     * @return {object}      The new object with assets added to PxLoader
     */
    function _parseImageData (data, tag) {
        var obj = data, prop, current;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                current = obj[prop];
                if (tag !== undefined && current[1] != tag || typeof current[0] !== "string") {
                    continue;
                }
                obj[prop] = _pxLoader.addImage(AssetManager.instance.IMAGE_PATH + current[0], current[1]);
            }
        }
        return obj;
    };

    function _onAtlasJSONLoaded(response) {
        console.log('response: ', response);
    }

    // Singleton
    AssetManager.instance = new AssetManager();
    return AssetManager;

});