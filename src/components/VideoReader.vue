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
            <video v-if="stream"
                class="video-stream"
                :srcObject="stream"
                autoplay
                ref="videoEl"
                @click="takePhoto"
            />
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
                        :step="10"
                        :min="100"
                        :max="1280"
                        :format-tooltip="value => `${value} × ${value}`"
                    />
                </label>
            </aside>
        </div>
        <canvas ref="canvasEl" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';
import { injectStrict } from '@/utils';
import { TInject } from '@/symbols';
import { Camera, Stop, ResizeOutline as TestIcon } from '@vicons/ionicons5'

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
    setup() {
        const T = injectStrict(TInject);

        const supportMediaDevice = !!(
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia
        );

        const status: Ref<Status> = ref('pending');
        const deviceList: Ref<DeviceInfo[]> = ref([]);
        const deviceId: Ref<null | string> = ref(null);
        const stream: Ref<null | MediaStream> = ref(null);
        const videoEl: Ref<null | HTMLVideoElement> = ref(null);
        const canvasEl: Ref<null | HTMLCanvasElement> = ref(null);
        const canvasSizeVal: Ref<number> = ref(300);

        const stopStream = () => {
            const streamValue = stream.value;
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

        const takePhoto = () => {
            const streamVideo = videoEl.value;
            const canvasSize = canvasSizeVal.value;
            const fullVideo = true;
            const streamCanvas = canvasEl.value;
            // const streamCanvas = document.createElement('canvas');
            const streamPicture = document.createElement('img');
            const ctx = streamCanvas && streamCanvas.getContext('2d');

            if (!streamVideo || !streamCanvas || !ctx) {
                return;
            }
            streamCanvas.width = canvasSize;
            streamCanvas.height = canvasSize;

            const vWidth = streamVideo.videoWidth;
            const vHeight = streamVideo.videoHeight;
            let width = canvasSize;
            let height = canvasSize;
            let offsetX = 0;
            let offsetY = 0;

            if (fullVideo) {
                /* keep all the video inside the canvas */
                if (vWidth > vHeight) {
                    height = canvasSize * vHeight / vWidth;
                    offsetY = (canvasSize - height) / 2;
                } else {
                    width = canvasSize * vWidth / vHeight;
                    offsetX = (canvasSize - width) / 2;
                }
            } else {
                /* trunc the video to keep the smallest side in the canvas */
                if (vWidth > vHeight) {
                    width = canvasSize * vWidth / vHeight;
                    offsetX = (canvasSize - width) / 2;
                } else {
                    height = canvasSize * vHeight / vWidth;
                    offsetY = (canvasSize - height) / 2;
                }
            }

            ctx.drawImage(streamVideo, 0, 0, vWidth, vHeight, 0, 0, width, height);
            // ctx.drawImage(streamVideo, 0, 0, vWidth, vHeight, offsetX, offsetY, width, height);
            let data = streamCanvas.toDataURL('image/png');
            streamPicture.src = data;
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

        return {
            T,
            notifReader,
            cameraList,
            stream,
            canvasSizeVal,
            showSize: ref(false),

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
    }

    .video-buttons {
        grid-area: buttons;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 5px;
    }

    .video-tools {
        grid-area: tools;
    }

</style>
