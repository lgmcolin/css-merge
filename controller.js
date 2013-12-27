module.exports = (function(){
	var fs = require('fs'),
		http = require('http'),
		url  = require('url'),
		crypto = require('crypto'),
	    uglifyJs = require('uglify-js'),
	    cleanCss = require('clean-css'),
	    Config = require('./config'),
	    proParser = uglifyJs.uglify;
		
	/*
	* 调用单个文件压缩和多个文件压缩
	* jsMinifier('./file/test2.js', './file/test-min.js');  
	* jsMinifier(['./file/test.js','./file/test2.js'], './file-smin/test-min.js');
	*/    
	var jsMinifier = {
		minify : function(code){
			return uglifyJs.minify(code,{
				fromString: true
			})
		},
		jsMinifier:function(fileIn,fileOut){			
			var fileIn=Array.isArray(fileIn)? fileIn : [fileIn],
     		    filedata,
     		    ast,
     			finalCode=[],
     			that = jsMinifier;
     	
     		for(var i=0; i<fileIn.length; i++) {
        		filedata = fs.readFileSync(fileIn[i], 'utf8');
     			finalCode = finalCode.concat([filedata]);
     		}
   		finalCode = Config.short === 'false' ? finalCode :that.minify(finalCode).code; 
     		console.log("finalCode = "+finalCode);
    		fs.writeFileSync(fileOut, finalCode, 'utf8');
		}		 
	};
	
	/*
	* 单个文件压缩 cssMinifier('./file-src/indexw_20120913.css', './file-smin/index.css'); 
	* 多个文件压缩 cssMinifier(['./file-src/index_20120913.css','./file-src/indexw_20120913.css'], './file-smin/index.css'); 		
	*/
	var cssMinifier = {
		cssMinifier:function(fileIn,fileOut){
			var fileIn=Array.isArray(fileIn)? fileIn : [fileIn],
     			 filedata,finalCode='';
     		for(var i=0; i<fileIn.length; i++) {
        		filedata = fs.readFileSync(fileIn[i], 'utf8');
        		finalCode = Config.short ? (finalCode + filedata ) : (finalCode + cleanCss.process(filedata)); 
     		}
     		console.log('fileOut='+fileOut+',finalCode(30)='+finalCode.substring(0,30));
     		console.log('before successful');
    		fs.writeFileSync(fileOut, finalCode, 'utf8');	
			console.log('writefile--before successful');
		}
	};
	
	var fileDeal = {
		startWith:function(str,begin){
			var begin = Config.root+begin;
			return (new RegExp('^'+begin).test(str));
		},
		endWith:function(str,tag){
			return (new RegExp(tag+'$').test(str));
		},
		hasDir:function(dir){
			fs.exists(dir, function (exists) {
  				return exists ? true : false;
			});
		},
		getAllFiles: function(root,str){
			//str = pg_ 或者 str='' 表示过滤条件的不同，一种是pg_ 另一种是不做特别处理
			var res = [],
				files;
			files = fs.readdirSync(root);
			Config.root = fileDeal.endWith(root,'/') === true ? root : root+'/';  
			//if path is exist,write to config.root
			console.log('root='+Config.root);
			files.forEach(function(file){
				var pathname = Config.root + file,
					stat = fs.lstatSync(pathname);
				console.log('pathname='+pathname);
				if(!stat.isDirectory() && fileDeal.startWith(pathname,str) && fileDeal.endWith(pathname,'css')){	
					res.push(pathname.replace(Config.root,''));
				}else if(!Config.childDir){
					res = res.concat(fileDeal.getAllFiles(pathname));	
				}
			});
			return res;			
		},		
		getFile: function(urlArray,callback1){
			var writeData = '',
				num = 0;
				
				function callback(num,str){
						writeData += str;
						if(num < urlArray.length){
							fileDeal.getUrlFileContent(urlArray[num],num,callback);
						}else{
							console.log("write all data(30):"+writeData.substring(0,30));
							callback1(writeData);
						}
				}				
				fileDeal.getUrlFileContent(urlArray[num], num,callback);
							
		},
		
		getUrlFileContent: function(url,num,callback){
			console.log("url = "+url+',num='+num);
			http.get(url,function(resContent){
				var resultdata = '';
				resContent.setEncoding('utf8');
				resContent.on('data',function(chunk){
					resultdata +=chunk;				
				});
				resContent.on('end',function(chunk){			
					console.log('resultdata(30)=' + resultdata.substring(0,30));		
					
					if(new RegExp('.css'+'$').test(url)){
						resultdata = cleanCss.process(resultdata);
					} else if(new RegExp('.js'+'$').test(url)) {
						resultdata = jsMinifier.minify(finalCode).code;
					} 
					callback(++num,resultdata);	
				});	
			});
		},	
		
		/*
		* @param fileDir: 合并好的文件目录,fileOut : 写入的html目录
		*/
		writeHtml:function(fileDir,fileOut){
				var fileDir = Array.isArray(fileDir) ? fileDir : [fileDir],
					 cssStr='',
					 jsStr ='',			 
					 htmlContent = '<!DOCTYPE html>'+'\n'+
					 			 	   '<html>'+'\n'+
					 			 	   '<head>'+'\n',
					 htmlEnd   =   '</head>'+'\n'+
					 				   '<body>'+'\n'+'hellworld rain!'+'\n'+
					 				   '</body>'+'\n'+
					 				   '</html>';
				
				for(var i = 0,j = fileDir.length;i < j;i++){
					if(Config.format === 'css' || new RegExp('.css'+'$').test(fileDir[i])){					
						cssStr+='<link rel="stylesheet" href="'+fileDir[i]+'">'+'\n';
					}					
					else if(Config.format === 'js' || new RegExp('.js'+'$').test(fileDir[i])){					
						jsStr +='<script type="text/javascript" src='+fileDir[i]+'></script>';				
					}				
				}
				htmlContent = htmlContent + cssStr + htmlEnd;
				fs.writeFileSync(fileOut, htmlContent, 'utf8');
		}
	};
		
	return {
		jsMinifier:jsMinifier,
		cssMinifier:cssMinifier,
		fileDeal:fileDeal
	};
}).call(this);