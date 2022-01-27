
//富文本编辑器去格式
export function pasteTextHandle(content){
    // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
    if (content == '' && !content) return ''
    var str = content
    str = str.replace(/<xml>[\s\S]*?<\/xml>/ig, '')
    str = str.replace(/<style>[\s\S]*?<\/style>/ig, '')
    str = str.replace(/<\/?[^>]*>/g, '')
    str = str.replace(/[ | ]*\n/g, '\n')
    str = str.replace(/&nbsp;/ig, '')
    return str
}

/*富文本菜单*/
export const menus = [
  'head',
  'bold',
  'fontSize',
  'fontName',
  'italic',
  'underline',
  'strikeThrough',
  'indent',
  'lineHeight',
  'foreColor',
  'backColor',
  'link',
  'list',
  'todo',
  'justify',
  'quote',
  'emoticon',
  // 'image',
  // 'video',
  'table',
  'code',
  'splitLine',
  'undo',
  'redo',
]
