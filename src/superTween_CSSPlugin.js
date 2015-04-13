/*
 * Super natural's micro Tween Engine CSS Plugin
 * http://www.wearesupernatural.com/
 *
 */

var CSSTween = {
	counter: 0,
	curAnims: {},
	vendorPrefixs: ["webkit", "moz"],
}


/*
 * main controller
 * 	@param obj: the tween object created in superTween.js
*/
CSSTween.applyCSSTransition = function(obj){

	CSSTween.curAnims["anim"+CSSTween.counter] = obj;
	obj.elem.setAttribute('data-tweenNum', "anim"+CSSTween.counter);
	obj.elem.setAttribute('data-tweenEnd', 'false');
	CSSTween.counter++;



	CSSTween.tweenStyles = {
			top: "",
			left: "",
			width: "",
			height: "",
			opacity: "",
			transitionDuration: "",
			transitionProperty: "",
			transform: "",
			transitionTimingFunction: obj.ease,
			transitionend: "",
			transitionDelay: 0
	}
	var transitProp = "";
	var transformProp = "";

	//this is the loop that replaces the styles with any changes
	for(var i = 0; i < obj.attr.length;i++){

		var curAttr = CSSTween.naming(obj, i);

		if(!curAttr.transform){
			CSSTween.tweenStyles[curAttr.cssVar] = curAttr.value;
		} else {
			transformProp = curAttr.transform + " "+transformProp;
		}
		transitProp += curAttr.cssVar+", ";
	}

	CSSTween.tweenStyles.transform = transformProp;
	CSSTween.tweenStyles.transitionDuration = (obj.rawTime/1000)+'s';
	CSSTween.tweenStyles.transitionProperty = transitProp;

	if(obj.rawDelay){
		CSSTween.tweenStyles.transitionDelay = (obj.rawDelay/1000)+'s';
	} else {
		CSSTween.tweenStyles.transitionDelay = '0s';
	}

	CSSTween.vendorPrefix([
		'transitionDelay',
		'transform',
		'transitionDuration',
		'transitionProperty',
		'transitionTimingFunction'
	], CSSTween.tweenStyles)

	//obj.elem.style.webkitTransformOrigin = "top left";

	//Apply the styles to the element
	for(var prop in CSSTween.tweenStyles){
		if(!CSSTween.tweenStyles[prop]){
			CSSTween.tweenStyles[prop] = null;
		}


		obj.elem.style[prop] = CSSTween.tweenStyles[prop];
	}

	//listen for transition complete && setup backup timer
	obj.elem.addEventListener( 'webkitTransitionEnd', CSSTween.completeHandler, false );
	obj.elem.addEventListener( 'mozTransitionEnd', CSSTween.completeHandler, false );
	obj.elem.addEventListener( 'msTransitionEnd', CSSTween.completeHandler, false );
	obj.elem.addEventListener( 'transitionend', CSSTween.completeHandler, false );

}

/*
 * fires on transition complete, removes anim from array and fires any onComplete Events
 * 	@param e: transition event
*/
CSSTween.completeHandler = function(e){

	var srcElem = e.srcElement || e.originalTarget;
	var tweenCheck = srcElem.getAttribute("data-tweenEnd");


	if(tweenCheck == "false"){
		srcElem.setAttribute('data-tweenEnd', 'true');
		srcElem.removeEventListener( 'webkitTransitionEnd', CSSTween.completeHandler, false  );
		srcElem.removeEventListener( 'mozTransitionEnd', CSSTween.completeHandler, false );
		srcElem.removeEventListener( 'msTransitionEnd', CSSTween.completeHandler, false );
		srcElem.removeEventListener( 'transitionend', CSSTween.completeHandler, false );

		var animNum = srcElem.getAttribute('data-tweenNum');
		var onComplete = CSSTween.curAnims[animNum].onComplete;

		if(onComplete){
			onComplete.apply(this, CSSTween.curAnims[animNum].onCompleteParams);
		}

		delete CSSTween.curAnims[animNum];
	}
}


/*
 * returns the appropriate value and suffix for each element passed in
 * 	@param parObj: the tween object created in superTween.js
 * 	@param unit: the attribute in question
*/
CSSTween.naming = function(parObj, unit){

	obj = parObj.attr[unit]

	/*
	 * r = object to return
	*/
	var r = {
		cssVar: obj.attr,
		value: parObj.rawObj[obj.attr],
		transform: null
	}

	if (obj.attr == 'x'||
		obj.attr == 'y'||
		obj.attr == 'width'||
		obj.attr == 'height'){

			if(obj.attr == 'x'){r.cssVar = "left"}
			if(obj.attr == 'y'){r.cssVar = "top"}

			r.value += "px";

	} else if(obj.attr == 'transitionDuration'){
			r.value +=  "s";

	} else if(obj.attr == 'delay'){
			r.value +=  "s";

	} else if(obj.attr == 'rotate') {
		r.transform = obj.attr+"("+r.value+"deg)"


	} else if (	obj.attr == 'scaleX' ||
				obj.attr == 'scaleY'){

		var newScale = parObj.rawObj[obj.attr];
		r.transform = obj.attr+"("+newScale+")"
	}

	return r;
}


/*
 * adds vendor-prefixed variables to an object
 * 	@param whatAttrArr: an array of attributes to vendorify
 * 	@param whatObj: what object to put the newly prefixed variables into
*/
CSSTween.vendorPrefix = function(whatAttrArr, whatObj){
	for(var i = 0; i < whatAttrArr.length; i++){
		for(var k = 0; k < CSSTween.vendorPrefixs.length; k++){
			var newVar = CSSTween.vendorPrefixs[k]+whatAttrArr[i].charAt(0).toUpperCase() + whatAttrArr[i].slice(1);
			whatObj[newVar] = CSSTween.tweenStyles[whatAttrArr[i]];
		}
	}
}


/******************
 *
 * CSS EASES (only uncomment the ones you use)
 *
********************/
CSSEase = {
	Expo : {
	//	easeIn: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
	//	easeOut: 'cubic-bezier(0.19, 1, 0.22, 1)',
	//	easeInOut: 'cubic-bezier(1, 0, 0, 1)'
	},	Quint : {
	//	easeIn: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
	//	easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
	//	easeInOut: 'cubic-bezier(0.86, 0, 0.07, 1)'
	},	Quart : {
	//	easeIn: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
	//	easeOut: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
	//	easeInOut: 'cubic-bezier(0.77, 0, 0.175, 1)'
	},	Cubic : {
	//	easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
	//	easeOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
	//	easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
	},	Linear : {
		easeNone: 'linear'
	},	Sine : {
		easeIn: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
		easeOut:'cubic-bezier(0.39, 0.575, 0.565, 1)',
		easeInOut:'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
	},	Elastic : { //NOT SUPPORTED
	//	easeIn:
	//	easeOut:
	//	easeInOut:
	},	Back : {
	//	easeIn: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
		easeOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
	//	easeInOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
	},	Bounce : { //NOT SUPPORTE
	//	easeIn:
	//	easeOut:
	//	easeInOut:
	},	Quad : {
	//	easeIn: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	//	easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	//	easeInOut: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
	},	Circ: {
	//	easeIn: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
	//	easeOut: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
	//	easeInOut: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
	}
};
