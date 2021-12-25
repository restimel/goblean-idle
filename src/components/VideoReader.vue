<template>
    <div class="video-reader">
        <NAlert v-if="notifReader.type !== 'none'"
            class="video-notification"
            :title="notifReader.title"
            :type="notifReader.type"
            closable
        >
            {{notifReader.message}}
        </NAlert>
        <div v-else
            class="video-section"
        >
            <div v-if="stream"
                class="video-stream"
                @click="takePhoto(true)"
            >
                <video
                    class="video-stream"
                    :srcObject="stream"
                    autoplay
                    ref="videoEl"
                />
                <canvas
                    ref="canvasEl"
                />
            </div>
            <aside class="video-buttons">
                <NDropdown v-if="cameraList.length > 0"
                    trigger="hover"
                    :options="cameraList"
                    @select="changeCamera"
                >
                    <NButton circle
                        @click="defaultSelection"
                    >
                        <NIcon><Camera /></NIcon>
                    </NButton>
                </NDropdown>
                <NButton circle  v-if="stream"
                    @click="stopStream"
                >
                    <NIcon><Stop /></NIcon>
                </NButton>
                <NButton circle  v-if="stream"
                    @click="showSize = !showSize"
                    :type="showSize ? 'primary': 'default'"
                >
                    <NIcon><TestIcon /></NIcon>
                </NButton>
            </aside>
            <aside class="video-tools" v-if="stream">
                <label v-if="showSize">
                    {{T('Picture definition:')}}
                    <NSlider
                        v-model:value="canvasSizeVal"
                        :step="5"
                        :min="10"
                        :max="200"
                        :format-tooltip="value => `${Math.round(value * videoWidth / 100)} × ${Math.round(value * videoHeight / 100)}`"
                    />
                </label>
            </aside>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref, PropType, watch } from 'vue';
import { injectStrict } from '@/utils';
import { TInject } from '@/symbols';
import { Camera, Stop, ResizeOutline as TestIcon } from '@vicons/ionicons5'
import { Box } from '@/Types';

export type Action = 'none' | 'picture' | 'pause' | 'play' | 'stop';

type Status = 'pending' | 'allowed' | 'forbid' | 'disabled';
interface DeviceInfo {
    key: string;
    label: string;
}
interface CameraInfo extends DeviceInfo {
    disabled: boolean;
}

export default defineComponent({
    name: 'VideoReader',
    props: {
        boxes: {
            type: Array as unknown as PropType<Box[]>,
            required: false,
        },
        showScan: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
        action: {
            type: String as PropType<Action>,
            default: 'none',
        }
    },
    emits: ['picture', 'play', 'pause'],
    setup(props, context) {
        const T = injectStrict(TInject);

        const supportMediaDevice = !!(
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia
        );

        const videoWidth = ref(640);
        const videoHeight = ref(480);

        const status: Ref<Status> = ref('pending');
        const deviceList: Ref<DeviceInfo[]> = ref([]);
        const deviceId: Ref<null | string> = ref(null);
        const stream: Ref<null | MediaStream> = ref(null);
        const videoEl: Ref<null | HTMLVideoElement> = ref(null);
        const canvasEl: Ref<null | HTMLCanvasElement> = ref(null);
        const canvasSizeVal: Ref<number> = ref(120);
        const redBarIdx: Ref<number> = ref(0);
        const pause = ref(true);

        let timerScan = 0;

        const stopStream = () => {
            const streamValue = stream.value;
            pause.value = true;
            if (streamValue) {
                streamValue.getVideoTracks().forEach(mediaStreamTrack => mediaStreamTrack.stop());
                stream.value = null;
            }
        };

        const getVideo = async () => {
            if (!supportMediaDevice) {
                status.value = 'disabled';
            } else {
                try {
                    stopStream();
                    const mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: 'environment',
                            deviceId: deviceId.value || undefined,
                        },
                        audio: false,
                    });
                    status.value = 'allowed';
                    stream.value = mediaStream;
                    pause.value = false;

                    /* List all camera availabled */
                    if (deviceList.value.length > 0) {
                        return;
                    }

                    try {
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        const videoDevices = devices.reduce((list, device) => {
                            if (device.kind === 'videoinput') {
                                list.push({
                                    key: device.deviceId,
                                    label: device.label || T('Camera #%s', list.length + 1),
                                });
                            }
                            return list;
                        }, [] as DeviceInfo[]);

                        deviceList.value = videoDevices;
                    } catch (err) {
                        return;
                    }
                } catch (err) {
                    status.value = 'forbid';
                }
            }
        };
        getVideo();

        const cameraList = computed(() => {
            const usedDevices = stream.value ?
                stream.value.getTracks().map((track) => track.getSettings().deviceId) :
                [];
            return deviceList.value.map((device) => {
                return {
                    ...device,
                    disabled: usedDevices.includes(device.key),
                } as CameraInfo;
            });
        });

        const drawShapes = () => {
            const canvasSize = canvasSizeVal.value;
            const canvasWidth = canvasSize / 100 * videoWidth.value;
            const canvasHeight = canvasSize / 100 * videoHeight.value;
            const canvas = canvasEl.value;
            const ctx = canvas && canvas.getContext('2d');

            if (!ctx || !canvas) {
                return;
            }

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.lineWidth = canvasHeight / 150;

            if (props.boxes) {
                for (const box of props.boxes) {
                    const [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] = box;
                    ctx.strokeStyle = 'orange';
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.lineTo(x3, y3);
                    ctx.lineTo(x4, y4);
                    ctx.closePath();
                    ctx.stroke();
                }
            }

            if (props.showScan && !pause.value) {
                const midSize = canvasHeight / 2;
                const redBarY = Math.cos(redBarIdx.value * Math.PI / 20) * midSize + midSize;
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.beginPath();
                ctx.moveTo(0, redBarY);
                ctx.lineTo(canvasWidth, redBarY);
                ctx.stroke();
                redBarIdx.value = redBarIdx.value + 1;
            }
        };

        const takePhoto = (manual = false, retry = 3) => {
            const streamVideo = videoEl.value;
            const canvasSize = canvasSizeVal.value;
            const canvasWidth = canvasSize / 100 * videoWidth.value;
            const canvasHeight = canvasSize / 100 * videoHeight.value;
            const fullVideo = true;
            const streamCanvas = document.createElement('canvas');
            const streamPicture = document.createElement('img');
            const ctx = streamCanvas && streamCanvas.getContext('2d');

            if (!streamVideo || !streamCanvas || !ctx) {
                if (retry) {
                    setTimeout(takePhoto, 100, manual, retry - 1);
                }
                return;
            }
            streamCanvas.width = canvasWidth;
            streamCanvas.height = canvasHeight;

            const vWidth = streamVideo.videoWidth;
            const vHeight = streamVideo.videoHeight;
            let width = canvasWidth;
            let height = canvasHeight;
            // let offsetX = 0;
            // let offsetY = 0;

            if (fullVideo) {
                /* keep all the video inside the canvas */
                if (vWidth > vHeight) {
                    height = canvasHeight * vHeight / vWidth;
                    // offsetY = (canvasSize - height) / 2;
                } else {
                    width = canvasWidth * vWidth / vHeight;
                    // offsetX = (canvasSize - width) / 2;
                }
            } else {
                /* trunc the video to keep the smallest side in the canvas */
                if (vWidth > vHeight) {
                    width = canvasWidth * vWidth / vHeight;
                    // offsetX = (canvasSize - width) / 2;
                } else {
                    height = canvasHeight * vHeight / vWidth;
                    // offsetY = (canvasSize - height) / 2;
                }
            }

            ctx.drawImage(streamVideo, 0, 0, vWidth, vHeight, 0, 0, width, height);
            // ctx.drawImage(streamVideo, 0, 0, vWidth, vHeight, offsetX, offsetY, width, height);
            let data = streamCanvas.toDataURL('image/png');
            streamPicture.src = data;

            context.emit('picture', streamPicture, manual);
        };

        const notifReader = computed(() => {
            const videoStatus = status.value;
            const sentences: Record<Status, string> = {
                'pending': T('You should authorize the camera to scan the bar code.'),
                'forbid': T('You have forbid the usage of camera. If you want to scan bar codes, you should change your preferences for this page.'),
                'disabled': T('You d\'ont have camera or your browser doesn\'t allow to use it.'),
                'allowed': '',
            };
            const titles: Record<Status, string> = {
                'pending': T('Please allow the camera usage.'),
                'forbid': T('Permission has been denied to use camera.'),
                'disabled': T('Camera is not availabled.'),
                'allowed': '',
            };
            const types: Record<Status, string> = {
                'pending': 'info',
                'forbid': 'error',
                'disabled': 'error',
                'allowed': 'none',
            };

            return {
                message: sentences[videoStatus],
                title: titles[videoStatus],
                type: types[videoStatus] || 'none',
            };
        });

        /* {{{ watch */

        watch(() => props.action, () => {
            const streamVideo = videoEl.value;
            const action = props.action;

            switch(action) {
                case 'none':
                    break;
                case 'pause':
                    streamVideo && streamVideo.pause();
                    pause.value = true;
                    break;
                case 'play':
                    streamVideo && streamVideo.play();
                    pause.value = false;
                    break;
                case 'stop':
                    stopStream();
                    break;
                case 'picture':
                    takePhoto();
                    break;
            }
        });

        watch(() => pause.value, () => {
            const pauseValue = pause.value;
            if (pauseValue) {
                context.emit('pause');
            } else {
                context.emit('play');
            }
        });

        /* }}} */

        timerScan = setInterval(drawShapes, 150);

        return {
            T,
            notifReader,
            cameraList,
            stream,
            canvasSizeVal,
            showSize: ref(false),
            videoWidth,
            videoHeight,

            timerScan,

            videoEl,
            canvasEl,

            stopStream,
            takePhoto,
            changeCamera: (id: string) => {
                deviceId.value = id;
                getVideo();
            },
            defaultSelection() {
                if (stream.value) {
                    /* video is active */
                    return;
                } else {
                    /* no videos are active */
                    const firstCamera = cameraList.value[0];
                    const cameraId = firstCamera && firstCamera.key;
                    deviceId.value = cameraId;
                    if (cameraId) {
                        getVideo();
                    }
                }
            },
        };
    },
    unmounted() {
        this.stopStream();
        clearInterval(this.timerScan);
    },
    components: {
        Camera,
        Stop,
        TestIcon,
    }
});
</script>

<style scoped>
    .video-notification {
        margin-left: 10%;
        margin-right: 10%;
        margin-bottom: 1em;
    }

    .video-section {
        display: grid;
        grid-template-rows: max-content max-content max-content;
        grid-template-areas: "buttons" "tools" "video";
        row-gap: 5px;
        align-items: center;
        justify-content: center;
    }

    .video-stream {
        grid-area: video;
        position: relative;
        width: 640px;
        height: 480px;
    }

    .video-buttons {
        grid-area: buttons;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 5px;
    }

    .video-stream video,
    .video-stream canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 640px;
        height: 480px;
    }

    .video-tools {
        grid-area: tools;
    }

</style>
