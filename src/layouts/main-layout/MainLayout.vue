<script
    setup
    lang="ts"
>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <header class="sm-flex sm-gap-12 sm-items-center sm-justify-between sm-p-12 sm-bg-middle-background">
        <h1 class="sm-light-accent-color">Soft Mall - Calendar</h1>

        <nav class="sm-flex sm-gap-8 sm-items-center sm-font-bold">
            <RouterLink
                class="link sm-light-accent-color sm-text-22"
                to="/"
            >Calendar
            </RouterLink>
            <RouterLink
                class="link sm-light-accent-color sm-text-22"
                to="/description"
            >Description
            </RouterLink>
        </nav>
    </header>

    <div class="sm-p-12 sm-flex sm-flex-col sm-flex-1">
        <RouterView/>
    </div>
</template>

<style scoped>
.link.router-link-active {
    color: #ffffff;
    text-decoration: underline;
}
</style>
