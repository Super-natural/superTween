/*
 * RUNS THE SUPER 360
 *
 * @param elem: An html element to apply 360 background animation to
 * @param loops:  number of loops or 'infinite'
 * @param obj: {
 * 			numSteps: Total number of steps to complete loop
 *			stepSize: distance to 'step'
 *			interval: speed at which to step
 *			bgOffset(optional): if image is offset (for centering larger 360s into smaller image)
 *		}
 */
/*
var superTween = superTween || {}
	superTween.config = superTween.config || {}
	superTween.config.timers360 = {}
*/

var super360 = {
	config: {
		timers360: {}
	}
}


//superTween.run360 = function(element, imgOffset, numSteps, interval, infiniteLoop, bgOffset){
super360.run360 = function(elem, loops, obj){

	//superTween.run360(thisElem, infinite, {numSteps: 45, stepSize: 170, interval: 150, bgOffset: null})

	var curLoop = 1;
	var curStep = 1;
	if(obj.bgOffset == null){obj.bgOffset = 0};

	super360.config.timers360[elem.id] = window.setInterval(function(){
		elem.style.backgroundPosition =  obj.bgOffset+" " + (-(obj.stepSize*curStep)) + "px";
		curStep++;

		if (curStep == obj.numSteps){
			if (loops == "infinite"){
				elem.style.backgroundPositionY =  0 + "px";
				curStep = 1;
			} else if (loops > curLoop){
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
