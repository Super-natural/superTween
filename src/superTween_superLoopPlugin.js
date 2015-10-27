var superLoop = {
	config: {
		superLoopTimers: {}
	}
}


/**
 * Triggers the 360 event
 *
 * @param {HTMLElement} elem The HTML element on which the tween is being used
 * @param {Number} loops Amount of times to loop the 360
 * @param {Object} obj Variables to define the 360: imgOffset, numSteps, interval, bgOffset(optional, default 0), direction(optional, default vertical)
 */
superLoop.runSuperLoop = function(elem, loops, obj){

	//superTween.runSuperLoop(thisElem, infinite, {numSteps: 45, stepSize: 170, interval: 150, bgOffset: null})

	var curLoop = 1;
	var curStep = 1;
	if(obj.bgOffset == null){obj.bgOffset = 0};

	superLoop.config.superLoopTimers[elem.id] = window.setInterval(function(){
		if (obj.direction == "horizontal"){
			elem.style.backgroundPosition =  (-(obj.stepSize*curStep)) + "px "+obj.bgOffset+"px";
		}
		else {
			elem.style.backgroundPosition =  obj.bgOffset+" " + (-(obj.stepSize*curStep)) + "px";
		}
		curStep++;

		if (curStep == obj.numSteps){
			if (loops == "infinite"){
				elem.style.backgroundPositionX =  0 + "px";
				elem.style.backgroundPositionY =  0 + "px";
				curStep = 1;
			} else if (loops > curLoop){
				elem.style.backgroundPositionX =  0 + "px";
				elem.style.backgroundPositionY =  0 + "px";
				curStep = 1;
				curLoop ++
			} else {
				window.clearInterval(superLoop.config.superLoopTimers[elem.id]);

				if(obj.onComplete){
					var func = obj.onComplete;
					var vars = obj.onCompleteParams;
				}

				if(func){
					func.apply(this, vars);
				}
			}
		}
	}, obj.interval)
}


/*
 * stops a 360 animation on a certain element
 *
 * @param element An html element to remove the 360 background animation from
 */

superLoop.killSuperLoop = function(element){
	element.style.backgroundPositionY =  0 + "px";
	element.style.backgroundPositionX =  0 + "px";
	window.clearInterval(superLoop.config.superLoopTimers[element.id]);
}


/*
 * stops a 360 animation on a certain element
 *
 * @param element An html element to remove the 360 background animation from
 */

superLoop.killAllSuperLoop = function(){
	for(var thisTime in superLoop.config.superLoopTimers){
		document.getElementById(thisTime).style.backgroundPositionY =  0 + "px";
		window.clearInterval(superLoop.config.superLoopTimers[thisTime]);
	}
}
