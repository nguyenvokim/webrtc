<template>
    <div>
        <Header />
        <div class="p-5">
            <div class="user_board">
                <UserCard v-for="user in users" :key="user.id" :user="user" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapMutations, mapState} from 'vuex';
import Header from '@/components/common/Header.vue';
import UserCard from '@/components/dashboard/UserCard.vue';
import UserModel from '@/models/UserModel';

@Component({
    components: {UserCard, Header},
    methods: {
        ...mapActions('dashboard', ['fetchProfile', 'fetchUsers']),
        ...mapMutations('dashboard', ['setLoading'])
    },
    computed: {
        ...mapState('dashboard', ['isLoading', 'users'])
    }
})
export default class DashboardService extends Vue {

    fetchUsers!: () => Promise<void>;
    fetchProfile!: () => Promise<void>;
    setLoading!: (flag: boolean) => void;
    isLoading!: boolean;
    users!: UserModel[]

    async created() {
        await Promise.all([this.fetchProfile(), this.fetchUsers()]);
        this.setLoading(false);
    }
}
</script>
