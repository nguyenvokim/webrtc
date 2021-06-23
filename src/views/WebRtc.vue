<template>
    <div class="p-2">
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <label class="form-label">Select Camera</label>
                    <div>
                        <select class="form-control" @change="onVideoSourceChange">
                            <option v-model="selectedDeviceId" :key="device.deviceId" v-for="device in videoDevices" :value="device.deviceId">{{ device.label || `Device -${device.deviceId}` }}
                            </option>
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
                    <video style="width: 256px; height: 144px" ref="myVideo" autoplay muted></video>
                </div>
            </div>
            <div class="col">
                <SelectUser @request-call="handleRequestCall"/>
            </div>
        </div>
        <div class="row">
            <video ref="remoteVideo" autoplay></video>
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
        ...mapState('socket', ['socketId']),
        ...mapGetters('socket', ['connectedSocketIds'])
    },
    methods: {
        ...mapMutations('socket', ['setSocketId', 'setSocketNames'])
    }
})
export default class WebRtc extends Vue {
    $refs!: {
        myVideo: HTMLVideoElement;
        remoteVideo: HTMLVideoElement;
    };
    userName: string = '';
    allDevices: MediaDeviceInfo[] = [];
    selectedDeviceId: string = '';
    socket!: Socket;
    socketId!: string;
    setSocketId!: (payload: string) => void;
    setSocketNames!: (payload: Record<string, string>) => void;
    myConnection!: RTCPeerConnection;
    remoteConnection!: RTCPeerConnection;
    isStartedCall: boolean = false;

    async mounted() {
        await this.loadDevices();
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
        this.socket = io().connect();
        this.socket.on('connect', () => {
            console.log('Socket Connected');
            console.log(this);
            this.setSocketId(this.socket.id);
        });
        this.socket.on('update-user-list', (data) => {
            this.setSocketNames(data.users);
        });
        this.socket.on('call-made', async (payload) => {
            console.log('Received Call');
            console.log(payload);
            if (this.remoteConnection) return;
            try {
                this.remoteConnection = new RTCPeerConnection({
                    iceServers: [{urls: "stun:stun.1.google.com:19302"}]
                });
                this.remoteConnection.ontrack = (event) => {
                    console.log('[REMOTE_CONNECTION][ON_TRACK]:', event);
                    this.$refs.remoteVideo.srcObject = event.streams[0];
                };
                this.remoteConnection.onicecandidate = (event) => {
                    console.log('[REMOTE_CONNECTION][ON_ICE_CANDIDATE]:', event);
                    if (event.candidate) {
                        this.socket.emit('send-remote-candidate', {
                            targetId: payload.targetId,
                            candidate: event.candidate
                        });
                    }
                };
                await this.remoteConnection.setRemoteDescription(new RTCSessionDescription(payload.offer));
                const answer = await this.remoteConnection.createAnswer();
                await this.remoteConnection.setLocalDescription(new RTCSessionDescription(answer));
                console.log('Make Answer', answer);
                this.socket.emit('make-answer', {
                    targetId: payload.targetId,
                    answer: answer
                });
                if (!this.myConnection) {
                    await this.handleRequestCall(payload.targetId);
                }
            } catch (e) {
                console.log(e);
            }
        });
        this.socket.on('answer-made', async (payload) => {
            console.log('Answer Made', payload);
            await this.myConnection.setRemoteDescription(new RTCSessionDescription(payload.answer));
        });
        this.socket.on('self-candidate', async (payload) => {
            console.log('Self Candidate', payload);
            await this.remoteConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
        });
        this.socket.on('remote-candidate', async (payload) => {
            console.log('Remote Candidate', payload);
            await this.myConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
        });
    }

    async startConnect() {
        await this.connectCamera();
    }

    async loadDevices() {
        this.allDevices = await navigator.mediaDevices.enumerateDevices();
        console.log(this.allDevices);
    }

    async connectCamera() {
        const permission: MediaStreamConstraints = {
            video: {
                width: {min: 1280},
                height: {min: 720}
            }
        }
        const result = await navigator.mediaDevices.getUserMedia(permission);
        this.selectedDeviceId = result.id;
        this.$refs.myVideo.srcObject = result;
    }

    allowSound() {
        const permission: MediaStreamConstraints = {
            audio: true
        }
        navigator.mediaDevices.getUserMedia(permission);
    }

    onVideoSourceChange() {
        this.$nextTick(() => {
            this.connectCamera();
        })
    }

    async handleRequestCall(socketId: string) {
        await this.connectCamera();
        console.log('Call Me');
        if (socketId === this.socketId || this.isStartedCall || this.myConnection) {
            return;
        }
        this.myConnection = new RTCPeerConnection({
            iceServers: [{urls: "stun:stun.1.google.com:19302"}]
        });
        this.isStartedCall = true;
        this.myConnection.ontrack = (event) => {
            console.log('[MY_CONNECTION][ON_TRACK]:', event);
        };
        this.myConnection.onicecandidate = (event) => {
            console.log('[MY_CONNECTION][ON_ICE_CANDIDATE]:', event);
            if (event.candidate) {
                this.socket.emit('send-self-candidate', {
                    targetId: socketId,
                    candidate: event.candidate
                });
            }
        };
        const stream = this.$refs.myVideo.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
            this.myConnection.addTrack(track, stream);
        });
        const offer = await this.myConnection.createOffer();
        await this.myConnection.setLocalDescription(new RTCSessionDescription(offer));
        this.socket.emit('call-user', {
            targetId: socketId,
            offer: this.myConnection.localDescription
        });
    }

    private updateName() {
        this.socket.emit('update-name', this.userName);
    }

    beforeDestroy() {
        if (this.myConnection) this.myConnection.close();
        if (this.socket) this.socket.close();
    }
}
</script>
