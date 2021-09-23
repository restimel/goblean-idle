<template>
    <div
        class="achievement-item"
        :title="hint"
    >
        <div
            :class="grade"
        >
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 1000 1000"
                width="100" height="100"
            >
                <circle cx="500" cy="500" r="460" class="badge-circle" />
                <path :d="path" class="path-pattern" />
            </svg>
            <span class="achievement-title">
                {{title}}
            </span>
            <span class="achievement-label">
                {{label}}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AchievementItem',
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    computed: {
        isAchieved() {
            return this.item.condition();
        },
        grade() {
            const item = this.item;
            if (!this.isAchieved) {
                return 'none';
            }

            return item.grade;
        },
        hint() {
            const item = this.item;
            if (!this.isAchieved && item.secret) {
                return '???';
            }
            return item.hint;
        },
        title() {
            const item = this.item;
            if (!this.isAchieved && item.secret) {
                return item.secretTitle || '???';
            }
            return item.title;
        },
        label() {
            const item = this.item;
            if (!this.isAchieved) {
                return '';
            }
            return item.label;
        },
        path() {
            const item = this.item;
            if (!this.isAchieved) {
                return 'M 650,350 c -4e-4,53.2803 -30.7203,96.4803 -92.16,129.6 -25.9202,12.9602 -41.7602,23.0402 -47.52,30.24 -9.1202,10.5602 -12.9602,32.4002 -11.52,65.52 l 0,14.4 -51.84,0 0,-30.96 c -2e-4,-35.0398 43.198,-59.5198 12.96,-73.44 7.1998,-11.0398 18.4798,-21.1198 33.84,-30.24 32.6398,-18.7197 52.3197,-30.9597 59.04,-36.72 22.0797,-18.2397 33.1197,-40.7997 33.12,-67.68 -3e-4,-37.4396 -17.0403,-63.5996 -51.12,-78.48 -15.3602,-6.7196 -32.1602,-10.0796 -50.4,-10.08 -47.5201,4e-4 -80.8801,22.0804 -100.08,66.24 l -8.64,27.36 c -0.96,3.8403 -1.6801,7.9203 -2.16,12.24 l -54,-11.52 c 10.56,-67.6796 43.4399,-112.0795 98.64,-133.2 21.1198,-8.1595 44.6398,-12.2395 70.56,-12.24 52.7997,5e-4 94.5597,15.8405 125.28,47.52 l 15.12,18 c 13.4396,20.6404 20.3996,45.1204 20.88,73.44 m -138.24,362.16 a 40,40 0 1,0 -80,0 a 40,40 0 1,0 80,0';
            }
            if (!item.path) {
                return 'M 500 700 L 450 750 L 550 750 L 500 700 L 500 550 L 400 400 L 350 300 L 500 250 L 650 300 L 600 400 L 500 550';
            }
            return item.path;
        },
    },
});
</script>

<style scoped>
.achievement-item {
    --item-width: 150px;
    cursor: help;
    width: var(--item-width);
}

svg {
    display: block;
    margin: 0 calc((var(--item-width) - 100px) / 2);
}

.achievement-item .none {
    stroke: #e8e2ee;
    fill: #e4dbe4;
    color: #dddddd;
}

.achievement-item .bronze {
    stroke: #cd7f32;
    fill: #7b4c1e;
    color: #ee9439;
}

.achievement-item .silver {
    stroke: #f0f0F0;
    fill: #c0c0c0;
    color: #606070;
}

.achievement-item .gold {
    stroke: #ffd700;
    fill: #e4a003;
    color: #ffd700;
}

.achievement-item .diamond {
    stroke: #d0d0f0cc;
    fill: #e0e0eaee;
    color: #c0c0f0;
}

.achievement-item .jade {
    stroke: #339900;
    fill: #221100;
    color: #339900;
}

.badge-circle {
    stroke-width: 70;
}
.path-pattern {
    fill: none;
    stroke-width: 30;
}

.achievement-title {
    display: block;
    font-weight: bold;
}
.achievement-label {
    display: block;
    font-style: italic;
    text-align: justify;
    color: var(--text-color);
    font-size: 0.8em;
}
</style>
