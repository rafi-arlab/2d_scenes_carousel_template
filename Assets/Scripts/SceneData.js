//@input Asset.Texture background {"label":"Background Texture"}
//@input Asset.Material[] elements {"label":"Element Materials"}
//@input vec2[] elementTimings {"label":"reveal element tween (x=delay, y=duration)"}
//@input Component.ScreenTransform[] elementTransforms {"label":"Optional Element Transforms (for rotation)"}
//@input vec2[] elementBehaviors {"label":"Tween enabled? (x=rotationEnabled,y=floatingEnabled) (1=on,0=off)"}
//@input vec4[] elementRotationParams {"label":"Rotation / Float Params (must be enabled ^) (x=startDeg_or_offsetY-,y=endDeg_or_offsetY+,z=duration,w=initdelay)"}
script.getSceneConfig = function() {
    var timings = (script.elementTimings || []).map(function(vec) {
        return { delay: vec.x, duration: vec.y };
    });
    
    // build rotation/float configs array aligned with elements
    var rotations = [];
    var transforms = script.elementTransforms || [];
    var behaviors = script.elementBehaviors || [];
    for (var i = 0; i < (script.elements || []).length; i++) {
        var behavior = behaviors[i] || new vec2(0, 0);
        var rotEnabled = (behavior.x !== 0);
        var floatEnabled = (behavior.y !== 0);
        var params = (script.elementRotationParams && script.elementRotationParams[i]) ? script.elementRotationParams[i] : { x: 0, y: 0, z: 0, w: 0 };
        rotations.push({
            enabled: rotEnabled,
            floating: floatEnabled,
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
        rotationConfigs: rotations,
    };
};
