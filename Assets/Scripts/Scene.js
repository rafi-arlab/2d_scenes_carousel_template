//@input Asset.Material bg1
//@input Asset.Material bg2

class Scene {
    constructor(params) {
        this.elementsBehavior = params.elementsBehavior;
        this.background = params.background;
        this.elements = params.elements || [];
        this.elementTimings = params.elementTimings || [];
        this.rotationConfigs = params.rotationConfigs || [];
        this._activeTweens = [];
        this.music = params.music;
    }

    show(baseDelay) {
        baseDelay = baseDelay || 0;
        this.elements.forEach((element, i) => {
            const timing = this.elementTimings[i] || { delay: 0, duration: 0.8 };
            this._showElement(element.mainPass, timing.delay + baseDelay, timing.duration);
            // start rotation if configured and a transform is provided
            var rot = this.rotationConfigs[i];
                if (rot && rot.enabled && rot.transform) {
                    var rotDur = rot.duration || timing.duration || 0.8;
                    this._rotateElement(rot.transform, rot.start, rot.end, rotDur, rot.delay);
            }
        });
    }

    hide() {
        this.elements.forEach((element, i) => {
            const timing = this.elementTimings[i] || { delay: 0, duration: 0.8 };
            this._hideElement(element.mainPass, timing.delay, timing.duration);
        });

        // for rotating tweens: tween back to 0 then stop; for others stop immediately
        this._activeTweens.forEach(function(entry) {
            try {
                if (entry && entry.type === 'rotate' && entry.transform && entry.transform.getTransform) {
                    var tr = entry.transform;
                    // create a short tween to return rotation to 0
                    var resetParams = {
                        name: "ResetRotation",
                        duration: 0.15,
                        easing: global.Easings.Linear,
                        onStart: function() {
                            // capture current quaternion
                            var q = tr.getTransform().getLocalRotation();
                            entry._startRad = 2 * Math.atan2(q.z, q.w);
                        },
                        onUpdate: function(p) {
                            var startRad = entry._startRad || 0;
                            var angle = startRad * (1 - p);
                            tr.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, angle));
                        },
                        onComplete: function() {
                            if (entry.tween && entry.tween.stop) entry.tween.stop();
                        }
                    };
                    var resetTween = new global.CustomTween(resetParams);
                    resetTween.start();
                } else {
                    if (entry && entry.tween && entry.tween.stop) entry.tween.stop();
                }
            } catch (e) {
                if (entry && entry.tween && entry.tween.stop) entry.tween.stop();
            }
        });
        this._activeTweens = [];

        if (this.elementsBehavior) {
            this.elementsBehavior.enabled = false;
        }
    }
    
    _showElement(elementPass, delayTime, duration) {
        var tweenParams = {
            name: "ShowElementTween",
            duration: duration,
            delay: delayTime,
            easing: global.Easings.QuadraticOut,
            onStart: function() {
                elementPass.invertReveal = true;
            },
            onUpdate: function(progress) {
                elementPass.revealRatio = progress;
            },
        };
        var revealTween = new global.CustomTween(tweenParams);
        revealTween.start();
    }
    
    _hideElement(elementPass, delayTime, duration) {
        var tweenParams = {
            name: "HideElementTween",
            duration: duration,
            delay: delayTime,
            easing: global.Easings.QuadraticOut,
            onStart: function() {
                elementPass.invertReveal = false;
            },
            onUpdate: function(progress) {
                elementPass.revealRatio = 1-progress;
            },
        };
        var revealTween = new global.CustomTween(tweenParams);
        revealTween.start();
    }

    _rotateElement(transformComp, startDeg, endDeg, duration, delay) {
        if (!transformComp) return;
        var self = this;

        // ensure transform is at 0 immediately to avoid visual jump
        if (transformComp.getTransform) {
            transformComp.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, 0));
        }

        var initParams = {
            name: "RotateInit",
            duration: duration/2,
            delay: delay || 0,
            easing: global.Easings.Linear,
            onUpdate: function(p) {
                var angle = startDeg * p;
                var rad = angle * Math.PI / 180;
                if (transformComp.getTransform) {
                    transformComp.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, rad));
                }
            },
            onComplete: function() {
                // start the repeating ping-pong tween between startDeg and endDeg
                var rotParams = {
                    name: "RotateElementTween",
                    duration: duration,
                    delay: 0,
                    repeatDelay: 0,
                    easing: global.Easings.Linear,
                    repeatMode: global.LoopType.PingPong,
                    repeatNumber: -1,
                    onUpdate: function(progress) {
                        var angle = startDeg + (endDeg - startDeg) * progress;
                        var rad = angle * Math.PI / 180;
                        if (transformComp.getTransform) {
                            transformComp.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, rad));
                        }
                    }
                };
                var rotTween = new global.CustomTween(rotParams);
                rotTween.start();
                self._activeTweens.push({ tween: rotTween, type: 'rotate', transform: transformComp });
            }
        };

        var initTween = new global.CustomTween(initParams);
        initTween.start();
        this._activeTweens.push({ tween: initTween, type: 'rotate', transform: transformComp });
    }
}


global.Scene = Scene;