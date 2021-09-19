<template>
    <div class="back-link" @click="move">
        <div>
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 500 500"
                width="40" height="40"
            >
                <defs>
                    <path
                        id="svg-arrow"
                        class="svg-arrow"
                        d="M 475 300 L 250 300 L 250 475 L 25 250 L 250 25 L 250 200 L 475 200"
                    />
                    <mask id="mask-url">
                        <rect x="0" y="0" width="500" height="500" fill="white"  />
                        <use href="#svg-arrow" class="arrow-mask" />
                    </mask>
                </defs>
                <circle cx="250" cy="250" r="225" class="svg-circle" mask="url(#mask-url)" />
                <use href="#svg-arrow" class="arrow-active" />
            </svg>
            <span class="label">
                Menu
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Back',

    methods: {
        move() {
            this.$router.push('menu');
        },
    },
});
</script>

<style scoped>
.back-link {
    cursor: pointer;
    position: fixed;
    top: 10px;
    left: 10px;
}
.back-link > div {
    display: flex;
    flex-direction: row;
}

svg {
    display: inline-block;
}

.svg-circle {
    stroke: none;
    fill: black;
}
.svg-arrow {
    /* stroke: black; black = transparent */
    fill: none;
    stroke-width: 20;
}
.arrow-mask {
    stroke: black; /* black = transparent */
}
.arrow-active {
    stroke: none;
}
.back-link:hover .arrow-active {
    stroke: var(--brand-primary);
}
.back-link:hover {
    color: var(--brand-primary);
}

.label {
    display: none;
    max-height: 40px;
    margin: 5px;
    border-radius: 40px;
    background-color: black;
    color: var(--brand-primary);
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 6px;
    padding-bottom: auto;
}
.back-link:hover .label {
    display: inline-block;
}
</style>
