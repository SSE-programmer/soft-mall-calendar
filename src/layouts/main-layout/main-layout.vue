<template>
    <div class="layout sm-flex sm-flex-col">
        <header class="sm-flex sm-gap-12 sm-items-center sm-justify-between sm-p-12 sm-bg-middle-background">
            <h1 class="sm-light-accent-color">Soft Mall - Calendar</h1>

            <nav class="sm-flex sm-gap-8 sm-items-center sm-font-bold">
                <RouterLink
                    class="link sm-light-accent-color sm-text-22"
                    to="/"
                >
                    Calendar
                </RouterLink>
                <RouterLink
                    class="link sm-light-accent-color sm-text-22"
                    to="/description"
                >
                    Description
                </RouterLink>
            </nav>
        </header>

        <div class="container sm-p-12 sm-flex sm-flex-col sm-flex-1 sm-bg-primary-background sm-overflow-hidden">
            <RouterView/>
        </div>
    </div>
</template>

<script
    setup
    lang="ts"
>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style
    scoped
>
.container {
    background: linear-gradient(to right, var(--sm-primary-color), var(--sm-accent-color), var(--sm-ultra-light-primary-color));
}
.layout {
    max-height: 100dvh;
}

.link.router-link-active {
    color: #ffffff;
    text-decoration: underline;
}
</style>
