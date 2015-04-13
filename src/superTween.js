/*
 * Super natural's micro Tween Engine
 * http://www.wearesupernatural.com/
 * Based on Robert Penners Easing Equations
 * currently supports down to IE8
 */
 var superTween = {
     fn: {}
 };

//Globals
var glob = {
  	loopTimer: null,
    useCSS: false,
  	availAttr: ['opacity', 'x', 'y', 'scaleY', 'scaleX', 'rotate'] //currently animatable attributes
}



//Variables for a javascript tween
var JSTween = {
    updateRate: 30,
    loopTimer: null,
    curAnims: []
}


/*
 * Runs on script load, determines whether to use CSS of JS transitions
*/
superTween.init = function(){
    domPrefixes = 'Webkit Moz ms O'.split(' ');
    elm = document.createElement('div');

    if( elm.style.transition !== undefined ) { glob.useCSS = true; }
    if( glob.useCSS === false ) {
        feat = "transition";
        featurenameCapital = feat.charAt(0).toUpperCase() + feat.substr(1);
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( elm.style[domPrefixes[i] + featurenameCapital ] !== undefined ) {
                glob.useCSS = true;
              break;
            }
        }
    }
}





/* @param elem: element to be tweened
 * @param time: length of animation
 * @param obj{
 *	 		delay: Dime to delay (in seconds)
 *			onComplete: Function to run after animation completion
 *			onCompleteParams: parameters for the oncomplete function
 *			ease: ease to use for tween
*/
superTween.to = function(elem, time, obj){


//    glob.useCSS = false;


	time = time*1000;
	obj.delay = obj.delay*1000;
    var newTween = superTween.fn.setupTween(elem, time, obj);


/*
   elem.style.msTransformOrigin = '0';
   elem.style.webkitTransformOrigin = '0';
   elem.style.transformOrigin = '0';
*/



    if(glob.useCSS && CSSTween){

        CSSTween.applyCSSTransition(newTween);

    } else {

        JSTween.curAnims.push(newTween);

    	if(!glob.loopTimer){
    		glob.loopTimer = setTimeout(JSTween.tweenLoop, JSTween.updateRate);
    	}
    }
}

/*
 * Kills all active Tweens
*/
superTween.killAll = function(){
    clearTimeout(glob.loopTimer);
    JSTween.curAnims = [];
}


/*
 * Initialises a tween and does the math to work out what does what
*/
superTween.fn.setupTween = function(elem, time, obj){
	if(!obj.ease){obj.ease = 'Sine.easeInOut'}



    var easeEx = obj.ease.split(".");
    var chosenEase = "";

    if(glob.useCSS){
        chosenEase = CSSEase[easeEx[0]][easeEx[1]]
    } else{
        chosenEase = JSEase[easeEx[0]][easeEx[1]]
    }


	var tweenObj = {
		attr: superTween.fn.getAttr(elem, obj),
        rawObj: obj,
        rawTime: time,
        rawDelay:obj.delay,
		d: Math.floor(time/JSTween.updateRate),
		delaySteps: Math.floor(obj.delay/JSTween.updateRate),
		curDel: false,
		t: 0,
		curDelStep: 0,
		elem: elem,
		ease: chosenEase,//obj.ease,
		onComplete: obj.onComplete,
		onCompleteParams: obj.onCompleteParams
	}
	if(tweenObj.delaySteps > 0){
		tweenObj.curDel = true;
	}




	return tweenObj;
}

/*
 * Getting and setting the variables for a new Tween
*/
superTween.fn.getAttr = function(elem, obj){
	var returnVar = [];

	for (var i=0;i<glob.availAttr.length;i++){

		var curSearch = glob.availAttr[i];

		if(obj[curSearch] !== null && obj[curSearch] !== undefined ){

			var newObj = {}
			   	newObj.attr = glob.availAttr[i];
			   	newObj.b = superTween.fn.getPos(elem, newObj.attr, obj[newObj.attr]);
			   	newObj.c = superTween.fn.getTarg(newObj.attr, obj[newObj.attr], newObj.b, elem);

			returnVar.push(newObj);
		}
	}
	return returnVar;
}
superTween.fn.getPos = function(elem, attr, backupVal){

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
superTween.fn.getTarg = function(attr, targ, orig, elem){
	if(attr == 'x' || attr == 'y' || attr == 'opacity' || attr == 'rotate'){
		return targ - orig;
	} else if(attr == 'scaleX'){
		return ((targ * elem.getAttribute('data-startW')-orig))
	} else if (attr == 'scaleY'){
		return ((targ * elem.getAttribute('data-startH')-orig))

	}
}


/*
 * Functions used for JS tweens
*/
JSTween.tweenLoop = function(){
    var anims = JSTween.curAnims;
	for (i = 0; i < anims.length; i++){
		if(!anims[i].curDel){
			for(var j = 0; j < anims[i].attr.length; j++){

				var passObj = {
					t:	anims[i].t,
					d:	anims[i].d,
					b: 	anims[i].attr[j].b,
					c: 	anims[i].attr[j].c //- anims[i].attr[j].b
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
		glob.loopTimer = setTimeout(JSTween.tweenLoop, JSTween.updateRate);
	} else {
		clearTimeout(glob.loopTimer);
		glob.loopTimer = null;
	}
}
JSTween.setPos = function(elem, obj, val){
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
                if(elem.filters.item){
				    elem.filters.item("DXImageTransform.Microsoft.Alpha").opacity = (val*100);
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
    /*	easeIn: function (ob, s) {
    				if (s == undefined) s = 1.70158;
    				return ob.c*(ob.t/=ob.d)*ob.t*((s+1)*ob.t - s) + ob.b;
    			},		//*/
    /*	easeInOut: function (ob, s) {
    				if (s == undefined) s = 1.70158;
    				if ((ob.t/=ob.d/2) < 1) return ob.c/2*(ob.t*ob.t*(((s*=(1.525))+1)*ob.t - s)) + ob.b;
    				return ob.c/2*((ob.t-=2)*ob.t*(((s*=(1.525))+1)*ob.t + s) + 2) + ob.b;
    			}	//*/
    },
    Bounce: {
    /*	easeOut: function (ob) {
    						if ((ob.t/=ob.d) < (1/2.75)) {
    							return ob.c*(7.5625*ob.t*ob.t) + ob.t;
    						} else if (ob.t < (2/2.75)) {
    							return ob.c*(7.5625*(ob.t-=(1.5/2.75))*ob.t + .75) + ob.t;
    						} else if (ob.t < (2.5/2.75)) {
    							return ob.c*(7.5625*(ob.t-=(2.25/2.75))*ob.t + .9375) + ob.t;
    						} else {
    							return ob.c*(7.5625*(ob.t-=(2.625/2.75))*ob.t + .984375) + ob.t;
    						}
    				},		// !NONFUNCTIONAL */
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
