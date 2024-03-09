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
                                        :src='COMMON.imgUrl + "/t/p/w710_and_h400_multi_faces" + item.still_path' alt="">
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
                        <a :href="'iina://weblink/?url=' + urlBase" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/iina.webp" alt="">
                                </template>
                                IINA
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'potplayer://' + urlBase" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/potplayer.webp" alt="">
                                </template>
                                Potplayer
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'vlc://' + urlBase" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/vlc.webp" alt="">
                                </template>
                                vcl
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'nplayer-' + urlBase" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/nplayer.webp" alt="">
                                </template>
                                nplayer
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'infuse://x-callback-url/play?url=' + urlBase" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/infuse.webp" alt="">
                                </template>
                                infuse
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'intent:' + urlBase" target="_blank">
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <img class="play-icon" src="/images/mxplayer.webp" alt="">
                                </template>
                                Mxplayer
                            </n-tooltip>
                        </a>
                    </li>
                    <li class="play-item">
                        <a :href="'intent:' + urlBase" target="_blank">
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
import { loadRouteLocation, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import artplayerPluginDanmuku from "artplayer-plugin-danmuku";
export default {
    name: 'VideoPlayer',
    components: {
        Artplayer,
    },
    setup() {
        const loading = ref(true);
        const rootSubtitle = ref(null);
        const is_ali_open = ref(false);
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
        const urlBase = ref(null);
        const alist_host = ref(null);
        const gallery_type = ref(null);
        const siderRef = ref(null);
        const videoRef = ref(null);
        const left = ref(null);
        left.value = 6 * 170 + 50;
        const { proxy } = getCurrentInstance();
        const timerList = ref([]);
        gallery_type.value = proxy.$route.query.gallery_type;
        season_id.value = proxy.$route.query.season_id;
        id.value = proxy.$route.query.id;

        let speed_str = localStorage.getItem(`${id.value}_${gallery_type.value}`)

        if (gallery_type.value == "tv") {
            speed_str = localStorage.getItem(`${season_id.value}_${gallery_type.value}`)
        }
        if (speed_str != null) {
            speed.value = parseInt(speed_str);
        }
        if (proxy.$route.query.speed != null) {
            speed.value = proxy.$route.query.speed - 1;
        }
        const setting = ref(null);


        //选集
        function selectList() {
            if (!is_ali_open.value) {
                setting.value.id = season.value.episodes[speed.value].url;
                url.value = alist_host.value + season.value.episodes[speed.value].url;
                urlBase.value = encodeURI(url.value);
                chunkSubtitles(season.value.episodes[speed.value].url);
            }
            let selectList = {
                name: "选集",
                html: '选集',
                width: 300,
                tooltip: season.value.name,
                selector: [],
                onSelect: function (item, $dom, event) {
                    speed.value = item.speed
                    if (gallery_type.value == "tv") {
                        localStorage.setItem(`${season_id.value}_${gallery_type.value}`, item.speed);
                    }
                    else {
                        localStorage.setItem(`${id.value}_${gallery_type.value}`, item.speed);
                    }
                    art.plugins.artplayerPluginDanmuku.config({
                        danmuku: `${proxy.COMMON.apiUrl}/v1/api/barrage/get?id=${id.value}&tv=${item.speed}&season_id=${season_id.value}&gallery_type=${gallery_type.value}`
                    })
                    art.plugins.artplayerPluginDanmuku.load();
                    document.title = gallery_type.value == "tv" ? `${data.value.name}第${item.speed + 1}集` : data.value.title
                    if (is_ali_open.value) {
                        urlBase.value = encodeURI(alist_host.value + item.url)
                        OpenVideo(item.url);
                    } else {
                        urlBase.value = encodeURI(item.url);
                        art.switchUrl(item.url, item.html);
                        art.option.id = item.url.replaceAll(alist_host.value, "");
                        art.on('ready', () => {
                            art.play();
                            chunkSubtitles(item.url.replaceAll(alist_host.value, ""));
                        });
                    }
                    return `第${speed.value + 1}集`;
                },
            };
            for (let i = 0; i < season.value.episodes.length; i++) {
                let episode = season.value.episodes[i];
                let item = {
                    default: speed.value == i ? true : false,
                    html: episode.episode_number + "." + episode.name,
                    url: is_ali_open.value ? episode.url : alist_host.value + episode.url,
                    speed: i,
                };
                urlList.value.push(item)
                selectList.selector.push(item);
            }
            setting.value.settings.push(selectList);
            if (is_ali_open.value) {
                OpenVideo(season.value.episodes[speed.value].url);
            } else {
                loading.value = false;
            }
        }

        // 多字幕应用于阿里云open
        function CreateSubtitle(live_transcoding_subtitle_task_list) {
            let subtitle = {
                name: "Subtitle",
                html: '字幕',
                width: 250,
                tooltip: '字幕',
                selector: [
                    {
                        html: '开启字幕',
                        tooltip: '是',
                        switch: true,
                        onSwitch: function (item) {
                            item.tooltip = item.switch ? '否' : '是';
                            art.subtitle.show = !item.switch;
                            return !item.switch;
                        },
                    },
                ],
                onSelect: function (item, $dom, event) {
                    art.subtitle.url = item.url;
                    rootSubtitle.value = item.url;
                    return item.html;
                },
            };

            for (let i = 0; i < live_transcoding_subtitle_task_list.length; i++) {
                let selector = {
                    default: live_transcoding_subtitle_task_list[i].language == "chi" ? true : false,
                    html: `<span style="color:red">${live_transcoding_subtitle_task_list[i].language}</span>`,
                    url: live_transcoding_subtitle_task_list[i].url,
                }
                subtitle.selector.push(selector);
            }
            if (art != null) {
                art.setting.update(subtitle);
            } else {
                setting.value.settings.push(subtitle);
            }
        }

        //获取多清晰度
        function CreateQuality(body, file) {
            let video_preview_play_info = body.data.video_preview_play_info;
            let live_transcoding_task_list = video_preview_play_info.live_transcoding_task_list;
            let live_transcoding_subtitle_task_list = video_preview_play_info.live_transcoding_subtitle_task_list;
            let quality = {
                name: "Quality",
                html: '清晰度',
                width: 150,
                tooltip: '清晰度',
                selector: [],
                onSelect: function (item, $dom, event) {
                    // console.info(item, $dom, event);
                    art.switchQuality(item.url, item.html);
                    setTimeout(function () {
                        art.subtitle.url = rootSubtitle.value;
                    }, 4000)
                    return item.html;
                },
            };
            for (let i = 0; i < live_transcoding_task_list.length; i++) {
                let selector = {
                    default: i == live_transcoding_task_list.length - 1 ? true : false,
                    html: live_transcoding_task_list[i].template_height + "P",
                    url: live_transcoding_task_list[i].url,
                }
                quality.selector.push(selector);
                setting.value.quality.push(selector);
            }
            setting.value.settings.push(quality);

            if (live_transcoding_subtitle_task_list != null) {
                CreateSubtitle(live_transcoding_subtitle_task_list);
            }
            url.value = live_transcoding_task_list[live_transcoding_task_list.length - 1].url;

            setting.value.id = alist_host.value + file;
            loading.value = false;
            setTimeout(function () {
                if (live_transcoding_subtitle_task_list != null) {
                    let subtitleUrl = live_transcoding_subtitle_task_list[0].url;
                    for (let i = 0; i < live_transcoding_subtitle_task_list.length; i++) {
                        if (live_transcoding_subtitle_task_list[i].language == "chi") {
                            subtitleUrl = live_transcoding_subtitle_task_list[i].url;
                        }
                    }
                    if (art != null) {
                        art.subtitle.url = subtitleUrl;
                        rootSubtitle.value = subtitleUrl;
                        WatchArtSubtitle();
                    }
                } else {
                    chunkSubtitles(file);
                }
            }, 5000)
        }

        //更新多清晰度
        function UpdateQuality(body, file) {
            let video_preview_play_info = body.data.video_preview_play_info;
            let live_transcoding_task_list = video_preview_play_info.live_transcoding_task_list;
            let live_transcoding_subtitle_task_list = video_preview_play_info.live_transcoding_subtitle_task_list;
            let qualityList = [];
            let quality = {
                name: "Quality",
                html: '清晰度',
                width: 150,
                tooltip: '清晰度',
                selector: [],
                onSelect: function (item, $dom, event) {
                    art.switchQuality(item.url, item.html);
                    setTimeout(function () {
                        art.subtitle.url = rootSubtitle.value;
                    }, 4000)
                    return item.html;
                },
            };
            for (let i = 0; i < live_transcoding_task_list.length; i++) {
                let selector = {
                    default: i == live_transcoding_task_list.length - 1 ? true : false,
                    html: live_transcoding_task_list[i].template_height + "P",
                    url: live_transcoding_task_list[i].url,
                }
                quality.selector.push(selector);
                qualityList.push(selector);
            }
            if (live_transcoding_subtitle_task_list != null) {
                CreateSubtitle(live_transcoding_subtitle_task_list);
            }
            url.value = live_transcoding_task_list[live_transcoding_task_list.length - 1].url;
            art.option.id = file;
            setting.value.id = file;
            art.setting.update(quality);
            art.switchUrl(url.value, "");
            art.quality = qualityList;
            if (live_transcoding_subtitle_task_list != null) {
                let subtitleUrl = live_transcoding_subtitle_task_list[0].url;
                art.subtitle.url = subtitleUrl;
                rootSubtitle.value = subtitleUrl;

            } else {
                chunkSubtitles(file);
            }
        }

        function chunkSubtitles(file) {
            let subtitles = ["srt", "ass", "ssa", "SRT", "ASS", "SSA"]
            Promise.all(
                subtitles.map(async (subtitleType) => {
                    await chunkSubtitle(file, subtitleType)
                })
            ).then(() => {
                WatchArtSubtitle()
            })
        }

        // srt，ass，ssa
        function chunkSubtitle(file, subtitleType) {
            let subtitlePath = alist_host.value + file.replaceAll(file.split('.').pop().split('?')[0], subtitleType);
            proxy.axios.get(subtitlePath, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (!res.data.code) {
                    art.subtitle.url = subtitlePath;
                    rootSubtitle.value = subtitlePath;
                    let subtitle = {
                        name: "Subtitle",
                        html: '字幕',
                        width: 250,
                        tooltip: '字幕',
                        selector: [
                            {
                                html: '开启字幕',
                                tooltip: '是',
                                switch: true,
                                onSwitch: function (item) {
                                    item.tooltip = item.switch ? '否' : '是';
                                    art.subtitle.show = !item.switch;
                                    return !item.switch;
                                },
                            },
                            {
                                html: '字幕字体',
                                tooltip: '40px',
                                range: [20, 5, 200, 5],
                                onChange: function (item, $dom, event) {
                                    art.subtitle.style({
                                        fontSize: item.range + 'px',
                                    });
                                    return item.range + 'px';
                                },
                            },
                            {
                                html: "字幕偏移",
                                tooltip: '0s',
                                range: [0, -10, 10, 1],
                                onChange: function (item, $dom, event) {
                                    art.subtitleOffset = item.range;
                                    return item.range + 's';
                                }
                            }
                        ],
                        onSelect: function (item, $dom, event) {
                            art.subtitle.url = item.url;
                            rootSubtitle.value = item.url;
                            return item.html;
                        },
                    };
                    let selector = {
                        default: true,
                        html: `<span style="color:red">外挂字幕</span>`,
                        url: subtitlePath,
                    }
                    subtitle.selector.push(selector);
                    art.setting.update(subtitle);
                    art.subtitle.style({
                        fontSize: '40px',
                    });
                    return true;
                }
                return false;
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
                return false;
            });
        }
        //监控清晰度切换，重载字幕
        function WatchArtSubtitle() {
            setTimeout(
                function () {
                    art.on('restart', (url) => {
                        art.subtitle.url = rootSubtitle.value;
                    });
                }, 4000
            )

        }

        // 阿里云盘open
        function OpenVideo(file) {
            let api = `${proxy.COMMON.apiUrl}/v1/api/aliopen/video`;
            let form = {
                "file": file,
                "gallery_uid": data.value.gallery_uid
            };
            proxy.axios.post(api, form, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    urlBase.value = encodeURI(alist_host.value + file);
                    if (art == null) {
                        CreateQuality(res.data, file);
                    } else {
                        UpdateQuality(res.data, file);
                    }
                } else {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }

        function debounce(func, delay) {
            let timeoutId;

            return function () {
                const context = this;
                const args = arguments;

                clearTimeout(timeoutId);

                timeoutId = setTimeout(function () {
                    func.apply(context, args);
                }, delay);
            };
        }

        function next_set() {
            // setTimeout(_next_set, 1000*3)
            _next_set()
        }

        function _next_set() {
            if (urlList.value != null) {
                speed.value++;
                if (gallery_type.value == "tv") {
                    localStorage.setItem(`${season_id.value}_${gallery_type.value}`, speed.value);
                }
                else {
                    localStorage.setItem(`${id.value}_${gallery_type.value}`, speed.value);
                }
                if (speed.value <= urlList.value.length) {
                    art.plugins.artplayerPluginDanmuku.config({
                        danmuku: `${proxy.COMMON.apiUrl}/v1/api/barrage/get?id=${id.value}&tv=${speed.value}&season_id=${season_id.value}&gallery_type=${gallery_type.value}`
                    })
                    art.plugins.artplayerPluginDanmuku.load();
                    document.title = `第${speed.value + 1}集`
                    art.switchUrl(urlList.value[speed.value].url, urlList.value[speed.value].html);
                    art.option.id = urlList.value[speed.value].url.replaceAll(alist_host.value, "");
                    var _t = urlList.value.find(i => i.speed === speed.value);
                    var _t2 = urlList.value.find(i => i.default == true);
                    _t.default = true;
                    _t2.default = false;
                    art.setting.update({
                        name: '选集',
                        tooltip: `第${speed.value + 1}集`,
                        selector: urlList
                    });
                }
            }
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
                    console.log("下一集");
                    next_set()
                },
            }
            setting.value.controls.push(next);
        }


        function initArt() {
            if (gallery_type.value == "tv") {
                var danmuku = `${proxy.COMMON.apiUrl}/v1/api/barrage/get?id=${id.value}&tv=${localStorage.getItem(season_id.value + "_tv")}&season_id=${season_id.value}&gallery_type=${gallery_type.value}`;
            }
            else {
                var danmuku = `${proxy.COMMON.apiUrl}/v1/api/barrage/get?id=${id.value}&tv=${localStorage.getItem(id.value + "_tv")}&season_id=${season_id.value}&gallery_type=${gallery_type.value}`;
            }
            var danmu_setting = window.localStorage.danmu_setting;
            if (danmu_setting == undefined) {
                danmu_setting = JSON.stringify({
                    value: {
                        speed: 8.5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
                        opacity: 0.5, // 弹幕透明度，范围在[0 ~ 1]
                        fontSize: '3%', // 字体大小，支持数字和百分比
                        color: '#FFFFFF', // 默认字体颜色
                        mode: 0, // 默认模式，0-滚动，1-静止
                        margin: [10, '75%'], // 弹幕上下边距，支持数字和百分比
                        antiOverlap: true, // 是否防重叠
                        useWorker: true, // 是否使用 web worker
                        synchronousPlayback: true, // 是否同步到播放速度
                        theme: 'light', // 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
                        heatmap: true, // 是否开启弹幕热度图, 默认为 false
                        beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送

                    }
                })

            }
            danmu_setting = JSON.parse(danmu_setting).value

            danmu_setting.danmuku = danmuku
            setting.value = {
                url: "",
                id: "",
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
                    },
                    mkv: function (video, url) {
                        const flvPlayer = flvjs.createPlayer({
                            type: 'mkv',
                            url: url
                        })
                        flvPlayer.attachMediaElement(video)
                        flvPlayer.load()
                    },
                    mp4: function (video, url) {
                        const flvPlayer = flvjs.createPlayer({
                            type: 'mkv',
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
                autoMini: true, // 当播放器滚动到浏览器视口以外时，自动进入 迷你播放 模式
                screenshot: false,
                setting: true,
                loop: true,
                flip: false,    // 是否显示视频翻转功能，目前只出现在 设置面板 和 右键菜单 里
                playbackRate: false,
                aspectRatio: true,
                fastForward: true,
                fullscreen: true,
                fullscreenWeb: false,
                subtitleOffset: false,
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
                    // {
                    //     position: 'right',
                    //     index: 15,
                    //     html: '<img width="18" heigth="18" src="./images/download.svg">',
                    //     tooltip: '下载视频',
                    //     style: {
                    //         color: 'red',
                    //     },
                    //     click: function () {
                    //         const a = document.createElement('a');
                    //         a.setAttribute('href', url.value);
                    //         a.setAttribute('target', "_blank");
                    //         a.setAttribute('download', "001.mp4");
                    //         a.click();
                    //     },
                    // }
                    {
                        name: 'skip',
                        position: 'right',
                        html: '头尾',
                        selector: [
                            {
                                default: true,
                                html: '记录片头',
                            },
                            {
                                html: '记录片尾',
                            },
                        ],
                        onSelect: function (item, $dom) {
                            // console.info(item, $dom);
                            if (item.html == '记录片头') {
                                var api = `${proxy.COMMON.apiUrl}/v1/api/barrage/time_update?type=head_time&season_id=${season_id.value}&head_time=${art.currentTime}`;
                            }
                            else {
                                var api = `${proxy.COMMON.apiUrl}/v1/api/barrage/time_update?type=tail_time&season_id=${season_id.value}&tail_time=${art.duration - art.currentTime}`;
                            }
                            proxy.axios.get(api, {
                                headers: {
                                    'content-type': 'application/json',
                                    'Authorization': proxy.$cookies.get("Authorization")
                                }
                            }).then(res => {
                                if (item.html == '记录片头') {
                                    season.value.head_time = res.data.data;
                                }
                                else {
                                    season.value.tail_time = res.data.data;
                                }
                                proxy.COMMON.ShowMsg(res.data.msg)
                            })
                            return '记录片头片尾';
                        },
                    },
                    {
                        name: '倍速',
                        position: 'right',
                        html: '倍速',
                        selector: [
                            {
                                html: 0.5,
                            },
                            {
                                html: 0.8,
                            },
                            {
                                html: 1,
                            }, {
                                html: 1.2,
                            }, {
                                html: 1.5,
                            }, {
                                html: 1.8,
                            }, {
                                html: 2,
                            }, {
                                html: 2.5,
                            }, {
                                html: 2.8,
                            }, {
                                html: 3,
                            },
                        ],
                        onSelect: function (item, $dom) {
                            art.playbackRate = item.html;
                            return '倍速';
                        },
                    }
                ],
                quality: [],
                icons: {
                    loading: '<img width="60" heigth="60" src="./images/loading.gif">',
                    state: '<img width="60" heigth="60" src="./images/play2.svg">',
                    indicator: '<img width="16" heigth="16" src="./images/indicator.svg">',
                },
                plugins: [
                    //   artplayerPluginControl(),
                    artplayerPluginDanmuku(danmu_setting)
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
                    // LoadBulletScreen();
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
                        alist_host.value = process.env.NODE_ENV === 'production' ? window.location.origin + "/file/" : proxy.COMMON.apiUrl + "/file/";
                    }
                    is_ali_open.value = res.data.is_ali_open;
                    if (gallery_type.value == "movie") {
                        if (is_ali_open.value) {
                            OpenVideo(data.value.url);
                        } else {
                            url.value = alist_host.value + data.value.url;
                            setting.value.id = data.value.url;
                            urlBase.value = encodeURI(url.value);
                            chunkSubtitles(data.value.url);
                            loading.value = false;
                        }

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

        function load_art_settings() {
            // 设置自定义的弹幕设置方案
            if (art.setting.option.find((r) => r.name == "danmuku") != undefined) {
                art.setting.remove('danmuku');
            }
            art.setting.add({
                width: 260,
                name: "danmuku",
                html: "弹幕设置",
                tooltip: "更多",
                selector: [{
                    width: '20%',
                    html: "播放速度",
                    icon: "",
                    tooltip: "5",
                    range: [5, 1, 10, 1],
                    onChange: function (t, $dom, event) {
                        // TODO 设置值的代码
                        art.plugins.artplayerPluginDanmuku.config({
                            speed: t.range
                        })
                        return t.range
                    }
                }, {
                    width: '20%',
                    html: "字体大小",
                    icon: "",
                    tooltip: "6%",
                    range: [6, 1, 10, 1],
                    onChange: function (t, $dom, event) {
                        // TODO 设置值的代码
                        art.plugins.artplayerPluginDanmuku.config({
                            fontSize: t.range + "%"
                        })
                        return t.range + "%"
                    }
                }, {
                    width: '20%',
                    html: "不透明度",
                    icon: "",
                    tooltip: "100%",
                    range: [100, 0, 100, 20],
                    onChange: function (t, $dom, event) {
                        // TODO 设置值的代码
                        art.plugins.artplayerPluginDanmuku.config({
                            opacity: t.range / 100
                        })
                        return t.range + "%"
                    }
                }, {
                    width: '20%',
                    html: "显示范围",
                    icon: "",
                    tooltip: "80%",
                    range: [80, 0, 100, 10],

                    onChange: function (t, $dom, event) {
                        // TODO 设置值的代码
                        art.plugins.artplayerPluginDanmuku.config({
                            margin: [10, 100 - t.range + "%"]
                        })
                        return t.range + "%"
                    }
                }, {
                    html: "弹幕防重叠",
                    icon: "",
                    tooltip: "开启",
                    switch: true,
                    onSwitch: t => (art.plugins.artplayerPluginDanmuku.config({
                        antiOverlap: !t.switch
                    }),
                        t.tooltip = t.switch ? "关闭" : "开启",
                        !t.switch)
                }, {
                    html: "同步视频速度",
                    icon: "",
                    tooltip: "开启",
                    switch: true,
                    onSwitch: t => (art.plugins.artplayerPluginDanmuku.config({
                        synchronousPlayback: !t.switch
                    }),
                        t.tooltip = t.switch ? "关闭" : "开启",
                        !t.switch)
                }]
            })

            art.storage.name = 'skip';
            if (art.setting.option.find((r) => r.name == "跳过片头片尾") != undefined) {
                art.setting.remove('跳过片头片尾');
            }

            var d = {
                name: "跳过片头片尾",
                html: '跳过片头片尾',
                tooltip: art.storage.get('skip') == undefined ? "打开" : (art.storage.get('skip') ? "打开" : "关闭"),
                switch: art.storage.get('skip') == undefined ? true : art.storage.get('skip'),
                onSwitch: function (item, $dom, event) {
                    console.log(item);
                    art.storage.name = 'skip';
                    art.storage.set('skip', !item.switch);
                    art.storage.name = "artplayer_settings"
                    const nextState = !item.switch;
                    item.tooltip = nextState ? '打开' : '关闭';
                    return nextState;
                },
            }
            art.setting.update(d);
            art.storage.name = "artplayer_settings"
        }
        function ready() {
            console.log(1);
            art.controls.remove('volume');

            var params = new URLSearchParams(window.location.search);
            if (localStorage.playbackRate) {
                art.playbackRate = localStorage.playbackRate;
            }
            head_time = 0;
            if (params.get("gallery_type") == "tv") {
                var head_time = season.value.head_time - 8;
                var tail_time = season.value.tail_time + 8;
            }
            var duration = art.duration;
            if (duration != 0) {
                if (head_time >= (duration / 3)) {
                    head_time = 0;
                    proxy.COMMON.ShowMsg("开头时长大于视频的三分之一，禁止跳过")
                }
            }

            // 获取在线进度
            var api = "";
            if (params.get("gallery_type") == "tv") {
                api = `${proxy.COMMON.apiUrl}/v1/api/progress/get?tv_id=${params.get("id")}&season_id=${params.get("season_id")}`;
            }
            else {
                api = `${proxy.COMMON.apiUrl}/v1/api/progress/get?tv_id=${params.get("id")}`;
            }
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith("UserId" + "="));
            proxy.axios.post(api, {
                "data": art.url
            }, {
                headers: {
                    'content-type': 'application/json',
                    'UserId': cookieValue.split("=")[1],
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                var times = {};
                var res_data = res.data.data;
                if (res_data == undefined) {
                    art.storage.name = 'skip';
                    if ((art.storage.get('skip') == undefined || art.storage.get('skip')) && head_time > 0) {
                        proxy.COMMON.ShowMsg("跳过开头")
                        art.currentTime = head_time;
                    }
                    art.play();
                }
                else {
                    var tv_path = res_data.tv_path;
                    var _time = res_data.time;
                    var a = localStorage.artplayer_settings != undefined ? localStorage.artplayer_settings : "{}";
                    var local_times = JSON.parse(a).times;
                    if (tv_path in local_times) {
                        // 默认使用本地进度
                        times[tv_path] = local_times[tv_path];
                        if (local_times[tv_path] < _time) {
                            times[tv_path] = _time;
                        }
                    }
                    else {
                        times[tv_path] = _time;
                    }
                    localStorage.artplayer_settings = JSON.stringify({ "times": times });
                    if (head_time > 0 && head_time > _time) {
                        if (art.storage.get('skip') == undefined || art.storage.get('skip')) {
                            proxy.COMMON.ShowMsg("跳过开头")
                            _time = head_time;
                        }

                    }
                    art.currentTime = _time;
                    art.play();

                }
                art.storage.name = 'artplayer_settings';
                load_art_settings()

            })




            // art.currentTime = JSON.parse(localStorage.artplayer_settings).times[decodeURI(art.url).match(/\/d\/.*$/)[0]];
        }

        function upload_progress() {
            var params = new URLSearchParams(window.location.search);
            var api = "";
            if (params.get("gallery_type") == "tv") {
                api = `${proxy.COMMON.apiUrl}/v1/api/progress/update?tv_id=${params.get("id")}&season_id=${params.get("season_id")}`;
            }
            else {
                api = `${proxy.COMMON.apiUrl}/v1/api/progress/update?tv_id=${params.get("id")}`;
            }
            var data = {}
            var tv = {}
            for (var k of Object.keys(localStorage)) {
                if (k.endsWith("_tv")) {
                    tv[k] = localStorage[k]
                }
            }
            data['tv'] = tv
            data["artplayer_settings"] = JSON.parse(localStorage.artplayer_settings)
            proxy.axios.post(api, {
                "data": data
            }, {
                headers: {
                    'content-type': 'application/json',
                    'UserId': getCookie('UserId'),
                    "Authorization": proxy.$cookies.get("Authorization")
                }
            }).then(res => {
            }).catch((error) => {
            });

        }

        function getCookie(name) {
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith(name + "="));

            if (cookieValue) {
                return cookieValue.split("=")[1];
            }

            return null;
        }

        const artF = async (data) => {
            art = data;
            art.on('restart', () => {
                ready();
                url.value = encodeURI(art.url);
            });
            art.on('ready', ready);
            art.on('video:ratechange', () => {
                localStorage.playbackRate = art.playbackRate;
            });
            art.on("video:timeupdate", () => {
                // console.log(art.currentTime);
                var duration = art.duration;
                var tail_time = season.value.tail_time;
                if (tail_time > duration / 3) {
                    return
                }

                if ((art.currentTime + tail_time) > duration) {
                    art.currentTime = 1
                    next_set()
                }


            })
            art.on('video:ended', () => {
                console.log("视频播放完毕");
                next_set()
            });

            art.on('artplayerPluginDanmuku:config', (option) => {
                art.storage.name = 'danmu_setting';
                var o = JSON.parse(JSON.stringify(option))
                delete o.danmuku;
                art.storage.set("value", o);
                art.storage.name = 'artplayer_settings';
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
            for (var t of timerList.value) {
                clearInterval(t);
            }
        });

        onMounted(() => {
            initArt();
            initArtTv();
            fetchData();
            // get_progress();
            var _timer1 = setInterval(() => {
                if (gallery_type.value == "tv") {
                    var new_url = encodeURI(alist_host.value + season.value.episodes[speed.value].url)
                }
                else {
                    var new_url = encodeURI(alist_host.value + data.value.url)
                }
                var currentTime = art.currentTime;
                console.log(currentTime);
                // art.url = new_url;
                var url = new URL(new_url);
                url.searchParams.append("r", new Date().getTime());
                art.seek = currentTime;
                setTimeout(() => {
                    art.switchQuality(url.toString());
                }, 3000);
            }, 1000 * 60 * 14)

            var _timer2 = setInterval(upload_progress, 10000)
            timerList.value.push(_timer1);
            timerList.value.push(_timer2);

            // timerList.value.push(setInterval(()=>{

            // }));



        });

        return {
            season_id,
            showModal,
            id,
            data,
            like,
            urlBase,
            artF,
            error,
            setting,
            gallery_type,
            loading,
            url,
            siderRef,
            videoRef,
            left,
            season,
            proxy,
            art
        }
    },
    methods: {
        getInstance(_art) {
            this.artF(_art);
            this.art = _art;
            this.art.url = this.url
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
        }
    }
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
    max-height: 120px;
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

.art-video-player .art-mask .art-state {
    position: absolute;
    bottom: 65px;
    right: 30px;
}

@media (max-width: 767px) {
    img.play-icon {
        width: 40px;
        height: 40px;
    }
}
</style>