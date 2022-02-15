<template>
    <div>
        <div>
            <router-link to="/slowFirst">First</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
            <router-link style="font-weight: bold" to="/slowSecond">Second</router-link>
        </div>
        <h1>PAGE 2</h1>
        <div>
            <MapStore v-for="(number, index) in loop" :key="index" :index-str="number" />
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapMutations, mapState} from 'vuex';
import MapStore from '@/components/MapStore.vue';

@Component({
    components: {MapStore},
    computed: {
        ...mapState('dashboard', ['isLoading'])
    }
})
export default class DashboardService extends Vue {

    get loop(): number[] {
        const numbers = []
        for (let i = 0; i <= 3000; i++) {
            numbers.push(i)
        }

        return numbers
    }
}
</script>
