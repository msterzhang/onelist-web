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
                            <n-button @click="EditGallery(item)" strong secondary circle>
                                <i class='bx bx-detail'></i>
                            </n-button>
                        </template>
                        <img v-if="item.image.length > 0" loading="lazy" class='gallery-img'
                            :src='COMMON.imgUrl + "/t/p/w355_and_h200_multi_faces/" + item.image'>
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
                                    <n-button @click="addPath(item)" type="info">
                                        <template #icon>
                                            <i class='bx bx-plus-circle'></i>
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
                        <n-button @click="Create()" type="info">
                            <template #icon>
                                <i class='bx bx-save'></i>
                            </template>
                            创建
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
                            删除
                        </n-button>
                        <n-button @click="Update()" type="info">
                            <template #icon>
                                <i class='bx bx-save'></i>
                            </template>
                            更新
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
    </div>
</template>
<script>
import Snackbar from 'node-snackbar';
import { getCurrentInstance, onMounted, ref } from "vue";
export default {
    name: 'GalleryIndex',
    setup() {
        const loading = ref(true);
        const showModal = ref(false);
        const updateModal = ref(false);
        const error = ref(null);
        const data = ref(null);
        const { proxy } = getCurrentInstance();
        const page = ref(1);
        const size = ref(24);
        const modal_title = ref("创建");
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
            loading,
            showModal,
            page,
            gallery,
            modal_title,
            size,
            updateModal,
            reF,
            typeOptions: ["movie", "tv"].map(
                (v) => ({
                    label: v,
                    value: v
                })
            )
        }
    },
    methods: {
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
        }
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
</style>