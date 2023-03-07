<template>
    <div v-if="loading" class="load">
    </div>
    <div v-else class="content">
        <div class="content-header">
            <div class="content-header-title">
                媒体库
            </div>
            <div class="content-header-tool">
                <n-space justify="end" size="medium">
                    <n-button @click="reF()" type="info">
                        <template #icon>
                            <i class='bx bx-analyse'></i>
                        </template>
                        刷新
                    </n-button>
                    <n-button @click="CreateShow()" type="info">
                        <template #icon>
                            <i class='bx bx-plus-circle'></i>
                        </template>
                        新增
                    </n-button>
                    <!-- <n-button strong secondary circle>
                        <i class='bx bx-search'></i>
                    </n-button>
                    <n-button @click="CreateShow()" strong secondary circle>
                        <i class='bx bx-plus-circle'></i>
                    </n-button> -->
                </n-space>
            </div>
        </div>
        <div class="gallery-list">
            <n-grid x-gap="12" y-gap="12" cols="1 s:2 m:2 l:4 xl:4 2xl:8" responsive="screen">
                <n-gi v-for="(item, index) in data" :key="index">
                    <n-card :title="item.title">
                        <template #header-extra>
                            <n-space justify="end" size="medium">

                                <n-button @click="EditGallery(item)" strong secondary circle>
                                    <i class='bx bx-detail'></i>
                                </n-button>
                            </n-space>
                        </template>
                        <img v-if="item.image.length > 0" loading="lazy" class='gallery-img'
                            :src='item.image.search(/gallery/) != -1 ? COMMON.apiUrl + item.image : COMMON.imgUrl + "/t/p/w355_and_h200_multi_faces" + item.image'>
                        <img v-else loading="lazy" class='gallery-img' src='/images/not_gellery.png'>
                        <template #footer>
                            <div class="gallery-tool">
                                <div class="gallery-data">
                                    <n-space justify="start" size="medium" vertical>
                                        <div class="gallery-type">
                                            类别：{{ item.gallery_type }}
                                        </div>
                                        <div class="gallery-alist">
                                            alist：{{ item.is_alist ? "是" : "否" }}
                                        </div>
                                    </n-space>
                                </div>
                                <div class="gallery-show">
                                    <n-button class="add-video" @click="showAdd(item)" type="info">
                                        <template #icon>
                                            <i class='bx bx-plus-circle'></i>
                                        </template>
                                        添加资源
                                    </n-button>
                                    <n-button @click="addPath(item)" type="info">
                                        <template #icon>
                                            <i class='bx bx-folder-plus'></i>
                                        </template>
                                        挂载目录
                                    </n-button>
                                </div>
                            </div>
                        </template>
                    </n-card>
                </n-gi>
            </n-grid>
        </div>
        <n-modal class="create" v-model:show="showModal" transform-origin="center">
            <n-card style="width: 600px" title="创建" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="showModal = !showModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-form :model="gallery">
                    <n-form-item label="媒体库标题">
                        <n-input size="large" v-model:value="gallery.title" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="封面图片">
                        <n-input size="large" v-model:value="gallery.image" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="类型" path="">
                        <n-select size="large" v-model:value="gallery.gallery_type" placeholder="Select"
                            :options="typeOptions" />
                    </n-form-item>
                    <n-form-item label="是否为alist,如果是则需要输入相关信息，用于刮削文件?">
                        <n-switch size="large" v-model:value="gallery.is_alist" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item v-show="gallery.is_alist" label="域名">
                        <n-input size="large" v-model:value="gallery.alist_host" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item v-show="gallery.is_alist" label="账号">
                        <n-input size="large" v-model:value="gallery.alist_user" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item v-show="gallery.is_alist" label="密码">
                        <n-input type="password" show-password-on="mousedown" size="large" v-model:value="gallery.alist_pwd"
                            placeholder="" clearable />
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="showUpload()" type="info">
                            <template #icon>
                                <i class='bx bx-image-add'></i>
                            </template>
                            上传封面
                        </n-button>
                        <n-button @click="Create()" type="info">
                            <template #icon>
                                <i class='bx bx-save'></i>
                            </template>
                            创建影库
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
        <n-modal class="update" v-model:show="updateModal" transform-origin="center">
            <n-card style="width: 600px" title="更新" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="updateModal = !updateModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-form :model="gallery">
                    <n-form-item label="媒体库标题">
                        <n-input size="large" v-model:value="gallery.title" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="封面图片">
                        <n-input size="large" v-model:value="gallery.image" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="类型" path="">
                        <n-select size="large" v-model:value="gallery.gallery_type" placeholder="Select"
                            :options="typeOptions" />
                    </n-form-item>
                    <n-form-item label="是否为alist,如果是则需要输入以下相关信息，用于刮削文件?">
                        <n-switch size="large" v-model:value="gallery.is_alist" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item v-show="gallery.is_alist" label="域名">
                        <n-input size="large" v-model:value="gallery.alist_host" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item v-show="gallery.is_alist" label="账号">
                        <n-input size="large" v-model:value="gallery.alist_user" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item v-show="gallery.is_alist" label="密码">
                        <n-input size="large" type="password" show-password-on="mousedown" v-model:value="gallery.alist_pwd"
                            placeholder="" clearable />
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="Delete()" type="warning">
                            <template #icon>
                                <i class='bx bx-trash'></i>
                            </template>
                            删除影库
                        </n-button>
                        <n-button @click="showUpload()" type="info">
                            <template #icon>
                                <i class='bx bx-image-add'></i>
                            </template>
                            上传封面
                        </n-button>
                        <n-button @click="Update()" type="info">
                            <template #icon>
                                <i class='bx bx-save'></i>
                            </template>
                            更新影库
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
        <n-modal class="add" v-model:show="addModal" transform-origin="center">
            <n-card style="width: 600px" title="添加" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="addModal = !addModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-spin :show="show">
                    <n-form :model="addvideo">
                        <!-- <n-form-item label="影库ID">
                            <n-input disabled="true" size="large" v-model:value="addvideo.gallery_uid" placeholder=""
                                clearable />
                        </n-form-item> -->
                        <n-form-item v-show="addType == 'movie'" label="文件链接">
                            <n-input @focus="FilehandleFocus" size="large" v-model:value="addvideo.file" placeholder=""
                                clearable />
                        </n-form-item>
                        <n-form-item v-show="addType == 'tv'" label="电视文件夹">
                            <n-input @focus="PathhandleFocus" size="large" v-model:value="addvideo.path" placeholder=""
                                clearable />
                        </n-form-item>
                        <n-form-item label="输入关键字搜索">
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
                                        :src='"https://image.tmdb.org/t/p/w220_and_h330_face/" + item.poster_path'>
                                </div>
                                <div class="search-content">
                                    <div class="search-title">
                                        {{ item.name }}
                                    </div>
                                    <div class="search-id">
                                        ID:{{ item.id }}
                                    </div>
                                    <div class="search-overview">
                                        简介:{{ item.overview }}
                                    </div>
                                    <n-space justify="end" size="medium">
                                        <n-button @click="AddVideo(item.id)" type="info">
                                            选中刮削
                                        </n-button>
                                    </n-space>
                                </div>
                            </div>
                        </div>
                    </n-form>
                </n-spin>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="SearchVideo()" type="info">
                            搜索
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
        <input type="file" id="file">
    </div>
</template>
<script>
import { useMessage } from 'naive-ui';
import Snackbar from 'node-snackbar';
import { getCurrentInstance, onMounted, ref } from "vue";
export default {
    name: 'GalleryIndex',
    setup() {
        const message = useMessage()
        const loading = ref(true);
        const showModal = ref(false);
        const addModal = ref(false);
        const updateModal = ref(false);
        const error = ref(null);
        const data = ref(null);
        const q = ref(null);
        const show = ref(false);
        const addType = ref(null);
        const gallery_uid = ref(null);
        const { proxy } = getCurrentInstance();
        const page = ref(1);
        const size = ref(24);
        const modal_title = ref("创建");
        const searchData = ref(null);
        const gallery = ref({
            "id": null,
            "title": "",
            "gallery_type": "",
            "is_tv": true,
            "gallery_uid": "",
            "image": "",
            "is_alist": false,
            "alist_host": "",
            "alist_user": "",
            "alist_pwd": "",
        })
        const addvideo = ref({
            "the_movie_id": null,
            "the_tv_id": null,
            "path": null,
            "file": null,
            "gallery_uid": null,
        })

        function fetchData() {
            proxy.axios.post(proxy.COMMON.apiUrl + '/v1/api/gallery/list?page=' + page.value + '&size=' + size.value, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    data.value = res.data.data;
                    loading.value = false;
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        }

        const reF = async () => {
            fetchData();
        };
        onMounted(() => {
            fetchData();
        });
        return {
            data,
            error,
            show,
            loading,
            showModal,
            page,
            gallery,
            modal_title,
            size,
            updateModal,
            gallery_uid,
            q,
            reF,
            addType,
            addvideo,
            addModal,
            searchData,
            message,
            typeOptions: ["movie", "tv"].map(
                (v) => ({
                    label: v,
                    value: v
                })
            )
        }
    },
    methods: {
        PathhandleFocus() {
            this.message.info("挂载本地就为包含该部剧全部文件的绝路路径文件夹;挂载alist的就为去掉域名后的文件夹", { duration: 8000 })
        },
        FilehandleFocus() {
            this.message.info("挂载本地就为文件绝对路径;挂载alist的就为去掉域名后的文件路径", { duration: 8000 })
        },
        showUpload() {
            let file = document.getElementById("file");
            file.click();
            file.addEventListener('change', (event) => {
                let file = event.target.files[0];
                this.UploadImage(file);
            });
        },
        UploadImage(file) {
            let api = this.COMMON.apiUrl + "/file/gallery/upload";
            let form = new FormData();
            form.set("file", file)
            this.axios.post(api, form, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.gallery.image = res.data.data;
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        },
        CreateShow() {
            this.gallery = {
                "title": "",
                "gallery_type": "",
                "is_tv": false,
                "gallery_uid": "",
                "image": "",
                "is_alist": true,
                "alist_host": "",
                "alist_user": "",
                "alist_pwd": "",
            };
            this.showModal = !this.showModal;
        },
        EditGallery(gallery) {
            this.gallery = gallery;
            this.updateModal = !this.updateModal;
        },
        Request(api, data) {
            this.axios.post(api, data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.$emit("refApp");
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                    this.reF();

                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        },
        Create() {
            if (this.gallery.gallery_type == "tv") {
                this.gallery.is_tv = true;
            }
            this.Request(this.COMMON.apiUrl + '/v1/api/gallery/create', this.gallery)
        },
        Update() {
            this.Request(this.COMMON.apiUrl + '/v1/api/gallery/update?id=' + this.gallery.id, this.gallery)
        },
        Delete() {
            this.Request(this.COMMON.apiUrl + '/v1/api/gallery/delete?id=' + this.gallery.id, {})
        },
        addPath(gallery) {
            this.$router.push({
                path: "/gallerys/works",
                query: {
                    gallery_uid: gallery.gallery_uid
                }
            })
        },
        showAdd(item) {
            this.addType = item.gallery_type;
            this.gallery_uid = item.gallery_uid;
            this.addvideo.gallery_uid = this.gallery_uid
            this.addModal = !this.addModal;
        },
        AddVideo(id) {
            if (this.addType == "movie") {
                this.addvideo.the_movie_id = id;
            } else {
                this.addvideo.the_tv_id = id;
            }
            this.show = true;
            let api = this.COMMON.apiUrl + '/v1/api/themovie/add'
            if (this.addType == "tv") {
                api = this.COMMON.apiUrl + '/v1/api/thetv/add'
            } else {
                Snackbar.show({ pos: 'top-center', text: "刮削比较耗时,可离开此页面或者耐心等待....", showAction: false });
            }
            this.addvideo.the_movie_id = parseInt(this.addvideo.the_movie_id)
            this.addvideo.the_tv_id = parseInt(this.addvideo.the_tv_id)
            this.axios.post(api, this.addvideo, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
                this.show = false;
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        },
        SearchVideo() {
            this.show = true;
            let api = `${this.COMMON.apiUrl}/v1/api/errfile/ref/file/search?name=${this.q}&type=${this.addType}`;
            this.axios.post(api, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                    if (res.data.data.results.length == 0) {
                        Snackbar.show({ pos: 'top-center', text: "未查询到任何资源!", showAction: false });
                    }
                    this.searchData = res.data.data.results;
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
                this.show = false;
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        },
    }
}
</script >

<style scoped>
.content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 60px;
    margin-bottom: 12px;
}

.gallery-tool {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.content-header-title {
    font-size: 1.4em;
}

.gallery-data {
    font-size: 18px;
}

.gallery-show {
    display: flex;
    gap: 10px;
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

input#file {
    display: none;
}
</style>