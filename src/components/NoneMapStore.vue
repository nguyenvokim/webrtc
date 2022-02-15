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
        ...mapState('dashboard', ['isLoading'])
    },
})
export default class MapStore extends Vue {
    @Prop({type: String}) indexStr!: string
    @Prop({type: Boolean}) isLoading!: boolean
    @Prop({type: Object}) profile!: boolean
    @Prop({type: Object}) users!: boolean
}
</script>
