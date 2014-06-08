window.animate = (function(){

	function action(elementId, actionName, duration, easing, time, finalCondition){

		if(isEmpty(elementId)){
			this.trace("elementId");
			return false;
		}		
		this.elementId = elementId;

		if(isEmpty(actionName) || ["move","fadeIn","fadeOut","zoomIn","zoomOut","rotate"].indexOf(actionName) < 0){
			this.trace("actionName");
			return false;
		}
		this.actionName = actionName;

		if(isEmpty(duration) || !Number(duration) || eval(duration) <= 0){
			this.trace("duration");
			return false;
		}
		this.duration = duration;

		if(isEmpty(easing)){
			this.easing = "linear";
		}
		this.easing = easing;

		if(isEmpty(time) || !Number(time) || eval(time) < 0){
			this.trace("time");
			return false;
		}
		this.time = time * 1000;

		if(!isEmpty(finalCondition)){
			if(this.actionName == "move"){
				var locations = finalCondition.split(",");
				this.finalLocationX = locations[1] || 0;
				this.finalLocationY = locations[0] || 0;
			}
			if(this.actionName == "zoomIn" || this.actionName == "zoomOut"){
				this.scaleTo = finalCondition;
			}
			if(this.actionName == "rotate"){
				this.rotateTo = finalCondition;
			}
		}

		this.done = false;
	}

	action.prototype.trace = function(property){
		var msg = "error in acion setting";

		switch(property){
			case "elementId":
				msg = "animation-item should have id property";
				break;
			case "actionName":
				msg = this.elementId + " : valid actions are move, fadeIn, fadeOut, zoomIn, zoomOut and rotate";
				break;
			default:
				msg = this.element + " : " + property + " doesn't have a valid value";
				break;
		}

		trace(msg);
	}

	action.prototype.generateCss = function(){
		switch(this.actionName){
			case "move":
				return "top: " + this.finalLocationY + ";" +
					   "left: " + this.finalLocationX + ";";
			case "fadeOut":
				return "opacity: 0;";
			case "fadeIn":
				return "opacity: 1;";
			case "zoomIn":
			case "zoomOut":
				return  "-webkit-transform: scale(" + this.scaleTo + ");" +
						"-moz-transform: scale(" + this.scaleTo + ");" +
						"-ms-transform: scale(" + this.scaleTo + ");" +
						"-o-transform: scale(" + this.scaleTo + ");" +
						"transform: scale(" + this.scaleTo + ");";
			case "rotate":
				return  "-webkit-transform: rotate(" + this.rotateTo + "deg);" +
						"-moz-transform: rotate(" + this.rotateTo + "deg);" +
						"-ms-transform: rotate(" + this.rotateTo + "deg);" +
						"-o-transform: rotate(" + this.rotateTo + "deg);" +
						"transform: rotate(" + this.rotateTo + "deg);";
		};
	};

	action.prototype.resetStyle = function(style){
		var el = document.getElementById(this.elementId);
		el.setAttribute("style", style);
	}

	action.prototype.addStyle = function(style){
		var el = document.getElementById(this.elementId);
		var currentStyle = el.getAttribute("style");
		if(!isEmpty(currentStyle)){
			style = currentStyle + style;
		}
		el.setAttribute("style", style);
	}

	action.prototype.setActionStyle = function(){
		this.addStyle(this.generateCss());
	}

	action.prototype.setTransition = function(){
		this.addStyle("transition: all " + this.duration + "s " + this.easing + ";");
	}

	action.prototype.run = function(){
		this.setTransition();
		this.setActionStyle();
		this.done = true;
	}

	var animate = {
		timer : 100,
		interval: null,
		actions : [],
		start : function(){
			var stage = document.getElementById("animation");
			if(isEmpty(stage)){
				trace("can not find element with id 'animation'");
				return;
			}

			var elms = stage.getElementsByClassName("animation-item");
			if(isEmpty(elms) || elms.length == 0){
				trace("no animation-item is found on stage");
				return;
			}

			for(var i = 0; i <= elms.length - 1; i += 1){
				this.actions = this.actions.concat(getActions(elms[i]));
			}

			if(this.actions.length == 0){
				trace("no action is defined for animation items");
				return;
			}

			style = "<style>html{margin: 0; padding: 0;}body{height: 100%; overflow: hidden;}#timer{position: fixed; right: 0; top: 10px;z-index: 1000}#animation{position: relative; height: 100%;width: 100%;}.animation-item{position: absolute;}</style>";

			document.getElementsByTagName("head")[0].innerHTML += style;

			this.interval = setInterval(function(){
				runActions();
			},100);
		}
	};


	function getActions(elm){
		var actions = [];
		var defaultDuration = 1;
		var defaultEasing = "linear";

		if(!isValidElement(elm)){
			return [];
		}

		var id = elm.getAttribute("id");
		if(isEmpty(id)){
			return [];
		}

		var actionsNames = elm.getAttribute("data-anim-action").split("|");
		if(actionsNames.length == 0){
			return [];
		}

		var actionsDurations = elm.getAttribute("data-anim-action-duration").split("|");
		if(actionsDurations.length == 0){
			return [];
		}

		var actionsEasings = elm.getAttribute("data-anim-easing").split("|");
		if(actionsEasings.length == 0){
			return [];
		}

		var actionsTimes =  elm.getAttribute("data-anim-time").split("|");
		if(actionsTimes.length == 0 || actionsTimes.length < actionsNames.length){
			return [];
		}

		var actionsFinalLocations = elm.getAttribute("data-anim-to").split("|");

		for(var i=0; i<= actionsNames.length - 1; i++){
			var duration = actionsDurations[i] || defaultDuration;
			var easing = actionsEasings[i] || defaultEasing;

			actions.push(new action(id, actionsNames[i], duration, easing, actionsTimes[i], actionsFinalLocations[i]));
		}

		return actions;
	}

	function getNotRunnedActions(){
		var actions = [];
		for(var i = 0; i <= animate.actions.length - 1; i++){
			if(animate.actions[i].done == false){
				actions.push(animate.actions[i]);
			}
		}
		return actions;
	}
	function runActions(){
		var actions = getNotRunnedActions();

		if(actions.length == 0){
			clearInterval(animate.interval);
			return;
		}

		document.getElementById("timer").innerText = animate.timer;

		for(var i = 0; i <= actions.length - 1; i++){
			var action = actions[i];
			if(action.time == animate.timer){
				action.run();
			}
		}

		animate.timer += 100;
	}

	function isValidElement(elm){
		return elm.hasAttribute("id") &&
				elm.hasAttribute("data-anim-action") &&
				elm.hasAttribute("data-anim-action-duration") &&
				elm.hasAttribute("data-anim-easing") &&
				elm.hasAttribute("data-anim-time") &&
				elm.hasAttribute("data-anim-to");
	}
	function isEmpty(val){
		return val == undefined || val == null || val == "";
	}

	function trace(msg){
		console.log(msg);
	}

	return animate;

}());