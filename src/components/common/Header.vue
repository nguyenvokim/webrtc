<template>
    <div class="header">
        <b-navbar toggleable="sm" type="dark" variant="primary">
            <b-navbar-brand href="#">
                <strong>DigiCollect</strong>
                <img width="30" src="https://cdn.fakercloud.com/avatars/edgarchris99_128.jpg" class="round_image" />
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-navbar-nav style="margin-left: auto">
                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template #button-content>
                        <img :src="profile.avatar" class="round_image" width="28" />&nbsp;&nbsp;<strong>{{fullName}}</strong>
                    </template>
                    <b-dropdown-item href="#">Profile</b-dropdown-item>
                    <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-navbar>
        <MenuBar />
    </div>
</template>
<script lang="ts">

import {Component, Vue} from 'vue-property-decorator';
import {mapState} from 'vuex';
import UserModel from '@/models/UserModel';
import MenuBar from '@/components/common/MenuBar.vue';

@Component({
    components: {MenuBar},
    computed: {
        ...mapState('dashboard', ['profile'])
    },
})
export default class Header extends Vue {
    profile!: UserModel

    get fullName() {
        return `${this.profile.firstName} ${this.profile.firstName}`
    }
}

</script>

<style lang="scss">

</style>
