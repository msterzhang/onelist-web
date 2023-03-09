<template>
    <div v-if="loading" class="load">
    </div>
    <div v-else class="content">
        <div class="card-list">
            <div class="card-shows medias">
                <div class="card-show-title">
                    我的媒体
                </div>
                <div class="card-show-content gallery-card">
                    <n-carousel :show-dots="false" show-arrow :slides-per-view="per_view" :space-between="20" :loop="false"
                        draggable>
                        <div class="view-item" v-for="(item, index) in data" :key="index">
                            <router-link :to="{
                                path: '/list', query: {
                                    gallery_uid: item.gallery_uid,
                                    gallery_type: item.gallery_type
                                }
                            }">
                                <img v-if="item.image.length > 0" loading="lazy" class='gallery-img'
                                    :src='COMMON.imgUrl + "/t/p/w355_and_h200_multi_faces" + item.image'>
                                <img v-else loading="lazy" class='gallery-img' src='/images/not_gellery.png'>
                                <div class="view-item-title">
                                    {{ item.title }}
                                </div>
                            </router-link>
                        </div>
                        <template #arrow="{ prev, next }">
                            <div class="custom-arrow">
                                <button type="button" class="custom-arrow--left" @click="prev">
                                    <i class='bx bx-chevron-left'></i>
                                </button>
                                <button type="button" class="custom-arrow--right" @click="next">
                                    <i class='bx bx-chevron-right'></i>
                                </button>
                            </div>
                        </template>
                    </n-carousel>
                </div>
            </div>
            <div class="card-shows" v-for="(key, index) in Object.keys(dict_data)" :key="index">
                <div class="card-show-title">
                    {{ key }}
                </div>
                <div class="card-show-content view-card">
                    <n-carousel :show-dots="false" show-arrow :slides-per-view="per_card" :space-between="20" :loop="false"
                        draggable>
                        <div class="view-item" v-for="item in dict_data[key]" :key="item.id">
                            <div class="view-item-header">
                                <div class="view-item-tag-list">
                                    <div class="view-item-tag rating">
                                        {{ isNaN(Math.floor(item.vote_average * 100) /
                                            100) ? "" : Math.floor(item.vote_average * 100) / 100
                                        }}
                                    </div>
                                    <!-- <div v-if="item.Type != 'Movie' && item.ChildCount != 0" class="view-item-tag count">
                                        {{ item.ChildCount }}
                                    </div> -->
                                    <div v-if="item.played" class="view-item-tag count">
                                        <i class='bx bx-check'></i>
                                    </div>
                                </div>
                            </div>
                            <router-link :to="{
                                path: '/video', query: {
                                    id: item.id,
                                    gallery_type: item.title != null ? 'movie' : 'tv'
                                }
                            }">
                                <img loading="lazy" class="carousel-img"
                                    :src='COMMON.imgUrl + "/t/p/w220_and_h330_face/" + item.poster_path'>
                            </router-link>
                            <div v-if="item.title != null" class="view-item-title">
                                {{ item.title }}
                            </div>
                            <div v-else class="view-item-title">
                                {{ item.name }}
                            </div>
                        </div>
                        <template #arrow="{ prev, next }">
                            <div class="custom-arrow">
                                <button type="button" class="custom-arrow--left" @click="prev">
                                    <i class='bx bx-chevron-left'></i>
                                </button>
                                <button type="button" class="custom-arrow--right" @click="next">
                                    <i class='bx bx-chevron-right'></i>
                                </button>
                            </div>
                        </template>
                    </n-carousel>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from "vue";
export default {
    name: 'HelloWorld',
    setup() {
        const per_view = ref(5);
        const per_card = ref(8);

        const { proxy } = getCurrentInstance();
        if (proxy.COMMON.isMo) {
            per_view.value = 2;
            per_card.value = 3;
        }
        const data = ref(null);
        const dict_data = ref(null);
        var dataDict = new Object();

        const size = ref(100);

        const loading = ref(true);
        const error = ref(null);

        function fetchData() {
            loading.value = true;
            proxy.axios.post(proxy.COMMON.apiUrl + `/v1/api/gallery/list?page=1&size=` + size.value, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    data.value = res.data.data;
                    Promise.all(
                        res.data.data.map(async (gallery) => {
                            await latestData(gallery)
                        })
                    ).then(() => {
                        loading.value = false;
                    })
                }
            }).catch((error) => {
               proxy.COMMON.ShowMsg(error);
            });
        }

        function latestData(gallery) {
            let api = proxy.COMMON.apiUrl + `/v1/api/thetv/gallery/list?id=` + gallery.gallery_uid + "&page=1&size=24";
            if (gallery.gallery_type == "movie") {
                api = proxy.COMMON.apiUrl + `/v1/api/themovie/gallery/list?id=` + gallery.gallery_uid + "&page=1&size=24";
            }
            return proxy.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    dataDict[gallery.title] = res.data.data;
                    dict_data.value = dataDict;
                }
            }).catch((error) => {
               proxy.COMMON.ShowMsg(error);
            })
        }

        onMounted(() => {
            fetchData();
        });
        return {
            data,
            dict_data,
            per_view,
            per_card,
            loading,
            error,
            size,
        }
    },
    methods: {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.gallery-card .view-item {
    transform: translateY(0) scale(1);
    transition: all .2s ease-in-out;
}

.gallery-card .view-item:hover {
    transform: translateY(0) scale(0.99);
    transition: all .2s ease-in-out;
}

.gallery-card .view-item img {
    border-radius: 5px;
}

.medias .view-item-title {
    font-size: 1.2em;
    font-weight: 400;
}

.custom-arrow {
    display: flex;
    position: absolute;
    top: 70%;
    right: 10px;
}

@media (max-width: 750px) {
    .custom-arrow {
        display: none;
    }
}

.view-card .custom-arrow {
    top: 75%;
}

.custom-arrow button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 12px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    border-width: 0;
    border-radius: 8px;
    transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.custom-arrow button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.custom-arrow button:active {
    transform: scale(0.95);
    transform-origin: center;
}

img.carousel-img {
    width: 100%;
    aspect-ratio: 16/10;
}

.view-card img.carousel-img {
    width: 100%;
    aspect-ratio: 11/16;
    border-radius: 5px;
}


.view-card .view-item {
    transform: translateY(0) scale(1);
    transition: all .2s ease-in-out;
}

.view-card .view-item:hover {
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

.project {
    margin-top: 10px;
}

.project .n-pagination {
    float: right;
}

@media (max-width: 767px) {
    .card-show-title {
        font-size: 1.2em;
        font-weight: 400;
        padding-bottom: 10px;
    }

    .view-item-title {
        font-size: 0.5em;
        font-weight: 400;
    }

    .custom-arrow.next {
        bottom: 60px;
    }
}
</style>
