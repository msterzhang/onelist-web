<template>
    <div v-if="loading" class="load">
    </div>
    <div v-else class="content">
        <div class="content-header">
            <div class="content-header-title">
                挂载目录
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
                        新增挂载
                    </n-button>
                    <!-- <n-button @click="reF()" strong secondary circle>
                        <i class='bx bx-analyse'></i>
                    </n-button>
                    <n-button @click="CreateShow()" strong secondary circle>
                        <i class='bx bx-plus-circle'></i>
                    </n-button> -->
                </n-space>
            </div>
        </div>
        <div class="work-list">
            <n-grid x-gap="12" y-gap="12" cols="1 s:2 m:2 l:4 xl:4 2xl:8" responsive="screen">
                <n-gi v-for="(item, index) in data" :key="index">
                    <n-card title="目录">
                        <template #header-extra>
                            <n-button @click="Editwork(item)" strong secondary circle>
                                <i class='bx bx-detail'></i>
                            </n-button>
                        </template>
                        <div class="progres-content">
                            <n-progress type="circle" :percentage="(item.speed * 100 / item.file_number).toFixed(0)" />
                        </div>
                        <template #footer>
                            <div class="work-tool">
                                <div class="work-data">
                                    <n-space justify="start" size="medium" vertical>
                                        <div class="work-type">
                                            挂载目录：{{ item.path }}
                                        </div>
                                        <div class="work-alist">
                                            已完成：{{ item.is_ok ? "是" : "否" }}
                                        </div>
                                        <div class="work-watching">
                                            监控中：{{ item.watching ? "是" : "否" }}
                                        </div>
                                    </n-space>
                                </div>
                                <n-space justify="end" size="medium">
                                    <n-button @click="ErrFiles(item)" type="error">
                                        <template #icon>
                                            <i class='bx bx-error'></i>
                                        </template>
                                        出错文件
                                    </n-button>
                                    <n-button @click="showReNew(item)" type="info">
                                        <template #icon>
                                            <i class='bx bx-plus-circle'></i>
                                        </template>
                                        重新刮削
                                    </n-button>
                                </n-space>
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
                <n-spin :show="show">
                    <n-form :model="work">
                        <n-form-item label="目录">
                            <n-input @focus="handleFocus" size="large" v-model:value="work.path" placeholder="" clearable />
                        </n-form-item>
                        <n-form-item label="是否强制刷新alist缓存后再获取文件?">
                            <n-switch size="large" v-model:value="work.is_ref" placeholder="" clearable />
                        </n-form-item>
                        <n-form-item label="是否监控目录,每天晚上2点自动扫描?">
                            <n-switch size="large" v-model:value="work.watching" placeholder="" clearable />
                        </n-form-item>
                    </n-form>
                </n-spin>
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
                <n-form :model="work">
                    <n-form-item label="目录">
                        <n-input size="large" v-model:value="work.path" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="封面图片">
                        <n-input size="large" v-model:value="work.image" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="是否强制刷新alist缓存后再获取文件?">
                        <n-switch size="large" v-model:value="work.is_ref" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="是否监控目录，每天晚上2点自动扫描?">
                        <n-switch size="large" v-model:value="work.watching" placeholder="" clearable />
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
        <n-modal class="renew" transform-origin="center" v-model:show="renewModal">
            <n-card style="width: 600px" title="确认" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="renewModal = !renewModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <h3>确定重新刮削此挂载目录吗？</h3>
                <n-form-item label="是否全部重新刮削(默认只刮削挂载目录中新增文件)?">
                    <n-switch size="large" v-model:value="allFile" placeholder="" clearable />
                </n-form-item>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="ReNewWork()" type="info">
                            <template #icon>
                                <i class='bx bx-check'></i>
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
import { useMessage } from 'naive-ui';
import { getCurrentInstance, onMounted, ref } from "vue";
export default {
    name: 'WorkIndex',
    setup() {
        const loading = ref(true);
        const show = ref(false);
        const allFile = ref(false);
        const showModal = ref(false);
        const updateModal = ref(false);
        const renewModal = ref(false);
        const gallery_uid = ref(null);
        const error = ref(null);
        const data = ref(null);
        const { proxy } = getCurrentInstance();
        const page = ref(1);
        const size = ref(24);
        gallery_uid.value = proxy.$route.query.gallery_uid;
        const message = useMessage()
        const work = ref({
            "id": null,
            "gallery_id": null,
            "gallery_uid": "",
            "image": "",
            "path": "",
            "file_number": 0,
            "speed": 0,
            "is_ok": false,
            "watching": false,
            "is_ref": false,
        })

        function fetchData() {
            proxy.axios.post(proxy.COMMON.apiUrl + '/v1/api/work/gallery/list?page=' + page.value + '&size=' + size.value + "&id=" + gallery_uid.value, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    data.value = res.data.data;
                    loading.value = false;
                } else {
                    proxy.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                proxy.COMMON.ShowMsg(error);
            });
        }

        const reF = async () => {
            fetchData();
        };
        onMounted(() => {
            fetchData();
        });
        return {
            allFile,
            data,
            error,
            message,
            loading,
            gallery_uid,
            showModal,
            page,
            work,
            show,
            size,
            updateModal,
            renewModal,
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
        handleFocus() {
            this.message.info("比如'http://alist.cn/云盘/电影'就应该输入'/云盘/电影',或者是本地文件夹绝对路径", { duration: 8000 })
        },
        CreateShow() {
            this.work = {
                "id": null,
                "gallery_id": null,
                "gallery_uid": "",
                "image": "",
                "path": "",
                "file_number": 0,
                "speed": 0,
                "is_ok": false,
                "watching": false,
                "is_ref": false,
            };
            this.work.gallery_uid = this.gallery_uid
            this.showModal = !this.showModal;
        },
        Editwork(work) {
            this.work = work;
            this.updateModal = !this.updateModal;
        },
        showReNew(work) {
            this.work = work;
            this.renewModal = !this.renewModal;
        },
        ReNewWork() {
            let mod = "new";
            if (this.allFile) {
                mod = "all";
            }
            this.Request(this.COMMON.apiUrl + '/v1/api/work/renew?id=' + this.work.id + "&mod=" + mod, {})
        },
        Request(api, data) {
            this.axios.post(api, data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.COMMON.ShowMsg(res.data.msg)
                    this.showModal = false;
                    this.updateModal = false;
                    this.reF();
                } else {
                    this.COMMON.ShowMsg(res.data.msg)
                }
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
            });
        },
        Create() {
            if (this.work.work_type == "tv") {
                this.work.is_tv = true;
            }
            this.show = true;
            let api = this.COMMON.apiUrl + '/v1/api/work/create';
            this.axios.post(api, this.work, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.COMMON.ShowMsg(res.data.msg)
                    this.reF();
                } else {
                    this.COMMON.ShowMsg(res.data.msg)
                }
                this.show = false;
                this.showModal = !this.showModal;
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
                this.show = false;
            });
        },
        Update() {
            this.Request(this.COMMON.apiUrl + '/v1/api/work/update?id=' + this.work.id, this.work)
        },
        Delete() {
            this.Request(this.COMMON.apiUrl + '/v1/api/work/delete?id=' + this.work.id, {})
        },
        ErrFiles(work) {
            this.$router.push({
                path: "/gallerys/works/errfiles",
                query: {
                    id: work.id
                }
            })
        },
        RefErrFiles(work) {
            this.axios.post(`${this.COMMON.apiUrl}/v1/api/errfile/ref/work/list?id=${work.id}`, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                this.COMMON.ShowMsg(res.data.msg)
            }).catch((error) => {
                this.COMMON.ShowMsg(error);
            });
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

.content-header-title {
    font-size: 1.4em;
}

.work-data {
    font-size: 18px;
}

.work-img {
    width: 100%;
}

.progres-content {
    text-align: center;
}
</style>