//@ui {"widget":"separator"}
//@input Asset.Texture oneBackground
//@ui {"widget":"separator"}
//@input Asset.Texture twoBackground
//@ui {"widget":"separator"}
//@input Asset.Texture threeBackground
//@ui {"widget":"separator"}
//@input Asset.Texture fourBackground
//@ui {"widget":"separator"}

//@input Asset.Material bg1
//@input Asset.Material bg2
//@input Component.ScreenTransform trailTransform
//@input Component.ScriptComponent carousel

var currentSceneIndex = 0;
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
		onComplete: function() {

		}
	};
	var revealTween2 = new global.CustomTween(tweenParams);
	revealTween2.start();
}

function startShowElementTween(elementPass,delayTime) {
    var tweenParams = {
        name: "ShowElementTween",
        duration: 0.8,
        delay: delayTime,
        easing: global.Easings.QuadraticOut,
		onStart: function() {
			elementPass.invertReveal = true;
		},
        onUpdate: function(progress) {
            elementPass.revealRatio = progress;
        },
    };
    revealTween = new global.CustomTween(tweenParams);
    revealTween.start();
}
function startHideElementTween(elementPass,delayTime) {
    var tweenParams = {
        name: "HideElementTween",
        duration: 0.8,
        delay: delayTime,
        easing: global.Easings.QuadraticOut,
		onStart: function() {
			elementPass.invertReveal = false;
		},
        onUpdate: function(progress) {
            elementPass.revealRatio = 1-progress;
        },
    };
    revealTween = new global.CustomTween(tweenParams);
    revealTween.start();
}

var myScene = new global.Scene({background: script.oneBackground, elements: script.oneElements,});
var myScene2 = new global.Scene({
    //elementsBehavior: script.oneElementsBehavior,
    background: script.twoBackground,
});
var myScene3 = new global.Scene({background: script.threeBackground});
var myScene4 = new global.Scene({background: script.fourBackground});


script.showScene = function(index, initialDelay, prev) {
	if (index === 0) {
		if(prev !==0 )
		//global.FadeOutAudio(prev);
		//global.FadeInAudio(0);
		script.bg1.mainPass.baseTex = myScene.background;
	} 
	else if (index === 1) {
		//global.FadeOutAudio(prev);
		//global.FadeInAudio(1);
		script.bg1.mainPass.baseTex = myScene2.background;
	} 
	else if (index === 2) {
		//global.FadeOutAudio(prev);
		//global.FadeInAudio(2);

		script.bg1.mainPass.baseTex = myScene3.background;
	}
	else if (index === 3) {
		//global.FadeOutAudio(prev);
		//global.FadeInAudio(3);
		script.bg1.mainPass.baseTex = myScene4.background;
	}
};
script.cleanupOldScene = function(index) {
	if(currentSceneIndex === 0 && index !== 0)
	{
	}
	else if(currentSceneIndex === 1 && index !== 1) {
	}
	else if(currentSceneIndex === 2 && index !== 2) {
	}
	else if(currentSceneIndex === 3 && index !== 3) {
	}
	currentSceneIndex = index;
};
script.createEvent("OnStartEvent").bind(function() {
	global.ShowHint(0,3)
	let delay = 2;
	let prev = 0;
	script.bg1.mainPass.baseTex = myScene.background;
	script.carousel.onSelectionUpdate.add(function (i, tex) {
		script.carousel.disableInteraction();
		script.showScene(i, delay, prev);
		startRevealTween(delay)
		startRevealTweentr(delay)
		script.cleanupOldScene(i);
		if(delay==0)
			global.HideHint(0,1)
		delay=0;
		prev = i;
	});
});

