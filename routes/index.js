
/*
 * GET home page.
 */
var controller = require('../controller'),
	 Config = require('../config'),
	 fs =  require('fs'),
    sys = require('sys'),
	 path = require('path'),
	 mime = require('mime'),
	 fileDeal = controller.fileDeal,
    Client = require('mysql').Client;
   

exports.index = function(req, res){
   if(!Client) console.log('gag');
   var client = new Client();
   client.user = 'root';
   client.password ='123123';

   console.log('connecting to mysql');
   
   client.connect(function(error, results) {
      if(error) {
         console.log('Connection Error: ' + error.message);
         return;
      }
      console.log('Connected to MySQL');
      ClientConnectionReady(client);
   });

   ClientConnectionReady = function(client)
   {
      client.query('USE cssmerge', function(error, results) {
        if(error) {
            console.log('ClientConnectionReady Error: ' + error.message);
            client.end();
            return;
        }
        GetData(client);
      });

      GetData = function(client)
      {
         client.query(
            'SELECT * FROM pro',
            function selectCb(error, results, fields) {
               if (error) {
                   console.log('GetData Error: ' + error.message);
                   client.end();
                   return;
               }
    
               if(results.length > 0)
               {
                 var firstResult = results[0];
                 console.log('pro_id: ' + firstResult['pro_id']);
                 console.log('pro_name: ' + firstResult['pro_name']);
                 console.log('pro_root: ' + firstResult['pro_root']);
                 console.log('pro_globalcss: ' + firstResult['pro_globalcss']);
               }
         });
         client.end();
         console.log('Connection closed');
      };
   };

   	res.render('index', '');
};

exports.create = function(req,res){
   var global_filelist = [],
       global_path = Config.globalDir;

   console.log('global_path='+global_path);
   if(Config.globalDir || Config.globalDir.length !==0){
      try{
         global_filelist = controller.fileDeal.getAllFiles(global_path,'');
      }catch(e){
         console.log('controller.fileDeal.getAllFiles error!');
      }
   }

	res.render('create',{
         global_filelist:global_filelist
   });
};

exports.result = function(req,res){
	var filelist = req.query.filelistValue.split(','),
		 outName  = req.query.outName,
		 outPath  = fileDeal.endWith(outName,'.css') === true ?  outName : (outName+'.css'),
		 outPath  = Config.root + outPath,
		 pathlength = Config.root.length + 4,
       htmlLinkArray = [];  //'.css'

	   console.log('outPath='+outPath);

      for(var i=0,j=filelist.length;i<j;i++){
         filelist[i] = Config.root +filelist[i];
      }

      //filter can do this ,but it only in ecmscript5
      filelist.forEach(function(element,i){
         console.log('filelist['+i+']='+element);  
      });

      if(outPath.indexOf('.css')!=-1&&outPath.length === pathlength || !outPath || outPath.length === 0){
         outPath = Config.root + 'pg_global.css';
      }
      console.log('filelist,outPath='+filelist+','+outPath);

      Config.outName = outPath;
      Config.urlOut = 'index.html';   //reset the urlOut
      Config.urlOut  = Config.root + Config.urlOut;
      
      htmlLinkArray.push(outPath);
      htmlLinkArray.push(Config.globalDir+'/'+Config.globalOutName);

      try{
         controller.cssMinifier.cssMinifier(filelist,outPath); 
         console.log('css reunit successful!');
      }catch(err){
         console.log("controller.cssMinifier.cssMinifier trigger err");
      }

      try{
         console.log('Config.urlOut='+Config.urlOut);
         controller.fileDeal.writeHtml(htmlLinkArray,Config.urlOut); 
         console.log('html reunit successful!');
         res.render('download', {
            urlOut: Config.urlOut
         });
      }catch(err){
         console.log('controller.fileDeal.writeHtml err');
      }
   
};

exports.filelist = function(req,res){
	var filepath = req.body.content,
       files;
	console.log('node filelist='+filepath);
	//filepath = './'; // /home/lgm
	try{
      files = controller.fileDeal.getAllFiles(filepath,'pg_');
      console.log('files='+files);
   }catch(e){
      console.log('controller.fileDeal.getAllFiles error!');
   }  
      
   res.writeHead(200, {'content-type': 'text/json' });
   res.write(JSON.stringify(files));
   res.end('\n');
};

exports.globalCss = function(req,res){
   var global_filelist = req.body.global_filelist.split(','),
       global_outName  = req.body.global_outName ,
       state;

   for(var i=0,j=global_filelist.length;i<j;i++){
         global_filelist[i] = Config.globalDir + '/' + global_filelist[i];
   }
       
   global_outName  = fileDeal.endWith(global_outName,'.css') === true ?  global_outName : (global_outName+'.css');
   
   if(global_outName.indexOf('.css')===-1&&global_outName.length !== 4 && global_outName.length !== 0){
      Config.globalOutName = global_outName;
   }
   
   globalOutPath = Config.globalDir + '/' + Config.globalOutName;

   console.log('globalOutPath='+globalOutPath+',global_filelist='+global_filelist);
   try{
      controller.cssMinifier.cssMinifier(global_filelist,globalOutPath); 
      state = 'success';
   }catch(err){
      state = 'err';
   }
   res.writeHead(200, {'content-type': 'text/json' });
   res.write(JSON.stringify(state));
   res.end('\n');
};


exports.download = function(req,res){
	var downloadPath = Config.urlOut;
	console.log('downloadPath='+downloadPath);
	res.download(downloadPath);
};

exports.urlFile = function(req,res){
	
	if(req.query) {
		if(req.query.file && req.query.file != '') {
			var fsArray = req.query.file.split(',');
			
			fileDeal.getFile(fsArray,function(writeData){
				 console.log('writeData='+writeData.substring(0,30));	
	  			 fs.writeFileSync(Config.urlOut, writeData, 'utf8');	
			});		
		} 
		else {
			console.log("url格式错误，如http://localhost:3000/css?file=http://..,http://..");	
		}
	}
	res.render('index', '');
};