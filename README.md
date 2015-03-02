# superTween
A very small tweening engine for those teeny tiny projects

A Tweening library using Robert Penners easing equations that was initially built for animation within projects with
incredibly tight file restrictions. The current build supports commands following this structure:

App.superTween(elem,                //DOM element to animate
                  1,                //Length of animation (in seconds)
                  {
                         opacity: 0.5,                        //target alpha
                         x: 600,                              //distance to move on x axis (in pixels)
                         y: 60,                               //distance to move on y axis (in pixels)
                         scaleX: 0.2,                         //X Scale
                         scaleY: 0.5,                         //Y Scale
						    		     delay: .5,                           //Animation delay (in seconds)
									       ease: Elastic.easeInOut,             //ease to use
									       onComplete: App.timeline.boxAnim,    //function called on complete
									       onCompleteParams: [2, elem]          //paramenters to pass to completion function
									});	
									
									
	This relies on the DOM object being absolutely positioned and runs off offsetLeft and OffsetRight
	
	currently there is some lag on slower machines and a few mobile devices when trying to tween a large amount of objects, 
	specifically if changing object opacity
