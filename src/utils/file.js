import {Message} from "element-ui";

/*文件类型*/
export const fileType = [
  '.jfif','pjpeg','.jpeg','.pjp','.jpg','.gif','.png','.bmp',
  '.txt','.text',
  '.mp4','.m4v',
  '.doc','.docx','.xls','.xlsx', '.ppt','.pptx',
  '.pdf',
  '.zip','.rar','.7z',
  '.dib'
];

/*文件后缀名与图标对应*/
const fileType2Icon = {
  file:'file.png',
  img:'img.png',
  pdf:'pdf.png',
  word:'word.png',
  excel:'excel.png',
  rar:'rar.png',
  txt:'txt.png',
  ppt:'ppt.png'
};



/*上传文件校验*/
export function validFile({name,size}){
  let fileSuffix = name.substring(name.lastIndexOf(".")).toLowerCase();
  let accept = (fileType.indexOf(fileSuffix) !== -1)
  if(!accept){
    Message({showClose: false,message: '不支持上传该文件类型',duration:2000});
  }
  return accept
}


/*根据文件类型显示文件图标*/
export function choiceTypeImg(fileName){
  let urlArr =  fileName.split('.');
  let fileType = urlArr[urlArr.length-1].toString().toLowerCase();
  var imgUrl = '';
  if(fileType === 'bmp' || fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg' || fileType === 'mpg'){
    imgUrl = '/static/images/file/' + fileType2Icon.img;
  }
  else if(fileType === 'txt'){
    imgUrl = '/static/images/file/' + fileType2Icon.txt;
  }
  else if(fileType === 'doc' || fileType === 'docx'){
    imgUrl = '/static/images/file/' + fileType2Icon.word;
  }
  else if(fileType === 'pdf'){
    imgUrl= '/static/images/file/' + fileType2Icon.pdf;
  }
  else if(fileType === 'xls' || fileType === 'xlsx'){
    imgUrl= '/static/images/file/'+ fileType2Icon.excel;
  }
  else if(fileType === 'rar' || fileType === 'zip'){
    imgUrl = '/static/images/file/' + fileType2Icon.rar;
  }
  else if(fileType === 'ppt' || fileType === 'pptx'){
    imgUrl = '/static/images/file/' + fileType2Icon.ppt;
  }
  else{
    imgUrl = '/static/images/file/' + fileType2Icon.file;
  }
  return imgUrl;
}
