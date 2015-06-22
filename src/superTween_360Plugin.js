var super360 = {
	config: {
		timers360: {}
	}
}


/**
 * Triggers the 360 event
 *
 * @param {HTMLElement} elem The HTML element on which the tween is being used
 * @param {Number} loops Amount of times to loop the 360
 * @param {Object} obj Variables to define the 360: imgOffset, numSteps, interval, bgOffset(optional, default 0), direction(optional, default vertical)
 */
super360.run360 = function(elem, loops, obj){

	//superTween.run360(thisElem, infinite, {numSteps: 45, stepSize: 170, interval: 150, bgOffset: null})

	var curLoop = 1;
	var curStep = 1;
	if(obj.bgOffset == null){obj.bgOffset = 0};

	super360.config.timers360[elem.id] = window.setInterval(function(){
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
				window.clearInterval(super360.config.timers360[elem.id]);
			}
		}
	}, obj.interval)
}


/*
 * stops a 360 animation on a certain element
 *
 * @param element An html element to remove the 360 background animation from
 */

super360.kill360 = function(element){
	element.style.backgroundPositionY =  0 + "px";
	window.clearInterval(super360.config.timers360[element.id]);
}


/*
 * stops a 360 animation on a certain element
 *
 * @param element An html element to remove the 360 background animation from
 */

super360.killAll360 = function(){
	for(var thisTime in super360.config.timers360){
		document.getElementById(thisTime).style.backgroundPositionY =  0 + "px";
		window.clearInterval(super360.config.timers360[thisTime]);
	}
}
