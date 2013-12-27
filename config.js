
module.exports = (function(){
	/*
	*@param root:输入默认目录 ;format: 匹配合并格式 css or js; 
	*@param outDir: 输出目录; outName:输出私有css文件名; childDir:是否遍历子目录 ; short:是否压缩; urlOut:url合并默认输出dir
	*@param globalDir:全局文件夹默认路径 
	*/
	var Config = {
		'root':'./',
		"format":'css',  
		'outDir': '',
		'outName':'pg_global.css',
		'childDir':'false',
		'short':'true',
		'urlOut':'index.html',
		'globalDir':'./global',
		'globalOutName':'global.css'
	};
	return Config;
		
}).call(this);