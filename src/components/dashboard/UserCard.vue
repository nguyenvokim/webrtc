<template>
    <div class="user_card_box">
        <div class="user_card_box_inner">
            <a href="#" class="btn btn-sm btn-primary btn_action">
                <b-icon-chevron-down />
            </a>
            <div class="avatar">
                <img :src="user.avatar" />
                <div class="half_circle" :style="borderAvatarStyle"></div>
            </div>
            <div class="name">
                {{fullName}}
            </div>
            <div class="badge_label" :style="{'background-color': color}">
                {{user.role}}
            </div>
            <div class="row_info border_bottom">
                <div>EmployeeID:</div>
                <div>EMPP{{user.id}}</div>
            </div>
            <div class="row_info border_bottom">
                <div>Email:</div>
                <div>{{user.email}}</div>
            </div>
            <div class="row_info border_bottom">
                <div>Telephone:</div>
                <div>{{user.phone}}</div>
            </div>
            <div class="row_info">
                <div>Department:</div>
                <div>{{user.department}}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import UserModel from '@/models/UserModel';

@Component({})
export default class UserCard extends Vue {
    @Prop({type: Object}) user!: UserModel

    color: string = ''

    created() {
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    get borderAvatarStyle(): Partial<CSSStyleDeclaration> {
        return {
            border: `2px solid ${this.color}`
        }
    }

    get colors(): string[] {
        return [
            '#FF268A',
            '#50BCFF',
            '#206AD3',
            '#F7A00F',
            '#1B9347',
            '#84812A'
        ]
    }

    get fullName() {
        return `${this.user.firstName} ${this.user.firstName}`
    }
}
</script>
