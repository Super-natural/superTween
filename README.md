# superTween
A very small tweening engine for those teeny tiny projects (minified with 5 tween ease options is 9kb).

It was initially built for animation within projects with incredibly tight file restrictions.

#Quick start
- 1) include build/superTween.js OR build/superTween.min.js in your html
- 2) call JavaScript function in your script:

example:
```
	// get a dom element
	var tweenMe = document.getElementById('elementToAnimate);

	// to run a complicated tween
	superTween.to(tweenMe, 4, {
		x: 300,
		y:500,
		scaleY: 0.5,
		scaleX: 2,
		rotate: 45,
		opacity: 0.5,
		ease: 'Linear.easeNone',
		transformOrigin: "center center"
		delay: 2,
		onComplete: animationCompleteFunction,
		onCompleteParams: ['stringToPassToFunction', 'anotherString']
	});

	// or a more basic version:
	superTween.to(tweenMe, 4, {
		x: 300,
		y: 500,
	});

	// to run a 360
	superTween.run360(tweenMe, "infinite", {numSteps: 45, stepSize: 161, interval: 50})
```

This relies on the DOM object being absolutely positioned and runs off offsetLeft and offsetRight.
Currently there is some lag on slower machines and a few mobile devices when trying to tween a large amount of objects,
specifically if changing object opacity.


# Some Background
The superTween library attempts to initially use CSS Transitions to achieve the required tween, first checking to see if
CSS transition is available. If not available there is a JS fallback for every tween. The tween eases are all based on
Robert Penner's easing equations.

# Public Functions
	superTween.to(elem, time, parameters);
	superTween.killAll();
	superTween.run360(elem, loops, parameters);
	superTween.kill360(elem);

## superTween.to
Starts a tween with the given parameters as detailed below:
```
	superTween.to(
		elem,              				//DOM element to animate
		1,                	 			//Length of animation (in seconds)
		{
			opacity: Number,                        //target alpha
			x: Number,                              //distance to move on x axis (in pixels)
			y: Number,                              //distance to move on y axis (in pixels)
			scaleX: Number,                         //X Scale
			scaleY: Number,                         //Y Scale
			delay: Number,                          //Animation delay (in seconds)
			transformOrigin: String,								//What point to animate from
			ease: String,         			//ease to use
			onComplete: Function,    		//function called on complete
			onCompleteParams: Array,        	//paramenters to pass to completion function
		});
```

## superTween.killAll
Stops all animation currently being handled by superTween

## superTween.set
Instantly sets an array of elements to a value
This has an addition variable "display" which will set the display of an element to whatever you input
```
App.superTween.set([elemW, elemX, elemY],	{x: 500, y: 500, display: "block"});
```
##superTween.run360
Runs a 360 animation (see below for more)

##superTween.kill360
Kills a 360 on the given element

# A look at 360s
These are a custom fix to create more engaging videos on devices that do not allow autoplaying video. It requires a spritesheet of frames stitched together vertically. The superTween command that launches one of these incrementally jumps the image a set distance on a specified interval allowing a short preview of a video the be autoplayed and looped for a more engaging experience.
The object parameters are as follows:
```
	superTween.run360(
		elem:HTMLElement, 		//html element containing image as bg image
		loops:Number, 			//number of loops or 'infinite'
		{
			numSteps:Number,	//how many frames are in the loop
			stepSize:Number, 	//frame height (in px)
			interval:Number,	//time between jumps (in ms, typically 70-120)
			direction:String,	//(PROTOTYPE) whether to scroll image up/down or left/right
		});
```
# A note on eases
The library includes most of Robert Penner's easing equations, and part of the library's small size comes from being able to only include eases that are used in the project (though this is a manual process).

- "yes" = immediately available on download
- "maybe" = available, but needs to be manually enabled
- "-" = not currently functional, will get round to it as and when

Ease  | .easeIn | .easeOut | .easeInOut| .easeNone
----- | --------| --------| --------| --------|
Linear  | -	| -	| -	| yes
Sine  |  yes	| yes	| yes	| -
Back  |  maybe	| yes	| maybe	| -
Expo  |  maybe	| maybe	| -	| -
Quint  |  maybe	| maybe	| -	| -
Quart  | maybe	| maybe	| -	| -
Cubic  |  maybe	| maybe	| -	| -

# Known Bugs
On IE (9 and below) when working with sub-values of opacity (between but not including 1 and 0) It will quickly flick to the opposite value before tweening. This is due to it having no support for getComputedStyle

Rotate will behave differently on different browsers. usually staying with shortest-possible-route. This is on the to-update list

Overwriting or doing multiple tweens on an element currently confuse it mightily, this is also on the update list

If a unit is scaled, and then a separate tween is applied that doesn't include the scale property, it will revert back to its original size. also on the update list
