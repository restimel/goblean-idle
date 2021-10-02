<template>
    <div class="about">
        <Back />
        <h1 class="page-title">{{T('About %s', i18n.projectName)}}</h1>

        <div class="box-text about-elements">
            <div class="information">
                <div>{{T('Version')}}</div><div>{{version}}</div>
                <div>{{T('License')}}</div><div>{{license}}</div>
                <div>{{T('Author')}}</div><div>{{author.name}}</div>
                <div v-if="contibutorsList">{{T('contributors')}}</div><div v-if="contibutorsList">{{contibutorsList}}</div>
            </div>

            <div class="box-text">
                <header>{{T('Special thanks to')}}</header>
                <p>
                    {{T('I would thank everyone which has been around this ' +
                    'project. And you of course to play this game.')}}
                </p>
            </div>

            <div class="box-text">
                <header>{{T('Cookies and data stored on your computer')}}</header>
                <p>
                    {{T('This program does not need any cookies because it ' +
                    'doesn\'t track your usage on this game. There is no ' +
                    'cookies for any advertisement or for any other usage.')}}
                </p>
                <p>
                    {{T('All data stored on your browser are only needed ' +
                    'for the game usage and are not read by anyone else.')}}
                </p>
                <label>
                    {{T('Accept useless cookies')}}
                    <input type="checkbox" :value="cookies" @change="eatCookie">
                    <div v-if="cookies" class="cookie-message">
                        {{T('Are you sure? Cookies are useless for this game!')}}
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Back from '@/components/Back.vue';
import { version } from '@/project';

export default defineComponent({
    name: 'About',
    inject: ['T', 'i18n', 'store'],
    data() {
        return {
            version: version,
            author: {
                name: 'Benoît Mariat',
            },
            contributors: [],
            license: 'MIT',
            cookies: false,
        };
    },
    computed: {
        contibutorsList() {
            return (this as any).contributors.map((c: any) => c.name).join(', ');
        },
    },
    methods: {
        eatCookie() {
            (this as any).store.states.cookieAccepted = true;
            this.cookies = !this.cookies;
        },
    },
    components: {
        Back,
    },
});
</script>

<style scoped>
.about-elements {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: space-around;
}
.about-elements > * {
    max-width: 500px;
    min-width: 200px;
    background-color: var(--item-bg);
    color: var(--item-color);
    padding: 1em;
    box-shadow: 0 0 10px 2px black;
    border-radius: 5px;
}

.box-text header {
    font-weight: bold;
}
.box-text p {
    text-align: justify;
    font-style: italic;
}

.information {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
    margin: 1em;
    width: 100%;
    max-width: initial;
}
.information :nth-child(odd) {
    font-weight: bold;
    justify-self: right;
}
.information :nth-child(even) {
    justify-self: left;
    font-style: italic;
}

.cookie-message {
    font-style: italic;
}
</style>
