<template>
    <div class="goblean">
        <Back />
        <h1 class="page-title">{{T('Add a new Goblean')}}</h1>

        <section>
            <VideoReader
                :boxes="codeBox"
                :action="videoAction"
                showScan
                @picture="onPicture"
                @play="pauseVideo = false; action('picture');"
                @pause="pauseVideo = true"
            />
            <label>
                {{T('Enter the EAN code:')}}
                <input
                    :placeholder="T('EAN code bar')"
                    type="text"
                    v-model="ean"
                >
            </label>
        </section>
        <div v-if="!!goblean" class="stats">
            <div class="charac">Speed</div><div class="value">{{goblean.speed}}</div>
            <div class="charac">Force</div><div class="value">{{goblean.force}}</div>
            <div class="charac">Stamina</div><div class="value">{{goblean.stamina}}</div>
            <div class="charac">Intelligence</div><div class="value">{{goblean.intelligence}}</div>
            <div class="charac">Craft</div><div class="value">{{goblean.craft}}</div>
            <div class="charac">Learning</div><div class="value">{{goblean.learning}}</div>
            <div class="charac">Social</div><div class="value">{{goblean.social}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import Back from '@/components/Back.vue';
import VideoReader, { Action } from '@/components/VideoReader.vue';
import {
    decode,
} from '@/tools/BarCodeReader';
import { storeInject, TInject } from '@/symbols';
import { createGoblean } from '@/tools/Goblean';
import { injectStrict, notification, sleep } from '@/utils';
import { Box } from '@/Types';

export default defineComponent({
    name: 'Goblean',
    setup() {
        const store = injectStrict(storeInject);
        const T = injectStrict(TInject);

        const ean = ref('');
        const codeBox: Ref<Box[] | null> = ref(null);
        const pauseVideo = ref(false);
        const videoAction: Ref<Action> = ref('none');

        const action = async (act: Action) => {
            videoAction.value = act;
            await sleep(0);
            videoAction.value = 'none';
        };

        const goblean = computed(() => {
            const goblean = createGoblean(ean.value, true);
            if (goblean) {
                notification(store, {
                    title: 'goblean is valid',
                    message: `The goblean ${ean.value} is valid!!!`,
                });
            }
            return goblean;
        });

        let isScanning = false;
        const onPicture = async (img: HTMLImageElement, manual = false) => {
            if (manual) {
                action('pause');
            } else if (isScanning) {
                return;
            }
            isScanning = true;
            const { code, box } = await decode(img);
            isScanning = false;
            if (manual) {
                action('play');
            }

            if (box) {
                codeBox.value = box;
            } else {
                codeBox.value = null;
            }

            if (code) {
                ean.value = code;
                action('stop');
            } else {
                await sleep(100);
                if (!pauseVideo.value) {
                    action('picture');
                }
            }
        };

        return {
            ean,
            goblean,
            T,
            codeBox,
            videoAction,
            pauseVideo,

            action,
            onPicture,
        };
    },
    components: {
        Back,
        VideoReader,
    },
});
</script>

<style scoped>
.stats {
    margin-top: 2em;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.stats .charac {
    text-align: end;
    padding: 5px;
    font-weight: bold;
}

.stats .value {
    text-align: start;
    padding: 5px;
    font-style: italic;
}
</style>
