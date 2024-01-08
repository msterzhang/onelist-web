<script type="text/javascript">
// 定义一些公共的属性和方法
let title = 'OneList';
let apiUrl = process.env.NODE_ENV === 'production' ? "" : 'http://127.0.0.1:5246';
let imgUrl = "https://image.tmdb.org"
const isMo = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
import Snackbar from 'node-snackbar';


function ShowMsg(msg) {
    Snackbar.show({ pos: 'top-center', text: msg, showAction: false });
}

function initConfig() {
    if (localStorage.getItem("title") != null) {
        title = localStorage.getItem("title")
    }
    if (localStorage.getItem("img_url") != null) {
        imgUrl = localStorage.getItem("img_url")
        if (process.env.NODE_ENV != 'production' && localStorage.getItem("img_url").length == 0) {
            imgUrl = apiUrl;
        }
    }
}

initConfig()
// 暴露出这些属性和方法
export default {
    apiUrl,
    title,
    isMo,
    imgUrl,
    ShowMsg
}
</script>