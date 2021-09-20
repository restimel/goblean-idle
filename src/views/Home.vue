<template>
    <div class="home" @click.prevent.stop="gotoMenu">
        <div><img alt="Goblean logo" src="../assets/logo.png"></div>
        <h1 class="goblean-title">{{i18n.projectName}}</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Home',
    inject: ['i18n'],
    methods: {
        gotoMenu() {
            this.$router.push('menu');
        },
    },
});
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    cursor: pointer;
}
.home img {
    width: auto;
    height: 50vw;
}

.home .goblean-title {
    font-size: 10vw;
}
</style>
