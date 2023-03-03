<template>
    <div v-if="load" class="load"></div>
    <div v-else class="content setting-content">
        <div class="setting-header">
            <div class="setting-title">
                系统设置
            </div>
        </div>
        <div class="setting-content-form">
            <n-form :model="config" label-placement="top" label-align="left" :label-width="140" :style="{
                maxWidth: '640px'
            }">
                <n-form-item label="影视库名字" path="inputValue">
                    <n-input v-model:value="config.title" size="large" placeholder="" clearable />
                </n-form-item>
                <n-form-item label="影视库图标" path="inputValue">
                    <n-input v-model:value="config.faviconico_url" size="large" placeholder="" clearable />
                </n-form-item>
                <n-form-item label="是否下载刮削图片到本地，填'是',或者'否'" path="inputValue">
                    <n-input v-model:value="config.download_image" size="large" placeholder="" clearable />
                </n-form-item>
                <n-form-item label="图片来源,留空则表示使用本地缓存图片,否则使用https://image.tmdb.org提供" path="inputValue">
                    <n-input v-model:value="config.img_url" size="large" placeholder="" clearable />
                </n-form-item>
                <n-form-item label="允许刮削alist中的视频文件类型" path="inputValue">
                    <n-input v-model:value="config.video_types" size="large" placeholder="" clearable />
                </n-form-item>
                <n-form-item label="TheMovieDb api密匙" path="inputValue">
                    <n-input v-model:value="config.key_db" size="large" placeholder="" clearable />
                </n-form-item>
                <n-button class="btn-save" @click="Save()" type="info">
                    保存
                </n-button>
            </n-form>
        </div>
    </div>
</template>

<script>

import Snackbar from 'node-snackbar';
import { getCurrentInstance, onMounted, ref } from "vue";
export default {
    name: "SettingIndex",
    setup() {
        const config = ref({
            "title": null,
            "download_image": null,
            "img_url": null,
            "key_db": null,
            "faviconico_url": null,
            "video_types": null
        })
        const { proxy } = getCurrentInstance();
        const load = ref(true);

        function getConfig() {
            proxy.axios.post(proxy.COMMON.apiUrl + `/v1/api/config/data`, {}, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    config.value = res.data.data;
                    load.value = false;
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
                load.value = false;
            });
        }

        function saveConfig() {
            proxy.axios.post(proxy.COMMON.apiUrl + `/v1/api/config/save`, config.value, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': proxy.$cookies.get("Authorization")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    config.value = res.data.data;
                    localStorage.setItem("title", config.value.title);
                    localStorage.setItem("img_url", config.value.img_url);
                    location.reload();
                } else {
                    Snackbar.show({ pos: 'top-center', text: res.data.msg, showAction: false });
                }
            }).catch((error) => {
                Snackbar.show({ pos: 'top-center', text: error, showAction: false });
                load.value = false;
            });
        }
        onMounted(() => {
            getConfig();
        });
        const saveF = async () => {
            saveConfig();
        };

        return {
            config,
            load,
            saveF
        }
    },
    methods: {
        Save() {
            this.saveF();
        }
    }
}
</script>

<style scoped>
.setting-header {
    margin-bottom: 20px;
    margin-top: 20px;
}

.setting-title {
    font-size: 1.4em;
}

.btn-save {
    width: 100%;
}
</style>