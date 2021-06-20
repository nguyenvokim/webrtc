<template>
    <div class="p-2">
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <label class="form-label">Select Camera</label>
                    <div>
                        <select class="form-control" @change="onVideoSourceChange">
                            <option v-model="selectedDeviceId" :key="device.deviceId" v-for="device in videoDevices" :value="device.deviceId">{{device.label || `Device -${device.deviceId}`}}</option>
                        </select>
                    </div>
                </div>
                <div class="input-group mt-1">
                    <input v-model="userName" type="text" class="form-control" placeholder="Enter user name" aria-label="Enter user name">
                    <div class="input-group-append">
                        <a @click.prevent="updateName" class="btn btn-primary" id="basic-addon2">Save</a>
                    </div>
                </div>
            </div>
            <div class="col">
                <div>
                    <a @click.prevent="startConnect" class="btn btn-primary m-1">Allow Camera</a>
                    <a @click.prevent="allowSound" class="btn btn-primary">Allow Sound</a>
                </div>
                <div>
                    <video style="width: 256px; height: 144px" ref="myVideo" autoplay="true"></video>
                </div>
            </div>
            <div class="col">
                <SelectUser @request-call="handleRequestCall" />
            </div>
        </div>
        <div class="row">
            <video ref="remoteVideo" autoplay="true"></video>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import io, {Socket} from 'socket.io-client';
import {mapGetters, mapMutations, mapState} from 'vuex';
import SelectUser from '@/components/SelectUser.vue';

@Component({
    components: {SelectUser},
    computed: {
        ...mapState('socket', ['socketId', 'socketNames']),
        ...mapGetters('socket', ['connectedSocketIds'])
    },
    methods: {
        ...mapMutations('socket', ['setSocketId', 'setSocketNames'])
    }
})
export default class PerToPer extends Vue {

    $refs!: {
        myVideo: HTMLVideoElement;
        remoteVideo: HTMLVideoElement;
    };
    userName: string = '';
    allDevices: MediaDeviceInfo[] = [];
    selectedDeviceId: string = '';
    socket!: Socket;
    socketId!: string;
    socketNames!: Record<string, string>
    setSocketId!: (payload: string) => void;
    setSocketNames!: (payload: Record<string, string>) => void;
    myConnection: RTCPeerConnection = new RTCPeerConnection();
    isStartedCall: boolean = false;

    async mounted() {
        this.myConnection.ontrack = (event) => {
            console.log('ON TRACK', event);
            this.$refs.remoteVideo.srcObject = event.streams[0];
        }
        this.loadDevices();
        this.socket = io().connect()
        this.initSocket();
    }

    get videoDevices(): MediaDeviceInfo[] {
        return this.allDevices.filter((device) => {
            return device.kind === 'videoinput';
        })
    }

    get audioDevices(): MediaDeviceInfo[] {
        return this.allDevices.filter((device) => {
            return device.kind === 'audioinput';
        })
    }

    initSocket() {
        this.socket.on('connect', () => {
            console.log('Socket Connected');
            console.log(this);
            this.setSocketId(this.socket.id);
        })
        this.socket.on('update-user-list', (data) => {
            this.setSocketNames(data.users);
        })
        this.socket.on('call-made', async (payload) => {
            console.log('Received call');
            console.log(payload);
            try {
                await this.myConnection.setRemoteDescription(new RTCSessionDescription(payload.offer));
                await this.connectCamera();
                const answer = await this.myConnection.createAnswer();
                await this.myConnection.setLocalDescription(new RTCSessionDescription(answer));
                console.log('Make Answer', answer);
                this.socket.emit('make-answer', {
                    answer: answer,
                    targetId: payload.targetId
                })
            } catch (e) {
                console.log(e);
            }
        })
        this.socket.on('answer-made', async (payload) => {
            console.log('ANSWER MADE', payload);
            await this.myConnection.setRemoteDescription(new RTCSessionDescription(payload.answer));
        })
    }

    async startConnect() {
        this.connectCamera();
    }

    async loadDevices() {
        this.allDevices = await navigator.mediaDevices.enumerateDevices();
        console.log(this.allDevices);
    }
    async connectCamera() {
        let mediaSetting: MediaTrackConstraints = {
            width: { min: 1280 },
            height: { min: 720 }
        }
        if (this.selectedDeviceId) {
            mediaSetting.deviceId = {exact: this.selectedDeviceId};
        } else {
            mediaSetting.facingMode = 'environment'
        }
        const permission: MediaStreamConstraints = {
            video: {
                width: { min: 1280 },
                height: { min: 720 }
            }
        }
        const result = await navigator.mediaDevices.getUserMedia(permission);
        console.log(result);
        this.selectedDeviceId = result.id;
        this.$refs.myVideo.srcObject = result;
        result.getTracks().forEach((track) => {
            this.myConnection.addTrack(track, result);
        })

        navigator.mediaDevices.enumerateDevices().then((devices) => {
            this.allDevices = devices;
            console.log(this.allDevices);
        }, (error) => {
            console.log(error);
        });
    }

    allowSound() {
        const permission: MediaStreamConstraints = {
            audio: true
        }
        navigator.mediaDevices.getUserMedia(permission).then((result) => {
        })
    }

    onVideoSourceChange() {
        this.$nextTick(() => {
            this.connectCamera();
        })
    }

    async handleRequestCall(socketId: string) {
        console.log('Call me');
        if (socketId == this.socketId || this.isStartedCall) {
            return;
        }
        this.isStartedCall = true;
        const offer = await this.myConnection.createOffer();
        await this.myConnection.setLocalDescription(new RTCSessionDescription(offer));
        this.socket.emit('call-user', {
            targetId: socketId,
            offer: this.myConnection.localDescription
        })
    }

    updateName() {
        this.socket.emit('update-name', this.userName)
    }
}
</script>
