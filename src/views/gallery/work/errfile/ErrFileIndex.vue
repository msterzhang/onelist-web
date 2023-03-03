<template>
    <div v-if="loading" class="load"></div>
    <div v-else class="content">
        <div class="content-header">
            <div class="content-header-title">
                错误文件
            </div>
            <div class="content-header-tool">
                <n-space justify="end" size="medium">
                    <n-button v-if="checkedRowKeys.length > 0" @click="DeleteList()" type="warning">
                        <template #icon>
                            <i class='bx bx-trash'></i>
                        </template>
                        删除所选
                    </n-button>
                    <n-button @click="reFData()" type="info">
                        <template #icon>
                            <i class='bx bx-analyse'></i>
                        </template>
                        刷新
                    </n-button>
                    <n-button @click="errModal = !errModal" type="info">
                        <template #icon>
                            <i class='bx bxs-error-circle'></i>
                        </template>
                        修复
                    </n-button>
                    <!-- <n-button @click="reFData()" strong secondary circle>
                        <i class='bx bx-analyse'></i>
                    </n-button>
                    <n-button @click="errModal = !errModal" strong secondary circle>
                        <i class='bx bxs-error-circle'></i>
                    </n-button> -->
                </n-space>
            </div>
        </div>
        <div class="data-table">
            <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="true" :row-key="rowKey"
                @update:checked-row-keys="handleCheck" />
        </div>
        <div class="data-footer">
            <n-space justify="end">
                <n-pagination v-model:page="page" :page-count="num" :page-slot="5" />
            </n-space>
        </div>
        <n-modal transform-origin="center" v-model:show="errModal">
            <n-card style="width: 600px" title="确认" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="errModal = !errModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <h3>确定创建错误文件修复任务吗？</h3>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="reF()" type="info">
                            确定
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
        <n-modal transform-origin="center" v-model:show="editModal">
            <n-card style="width: 600px" title="处理" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="editModal = !editModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-form :model="errfile">
                    <n-form-item label="文件">
                        <n-input size="large" v-model:value="errfile.file" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="错误信息">
                        <n-input size="large" v-model:value="errfile.err_msg" placeholder="" clearable />
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
                        <n-button @click="Updata()" type="info">
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
import { NButton, useDialog } from "naive-ui";
import Snackbar from 'node-snackbar';
import { defineComponent, getCurrentInstance, h, onMounted, ref } from "vue";


const createColumns = ({
    play
}) => {
    return [
        {
            type: "selection",
            disabled(row) {
                return row.id === "Edward King 3";
            }
        },
        {
            title: "ID",
            key: "id",
            resizable: true,
            minWidth: 50,
        },
        {
            title: "文件",
            key: "file",
            resizable: true,
            minWidth: 300,
        },
        {
            title: "错误信息",
            key: "err_msg",
            resizable: true,
            minWidth: 400,
            maxWidth: 600
        },
        {
            title: "操作",
            key: "actions",
            render(row) {
                return h(
                    NButton,
                    {
                        strong: true,
                        tertiary: true,
                        size: "small",
                        onClick: () => play(row)
                    },
                    { default: () => "处理" }
                );
            }
        }
    ];
};

export default defineComponent({
    name: 'ErrFileIndex',
    setup() {
        const loading = ref(true);
        const errModal = ref(false);
        const editModal = ref(false);
        const error = ref(null);
        const errfile = ref(null);
        const data = ref(null);
        const id = ref(null);
        const { proxy } = getCurrentInstance();
        const page = ref(1);
        const num = ref(0);
        const size = ref(12);
        id.value = proxy.$route.query.id;
        const dialog = useDialog();
        const checkedRowKeysRef = ref([]);

        function fetchData() {
            proxy.axios.post(`${proxy.COMMON.apiUrl}/v1/api/errfile/work/list?id=${id.value}&page=${page.value}&size=${size.value}`, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    data.value = res.data.data;
                    num.value = Math.round(res.data.num / size.value) + 1;
                    loading.value = false;
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        }

        function RefErrFiles() {
            proxy.axios.post(`${proxy.COMMON.apiUrl}/v1/api/errfile/ref/work/list?id=${id.value}`, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        }

        const reF = async () => {
            RefErrFiles();
        };
        const reFData = async () => {
            fetchData();
        };
        onMounted(() => {
            fetchData();
        });
        return {
            data,
            dialog,
            errfile,
            errModal,
            editModal,
            reF,
            reFData,
            error,
            loading,
            page,
            num,
            columns: createColumns({
                play(row) {
                    errfile.value = row;
                    editModal.value = !editModal.value;
                }
            }),
            checkedRowKeys: checkedRowKeysRef,
            rowKey: (row) => row.id,
            handleCheck(rowKeys) {
                checkedRowKeysRef.value = rowKeys;
            },
            pagination: false
        }
    },
    methods: {
        Request(api, data) {
            this.axios.post(api, data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': this.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.reFData();
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
            });
        },
        Updata() {
            this.Request(`${this.COMMON.apiUrl}/v1/api/errfile/update?id=${this.errfile.id}`, this.errfile)
        },
        Delete() {
            this.Request(`${this.COMMON.apiUrl}/v1/api/errfile/delete?id=${this.errfile.id}`, {})
        },
        DeleteList() {
            Promise.all(
                this.checkedRowKeys.map(async (id) => {
                    let api = `${this.COMMON.apiUrl}/v1/api/errfile/delete?id=${id}`;
                    this.axios.post(api, {}, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': this.$cookies.get("Authorization")
                        }
                    }).then(res => {
                        if (res.data.code == !200) {
                            Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                        } else {
                            this.reFData();
                        }
                    }).catch((error) => {
                        Snackbar.show({ pos: 'top-center', text: error, showAction: false });
                    });
                })
            ).then(() => {
                this.checkedRowKeys = [];
            })
        }
    },
    watch: {
        page: function (page) {
            this.page = page;
            this.reFData()
        }
    }
}
)
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

.data-footer {
    margin-top: 30px;
    margin-bottom: 30px;
}
</style>