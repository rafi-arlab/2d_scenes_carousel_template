//@input Asset.Material bg1
//@input Asset.Material bg2

function Scene(params) {
    this.elementsBehavior = params.elementsBehavior;
    this.background = params.background;
    this.elements = params.elements || [];
    this.music = params.music;
}

Scene.prototype.hide = function() {
    this.elements.forEach(function(obj) {
        obj.enabled = false;
    });
    //if (global.AudioManager) {
    //    global.AudioManager.stopMusic();
    //}
    if (this.elementsBehavior) {
        this.elementsBehavior.enabled = false;
    }
};

global.Scene = Scene;