<template>
    <v-navigation-drawer
        :value="drawer"
        temporary
        fixed
        @input="changeDrawer($event)"
    >
        <v-list
            nav
            dense
        >
            <v-list-item-group
                :value="group"
                active-class="primary--text text--primary-4"
                @input="setGroup($event)"
            >
                <v-list-item>
                    <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/men/77.jpg" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>John Leider</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider />

                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    :to="item.to"
                    link
                >
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
export default {
    props: { drawer: Boolean, items: Array },
    data () {
        return {
            group: null
        };
    },
    methods: {
        changeDrawer (value) {
            this.$emit('update:drawer', value);
        },
        setGroup (value) {
            this.group = value;
            this.$emit('update:drawer', false);
        }
    }
};
</script>
