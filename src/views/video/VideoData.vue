<template>
    <div v-if="loading" class="load"></div>
    <div v-else class="main-content">
        <div class="backdropContainer" v-bind:style="{ backgroundImage: 'url(' + backImg + ')' }">
        </div>
        <div class="view-backdrop">
            <div class="mainColumn">
                <div class="view-scroller">
                    <div class="view-card-image">
                        <img :src='COMMON.imgUrl + "/t/p/w220_and_h330_face" + data.poster_path' alt="">
                    </div>
                    <div class="view-card-detail detailTextContainer">
                        <div class="lex-direction-column">
                            <div class="itemPrimaryNameContainer">
                                <h1 class="itemName-primary">{{ gallery_type == "tv" ? data.name : data.title }}</h1>
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
                                <button v-show="is_admin" @click="deleteModal = !deleteModal"
                                    class="detailButton circleButton">
                                    <span class="button-icon">
                                        <i class='bx bxs-trash-alt'></i>
                                    </span>
                                </button>
                                <n-dropdown v-if="is_admin" trigger="hover" size="large" :options="options"
                                    @select="handleSelect">
                                    <button class="detailButton circleButton">
                                        <span class="button-icon">
                                            <i class='bx bx-dots-vertical-rounded'></i>
                                        </span>
                                    </button>
                                </n-dropdown>
                            </n-space>
                            <div class="overview-text">
                                {{ data.overview }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="gallery_type == 'tv'" class="showContainer">
                    <div class="show-header">
                        <div class="show-title">
                            <h3>季</h3>
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
                    <n-scrollbar ref="seasonRef" x-scrollable>
                        <div style="white-space: nowrap;">
                            <div class="show-card-list">
                                <div class="show-card-item" v-for="(item, index) in data.the_seasons" :key="index">
                                    <router-link :to="{
                                        path: '/season', query: {
                                            id: item.id,
                                            tv_id: data.id,
                                            gallery_type: gallery_type
                                        }
                                    }">
                                        <div class="show-img">
                                            <img :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.poster_path'
                                                alt="">
                                        </div>
                                    </router-link>
                                    <div class="show-name season-name">
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
                                <div class="view-item" v-for="(item, index) in like" :key="index">
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
            </div>
        </div>
        <n-modal transform-origin="center" v-model:show="deleteModal">
            <n-card style="width: 600px" title="确认" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="deleteModal = !deleteModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <h3>确定要删除此资源吗？</h3>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="deleteModal = !deleteModal" type="info">
                            <i class='bx bx-x'></i>
                            取消
                        </n-button>
                        <n-button @click="DeleteVideo()" type="warning">
                            <i class='bx bx-check'></i>
                            确定
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>

        <n-modal transform-origin="center" v-model:show="scrapeModal">
            <n-card style="width: 600px" title="重新刮削" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="scrapeModal = !scrapeModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-spin :show="show">
                    <n-form-item v-show="gallery_type == 'tv'" label="资源路径(自行确认)">
                        <n-input v-model:value="tvPath" type="text" size="large" placeholder="">
                        </n-input>
                    </n-form-item>
                    <n-form-item v-show="gallery_type == 'movie'" label="电影资源路径">
                        <n-input disabled="true" v-model:value="file" type="text" size="large" placeholder="">
                        </n-input>
                    </n-form-item>
                    <n-form-item label="搜索媒体信息">
                        <n-input @keyup.enter="SearchVideo()" v-model:value="q" type="text" size="large" placeholder="">
                            <template #prefix>
                                <i class='bx bx-search'></i>
                            </template>
                        </n-input>
                    </n-form-item>
                    <div class="search-list">
                        <div class="search-itme" v-for="(item, index) in searchData" :key="index">
                            <div class="search-img">
                                <img loading="lazy"
                                    :src='"https://tmdb-image-prod.b-cdn.net/t/p/w220_and_h330_face/" + item.poster_path'>
                            </div>
                            <div class="search-content">
                                <div class="search-title">
                                    {{ gallery_type == "tv" ? item.name : item.title }}
                                </div>
                                <div class="search-id">
                                    ID:{{ item.id }}
                                </div>
                                <div class="search-overview">
                                    简介:{{ item.overview }}
                                </div>
                                <n-space justify="end" size="medium">
                                    <n-button @click="RefVideo(item.id)" type="info">
                                        选中刮削
                                    </n-button>
                                </n-space>
                            </div>
                        </div>
                    </div>
                </n-spin>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="SearchVideo()" type="info">
                            <template #icon>
                                  <i class='bx bx-check'></i>
                            </template>
                            搜索
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
        <n-modal transform-origin="center" v-model:show="titleModal">
            <n-card style="width: 600px" title="修改资源" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="titleModal = !titleModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-form-item label="标题">
                    <n-input @keyup.enter="UpdateVideo()" v-model:value="title" type="text" size="large" placeholder="">
                    </n-input>
                </n-form-item>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="UpdateVideo()" type="info">
                            <template #icon>
                                <i class='bx bx-save'></i>
                            </template>
                            确定
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>
<script>
import { getCurrentInstance, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from 'vue-router';

export default {
    name: 'VideoData',
    setup() {
        const show = ref(false);
        const tvId = ref(false);
        const loading = ref(true);
        const is_admin = ref(false);
        const deleteModal = ref(false);
        const scrapeModal = ref(false);
        const updateModal = ref(false);
        const id = ref(null);
        const gallery_type = ref(null);
        const q = ref(null);
        const backImg = ref(null);
        const data = ref(null);
        const like = ref(null);
        const simila = ref(null);
        const error = ref(null);
        const { proxy } = getCurrentInstance();
        const siderRef = ref(null);
        const videoRef = ref(null);
        const seasonRef = ref(null);
        const boxsetRef = ref(null);
        const searchData = ref(null);
        const left = ref(null);
        const seasonId = ref(null);
        const tvPath = ref(null);
        const file = ref(null);
        const title = ref(null);
        const titleModal = ref(false);
        const form = ref({
            "data_type": "",
            "data_id": ""
        })
        left.value = 6 * 170 + 50;
        id.value = proxy.$route.query.id;
        gallery_type.value = proxy.$route.query.gallery_type;
        if (proxy.$cookies.get('is_admin') == "true") {
            is_admin.value = true;
        }

        // 根据Season获得电视剧的path
        function fetchSeason() {
            seasonId.value = data.value.the_seasons[0].id;
            let api = proxy.COMMON.apiUrl + `/v1/api/theseason/id?id=${seasonId.value}`;
            proxy.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    if (res.data.data.episodes.length > 0) {
                        let filePath = res.data.data.episodes[0].url.replaceAll("/d/", "/");
                        let oldPath = filePath.substr(0, filePath.lastIndexOf("/"))
                        if (oldPath.search(/S0/) != -1) {
                            oldPath = oldPath.substr(0, oldPath.lastIndexOf("/"))
                        }
                        tvPath.value = oldPath;
                    }
                } else {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }


        function fetchData() {
            let api = proxy.COMMON.apiUrl + `/v1/api/themovie/id?id=${id.value}`;
            if (gallery_type.value == "tv") {
                api = proxy.COMMON.apiUrl + `/v1/api/thetv/id?id=${id.value}`;
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
                    form.value.data_type = gallery_type.value;
                    form.value.data_id = data.value.id;
                    backImg.value = proxy.COMMON.imgUrl + "/t/p/w1920_and_h1080_bestv2" + data.value.backdrop_path
                    if (gallery_type.value == "tv") {
                        fetchSeason();
                    } else {
                        file.value = data.value.url.replaceAll("/d/", "/");
                    }
                    loading.value = false;
                } else {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }

        onBeforeRouteUpdate((to, from) => {
            id.value = to.query.id;
            gallery_type.value = to.query.gallery_type;
            fetchData();
        });

        onMounted(() => {
            fetchData();
        });

        const reF = () => {
            fetchData();
        };

        onMounted(() => {
            
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith("UserId" + "="));
            console.log(cookieValue);
            proxy.axios.get(proxy.COMMON.apiUrl + `/v1/api/progress/get`, {headers: {
                    'content-type': 'application/json',
                    'UserId': cookieValue.split("=")[1],
                    'Authorization': proxy.$cookies.get("Authorization")
                }}).then(res => {

                console.log(res.data);
                var times = {};
                var a = localStorage.artplayer_settings != undefined?localStorage.artplayer_settings:"{}";
                var local_times = JSON.parse(a).times;
                if (local_times == undefined) local_times = {};
                var server_times = JSON.parse(res.data.data).times;
                if (server_times == undefined) server_times = {};
                var times_keys = Array.from(new Set(Object.keys(local_times).concat(Object.keys(server_times))));
                console.log(times_keys);
                for (var key of times_keys) {
                    // 两个都存在，对比本地与线上的进度，如果线上大于本地，则更新本地进度
                    if (key in local_times && key in server_times){
                        // 默认使用本地进度
                        times[key] = local_times[key];
                        if (local_times[key] < server_times[key]){
                            times[key] = server_times[key];
                        }
                    }
                    if (!(key in local_times) && key in server_times){
                        times[key] = server_times[key];
                    }

                }
                localStorage.artplayer_settings = JSON.stringify({"times": times});
            }).catch((error) => {
            });
        });

        return {
            id,
            title,
            titleModal,
            tvId,
            show,
            tvPath,
            is_admin,
            deleteModal,
            scrapeModal,
            updateModal,
            seasonId,
            data,
            like,
            gallery_type,
            siderRef,
            videoRef,
            seasonRef,
            boxsetRef,
            simila,
            loading,
            error,
            backImg,
            left,
            file,
            form,
            reF,
            q,
            searchData,
            options: [
                {
                    label: "重新刮削",
                    key: "scrape"
                },
                {
                    label: "修改标题",
                    key: "title"
                },
            ],
            handleSelect(key) {
                if (key == "edit") {
                    updateModal.value = true;
                } else if (key == "scrape") {
                    scrapeModal.value = true;
                } else if (key == "title") {
                     if (gallery_type.value == "tv") {
                         title.value = data.value.name;
                    } else {
                         title.value = data.value.title;
                    }
                    titleModal.value = true;
                }
            }
        }
    },
    methods: {
        Play() {
            if (this.gallery_type == "tv") {
                this.$router.push({
                    path: "/player",
                    query: {
                        id: this.id,
                        gallery_type: this.gallery_type,
                        season_id: this.seasonId,
                    }
                })
            } else {
                this.$router.push({
                    path: "/player",
                    query: {
                        id: this.id,
                        gallery_type: this.gallery_type,
                    }
                })
            }
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
                    this.COMMON.ShowMsg(res.data.msg)
                } else {
                    this.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
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
        DeleteVideo() {
            let api = this.COMMON.apiUrl + '/v1/api/themovie/delete?id=' + this.data.id;
            if (this.gallery_type == "tv") {
                api = this.COMMON.apiUrl + '/v1/api/thetv/delete?id=' + this.data.id;
            }
            this.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.COMMON.ShowMsg(res.data.msg)
                    setTimeout(() => {
                        this.$router.push({
                            path: "/",
                        })
                    }, 1000);
                } else {
                    this.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
            });
        },
        UpdateVideo() {
            let api = this.COMMON.apiUrl + '/v1/api/themovie/update?id=' + this.data.id;
            this.data.title = this.title;
            if (this.gallery_type == "tv") {
                api = this.COMMON.apiUrl + '/v1/api/thetv/update?id=' + this.data.id;
                this.data.name = this.title;
            }
            this.axios.post(api, this.data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.titleModal = !this.titleModal;
                    this.COMMON.ShowMsg(res.data.msg)
                } else {
                    this.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
            });
        },
        SearchVideo() {
            this.show = true;
            let api = `${this.COMMON.apiUrl}/v1/api/errfile/ref/file/search?name=${this.q}&type=${this.gallery_type}`;
            this.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.COMMON.ShowMsg(res.data.msg)
                    this.searchData = res.data.data.results;
                } else {
                    this.COMMON.ShowMsg(res.data.msg)
                }
                this.show = false;
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
            });
        },
        RefVideo(id) {
            this.show = true;
            let form = new FormData();
            let api = `${this.COMMON.apiUrl}/v1/api/errfile/ref/themovie/id?id=${id}&old_id=${this.data.id}`;
            if (this.gallery_type == "tv") {
                api = `${this.COMMON.apiUrl}/v1/api/errfile/ref/thetv/id?id=${id}&old_id=${this.data.id}`;
                form.set("path", this.tvPath)
            } else {
                this.COMMON.ShowMsg("刮削比较耗时,可离开此页面或者耐心等待....")
            }
            this.axios.post(api, form, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.COMMON.ShowMsg(res.data.msg)
                    if (this.gallery_type == "movie") {
                        setTimeout(() => {
                            this.$router.push({
                                path: "/video",
                                query: {
                                    id: id,
                                    gallery_type: this.gallery_type
                                }
                            })
                        }, 1000);
                    }
                } else {
                    this.COMMON.ShowMsg(res.data.msg)
                }
                this.show = false;
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
            });

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

.season-name {
    text-align: center;
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

.search-list {
    margin-top: 20px;
}

.search-title {
    font-size: 1.2em;
}

.search-itme {
    display: flex;
    gap: 10px;
}

.search-overview {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
    margin-bottom: 10px;
}

.search-itme img {
    border-radius: 5px;
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