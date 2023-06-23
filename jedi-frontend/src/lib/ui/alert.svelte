<script lang="ts">
    export let type = "info";
</script>

<div class="alert alert-{type}">
    <div class="alert__icon">
        <svg class="alert__icon--svg" viewBox="0 0 24 24">
            <path
                class="alert__icon--path"
                fill="currentColor"
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
            ></path>
        </svg>
    </div>
    <div class="alert__message">
        <slot></slot>
    </div>
</div>

<style>
    .alert {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        background-color: #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        color: #000;
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin: 2rem 0;
    }

    .alert.alert-info {
        background-color: #fff;
        color: #000;
    }

    .alert.alert-success {
        background-color: #fff;
        color: #000;
    }

    .alert.alert-warning {
        background-color: #fff;
        color: #000;
    }

    .alert.alert-error {
        background-color: #ffa5a5;
        color: rgb(50, 50, 50);
    }

    .alert__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        margin-right: 0.75rem;
        border-radius: 0.25rem;
        background-color: #fff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
</style>