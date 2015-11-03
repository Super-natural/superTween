var App = App || {};
	App.superTween = window.superTween;
	App.timeline = App.timeline || {};
	App.dom = App.dom || {};
	App.utils = App.utils || {};

App.log = function(message){
	if('console' in  window){
		console.log(message);
	}
}

App.timeline.init = function(){

	App.dom.appMain = document.getElementById('appMain');

	App.dom.elem360 = document.getElementById('elem360');

	App.dom.elemW = document.getElementById('elemW');
	App.dom.elemX = document.getElementById('elemX');
	App.dom.elemY = document.getElementById('elemY');

	App.utils.goTo(0, 0);

}

App.timeline.doStep = function(whatStep){
	App.log("Step: "+whatStep)
	switch(whatStep){
		case 0:
			//App.superTween.superLoop(App.dom.elem360, "infinite", {numSteps: 45, stepSize: 161, interval: 50})

			// App.superTween.to(App.dom.elemW, 1, {rotate: 45, ease: 'Bounce.easeOut'});
			App.superTween.to(App.dom.elemW, 1, {x: 300, y:300, scaleY: 0.5, scaleX: 2, ease: 'Bounce.easeOut'});
			App.superTween.to(App.dom.elemX, 1, {y:400, scaleX: 2, rotate: 45, ease: 'Bounce.easeOut', delay: 0.5});
			 App.superTween.to(App.dom.elemY, 1, {x: 300, scaleY: 0.5, scaleX: 2, rotate: 45, ease: 'Bounce.easeOut', delay: 1,
			 										onComplete: App.utils.goTo,
			 										onCompleteParams: [1]});
			break;

		case 1:
			App.superTween.set([App.dom.elemW, App.dom.elemX, App.dom.elemY],
														{x: 500, y: 500, opacity: 0});

			App.utils.goTo(2);
			break;
		// case 1:
		// 	App.superTween.to(App.dom.elemW, 1, {rotate: 900, ease: 'Back.easeInOut'});
		// 	App.superTween.to(App.dom.elemX, 1, {rotate: 200, opacity: 1, ease: 'Sine.easeOut', delay: 1});
		// 	App.superTween.to(App.dom.elemY, 1, {rotate: 200, opacity: 1, ease: 'Sine.easeInOut', delay: 2,
		// 											onComplete: App.utils.goTo,
		// 											onCompleteParams: [2]});
		// 	break;

		case 2:
			App.superTween.to(App.dom.elemW, 1, {x: 300, y:100, scaleY: 0.5, scaleX: 2, rotate: 180, opacity: 1,	ease: 'Back.easeOut'});
			App.superTween.to(App.dom.elemX, 1, {x: 300, y:200, scaleY: 0.5, scaleX: 2, rotate: 180, opacity: 1,	ease: 'Back.easeOut', delay: 1});
			App.superTween.to(App.dom.elemY, 1, {x: 300, y:300, scaleY: 0.5, scaleX: 2, rotate: 180, opacity: 1,	ease: 'Back.easeOut', delay: 2,
													onComplete: App.utils.goTo,
													onCompleteParams: [3]});
			break;

		case 3:
			App.superTween.to(App.dom.elemW, 1, {x: 500, y:500, scaleY: 1, scaleX: 1, rotate: 100, ease: 'Sine.easeIn'});
			App.superTween.to(App.dom.elemX, 1, {x: 500, y:600, scaleY: 1, scaleX: 1, rotate: 100, ease: 'Sine.easeOut',	delay: 1});
			App.superTween.to(App.dom.elemY, 1, {x: 500, y:700, scaleY: 1, scaleX: 1, rotate: 100, ease: 'Sine.easeInOut', delay: 2,
													onComplete: App.utils.goTo,
													onCompleteParams: [0]});
			break;



		case 5:
				superTween.killAll()
				break;

	}




}


App.utils.goTo = function(whatStep, timeout){
	setTimeout(function(){
		App.timeline.doStep(whatStep)
	}, timeout);
}

App.timeline.init();
