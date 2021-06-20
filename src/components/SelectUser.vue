<template>
    <div>
        <ul class="list-group">
            <li class="list-group-item" v-for="id in connectedSocketIds" :key="id">
                {{socketNames[id] || id}} <a @click.prevent="startCall(id)"><BIconCameraVideo :variant="'primary'" /></a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from 'vue-property-decorator';
import {mapGetters, mapState} from 'vuex';

@Component({
    computed: {
        ...mapState('socket', ['socketId', 'socketNames']),
        ...mapGetters('socket', ['connectedSocketIds'])
    },
})
export default class SelectUser extends Vue {
    socketId!: string;
    connectedSocketIds!: string[];
    socketNames!: Record<string, string>

    startCall(socketId: string) {
        if (socketId == this.socketId) {
            return;
        }
        this.$emit('request-call', socketId)
    }
}

</script>

<style lang="scss">

</style>
