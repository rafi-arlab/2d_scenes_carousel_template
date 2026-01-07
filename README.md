Project: 2D Scenes Carousel Template
=====================================
files overview:
- SceneController.js : detects carousel changes -> calls hide and show functions from Scene.js also includes tweens for bg switch and trail.
- Scene.js : creates an instance of the Scene class for each scene, handles element tweens (rotation, float, reveal)
- SceneData.js : if you want to make a new scene add another SceneData component to the ScenesList object and make sure to also include it in the SceneDataList of SceneController.js. in the inputs of SceneData you can add elements and give them tweens.
Inspector inputs 
- **SceneData.js** : 
    - `background` (type: `Texture`) — just the background of the scene
    - `elements` (type: `Material[]`) — mats for each element, to be used in reveal tween.
        make sure the materials of the elements have the reveal image shader :)
        linear reveal, down
    - `elementTimings` (type: `vec2[]`) — used for show/hide reveal tweens
      - x = delay before reveal; y = reveal duration
    
    - `elementTransforms` (type: `Component.ScreenTransform[]`)
      - Assign the transform component of an element, to be used for rotation/float.
    
    - `elementBehaviors` (type: `vec2[]`)
      - x = rotationEnabled (1 = on, 0 = off)
      - y = floatingEnabled (1 = on, 0 = off)
      - Example: to enable rotation for item 0 and floating for item 1 set:
        - elementBehaviors[0] = (1,0)
        - elementBehaviors[1] = (0,1)
    
    - `elementRotationParams` (type: `vec4[]`)
      - Interpreted differently depending on whether the element has rotation or floating tween:
        - Rotation: x = startDeg, y = endDeg, z = duration (s), w = initDelay (s)
        - Floating: x = downOffset, y = upOffset, z = duration (s), w = initDelay (s)
        use the initial delays to sync the start of the tween with its reveal, if needed.
          - Offsets are relative to the element's original Y position.
      - Example (rotation): `( -10, 10, 2.0, 0.1 )` → start at -10°, swing to +10°, 2s cycle, 0.1s delay
      - Example (float): `( -0.15, 0.12, 1.5, 0.0 )` → go down 0.15 units and up 0.12 units, 1.5s cycle
- **Scene.js** : 
    - inputs are just the mats of the 2 screen images i use to transition the bgs, you  probably won't need to edit this.
- **SceneController.js** :
    -`initialDelaySeconds` delay before the first scene appears
    -`sceneDataList` a list of the SceneData components, one for each scene
    -`bezierpoints` and `bgSwitchDuration` in case you need to change how fast the scenes transition. changing this might make the trail out of sync so edit the bezier points to sync it.

for music just edit the audios like we usually do in the template, if you need only one song for the whole lens edit that in SceneController.js