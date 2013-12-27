

config.json = {
	"cssRoot":"",    //选择目录
	"format":"css",  //合并文件选择
	"cssOutput":"./output/", //文件输出目录
	"outputName":'', //文件输出名字
	
};



选择需要的css/js合并压缩，可以包含子目录(可实现)
选择几个在线文件链接生成合并压缩文件 


可以做个isprite的应用，选择图片合并压缩


界面设计!!？？难
也可以像cssgaga那样只是上传路径，合并同个目录的文件(css或者js)

(1)cssgaga合并:

默认开启，无法关闭
Before:

@import url("reset.import.source.css");
@import url("grid.import.source.css");
@import url("mod-1.source.css"); /* mod-1.source.css 中 @import url("media.source.css"); */
@import url("mod-2.css");
@import url("../mod-3.source.css");
@import url("http://imgcache.qq.com/qzonestyle/mod-4.source.css");
After:

@import url(media.css);
@import url(../mod-3.css);
@import url(http://imgcache.qq.com/qzonestyle/mod-4.css);
[reset.import.source.css 处理后的代码]
[grid.import.source.css 处理后的代码]
[mod-1.source.css 处理后的代码]
[mod-2.css 处理后的代码]

注：
只合并同级的css
文件名包含“.import”的文件不会生成到本地和同步目录（例如，不会生成到72等服务器），处理时会自动跳过
只合并一次，若mod-1.source.css中import了其他css文件（即便同级）则不做处理


(2)cssgaga压缩有挺多规则
去除注释和空白

Before:

/*****
  Multi-line comment
  before a new class name
*****/
.classname {
    /* comment in declaration block */
    font-weight: normal;
}
After:

.classname{font-weight:normal}
去除结尾的分号

Before:

.classname {
    border-top: 1px;
    border-bottom: 2px;
}
After:

.classname{border-top:1px;border-bottom:2px}
Before:

去除多余的分号

.classname {
    border-top: 1px; ;
    border-bottom: 2px;;;
}
After:

.classname{border-top:1px;border-bottom:2px}
去除无效的规则

Before:

.empty { ;}
.nonempty {border: 0;}
After:

.nonempty{border:0}
去除零值的单位并合并多余的零

Before:

a {
    margin: 0px 0pt 0em 0%;
    background-position: 0 0ex;
    padding: 0in 0cm 0mm 0pc
}
After:

a{margin:0;background-position:0 0;padding:0}
去除小数点前多余的0

Before:

.classname {
    margin: 0.6px 0.333pt 1.2em 8.8cm;
    background: rgba(0, 0, 0, 0.5);
}
After:

.classname{margin:.6px .333pt 1.2em 8.8cm;background:rgba(0,0,0,.5)}

