<script>
    export let message;
    export let type;
    export let duration = 5000;
    export let position = "top-right";
    export let show = false;
    export let closeable = true;
    export let closeableByClick = true;
    export let closeableByEsc = true;
    export let closeableByOutsideClick = true;
    export let closeableByTimer = true;
    export let timer = null;
    export let transition = "fade";
    export let transitionDuration = 300;
    export let transitionTimingFunction = "ease";
    export let transitionDelay = 0;
    export let transitionX = false;
    export let transitionY = false;
    export let transitionEnd = false;
    export let transitionDestroy = false;

</script>

<div class="alert-modal">
    
</div>