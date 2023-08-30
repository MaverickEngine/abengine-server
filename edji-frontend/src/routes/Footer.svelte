<script>
    import github from '$lib/images/github-mark-white.svg';
    const year = new Date().getFullYear();
</script>
<footer class="mt-auto flex flex-col items-center bg-zinc-800 text-slate-200 text-center">
    <div class="mb-4 mt-2 flex justify-center">
        <a href="https://github.com/j-norwood-young/edji">
            <img class="github h-4 w-4" src={github} alt="GitHub" />
        </a>
    </div>
    <div class="w-full bg-neutral-300 p-4 text-center text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
        Copyright {year} Jason Norwood-Young<br />
        <a href="mailto:jason@10layer.com">jason at 10layer dot com</a>
    </div>
    
</footer>