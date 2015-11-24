/*
 * Super natural's micro Tween Engine
 * http://www.wearesupernatural.com/
 * Based on Robert Penners Easing Equations
 * currently supports down to IE8
 */

 /*
 			TO DO
 		- figure out that damn transform origin z-origin bug
 		- strange rotation but difference between CSS and JS
 		- JS override
 */


 var superTween = {
     fn: {},
     delayed: [],
     useCSS: false,
     availAttr: ['opacity', 'x', 'y', 'scaleY', 'scaleX', 'scale', 'rotate', 'width', 'height'] //currently animatable attributes
};


//Variables for a javascript tween
var JSTween = {
    updateRate: 30,
    loopTimer: null,
    curAnims: [],
}


/*
 * Runs on script load, determines whether to use CSS of JS transitions
*/
superTween.init = function(){
    domPrefixes = 'Webkit Moz ms O'.split(' ');
    elem = document.createElement('div');

    if( elem.style.transition !== undefined ) { superTween.useCSS = true; }

    if( superTween.useCSS === false ) {
        featurenameCapital = "Transition";
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( elem.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
                superTween.useCSS = true;
              break;
            }
        }
    }
}

/*
 * Triggers the 360 funtions, a breakdown of params is found in the plugin
*/
superTween.superLoop = function(elem, loops, obj){
  if(superLoop){
    superLoop.runSuperLoop(elem, loops, obj);
  }
}

/*
 * stops a specified 360
*/
superTween.killSuperLoop = function(elem){
    if(superLoop){
        superLoop.killSuperLoop(elem);
    }
}



/**
 * This willl eventually be the delay loop rather than relying on css timer
 * and js loop as then we can have TODO overwrite=true/false functionality
*/
superTween.delayLoop = function(){
  console.log("delayLoop");
}




/**
 * @param elem: element to be tweened
 * @param time: length of animation
 * @param obj{
 *	 		delay: Dime to delay (in seconds)
 *			onComplete: Function to run after animation completion
 *			onCompleteParams: parameters for the oncomplete function
 *			ease: ease to use for tween
*/
superTween.to = function(elem, time, obj){
  //  superTween.useCSS = false;
  if (typeof elem === "object"){
    time = time*1000;
  	obj.delay = obj.delay*1000;

    if (elem.style){
      elem.style.transformOrigin = obj.transformOrigin || "50% 50%";
      elem.style.webkitTransformOrigin = obj.transformOrigin || "50% 50%";
      elem.style.mozTransformOrigin = obj.transformOrigin || "50% 50%";
    }

    var newTween = superTween.fn.setupTween(elem, time, obj);

    //If the CSS plugin is available as well as supported by browser, use CSS
    if(superTween.useCSS && CSSTween){
        CSSTween.applyCSSTransition(newTween);
    } else {

      JSTween.curAnims.push(newTween);

    	if(!JSTween.loopTimer){
        JSTween.loopTimer = setTimeout(JSTween.tweenLoop, JSTween.updateRate);
    	}
    }
  }
}



/**
 * @param arr: an array of elements to be set
 * @param values to be set
*/
superTween.set = function(arr, obj){
	for(var i = 0; i < arr.length; i++){
    for(var effect in obj){
      var e = {attr: effect}
      JSTween.setPos(arr[i], e, obj[effect]);
    }
  }
}


/*
 * Kills all active Tweens
*/
superTween.killAll = function(){
    clearTimeout(JSTween.loopTimer);
    JSTween.curAnims = [];

    for (var anim in CSSTween.curAnims){
        for(var prop in CSSTween.tweenStyles){
            CSSTween.curAnims[anim].elem.style[prop] = null;
        }
    }

    if(superLoop){
        superLoop.killAllSuperLoop()
    }
}


/**
 * Initialises a tween and does the math to work out what does what
 * @param elem: element the tween is acting upon
 * @param time: length of time of tween
 * @param obj: object containing all the tween variables
*/
superTween.fn.setupTween = function(elem, time, obj){
  //set a default ease
	if(!obj.ease){obj.ease = 'Sine.easeInOut'}

  var easeEx = obj.ease.split(".");
  var chosenEase = "";

  if(superTween.useCSS){
      chosenEase = CSSEase[easeEx[0]][easeEx[1]]
  } else{
      chosenEase = JSEase[easeEx[0]][easeEx[1]]
  }


  //make core tween obj, this applise to both CSS and JS
	var tweenObj = {
		attr: superTween.fn.getAttr(elem, obj),           //attribute(s) changing for the element
    elem: elem,                                       //element under question
		ease: chosenEase,                                 //ease to use for the tween

    rawObj: obj,                                      //the raw object called in the timeline (for CSS)
    rawTime: time,                                    //the raw time (for CSS)
    rawDelay:obj.delay,                               //raw delay amt, (for CSS)

    d: Math.floor(time/JSTween.updateRate),           //variable used in penners equations within the JS eases, duration in steps
		delaySteps: Math.floor(obj.delay/JSTween.updateRate), //amount of steps to delay the animation (JS)

    curDel: false,                                    //whether or not the tween is currently affected by a delay
    curDelStep: 0,                                    //current step the delay timer is on

    t: 0,                                             //variable used in penners equations, current step of the tween

		onComplete: obj.onComplete,                       //oncomplete function
		onCompleteParams: obj.onCompleteParams,           //oncomplete function parameters

	}
	if(tweenObj.delaySteps > 0){
		tweenObj.curDel = true;
	}

	return tweenObj;
}

/**
 * Getting and setting the variables for a new Tween
*/
superTween.fn.getAttr = function(elem, obj){
	var returnVar = [];

	for (var i=0;i<superTween.availAttr.length;i++){

		var curSearch = superTween.availAttr[i];
		var newObj = {}
		   	newObj.attr = superTween.availAttr[i];

		if(obj[curSearch] !== null && obj[curSearch] !== undefined ){
			   	newObj.b = superTween.fn.getPos(elem, newObj.attr, obj[newObj.attr]);
			   	newObj.c = superTween.fn.getTarg(newObj.attr, obj[newObj.attr], newObj.b, elem);

			returnVar.push(newObj);
		}
    else {
      if (curSearch === "x" || curSearch === "y" || curSearch === "width" || curSearch === "height"){
        newObj.b = superTween.fn.getTarg(newObj.attr, obj[newObj.attr], 0, elem);
        newObj.c = newObj.b;

  			returnVar.push(newObj);
      }
    }
	}
  // console.log(returnVar)
	return returnVar;
}

/**
 * Gets the current position of whatever attribute is being changed
 *  @param elem: element under question
 *  @param attr: attribute under question
 *  @param backupVal: in case of an unsure value, what to 'default' it with
 */
superTween.fn.getPos = function(elem, attr, backupVal){

	switch(attr){
		case 'x' :
			return elem.offsetLeft;
			break;

		case 'y' :
			return elem.offsetTop;
			break;

		case 'width' :
			return elem.offsetWidth;
			break;

		case 'height' :
			return elem.offsetHeight;
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
			}
      else {
				if(backupVal > 0){return 0}
							else {return 1}
			}
			break;
		case 'rotate' :
			if('getComputedStyle' in  window){
				var st =  window.getComputedStyle(elem, null);
				var tr = st.getPropertyValue("-webkit-transform") ||
				         st.getPropertyValue("-moz-transform") ||
				         st.getPropertyValue("-ms-transform") ||
				         st.getPropertyValue("-o-transform") ||
				         st.getPropertyValue("transform")

				//console.log(tr)
				if (tr == 'none' || !tr){
					 return 0;
				} else {
					var values = tr.split('(')[1].split(')')[0].split(',');
					var a = values[0];
					var b = values[1];
					var c = values[2];
					var d = values[3];
					var scale = Math.sqrt(a*a + b*b);
					var sin = b/scale;
					var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

					return angle;
				}

			} else {
				if(backupVal > 0){return 0}
							else {return 180}
			}
			break;

		default:
			//App.log("!! ATTRIBUTE NOT RECOGNISED "+attr+" !!")
			break
	}
}

/**
 * returns the amount of change an element will undergo in the specified attribute
 *  @param attr: attribute under question
 *  @param targ: the end value of the tween
 *  @param orig: the origional attribute value
 *  @param elem: element under question
 */
superTween.fn.getTarg = function(attr, targ, orig, elem){
	if(attr == 'x' || attr == 'y' || attr == 'opacity' || attr == 'rotate' || attr == 'width' || attr == 'height'){
		return targ - orig;
	} else if(attr == 'scaleX'){
		return ((targ * elem.getAttribute('data-startW')-orig))
	} else if (attr == 'scaleY'){
		return ((targ * elem.getAttribute('data-startH')-orig))
	}
}


/**
 * The 'onUpdate' loop run if it it a JS tween
*/
JSTween.tweenLoop = function(){
  var anims = JSTween.curAnims;
	for (i = 0; i < anims.length; i++){
		if(!anims[i].curDel){
      if (anims[i].elem.style){
        anims[i].elem.style.transformOrigin = anims[i].transformOrigin;
        anims[i].elem.style.webkitTransformOrigin = anims[i].transformOrigin;
        anims[i].elem.style.MozTransformOrigin = anims[i].transformOrigin;
      }
			for(var j = 0; j < anims[i].attr.length; j++){

				var passObj = {
					t:	anims[i].t,
					d:	anims[i].d,
					b: 	anims[i].attr[j].b,
					c: 	anims[i].attr[j].c
				}

				var newVal = anims[i].ease(passObj);
        JSTween.setPos(anims[i].elem, anims[i].attr[j], newVal);
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
        JSTween.loopTimer = setTimeout(JSTween.tweenLoop, JSTween.updateRate);
	} else {
		clearTimeout(JSTween.loopTimer);
        JSTween.loopTimer = null;
	}
}

/**
 * Sets the new value for a given attribute
 *  @param elem: element under question
 *  @param obj: object containing tween vars
 *  @param val: value to change attribute to
*/
JSTween.setPos = function(elem, obj, val){
	switch(obj.attr){
		case 'x' :
			elem.style.left = val + "px";
			break;

		case 'y' :
			elem.style.top = val + "px";
			break;

		case 'width' :
			elem.style.width = val + "px";
			break;

		case 'height' :
			elem.style.height = val + "px";
			break;

		case 'scaleX' :
			elem.style.width = val + "px";
			break;

		case 'scaleY' :
			elem.style.height = val + "px"
			break;

		case 'opacity' :
			elem.style.opacity = val + "";

			//IE8 Opacity fix
			if ('filters' in elem){
                if(elem.filters.item){
				    //elem.filters.item("DXImageTransform.Microsoft.Alpha").opacity = (val*100);
			    }
            }
			break;

		case 'rotate' :
			elem.style.webkitTransform = 'rotate('+val+'deg)';
			elem.style.mozTransform    = 'rotate('+val+'deg)';
			elem.style.msTransform     = 'rotate('+val+'deg)';
			elem.style.oTransform      = 'rotate('+val+'deg)';
			elem.style.transform       = 'rotate('+val+'deg)';

			break;

    case 'display' :
      elem.style.display = val;
      break;
	}
}


superTween.init();


/******************
 * EASES (only uncomment the ones you use)
 *
 *	t = time (current step)
 *  b = initial position/state
 *	d = duration (total steps)
 *  c = change in position/state
 *
********************/
var JSEase = {
    Expo: {
    /*	easeIn: function(ob) {
    	   			return ob.c * Math.pow(2, 10 * (ob.t / ob.d - 1)) + ob.b;
    			},			//*/
    /*	easeOut: function(ob) {
    	   			return ob.c * (-Math.pow(2, -10 * ob.t / ob.d) + 1) + ob.b;
    			},		//*/
    /*	easeInOut: function(ob) {
    		if ((ob.t /= ob.d / 2) < 1) {
    	        return ob.c / 2 * Math.pow(2, 10 * (ob.t - 1)) + ob.b;
    	    }
    	    return ob.c / 2 * (-Math.pow(2, -10 * --ob.t) + 2) + ob.b;

    	},		// !NONFUNCTIONAL */
    },
    Quint: {
    /*	easeIn: function(ob) {
    	    		return ob.c * Math.pow (ob.t / ob.d, 5) + ob.b;
    			},			//*/
    /*	easeOut: function(ob) {
    	    		return ob.c * (Math.pow(ob.t / ob.d - 1, 5) + 1) + ob.b;
    			},		//*/
    /*	easeInOut: function(ob) {
    		if ((ob.t /= ob.d / 2) < 1) {
    	        return ob.c / 2 * Math.pow(ob.t, 5) + ob.b;
    	    }
    	    return ob.c / 2 * (Math.pow(ob.t - 2, 5) + 2) + ob.b;
    	},		// !NONFUNCTIONAL */
    },
    Quart: {
    /*	easeIn: function(ob) {
    	    		return ob.c * Math.pow (ob.t / ob.d, 4) + ob.b;
    			},			//*/
    /*	easeOut: function(ob) {
    	    		return -ob.c * (Math.pow(ob.t / ob.d - 1, 4) - 1) + ob.b;
    			},		//*/
    /*	easeInOut: function(ob) {
    		if ((ob.t /= ob.d / 2) < 1) {
    	        return ob.c / 2 * Math.pow(ob.t, 4) + ob.b;
    	    }
    	    return -ob.c / 2 * (Math.pow(ob.t - 2, 4) - 2) + ob.b;
    	},		// !NONFUNCTIONAL */
    },
    Cubic: {
    /*	easeIn: function(ob) {
    				return ob.c * Math.pow(ob.t / ob.d, 3) + ob.b;
    			},			//*/
    /*	easeOut: function(ob) {
    				return ob.c * (Math.pow(ob.t / ob.d - 1, 3) + 1) + ob.b;
    			},		//*/
    /*	easeInOut: function(ob) {
    		if ((ob.t /= ob.d / 2) < 1) {
    	        return ob.c / 2 * Math.pow(ob.t, 3) + ob.b;
    	    }
    	    return ob.c / 2 * (Math.pow(ob.t - 2, 3) + 2) + ob.b;
    	},		// !NONFUNCTIONAL */
    },
    Linear: {
    	easeNone: function(ob) {
    			    return ob.c * ob.t / ob.d + ob.b;
    			},		//*/
    },
    Sine: {
    	easeIn: function(ob) {
    			    return ob.c * (1 - Math.cos(ob.t / ob.d * (Math.PI / 2))) + ob.b;
    			},			//*/
    	easeOut: function(ob) {
    			    return ob.c * Math.sin(ob.t / ob.d * (Math.PI / 2)) + ob.b;
    			},		//*/
    	easeInOut: function(ob) {
    			    return ob.c / 2 * (1 - Math.cos(Math.PI * ob.t / ob.d)) + ob.b;
    			},		//*/
    },
    Elastic: {
    /*	easeOut: function (ob) {
    				var a = 1;
    				var p = 15;
    				if (ob.t==0) return ob.b;  if ((ob.t/=ob.d)==1) return ob.b+ob.c;  if (!p) p=ob.d*.3;
    				if (a < Math.abs(ob.c)) { a=ob.c; var s=p/4; }
    				else var s = p/(2*Math.PI) * Math.asin (ob.c/a);
    				return a*Math.pow(2,-10*ob.t) * Math.sin( (ob.t*ob.d-s)*(2*Math.PI)/p ) + ob.c + ob.b;
    			},		//*/
    /*	easeIn: function (ob) {
    		var a = 1;
    		var p = 15;
    		if (ob.t==0) return ob.b;  if ((ob.t/=ob.d)==1) return ob.b+ob.c;  if (!p) p=ob.d*.3;
    		if (a < Math.abs(ob.c)) { a=ob.c; var s=p/4; }
    		else var s = p/(2*Math.PI) * Math.asin (ob.c/a);
    		return -(a*Math.pow(2,10*(ob.t-=1)) * Math.sin( (ob.t*ob.d-s)*(2*Math.PI)/p )) + ob.b;
    	},		//*/
    /*	easeInOut: function (ob) {
    		var a = 1;
    		var p = 15;
    		if (ob.t==0) return ob.b;  if ((ob.t/=ob.d/2)==2) return ob.b+ob.c;  if (!p) p=ob.d*(.3*1.5);
    		if (a < Math.abs(ob.c)) { a=ob.c; var s=p/4; }
    		else var s = p/(2*Math.PI) * Math.asin (ob.c/a);
    		if (ob.t < 1) return -.5*(a*Math.pow(2,10*(ob.t-=1)) * Math.sin( (ob.t*ob.d-s)*(2*Math.PI)/p )) + ob.b;
    		return a*Math.pow(2,-10*(ob.t-=1)) * Math.sin( (ob.t*ob.d-s)*(2*Math.PI)/p )*.5 + ob.c + ob.b;
    	}		//*/
    },
    Back: {
    	easeOut: function (ob, s) {
    				if (s == undefined) s = 1.70158;
    				return ob.c*((ob.t=ob.t/ob.d-1)*ob.t*((s+1)*ob.t + s) + 1) + ob.b;
    			},	//*/
    	easeIn: function (ob, s) {
    				if (s == undefined) s = 1.70158;
    				return ob.c*(ob.t/=ob.d)*ob.t*((s+1)*ob.t - s) + ob.b;
    			},		//*/
    	easeInOut: function (ob, s) {
    				if (s == undefined) s = 1.70158;
    				if ((ob.t/=ob.d/2) < 1) return ob.c/2*(ob.t*ob.t*(((s*=(1.525))+1)*ob.t - s)) + ob.b;
    				return ob.c/2*((ob.t-=2)*ob.t*(((s*=(1.525))+1)*ob.t + s) + 2) + ob.b;
    			}	//*/
    },
    Bounce: {
    	easeOut: function (ob) {
    		if ((ob.t/=ob.d) < (1/2.75)) {
    			return ob.c*(7.5625*ob.t*ob.t) + ob.b;
    		} else if (ob.t < (2/2.75)) {
    			return ob.c*(7.5625*(ob.t-=(1.5/2.75))*ob.t + .75) + ob.b;
    		} else if (ob.t < (2.5/2.75)) {
    			return ob.c*(7.5625*(ob.t-=(2.25/2.75))*ob.t + .9375) + ob.b;
    		} else {
    			return ob.c*(7.5625*(ob.t-=(2.625/2.75))*ob.t + .984375) + ob.b;
    		}
    	},
    /*	easeInOut: function (ob) {
    						var newVar2 = {t: ob.t*2, b: 0, c: ob.c, d: ob.d}
    						if (ob.t < ob.d/2) return Bounce.easeOut(newVar2) * .5 + ob.t;
    						var newVar = {t: ob.t*2-ob.d, b: 0, c: ob.c, d: ob.d};
    						return Bounce.easeOut(newVar) * .5 + ob.c*.5 + ob.t;
    				},		// !NONFUNCTIONAL */
    /*	easeIn: function (ob) {
    						var newVar = {t: ob.t-ob.t, b: 0, c: ob.c, d: ob.d}
    						return ob.c - Bounce.easeOut(newVar) + ob.t;
    				},		// !NONFUNCTIONAL */
    },	// !NONFUNCTIONAL
    Quad: {
    /*	easeIn: function(ob) {
    			    return ob.c * (ob.t /= ob.d) * ob.t + ob.b;
    			}			// !NONFUNCTIONAL */
    /*	easeOut: function(ob) {
    			    return -ob.c * (ob.t /= ob.d) * (ob.t - 2) + ob.b;
    			}			// !NONFUNCTIONAL */
    /*	easeInOut: function(ob) {
    			if ((ob.t /= ob.d / 2) < 1) {
    		        return ob.c / 2 * ob.t * ob.t + ob.b;
    		    }
    			return -ob.c / 2 * ((--ob.t) * (ob.t - 2) - 1) + ob.b;
    			}		// !NONFUNCTIONAL */
    },	// !NONFUNCTIONAL
    Circ: {
    /*	easeIn: function(ob) {
    			    return ob.c * (1 - Math.sqrt(1 - (ob.t /= ob.d) * ob.t)) + ob.b;
    			}			// !NONFUNCTIONAL */
    /*	easeOut: function(ob) {
    			    return ob.c * Math.sqrt(1 - (ob.t = ob.t / ob.d - 1) * ob.t) + ob.b;
    			}			// !NONFUNCTIONAL */
    /*	easeInOut: function(ob) {
    				if ((ob.t /= ob.d / 2) < 1) {
    			        return ob.c / 2 * (1 - Math.sqrt(1 - ob.t * ob.t)) + ob.b;
    			    }
    			    return ob.c / 2 * (Math.sqrt(1 - (ob.t -= 2) * ob.t) + 1) + ob.b;

    			}		// !NONFUNCTIONAL */
    }	// !NONFUNCTIONAL
}
