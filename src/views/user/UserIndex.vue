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
                    <n-button @click="ShowCreate()" type="info">
                        <template #icon>
                            <i class='bx bx-plus-circle'></i>
                        </template>
                        新增
                    </n-button>
                    <!-- <n-button @click="reFData()" strong secondary circle>
                        <i class='bx bx-analyse'></i>
                    </n-button>
                    <n-button @click="createModal = !createModal" strong secondary circle>
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
        <n-modal transform-origin="center" v-model:show="createModal">
            <n-card style="width: 600px" title="新增" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="createModal = !createModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-form :model="user">
                    <n-form-item label="用户名">
                        <n-input size="large" v-model:value="user.user_name" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="邮箱">
                        <n-input size="large" v-model:value="user.user_email" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="密码">
                        <n-input type="password" show-password-on="mousedown" size="large"
                            v-model:value="user.user_password" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="管理员">
                        <n-switch size="large" v-model:value="user.is_admin" placeholder="" clearable />
                    </n-form-item>
                </n-form>
                <template #footer>
                    <n-space justify="end" size="medium">
                        <n-button @click="Create()" type="info">
                            确定
                        </n-button>
                    </n-space>
                </template>
            </n-card>
        </n-modal>
        <n-modal transform-origin="center" v-model:show="editModal">
            <n-card style="width: 600px" title="编辑" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <template #header-extra>
                    <n-button @click="editModal = !editModal" strong secondary circle>
                        <i class='bx bx-x'></i>
                    </n-button>
                </template>
                <n-form :model="user">
                    <n-form-item label="用户名">
                        <n-input size="large" v-model:value="user.user_name" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="邮箱">
                        <n-input size="large" v-model:value="user.user_email" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="管理员">
                        <n-switch size="large" v-model:value="user.is_admin" placeholder="" clearable />
                    </n-form-item>
                    <n-form-item label="锁定账号">
                        <n-switch size="large" v-model:value="user.is_lock" placeholder="" clearable />
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
            title: "用户名",
            key: "user_name",
            resizable: true,
        },
        {
            title: "邮箱",
            key: "user_email",
            resizable: true,
        },
        {
            title: "UserId",
            key: "user_id",
            resizable: true,
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
                    { default: () => "编辑" }
                );
            }
        }
    ];
};

export default defineComponent({
    name: 'UserIndex',
    setup() {
        const loading = ref(true);
        const createModal = ref(false);
        const editModal = ref(false);
        const error = ref(null);
        const user = ref({
            "user_name": null,
            "user_id": null,
            "user_email": null,
            "user_password": null,
            "is_admin": false,
            "is_lock": false
        });
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
            proxy.axios.post(`${proxy.COMMON.apiUrl}/v1/api/user/list?page=${page.value}&size=${size.value}`, {}, {
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

        const reFData = async () => {
            fetchData();
        };
        onMounted(() => {
            fetchData();
        });
        return {
            data,
            dialog,
            user,
            createModal,
            editModal,
            reFData,
            error,
            loading,
            page,
            num,
            columns: createColumns({
                play(row) {
                    user.value = row;
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
        ShowCreate() {
            this.user = {
                "user_name": null,
                "user_id": null,
                "user_email": null,
                "user_password": null,
                "is_admin": false,
                "is_lock": false
            };
            this.createModal = !this.createModal;
        },
        Create() {
            this.Request(`${this.COMMON.apiUrl}/v1/api/user/create`, this.user)
        },
        Updata() {
            this.Request(`${this.COMMON.apiUrl}/v1/api/user/update?id=${this.user.id}`, this.user)
        },
        Delete() {
            this.Request(`${this.COMMON.apiUrl}/v1/api/user/delete?id=${this.user.id}`, {})
        },
        DeleteList() {
            Promise.all(
                this.checkedRowKeys.map(async (id) => {
                    let api = `${this.COMMON.apiUrl}/v1/api/user/delete?id=${id}`;
                    this.axios.post(api, {}, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': this.$cookies.get("Authorization")
                        }
                    }).then(res => {
                        if (res.data.code == !200) {
                            Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                        }
                    }).catch((error) => {
                        Snackbar.show({ pos: 'top-center', text: error, showAction: false });
                    });
                })
            ).then(() => {
                this.checkedRowKeys = [];
                this.reFData();
                Snackbar.show({ pos: 'top-center', text: "处理完毕!", showAction: false });
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