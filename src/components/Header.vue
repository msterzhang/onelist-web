<template>
    <header>
        <div class="header-content">
            <div class="nav-title-list">
                <div @click="toggDrawer" class="nav-more" id="nav-tog-app">
                    <n-button circle>
                        <ion-icon name="menu-outline"></ion-icon>
                    </n-button>
                </div>
                <div @click="toggIcon" class="nav-more" id="nav-tog">
                    <n-button circle>
                        <ion-icon name="menu-outline"></ion-icon>
                    </n-button>
                </div>
                <div @click="Home()" class="nav-title">
                    {{title}}
                </div>
            </div>
            <div class="flex-end">
                <!-- <n-input round placeholder="搜索">
                    <template #suffix>
                        <ion-icon name="search-outline"></ion-icon>
                    </template>
                </n-input> -->
                <n-avatar @click="LoginOut()"
                          circle
                          size="medium"
                          src="https://wework.qpic.cn/wwpic/622138_d-QTzJ_oQAyVDjO_1656146831/0">

                </n-avatar>
                <n-button @click="toggDark()" circle>
                    <template #icon>
                        <ion-icon name="aperture-outline"></ion-icon>
                    </template>
                </n-button>
            </div>

        </div>
    </header>
</template>

<script>


    export default {
        name: "Header",
        props: {
            title: {
                type: String,
                default: "标题",
            }
        },
        methods: {
            toggDrawer() {
                this.$emit('show-drawer')
            },
            toggIcon() {
                this.$emit('show-icon')
            },
            toggDark() {
                this.$emit('show-dark')
            },
            LoginOut() {
                this.$emit('login-out')
            },
            Home() {
                this.$router.push("/");
            }
        }

    }
</script>

<style scoped>

    header {
        box-shadow: 0 2px 8px #f0f1f2;
        max-width: 100%;
        height: 60px;
        line-height: 60px;
        position: sticky;
        top:0;
        z-index: 1;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-right: 20px;
        padding-left: 20px;
    }

    .nav-title-list {
        display: flex;
        align-items: center;
    }

    .nav-title {
        align-items: center;
        margin-left: 10px;
        padding-bottom: 5px;
    }

    .flex-end {
        display: flex;
        align-items: center;
        gap: 5px;
    }


    /*span.n-avatar,header .flex-end button {*/
        /*height: 32px;*/
        /*width: 42px;*/
    /*}*/

    #nav-tog-app {
        display: none;
    }
    .dark_height header ion-icon {
        color: rgba(255, 255, 255, 0.7);
    }


    .dark header ion-icon {
        color: rgba(255, 255, 255, 0.7);
    }

    .dark .nav-title {
        color: white;
    }

    @media (max-width: 767px) {
        #nav-tog-app {
            display: block;
        }

        #nav-tog {
            display: none;
        }
    }


</style>