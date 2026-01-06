//@input Asset.Texture background {"label":"Background Texture"}
//@input Asset.Material[] elements {"label":"Element Materials"}
//@input vec2[] elementTimings {"label":"Element Timings for tweens (x=delay, y=duration)"}
//@input Component.ScreenTransform[] elementTransforms {"label":"Optional Element Transforms (for rotation)"}
//@input bool[] elementRotate {"label":"Enable Rotation per Element"}
//@input vec4[] elementRotationParams {"label":"Rotation Params (x=startDeg,y=endDeg,z=duration, w=delay)"}

script.getSceneConfig = function() {
    var timings = (script.elementTimings || []).map(function(vec) {
        return { delay: vec.x, duration: vec.y };
    });
    
    // build rotation configs array aligned with elements
    var rotations = [];
    var transforms = script.elementTransforms || [];
    for (var i = 0; i < (script.elements || []).length; i++) {
        var enabled = (script.elementRotate && script.elementRotate[i]) ? script.elementRotate[i] : false;
        var params = (script.elementRotationParams && script.elementRotationParams[i]) ? script.elementRotationParams[i] : { x: 0, y: 0, z: 0, w: 0 };
        rotations.push({
            enabled: enabled,
            start: params.x,
            end: params.y,
            duration: params.z || 0,
            delay: params.w || 0,
            transform: transforms[i] || null
        });
    }

    return {
        background: script.background,
        elements: script.elements || [],
        elementTimings: timings,
        rotationConfigs: rotations
    };
};
