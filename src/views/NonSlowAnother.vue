<template>
    <div>
        <div>
            <router-link to="/noneSlowFirst">None First</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
            <router-link style="font-weight: bold" to="/noneSlowSecond">None Second</router-link>
        </div>
        <h1>PAGE None store 2</h1>
        <div>
            <NoneMapStore v-for="(number, index) in loop" :key="index" :index-str="number" :is-loading="isLoading" :users="users" :profile="profile" />
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapMutations, mapState} from 'vuex';
import NoneMapStore from '@/components/NoneMapStore.vue';

@Component({
    components: {NoneMapStore},
    computed: {
        ...mapState('dashboard', ['isLoading', 'profile', 'users'])
    }
})
export default class DashboardService extends Vue {
    isLoading!: boolean
    profile!: any
    users!: any
    get loop(): number[] {
        const numbers = []
        for (let i = 0; i <= 3000; i++) {
            numbers.push(i)
        }

        return numbers
    }
}
</script>
