import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'
import {getToken} from '@/utils/auth'
import {MessageBox,Message} from 'element-ui'



axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
const request = axios.create({
    baseURL:  process.env.VUE_APP_BASE_API ,
    timeout:100000000
})

//request拦截器
request.interceptors.request.use(
    config=>{
        const isToken = (config.headers || {}).isToken === false
        if(getToken() && !isToken){
            config.headers['Authorization'] = 'Bearer ' + getToken()
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
)




export function  downloadFile({url,headers,method,params,data,fileName,paramsSerializer}){
    let load = Message({showClose: false,message: '文件下载请求中...',duration:0, type:'success'});

    request({
        method:method!=undefined?method:'get',
        responseType: 'blob',
        headers,
        url,
        params,
        paramsSerializer,
        data
    }).then(res =>{
        load.close();
        let blob = new Blob([res.data], {type: res.data.type});
        let downloadElement = document.createElement('a');
        if((fileName==''||fileName==undefined)){
            fileName = decodeURI(res.headers['content-disposition'].split('filename=')[1]);
            console.log(res.headers['content-disposition']);
        }
        if('msSaveOrOpenBlob' in navigator){
            window.navigator.msSaveOrOpenBlob(blob,fileName);
            return;
        }
        else{
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = fileName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放blob对象
        }
    }).catch(err => {
      Message({showClose: false,message: '文件下载失败', type:'error'});
    }).finally(() => {
      load.close()
    })
}
