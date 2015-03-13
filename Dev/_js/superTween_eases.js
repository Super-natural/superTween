

/******************
 * EASES (only uncomment the ones you use)	
 *
 *	t = time (current step)
 *  b = initial position/state
 *	d = duration (total steps)
 *  c = change in position/state
 *  
********************/
var Expo = {
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
}
var Quint = {
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
}
var Quart = {
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
}
var Cubic = {
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
}
var Linear = {
/*	easeNone: function(ob) {
			    return ob.c * ob.t / ob.d + ob.b;
			},		//*/
}
var Sine = {
/*	easeIn: function(ob) {
			    return ob.c * (1 - Math.cos(ob.t / ob.d * (Math.PI / 2))) + ob.b;
			},			//*/
/*	easeOut: function(ob) {
			    return ob.c * Math.sin(ob.t / ob.d * (Math.PI / 2)) + ob.b;
			},		//*/
	easeInOut: function(ob) {
			    return ob.c / 2 * (1 - Math.cos(Math.PI * ob.t / ob.d)) + ob.b;
			},		//*/
}
var Elastic = {
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
	easeInOut: function (ob) {
		var a = 1;
		var p = 15;
		if (ob.t==0) return ob.b;  if ((ob.t/=ob.d/2)==2) return ob.b+ob.c;  if (!p) p=ob.d*(.3*1.5);
		if (a < Math.abs(ob.c)) { a=ob.c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (ob.c/a);
		if (ob.t < 1) return -.5*(a*Math.pow(2,10*(ob.t-=1)) * Math.sin( (ob.t*ob.d-s)*(2*Math.PI)/p )) + ob.b;
		return a*Math.pow(2,-10*(ob.t-=1)) * Math.sin( (ob.t*ob.d-s)*(2*Math.PI)/p )*.5 + ob.c + ob.b;
	}		//*/
}
var Back = {
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
}
var Bounce = {
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
}	// !NONFUNCTIONAL
var Quad = {
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
}	// !NONFUNCTIONAL
var Circ = {
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