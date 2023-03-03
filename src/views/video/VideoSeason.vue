<template>
    <div v-if="loading" class="load"></div>
    <div v-else class="main-content">
        <div class="backdropContainer" v-bind:style="{ backgroundImage: 'url(' + backImg + ')' }">
        </div>
        <div class="view-backdrop">
            <div class="mainColumn">
                <div class="view-scroller">
                    <div class="view-card-image">
                        <img :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + data.poster_path' alt="">
                    </div>
                    <div class="view-card-detail detailTextContainer">
                        <div class="lex-direction-column">
                            <div class="itemPrimaryNameContainer">
                                <h1 class="itemName-primary">{{ data.name }}</h1>
                                <h2>{{ season.name }}</h2>
                            </div>
                            <div class="mediaInfo">
                                <div class="mediaInfoItem">
                                    <span class="icon-star">
                                        <i class='bx bxs-star'></i>
                                    </span>{{ isNaN(Math.floor(data.vote_average * 100) / 100) ?
                                        "" :
                                        Math.floor(data.vote_average * 100) / 100
                                    }}
                                </div>
                                <div class="mediaInfoItem">{{ data.release_date }}</div>
                                <div class="mediaInfoItem mediaInfoOfficialRating">{{ data.OfficialRating ?
                                    data.OfficialRating : "-"
                                }}</div>
                                <div class="mediaInfoItem tag-list">
                                    <div class="tag-item" v-for="(item, index) in data.genres" :key="index">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>

                            <n-space size="large" class="detailButtons">
                                <button @click="Play()" class="detailButton outlineButton">
                                    <span class="button-icon">
                                        <i class='bx bxs-caret-right-circle'></i>
                                    </span>
                                    <span class="button-text">
                                        播放
                                    </span>
                                </button>
                                <button @click="ReNewPlayed()"
                                    :class="[data.played ? 'active' : '', 'detailButton', 'outlineButton']">
                                    <span class="button-icon">
                                        <i class='bx bx-check-circle'></i>
                                    </span>
                                    <span class="button-text">
                                        已播放
                                    </span>
                                </button>
                                <button @click="ReNewHeart()"
                                    :class="[data.heart ? 'active' : '', 'detailButton', 'circleButton']">
                                    <span class="button-icon">
                                        <i class='bx bxs-heart'></i>
                                    </span>
                                </button>
                                <button @click="ReNewStar()"
                                    :class="[data.star ? 'active' : '', 'detailButton', 'circleButton']">
                                    <span class="button-icon">
                                        <i class='bx bxs-star'></i>
                                    </span>
                                </button>
                                <button class="detailButton circleButton">
                                    <span class="button-icon">
                                        <i class='bx bxs-trash-alt'></i>
                                    </span>
                                </button>
                                <button class="detailButton circleButton">
                                    <span class="button-icon">
                                        <i class='bx bx-dots-vertical-rounded'></i>
                                    </span>
                                </button>
                            </n-space>
                            <div class="overview-text">
                                {{ data.overview }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="showContainer">
                    <div class="show-header">
                        <div class="show-title">
                            <h3>剧集信息</h3>
                        </div>
                    </div>
                    <div class="episode-card-list">
                        <div class="episode-card-item" v-for="(item, index) in season.episodes" :key="index">
                            <div @click="ItemPlayer(item, index)" class="episode-img">
                                <img loading="lazy" :src='COMMON.imgUrl + "/t/p/w710_and_h400_multi_faces" + item.still_path'
                                    alt="">
                            </div>
                            <div class="episode-content">
                                <div class="episode-name">
                                    {{ index + 1 }}.
                                    {{ item.name }}
                                </div>
                                <div class="episode-star">
                                    <span class="icon-star">
                                        <i class='bx bxs-star'></i>
                                    </span>{{ isNaN(Math.floor(item.vote_averag * 100) / 100) ?
                                        "" :
                                        Math.floor(item.vote_averag * 100) / 100
                                    }}
                                </div>
                                <div class="episode-overview">
                                    {{ item.overview }}
                                </div>
                            </div>
                            <div class="episode-buttons">
                                <button @click="PlayEpisod(index+1)" :class="['detailButton', 'circleButton']">
                                    <span class="button-icon">
                                        <i class='bx bxs-right-arrow'></i>
                                    </span>
                                </button>
                                <button class="detailButton circleButton">
                                    <span class="button-icon">
                                        <i class='bx bx-dots-vertical-rounded'></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import Snackbar from 'node-snackbar';
import { getCurrentInstance, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from 'vue-router';

export default {
    name: 'VideoSeason',
    setup() {
        const loading = ref(true);
        const tv_id = ref(null);
        const backImg = ref(null);
        const data = ref(null);
        const season = ref(null);
        const error = ref(null);
        const { proxy } = getCurrentInstance();
        const seasonId = ref(null);
        const gallery_type = ref(null);
        tv_id.value = proxy.$route.query.tv_id;
        seasonId.value = proxy.$route.query.id;
        gallery_type.value = proxy.$route.query.gallery_type;
        const form = ref({
            "data_type": "",
            "data_id": ""
        })
        
        // Season
        function fetchSeason() {
            let api = proxy.COMMON.apiUrl + `/v1/api/theseason/id?id=${seasonId.value}`;
            proxy.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    season.value = res.data.data;
                    loading.value = false;
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        }


        function fetchData() {
            let api = proxy.COMMON.apiUrl + `/v1/api/thetv/id?id=${tv_id.value}`;
            proxy.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    data.value = res.data.data;
                    backImg.value = proxy.COMMON.imgUrl + "/t/p/w1920_and_h1080_bestv2" + data.value.backdrop_path
                    form.value.data_type = gallery_type.value;
                    form.value.data_id = data.value.id;
                    fetchSeason();
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        }



        onBeforeRouteUpdate((to, from) => {
            seasonId.value = to.query.id;
            tv_id.value = to.query.tv_id;
            gallery_type.value = to.query.gallery_type;
            fetchData();
        });

        const reF = () => {
            fetchData();
        };

        onMounted(() => {
            fetchData();
        });
        return {
            tv_id,
            data,
            seasonId,
            gallery_type,
            form,
            reF,
            loading,
            error,
            season,
            backImg,
        }
    },
    methods: {
        Play() {
            this.$router.push({
                path: "/player",
                query: {
                    id: this.tv_id,
                    gallery_type: this.gallery_type,
                    season_id: this.seasonId
                }
            })
        },
         PlayEpisod(speed) {
            this.$router.push({
                path: "/player",
                query: {
                    id: this.tv_id,
                    gallery_type: this.gallery_type,
                    season_id: this.seasonId,
                    speed:speed
                }
            })
        },
        Request(api, data) {
            this.axios.post(api, data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.reF();
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        },
        ReNewPlayed() {
            this.Request(this.COMMON.apiUrl + '/v1/api/played/renew', this.form)
        },
        ReNewStar() {
            this.Request(this.COMMON.apiUrl + '/v1/api/star/renew', this.form)
        },
        ReNewHeart() {
            this.Request(this.COMMON.apiUrl + '/v1/api/heart/renew', this.form)
        },
    }
}
</script >

<style scoped>
.backdropContainer {
    contain: style size;
    position: fixed;
    top: 60px;
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

.view-backdrop {
    background-image: linear-gradient(90deg, #a39090 150px, rgb(207 179 179 / 84%));
    position: relative;
    min-height: 100vh;
}

.mainColumn .show-header ion-icon {
    color: white;
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

.mediaInfo .icon-star ion-icon {
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
    top: 2px;
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

.episode-card-list {
    display: grid;
    gap: 20px;
}

.episode-card-item {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
}

.episode-card-item>* {
    flex: 1;
}

.episode-title {
    font-size: 1.2em;
}

.episode-img img {
    border-radius: 4px;
    width: 100%;
    aspect-ratio: 16/11;
}

.episode-name {
    font-size: 1.2em;
}

.icon-star {
    color: yellow
}

.episode-buttons .detailButton.circleButton {
    margin-right: 10px;
    margin-bottom: 10px;
    /* justify-content: center; */
}

.show-title h3 {
    font-size: 1.2em;
}

@media (max-width: 750px) {
    .view-scroller {
        flex-direction: column;
    }

    .view-card-image {
        width: 65%;
        margin: 0 auto;
    }

    .episode-buttons {
        justify-content: center;
    }
}
</style>