<template>
    <div v-if="loading" class="load"></div>
    <div v-else class="main-content">
        <div class="backdropContainer" v-bind:style="{ backgroundImage: 'url(' + backImg + ')' }">
        </div>
        <div class="view-backdrop">
            <div class="mainColumn">
                <div class="view-scroller">
                    <div class="view-card-image">
                        <img :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + data.profile_path' alt="">
                    </div>
                    <div class="view-card-detail detailTextContainer">
                        <div class="lex-direction-column">
                            <div class="itemPrimaryNameContainer">
                                <h1 class="itemName-primary">{{ data.name }}</h1>
                            </div>
                            <n-space size="large" class="detailButtons">
                                <button @click="EditFavorite(data)"
                                    :class="[true ? 'active' : '', 'detailButton', 'circleButton']">
                                    <span class="button-icon">
                                        <i class='bx bxs-heart'></i>
                                    </span>
                                </button>
                                <button class="detailButton circleButton">
                                    <span class="button-icon">
                                        <i class='bx bx-dots-vertical-rounded'></i>
                                    </span>
                                </button>
                            </n-space>
                            <div class="overview-text">
                                {{ data.biography.length == 0 ? "暂无简介" : data.biography }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="showContainer">
                    <div class="show-header">
                        <div class="show-title">
                            <h3>参演电影</h3>
                        </div>
                        <div class="show-header-tool">
                            <n-space>
                                <n-button @click="videoRef?.scrollBy({ left: -left })" circle>
                                    <i class='bx bx-chevron-left'></i>
                                </n-button>
                                <n-button @click="videoRef?.scrollBy({ left: left })" circle>
                                    <i class='bx bx-chevron-right'></i>
                                </n-button>
                            </n-space>
                        </div>
                    </div>
                    <n-scrollbar v-if="data.the_movies != null" ref="videoRef" x-scrollable>
                        <div style="white-space: nowrap;">
                            <div class="show-card-list">
                                <div class="show-card-item" v-for="(item, index) in data.the_movies" :key="index">
                                    <router-link :to="{ path: '/video', query: { id: item.id } }">
                                        <div class="show-img">
                                            <img loading="lazy"
                                                :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.poster_path' alt="">
                                        </div>
                                    </router-link>
                                    <div class="show-name">
                                        {{ item.title }}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </n-scrollbar>
                    <div v-else class="error">
                        <h3>无内容</h3>
                    </div>
                </div>
                <div class="showContainer">
                    <div class="show-header">
                        <div class="show-title">
                            <h3>参演节目</h3>
                        </div>
                        <div class="show-header-tool">
                            <n-space>
                                <n-button @click="seasonRef?.scrollBy({ left: -left })" circle>
                                    <i class='bx bx-chevron-left'></i>
                                </n-button>
                                <n-button @click="seasonRef?.scrollBy({ left: left })" circle>
                                    <i class='bx bx-chevron-right'></i>
                                </n-button>
                            </n-space>
                        </div>
                    </div>
                    <n-scrollbar v-if="data.the_tvs != null" ref="seasonRef" x-scrollable>
                        <div style="white-space: nowrap;">
                            <div class="show-card-list">
                                <div class="show-card-item" v-for="(item, index) in data.the_tvs" :key="index">
                                    <router-link :to="{ path: '/video', query: { id: item.Id } }">
                                        <div class="show-img">
                                            <img loading="lazy"
                                                :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.poster_path' alt="">
                                        </div>
                                    </router-link>
                                    <div class="show-name">
                                        {{ item.name }}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </n-scrollbar>
                    <div v-else class="error">
                        <h3>无内容</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from 'vue-router';

export default {
    name: 'VideoPerson',
    setup() {
        const loading = ref(true);
        const id = ref(null);
        const backImg = ref(null);
        const data = ref(null);
        const seasons = ref(null);
        const simila = ref(null);
        const error = ref(null);
        const { proxy } = getCurrentInstance();
        const videoRef = ref(null);
        const seasonRef = ref(null);
        const left = ref(null);
        left.value = 6 * 170 + 50;
        id.value = proxy.$route.query.id;


        function fetchData() {
            proxy.axios.post(proxy.COMMON.apiUrl + `/v1/api/theperson/id?id=${id.value}`, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    data.value = res.data.data;
                    loading.value = false;
                    // backImg.value = 
                }

            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }




        onBeforeRouteUpdate((to, from) => {
            id.value = to.query.id;
            fetchData();
        });

        onMounted(() => {
            fetchData();
        });

        const refresh = () => {
            fetchData();
        };

        return {
            id,
            data,
            seasons,
            videoRef,
            seasonRef,
            simila,
            loading,
            error,
            backImg,
            left,
            refresh
        }
    }
}
</script >

<style scoped>
.backdropContainer {
    contain: style size;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    inset-inline-start: 0;
    inset-inline-end: 0;
    touch-action: none;
    border-bottom: 1px solid #15191b;
    background-size: cover;
    background-repeat: no-repeat;
}

.mainColumn .show-header ion-icon {
    color: white;
}

.view-backdrop {
    background-image: linear-gradient(90deg, #a39090 150px, rgb(207 179 179 / 84%));
    position: relative;
    min-height: 100vh;
}

.dark .view-backdrop {
    background-image: linear-gradient(90deg, #200b0b 150px, rgba(32, 11, 11, .84));
}


.view-scroller {
    display: flex;
    gap: 20px;
    padding: 14px;
    color: white;
}

.view-scroller .mediaInfo {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

.view-card-image {
    width: 20%;
    border-radius: 5px;
}


.view-card-image img {
    width: 100%;
    border-radius: 5px;
    aspect-ratio: 11/16;

}

@media (min-width: 1300px) {
    .view-card-image img {
        min-width: 240px;
    }
}

.mediaInfo .icon-star {
    color: yellow;
}

.mediaInfo .mediaInfoOfficialRating {
    border: 0.09em solid;
    padding: 0 0.6em;
}

.mediaInfoItem.tag-list {
    display: inherit;
}

.mediaInfoItem.tag-list .tag-item {
    margin-left: 4px;
}

.detailButtons {
    margin-top: 12px;
}

.detailButton {
    background: hsla(285, 4.2%, 40%, .7);
    color: hsla(0, 0%, 100%, 1);
    border-radius: 12px;
    position: relative;
    display: -webkit-inline-flex;
    display: inline-flex;
    -webkit-align-items: center;
    align-items: center;
    box-sizing: border-box;
    font-size: inherit;
    font-family: inherit;
    color: inherit;
    z-index: 0;
    padding: 0.72em 2ch;
    vertical-align: middle;
    border: 0;
    vertical-align: middle;
    border-radius: 0.6em;
    position: relative;
    font-weight: 500;
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
    line-height: inherit;
    outline: 0 !important;
    margin: 0 auto;
}

.detailButton:hover .button-icon,
.detailButton:hover .button-text {
    color: #c33;
}

.detailButton.active .button-icon {
    color: #c33;
}

.detailButton.circleButton {
    border-radius: 50%;
    padding: 0.72em 1.7ch;
}

.button-icon {
    font-size: 25px;
}

span.button-text {
    font-size: 20px;
    margin-left: 4px;
}

.detailButton.outlineButton .button-icon {
    position: relative;
    top: 4px;
}

.overview-text {
    width: 50%;
    min-width: 600px;
    margin-top: 20px;
}

@media (max-width: 750px) {
    .overview-text {
        min-width: 100%;
    }
}

.showContainer {
    padding: 14px;
    color: white;
}

.show-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.show-card-list {
    display: flex;
    gap: 20px;
}

.show-title {
    font-size: 1.2em;
}

.show-img img {
    border-radius: 4px;
    width: 160px;
    aspect-ratio: 11/16;
}

.show-name {
    width: 160px;
    text-overflow: ellipsis;
    overflow: hidden;
}


@media (max-width: 750px) {
    .view-scroller {
        flex-direction: column;
    }

    .view-card-image {
        width: 65%;
        margin: 0 auto;
    }
}
</style>