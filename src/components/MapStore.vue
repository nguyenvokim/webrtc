<template>
    <span>
        {{indexStr}}-{{isLoading}}-{{profile}}--{{users}}
    </span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {mapState} from 'vuex';

@Component({
    computed: {
        ...mapState('dashboard', ['isLoading', 'profile', 'users'])
    },
})
export default class MapStore extends Vue {
    @Prop({type: String}) indexStr!: string
    isLoading!: boolean
    profile!: any
    users!: any
}
</script>
