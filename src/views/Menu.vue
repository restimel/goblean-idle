<template>
    <div class="menu">
        <header class="goblean-title">Goblean <sub>idle</sub></header>
        <router-link to="/map">Play</router-link>
        <router-link to="/achievement">Achievement</router-link>
        <router-link to="/about">About</router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Menu',
});
</script>

<style scoped>
.menu {
    --border-width: 10px;
    --font-size: 40px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
}

.menu a {
    height: var(--font-size);
    font-weight: bold;
    color: var(--text-color);
    font-size: var(--font-size);
    text-decoration: none;
    cursor: pointer;
    background-color: var(--brand-secondary);
    padding: var(--font-size);
    margin: calc(var(--font-size) - var(--border-width) / 2 );
    border-radius: calc(3 * var(--font-size));
    box-shadow: 5px 5px 5px 0 black;
    border: var(--border-width) solid transparent;
}

.menu a:hover {
    font-size: calc(var(--font-size) * 1.1);
    border-color: var(--brand-primary);
    box-shadow: 5px 5px 5px 0 black, inset 0 0 calc(var(--font-size) / 2) 5px var(--brand-primary);
}

.menu .goblean-title {
    font-size: calc(var(--font-size) * 1.5);
}

.mnu a.router-link-exact-active {
    color: var(--brand-primary);
}
</style>
