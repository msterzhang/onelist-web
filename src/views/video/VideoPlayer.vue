<template>
    <div v-if="loading" class="load"></div>
    <div v-else class="content">
        <n-grid cols="12" x-gap="16" item-responsive responsive="screen">
            <n-grid-item span="12 m:12 l:9 xl:9 2xl:9">
                <div class="player">
                    <Artplayer class="art-player" @get-instance="getInstance" :option="setting" />
                </div>
                <div class="showContainer">
                    <div class="data-header">
                        <div class="header-left">
                            <div class="data-title">
                                {{ gallery_type == "tv" ? data.name : data.title }}
                            </div>
                            <div class="season-title">
                                {{ season != nul ? season.name : "" }}
                            </div>
                        </div>
                        <div class="header-right">
                            <n-button @click="showModal = !showModal" strong secondary circle>
                                <i class='bx bx-dots-vertical-rounded'></i>
                            </n-button>
                        </div>
                    </div>
                    <div class="data-content">
                        <div class="star">
                            评分：{{ isNaN(Math.floor(data.vote_average * 100) / 100) ?
                                "" :
                                Math.floor(data.vote_average * 100) / 100
                            }}
                        </div>
                        <div class="yaer">
                            <p> 发行时间：{{ data.release_date }}</p>
                        </div>
                        <div class="overview-text">
                            简介：
                            <p>{{ data.overview }}</p>
                        </div>
                    </div>
                </div>
                <div class="showContainer">
                    <div class="show-header">
                        <div class="show-title">
                            <h3>演职人员</h3>
                        </div>
                        <div class="show-header-tool">
                            <n-space>
                                <n-button @click="siderRef?.scrollBy({ left: -left })" circle>
                                    <i class='bx bx-chevron-left'></i>
                                </n-button>
                                <n-button @click="siderRef?.scrollBy({ left: left })" circle>
                                    <i class='bx bx-chevron-right'></i>
                                </n-button>
                            </n-space>
                        </div>
                    </div>
                    <n-scrollbar ref="siderRef" x-scrollable>
                        <div style="white-space: nowrap;">
                            <div class="show-card-list">
                                <div class="show-card-item" v-for="(item, index) in data.the_persons" :key="index">
                                    <router-link :to="{ path: '/person', query: { id: item.id, } }">
                                        <div class="show-img">
                                            <img v-if="item.profile_path.length > 0" loading="lazy"
                                                :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.profile_path'
                                                alt="">
                                            <img v-else loading="lazy" src="/images/not_person.jpg" alt="">
                                        </div>
                                    </router-link>
                                    <div class="show-name">
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </n-scrollbar>
                </div>

                <div class="showContainer">
                    <div class="show-header">
                        <div class="show-title">
                            <h3>同类型推荐</h3>
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
                    <n-scrollbar ref="videoRef" x-scrollable>
                        <div style="white-space: nowrap;">
                            <div class="view-card-list">
                                <div class="view-item" v-show="item.id != data.id" v-for="(item, index) in like"
                                    :key="index">
                                    <router-link :to="{
                                        path: '/video', query: {
                                            id: item.id,
                                            gallery_type: gallery_type
                                        }
                                    }">
                                        <div class="view-item-header">
                                            <div class="view-item-tag-list">
                                                <div class="view-item-tag rating">{{ isNaN(Math.floor(item.vote_average *
                                                    100) / 100) ?
                                                    "" :
                                                    Math.floor(item.vote_average * 100) / 100
                                                }}
                                                </div>
                                                <div v-if="item.played" class="view-item-tag count">
                                                    <i class='bx bx-check'></i>
                                                </div>
                                            </div>
                                        </div>
                                        <img loading="lazy" class="carousel-img"
                                            :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.poster_path'>
                                        <div v-if="item.video != null" class="view-item-title">
                                            {{ item.title }}
                                        </div>
                                        <div v-else class="view-item-title">
                                            {{ item.name }}
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </n-scrollbar>
                </div>
            </n-grid-item>
            <n-grid-item span="0 m:0 l:3 xl:3 2xl:3">
                <div class="show_like">
                    <div v-if="season != null" class="show-header">
                        <div class="show-title">
                            <h3>分集</h3>
                        </div>
                    </div>
                    <n-scrollbar v-if="season != null" style="max-height: 63vh">
                        <div class="episode-card-list">
                            <div class="episode-card-item" v-for="(item, index) in season.episodes" :key="index">
                                <div class="episode-img">
                                    <img v-if="item.still_path.length > 0" loading="lazy"
                                        :src='COMMON.imgUrl + "/t/p/w227_and_h127_bestv2" + item.still_path' alt="">
                                    <img v-else loading="lazy" src="/images/not_img.png" alt="">
                                </div>
                                <div class="episode-content">
                                    <div class="episode-name">
                                        {{ index + 1 }}.
                                        {{ item.name }}
                                    </div>
                                    <div class="episode-overview">
                                        {{ item.overview }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </n-scrollbar>
                    <div class="show-header">
                        <div class="show-title">
                            <h3>推荐</h3>
                        </div>
                    </div>
                    <n-scrollbar style="max-height: 80vh">
                        <div class="show-list">
                            <div class="show-item" v-show="item.id != data.id" v-for="(item, index) in like" :key="index">
                                <router-link :to="{
                                    path: '/video', query: {
                                        id: item.id,
                                        gallery_type: gallery_type
                                    }
                                }">
                                    <img loading="lazy" class="carousel-img"
                                        :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.poster_path'>
                                </router-link>
                                <div class="view-item-content">
                                    <div v-if="item.video != null" class="view-item-title">
                                        {{ item.title }}
                                    </div>
                                    <div v-else class="view-item-title">
                                        {{ item.name }}
                                    </div>
                                    <div class="star">
                                        评分：{{ isNaN(Math.floor(item.vote_average * 100) / 100) ?
                                            "" :
                                            Math.floor(item.vote_average * 100) / 100
                                        }}
                                    </div>
                                    <div class="yaer">
                                        <p> 发行时间：{{ item.release_date }}</p>
                                    </div>
                                    <div class="view-item-overview">
                                        简介：{{ item.overview }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </n-scrollbar>
                </div>
            </n-grid-item>
        </n-grid>
        <n-modal transform-origin="center" v-model:show="showModal">
            <n-card style="width: 600px" title="外部播放器" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="showModal = !showModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <ul class="play-list">
                    <li class="play-item">
                        <a :href="'iina://weblink/?url=' + url" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/iina.webp" alt="">
                                </template>
                                IINA
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'potplayer://' + url" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/potplayer.webp" alt="">
                                </template>
                                Potplayer
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'vlc://' + url" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/vlc.webp" alt="">
                                </template>
                                vcl
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'nplayer-' + url" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/nplayer.webp" alt="">
                                </template>
                                nplayer
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'infuse://x-callback-url/play?url=' + url" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/infuse.webp" alt="">
                                </template>
                                infuse
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'intent:' + url" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/mxplayer.webp" alt="">
                                </template>
                                Mxplayer
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'intent:' + url" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/mxplayer-pro.webp" alt="">
                                </template>
                                Mxplayer-Pro
                            </n-tooltip>
                        </a>
                    </li>
                </ul>
            </n-card>
        </n-modal>
    </div>
</template>
<script>
import Artplayer from "./ArtPlayer.vue";

import flvjs from 'flv.js';
import Hls from 'hls.js';
import { getCurrentInstance, onMounted, ref } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
export default {
    name: 'VideoPlayer',
    components: {
        Artplayer,
    },
    setup() {
        const loading = ref(true);
        const showModal = ref(false);
        const speed = ref(0);
        const urlList = ref([]);
        const error = ref(null);
        const data = ref(null);
        const like = ref(null);
        const season = ref(null);
        const season_id = ref(null);
        let art = null;
        const id = ref(null);
        const url = ref(null);
        const alist_host = ref(null);
        const gallery_type = ref(null);
        const siderRef = ref(null);
        const videoRef = ref(null);
        const left = ref(null);
        left.value = 6 * 170 + 50;
        const { proxy } = getCurrentInstance();
        gallery_type.value = proxy.$route.query.gallery_type;
        season_id.value = proxy.$route.query.season_id;
        id.value = proxy.$route.query.id;

        let speed_str = localStorage.getItem(`${id.value}_${gallery_type.value}`)
        if (speed_str != null) {
            speed.value = parseInt(speed_str);
        }
        if (proxy.$route.query.speed != null) {
            speed.value = proxy.$route.query.speed - 1;
        }
        const setting = ref(null);


        //选集
        function selectList() {
            url.value = alist_host.value + season.value.episodes[speed.value].url
            let selectList = {
                html: '选集',
                width: 200,
                tooltip: season.value.name,
                selector: [],
                onSelect: function (item, $dom, event) {
                    localStorage.setItem(`${id.value}_${gallery_type.value}`, item.speed);
                    document.title = gallery_type.value == "tv" ? `${data.value.name}第${item.speed + 1}集` : data.value.title
                    art.switchUrl(item.url, item.html);
                    art.on('ready', () => {
                        art.play();
                    });
                    return item.html;
                },
            };
            for (let i = 0; i < season.value.episodes.length; i++) {
                let episode = season.value.episodes[i];
                let item = {
                    default: speed.value == i ? true : false,
                    html: episode.episode_number + "." + episode.name,
                    url: alist_host.value + episode.url,
                    speed: i,
                };
                urlList.value.push(item)
                selectList.selector.push(item);
            }
            setting.value.settings.push(selectList);
        }

        // 下一集按钮，还不能和选集面板联动，暂时不用
        function initArtTv() {
            let next = {
                position: 'left',
                index: 11,
                html: '<img width="22" heigth="22" src="./images/next.svg">',
                tooltip: '下一集',
                style: {
                    color: 'green',
                },
                click: function () {
                    if (urlList.value != null) {
                        speed.value++;
                        if (speed.value <= urlList.value.length) {
                            art.switchUrl(urlList.value[speed.value - 1].url, urlList.value[speed.value - 1].html);
                        }
                    }
                },
            }
            setting.value.controls.push(next);
        }


        function initArt() {
            setting.value = {
                url: "",
                customType: {
                    m3u8: function (video, url) {
                        var hls = new Hls()
                        hls.loadSource(url)
                        hls.attachMedia(video)
                    },
                    flv: function (video, url) {
                        const flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            url: url
                        })
                        flvPlayer.attachMediaElement(video)
                        flvPlayer.load()
                    }
                },
                title: "",
                hotkey: true,
                poster: '',
                volume: 0.5,
                isLive: false,
                muted: false,
                autoplay: false,
                lock: true,
                pip: false,
                autoSize: false,
                autoMini: false,
                screenshot: false,
                setting: true,
                loop: true,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                fastForward: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: true,
                miniProgressBar: false,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                airplay: true,
                theme: '#23ade5',
                lang: navigator.language.toLowerCase(),
                // whitelist: [(ua) => /iPhone/gi.test(ua)],
                moreVideoAttr: {
                    crossOrigin: 'anonymous',
                },
                settings: [],
                controls: [
                    {
                        position: 'right',
                        index: 15,
                        html: '<img width="18" heigth="18" src="./images/download.svg">',
                        tooltip: '下载视频',
                        style: {
                            color: 'red',
                        },
                        click: function () {
                            const a = document.createElement('a');
                            a.setAttribute('href', url.value);
                            a.setAttribute('target', "_blank");
                            a.setAttribute('download', "001.mp4");
                            a.click();
                        },
                    }
                ],

                icons: {
                    loading: '<img width="80" heigth="80" src="./images/loading.gif">',
                    state: '<img width="200" heigth="200" src="./images/play.svg">',
                    indicator: '<img width="16" heigth="16" src="./images/indicator.svg">',
                },
                plugins: [
                    //   artplayerPluginControl(),
                ],
            }
        }

        // 保存已播放
        function fetchPlayed() {
            let api = `${proxy.COMMON.apiUrl}/v1/api/played/renew`;
            proxy.axios.post(api, {
                "data_type": gallery_type.value,
                "data_id": data.value.id
            }, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code != 200) {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }

        function fetchData() {
            let api = `${proxy.COMMON.apiUrl}/v1/api/themovie/id?id=${id.value}`;
            if (gallery_type.value == "tv") {
                api = `${proxy.COMMON.apiUrl}/v1/api/thetv/id?id=${id.value}`
            }
            proxy.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    data.value = res.data.data;
                    like.value = res.data.like;
                    document.title = gallery_type.value == "tv" ? `${data.value.name}第${speed.value + 1}集` : data.value.title
                    fetchHost();
                    if (!data.value.played) {
                        fetchPlayed();
                    }
                } else {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }

        // Season
        function fetchSeason() {
            let api = proxy.COMMON.apiUrl + `/v1/api/theseason/id?id=${season_id.value}`;
            proxy.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    season.value = res.data.data;
                    selectList();
                    loading.value = false;
                } else {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }

        function fetchHost() {
            let api = `${proxy.COMMON.apiUrl}/v1/api/gallery/host?id=${data.value.gallery_uid}`;
            proxy.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    if (res.data.data.length > 0) {
                        alist_host.value = res.data.data;
                    } else {
                        alist_host.value = process.env.NODE_ENV === 'production'?window.location.origin: proxy.COMMON.apiUrl + "/file/";
                    }
                    if (gallery_type.value == "movie") {
                        url.value = alist_host.value + data.value.url;
                        loading.value = false;
                    } else {
                        fetchSeason();
                    }

                } else {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }

        const artF = async (data) => {
            art = data;
            art.on('restart', () => {
                url.value = encodeURI(art.url);
            });
        }
        onBeforeRouteUpdate((to, from) => {
            id.value = to.query.id;
            gallery_type.value = to.query.gallery_type;
            season_id.value = to.query.season_id;
            if (to.query.speed != null) {
                speed.value = to.query.speed - 1;
            }
            fetchData();
        });

        onBeforeRouteLeave((to, from) => {
            document.title = proxy.COMMON.title;
        });
        onMounted(() => {
            initArt();
            fetchData();
        });

        return {
            season_id,
            showModal,
            id,
            data,
            like,
            artF,
            error,
            setting,
            gallery_type,
            loading,
            url,
            siderRef,
            videoRef,
            left,
            season
        }
    },
    methods: {
        getInstance(art) {
            this.artF(art);
            this.art = art;
            this.art.url = this.url
            console.info(this.art)
        },
        PlayEpisod(speed) {
            this.$router.push({
                path: "/player",
                query: {
                    id: this.id,
                    gallery_type: this.gallery_type,
                    season_id: this.season_id,
                    speed: speed
                }
            })
        },
    },
}

</script >

<style scoped>
h1 {
    padding: auto;
}


.player .art-player {
    background-color: black;
    width: 100%;
    aspect-ratio: 16/9;
}

.data-content {
    font-size: 16px;
}

.data-title {
    font-size: 1.4em;
    margin-bottom: 6px;
    font-weight: 500;
}

.season-title {
    font-size: 1.2em;
    margin-bottom: 4px;
}

.showContainer {
    padding-top: 8px;
    padding-bottom: 8px;
}

.show-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.data-header {
    display: flex;
    justify-content: space-between;
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


.view-card-list {
    justify-content: space-between;
    display: flex;
    gap: 20px;
}

.view-card-list img {
    border-radius: 4px;
    width: 160px;
    aspect-ratio: 11/16;
}

.card-show-title {
    font-size: 1.2em;
    font-weight: 400;
    padding-bottom: 16px;
}

.view-item-title {
    font-size: 1.2em;
    padding-bottom: 8px;
}

.card-shows {
    margin-bottom: 20px;
}

.view-item {
    text-align: center;
}


.view-card-list .view-item {
    transform: translateY(0) scale(1);
    transition: all .2s ease-in-out;
}

.view-card-list .view-item:hover {
    transform: translateY(-4px) scale(0.95);
    transition: all .2s ease-in-out;
}

.view-item-header {
    position: absolute;
    width: 95%;
    padding-left: 4px;
}


.view-item-tag-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.view-item-tag-list .count {
    background-color: #2d8cf0 !important;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: white;
    padding: 4px;
    text-align: center;
}

.rating {
    color: yellow;
}

.show_like .show-item img {
    width: 120px;
    aspect-ratio: 9/12;
    border-radius: 2px;
}

.show_like .show-item {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}


.episode-card-item {
    display: flex;
    gap: 10px;
}

.episode-card-list img {
    width: 100%;
    max-width: 400px;
    min-width: 200px;
    aspect-ratio: 12/9;
}

.episode-card-list .episode-overview,
.view-item-overview {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
}

.play-list {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-around;
}

.play-list .play-item {

    list-style: none;
}

img.play-icon {
    width: 60px;
    height: 60px;
}

@media (max-width: 767px) {
    img.play-icon {
        width: 40px;
        height: 40px;
    }
}
</style>