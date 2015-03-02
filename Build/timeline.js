var App = App || {};
	App.superTween = App.superTween || {};
	App.timeline = App.timeline || {};
	App.dom = App.dom || {};
	App.utils = App.utils || {};

App.log = function(message){
	if('console' in  window){
		console.log(message);
	}
}	

App.timeline.init = function(){
	App.log('init');
	
	App.dom.appMain = document.getElementById('appMain');

	App.dom.elemW = document.getElementById('elemW');
	App.dom.elemX = document.getElementById('elemX');
	App.dom.elemY = document.getElementById('elemY');	
	App.dom.elemZ = document.getElementById('elemZ')
	
	
	App.timeline.doStep(1);
}

App.timeline.doStep = function(whatStep){
	switch(whatStep){
		case 0: 
			App.superTween(App.dom.elemW, 1, {scaleX: 0.5, scaleY: 0.5, ease: Linear.easeNone,});			
			break;
		
		case 1:	
			App.timeline.boxAnim(1, App.dom.elemW);	
			App.utils.goTo(2, 2500);
			break;
			
		case 2:
			App.timeline.boxAnim(1, App.dom.elemX);
			App.utils.goTo(3, 2500);
			break;
			
		case 3:
			App.timeline.boxAnim(1, App.dom.elemY);
			App.utils.goTo(4, 2500);
			break;
			
		case 4:
			App.timeline.boxAnim(1, App.dom.elemZ);
			App.utils.goTo(5, 2500);
			break;
	}
}

App.timeline.boxAnim = function(whatStep, elem){
	//App.log("doStep "+whatStep+" on "+ elem.id);
	switch(whatStep){
		case 1 :
			App.superTween(elem, 1, {x: 600, y: 60, scaleX: 0.2, scaleY: 0.5,
						    		   delay: .5,
									   ease: Elastic.easeInOut,
									   onComplete: App.timeline.boxAnim,
									   onCompleteParams: [2, elem]
									});			
			break;
			
		case 2 :
			App.superTween(elem, 3, {x: 500, y: 700, opacity: 0, scaleX: 0.7, scaleY: 0.3,
									   ease: Sine.easeInOut,
									   onComplete: App.timeline.boxAnim,
									   onCompleteParams: [3, elem]
									});		
			break;
			
		case 3 :			
			App.superTween(elem, 2, {y: 50, x: 350, opacity: 1, scaleX: 1.5, scaleY: 0.8,
									   ease: Back.easeOut,
									   onComplete: App.timeline.boxAnim,
									   onCompleteParams: [4, elem]
									});		
			break;
			
		case 4 :			
			App.superTween(elem, 3, {x: 45, y: 450, scaleX: 1, scaleY: 1,
									   delay: 1,
									   ease: Sine.easeInOut,
									   onComplete: App.timeline.boxAnim,
									   onCompleteParams: [1, elem]
									});		
			break;
		}
}

App.utils.goTo = function(whatStep, timeout){
	setTimeout(function(){
		App.timeline.doStep(whatStep)
	}, timeout);
}

document.onload = App.timeline.init();

