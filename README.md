animateJs
=========

*animateJs* helps you to create slides or simple animations mostly by managing timming effects for you. it uses CSS to create effects.

*index.html* contains a sample of how to use it. You can see a demo [here](http://dorparasti.ir/animatejs/index.html);



notice:
---------
**this project is still being developed and is not complete yet.**

how to use:
---------

1. all items of animation/slide should be wrapped in an element with an id of **animation**.
2. all items(parts) of animation/slide should have an id and **animation-item** class.
3. each animation item should have these attributes to work correctly:
    * **data-anim-action**: effects that should be applied to the element. currently it supports [move, fadeIn, fadeOut, zoomIn, zoomOut, rotate].
    * **data-anim-action-duration**: duration of each effect in second.
    * **data-anim-to**: this is required for [move, zoomIn, zoomOut, rotate] and defines the final location of element or degree of rotation or rate of zoom.
    * **data-anim-time**: this defines when(from the start) the effect should be applied to the element in second.
    * **data-anim-easing**: easing of effect. the default in linear if not defined.
    
to set multiple settings , seperate them by **|**.
    
<pre>

&lt;div id="animation"&gt;
    &lt;h1 id="title" class="animation-item" data-anim-action="move|fadeOut" data-anim-action-duration="1|1" data-anim-to="200px,0" data-anim-time="1|3" data-anim-easing="cubic-bezier(0.075, 0.820, 0.165, 1.000)|ease-in" &gt;
				AnimateJs
    &lt;/h1&gt;
    &lt;h2 id="desc" class="animation-item" data-anim-action="move|fadeOut" data-anim-action-duration="1|1" data-anim-to="250px,0" data-anim-time="1.5|3.5" data-anim-easing="cubic-bezier(0.075, 0.820, 0.165, 1.000)|ease-out" &gt;
				A Simple Animating Library
    &lt;/h2&gt;

&lt;/div&gt;

</pre>
