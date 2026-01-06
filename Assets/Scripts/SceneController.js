//@input int initialDelaySeconds = 2 {"label":"delay before first scene"}
//@input Component.ScriptComponent[] sceneDataList
//@ui {"widget":"separator"}
//@input Asset.Material bg1
//@input Asset.Material bg2
//@input Component.ScreenTransform trailTransform
//@input Component.ScriptComponent carousel

var currentSceneIndex = 0;
var scenes = [];

function startRevealTween(delayTime) {
	var tweenParams = {
		name: "MaterialRevealTween",
		duration: 2,
		delay: delayTime,
		easing: global.Easings.QuadraticOut,
		onUpdate: function(progress) {
			script.bg1.mainPass.revealRatio = progress*1;
		},
		onComplete: function() {
			script.bg2.mainPass.baseTex = script.bg1.mainPass.baseTex;
			script.bg1.mainPass.revealRatio = 0;
			script.bg2.mainPass.revealRatio = 1;
			script.carousel.enableInteraction()
		}
	};
	var revealTween = new global.CustomTween(tweenParams);
	revealTween.start();
}

function startRevealTweentr(delayTime) {
	var tweenParams = {
		name: "MaterialRevealTween2",
		duration: 2,
		delay: delayTime,
		easing: global.Easings.Bezier,
        bezierPoints: [0.5,0.8],
		onUpdate: function(progress) {
            script.trailTransform.anchors.setCenter(new vec2(-3*progress+2, 2.2*progress-1));
		},
	};
	var revealTween2 = new global.CustomTween(tweenParams);
	revealTween2.start();
}

function initializeScenes() {
    for (var i = 0; i < script.sceneDataList.length; i++) {
        var sceneData = script.sceneDataList[i];
            var config = sceneData.getSceneConfig();
            scenes.push(new global.Scene(config));
    }
}

script.showScene = function(index, initialDelay, prev) {
	var scene = scenes[index];
	if (!scene) return;
	script.bg1.mainPass.baseTex = scene.background;
	scene.show(initialDelay);
};
script.cleanupOldScene = function(index) {
	if (currentSceneIndex !== index) {
		var oldScene = scenes[currentSceneIndex];
		if (oldScene) {
			oldScene.hide();
		}
	}
	currentSceneIndex = index;
};
script.createEvent("OnStartEvent").bind(function() {
	initializeScenes();
	global.ShowHint(0,script.initialDelaySeconds+1)
	let prev = 0;
	script.bg1.mainPass.baseTex = scenes[0].background;
	script.carousel.onSelectionUpdate.add(function (i, tex) {
		script.carousel.disableInteraction();
		script.showScene(i, script.initialDelaySeconds, prev);
		startRevealTween(script.initialDelaySeconds)
		startRevealTweentr(script.initialDelaySeconds)
		script.cleanupOldScene(i);
		if(script.initialDelaySeconds===0)
			global.HideHint(0,0.3)
		script.initialDelaySeconds=0;
		prev = i;
	});
});

