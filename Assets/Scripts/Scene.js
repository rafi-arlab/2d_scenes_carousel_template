//@input Asset.Material bg1
//@input Asset.Material bg2

class Scene {
  constructor(params) {
    this.background = params.background;
    this.elements = params.elements || [];
    this.elementTimings = params.elementTimings || [];
    this.rotationConfigs = params.rotationConfigs || [];
    this._activeTweens = [];
  }

  show(baseDelay) {
    this.elements.forEach((element, i) => {
      const timing = this.elementTimings[i] || { delay: 0, duration: 0.8 };
      this._showElement(element.mainPass, timing.delay + baseDelay, timing.duration);
      var rot = this.rotationConfigs[i];
        if (rot.enabled && rot.transform)
            this._rotateElement(rot.transform,rot.start,
                rot.end,rot.duration,rot.delay + baseDelay);
        if (rot.floating && rot.transform)
            this._floatElement(rot.transform, rot.start,
                rot.end,rot.duration,rot.delay + baseDelay);
    });
  }

  hide() {
    this.elements.forEach((element, i) => {
      const timing = this.elementTimings[i] || { delay: 0, duration: 0.8 };
      this._hideElement(element.mainPass, timing.delay, timing.duration);
    });

    // for rotating tweens: tween back to 0 then stop; for others stop immediately
    this._activeTweens.forEach(function (entry) {
        if (entry.type === "rotate") {
          var tr = entry.transform;
          var resetParams = {
            name: "ResetRotation",duration: 0.5,easing: global.Easings.Linear,
            onStart: function () {
              var q = tr.getTransform().getLocalRotation();
              entry._startRad = 2 * Math.atan2(q.z, q.w);
            },
            onUpdate: function (p) {
              var startRad = entry._startRad || 0;
              var angle = startRad * (1 - p);
              tr.getTransform().setLocalRotation(
                quat.fromEulerAngles(0, 0, angle)
              );
            },
            onComplete: function () {
              entry.tween.stop();
            },
          };
          var resetTween = new global.CustomTween(resetParams);
          resetTween.start();
        } 
        else if (entry.type === "float")
            entry.tween.stop();
    });
    this._activeTweens = [];
    if (this.elementsBehavior) {
      this.elementsBehavior.enabled = false;
    }
  }

  _showElement(elementPass, delayTime, duration) {
    var tweenParams = {
      name: "ShowElementTween", duration: duration, delay: delayTime, easing: global.Easings.QuadraticOut,
      onStart: function () {
        elementPass.invertReveal = true;
      },
      onUpdate: function (progress) {
        elementPass.revealRatio = progress;
      },
    };
    var revealTween = new global.CustomTween(tweenParams);
    revealTween.start();
  }

  _hideElement(elementPass, delayTime, duration) {
    var tweenParams = {
      name: "HideElementTween", duration: duration, delay: delayTime, easing: global.Easings.QuadraticOut,
      onStart: function () {
        elementPass.invertReveal = false;
      },
      onUpdate: function (progress) {
        elementPass.revealRatio = 1 - progress;
      },
    };
    var revealTween = new global.CustomTween(tweenParams);
    revealTween.start();
  }

  _rotateElement(transformComp, startDeg, endDeg, duration, delay) {
    var self = this;
    var initParams = {
      name: "RotateInit", duration: duration / 2,
      delay: delay || 0, easing: global.Easings.Linear,
      onUpdate: function (p) {
        var rad = startDeg * p * Math.PI / 180;
        transformComp.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, rad));
      },
      onComplete: function () {
        var rotParams = {
          name: "RotateElementTween", duration: duration, delay: 0, repeatDelay: 0,
          easing: global.Easings.Linear, repeatMode: global.LoopType.PingPong, repeatNumber: -1,
          onUpdate: function (progress) {
            var angle = startDeg + (endDeg - startDeg) * progress;
            var rad = angle * Math.PI / 180;
            transformComp.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, rad));
          },
        };
        var rotTween = new global.CustomTween(rotParams);
        rotTween.start();
        self._activeTweens.push({ tween: rotTween, type: "rotate", transform: transformComp });
      },
    };
    var initTween = new global.CustomTween(initParams);
    initTween.start();
    this._activeTweens.push({ tween: initTween, type: "rotate", transform: transformComp });
  }

  _floatElement(transformComp, minY, maxY, duration, delay) {
    if (!transformComp) return;
    var originaly = transformComp.anchors.getCenter().y;
    var floatParams = {
      name: "FloatTween", duration: duration, delay: delay, repeatDelay: 0,
      easing: global.Easings.Linear, repeatMode: global.LoopType.PingPong, repeatNumber: -1,
      onUpdate: function (progress) {
        var y = originaly + (maxY - minY) * progress;
        transformComp.anchors.setCenter(
          new vec2(transformComp.anchors.getCenter().x, y)
        );
      },
    };
    var floatTween = new global.CustomTween(floatParams);
    floatTween.start();
  }
}

global.Scene = Scene;
