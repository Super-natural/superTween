/*
 * Super natural's Tween Engine
 * http://www.wearesupernatural.com/
 * Based on Robert Penners Easing functions
 * currently supports down to IE8
 */

var Ad = Ad || {};
	Ad.superTween = Ad.superTween || {};

var glob = {
  	updateRate: 30,
  	loopTimer: null,
  	availAttr: ['opacity', 'x', 'y', 'scaleY', 'scaleX'] //currently animatable attributes
}
var anims = [];


/* @param elem: element to be tweened
 * @param time: length of animation
 * @param obj{
 *	 		delay: Dime to delay (in seconds)
 *			onComplete: Function to run after animation completion
 *			onCompleteParams: parameters for the oncomplete function
 *			ease: ease to use for tween
*/
Ad.superTween = function(elem, time, obj){


	time = time*1000;
	obj.delay = obj.delay*1000;

	anims.push(setupTween(elem, time, obj));

	if(!glob.loopTimer){
		if (Ad.config.adRunning){
			glob.loopTimer = setTimeout(tweenLoop, glob.updateRate);
		}
	}
}

/*
 * Triggered every increment
*/
function tweenLoop(){
	for (i = 0; i < anims.length; i++){
		if(!anims[i].curDel){
			for(var j = 0; j < anims[i].attr.length; j++){

				var passObj = {
					t:	anims[i].t,
					d:	anims[i].d,
					b: 	anims[i].attr[j].b,
					c: 	anims[i].attr[j].c
				}
				var newVal = anims[i].ease(passObj);

				setPos(anims[i].elem, anims[i].attr[j], newVal);
			}

			anims[i].t ++;

			//if reached the end then remove
			if (anims[i].t > anims[i].d){

				if(anims[i].onComplete){
					var func = anims[i].onComplete;
					var vars = anims[i].onCompleteParams;
				}
				anims.splice(i, 1);

				if(func){
					func.apply(this, vars);
				}
			}
		} else {
			//There is a delay
			anims[i].curDelStep ++;

			if (anims[i].curDelStep > anims[i].delaySteps){
				anims[i].curDel = false;
			}

		}
	}
	if(anims.length != 0){
		glob.loopTimer = setTimeout(tweenLoop, glob.updateRate);
	} else {
		clearTimeout(glob.loopTimer);
		glob.loopTimer = null;
		//App.log("All animation complete")
	}
}

/*
 * Initialises a tween and does the math to work out what does what
*/
function setupTween(elem, time, obj){
	if(!obj.ease){obj.ease = Sine.easeInOut}

	var tweenObj = {
		attr: getAttr(elem, obj),
		d: Math.floor(time/glob.updateRate),
		delaySteps: Math.floor(obj.delay/glob.updateRate),
		curDel: false,
		t: 0,
		curDelStep: 0,
		elem: elem,
		ease: obj.ease,
		onComplete: obj.onComplete,
		onCompleteParams: obj.onCompleteParams
	}
	if(tweenObj.delaySteps > 0){
		tweenObj.curDel = true;
	}

	return tweenObj;
}

/*
 * Getting and setting the variables
*/
function getAttr(elem, obj){
	var returnVar = [];

	for (var i=0;i<glob.availAttr.length;i++){

		var curSearch = glob.availAttr[i];

		if(obj[curSearch] !== null && obj[curSearch] !== undefined ){

			var newObj = {}
			   	newObj.attr = glob.availAttr[i];
			   	newObj.b = getPos(elem, newObj.attr, obj[newObj.attr]);
			   	newObj.c = getTarg(newObj.attr, obj[newObj.attr], newObj.b, elem);

			returnVar.push(newObj);
		}
	}
	return returnVar;
}
function getPos(elem, attr, backupVal){

	switch(attr){
		case 'x' :
			return elem.offsetLeft;
			break;

		case 'y' :
			return elem.offsetTop;
			break;

		case 'scaleX' :
			var sW = elem.getAttribute('data-startW');
			var w = elem.offsetWidth;
			elem.setAttribute('data-prevW', w);
			if(!sW){ elem.setAttribute('data-startW', w); }
			return w;
			break;

		case 'scaleY' :
			var sH = elem.getAttribute('data-startH');
			var h = elem.offsetHeight;
			elem.setAttribute('data-prevH', h);
			if(!sH){ elem.setAttribute('data-startH', h); }
			return h;
			break;

		case 'opacity' :
			if('getComputedStyle' in  window){
				return parseInt(window.getComputedStyle(elem, null).getPropertyValue("opacity"));
			} else {
				if(backupVal > 0){return 0}
							else {return 1}
			}
			break;

		default:
			//App.log("!! ATTRIBUTE NOT RECOGNISED "+attr+" !!")
			break
	}
}
function setPos(elem, obj, val){
	switch(obj.attr){
		case 'x' :
			elem.style.left = val + "px";
			break;

		case 'y' :
			elem.style.top = val + "px";
			break;

		case 'scaleX' :
			elem.style.width = val + "px";
			break;

		case 'scaleY' :
			elem.style.height = val + "px"
			break;

		case 'opacity' :
			elem.style.opacity = val;

			//IE8 Opacity fix
			if ('filters' in elem){
				elem.filters.item("DXImageTransform.Microsoft.Alpha").opacity = (val*100);
			}
			break;
	}
}
function getTarg(attr, targ, orig, elem){
	if(attr == 'x' || attr == 'y' || attr == 'opacity'){
		return targ - orig;
	} else if(attr == 'scaleX'){
		return (targ * elem.getAttribute('data-startW')) - orig;
	} else if (attr == 'scaleY'){
		return (targ * elem.getAttribute('data-startH')) - orig;
	}
}
