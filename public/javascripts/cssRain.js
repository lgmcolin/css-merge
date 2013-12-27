$(function(){

	var filelist = [],
		global_filelist=[];
	
	$(document).on('click','.btn-add',function(){
		$('.filelist').show();
		/*ajax request*/
		var filepath = $('#filepath')[0].value;
		var params = {
			content: ''+filepath
		};
		filelist = []; //filelist set []
		$('.filelist').find('.filed').remove().end().find('.warn').remove().end().find('.error').remove();
		$('#filelistValue').val('');

		console.log('filepath'+filepath);
		if(!filepath || filepath.indexOf('/') === -1) return;
		else{
			$.ajax({
				url: '/filelist',
				type: 'post',
				data: params,
				datatype: 'json',
				success:function(filelist){
					console.log('success filelist!');
					if(!filelist || filelist.length === 0){
						$('.filelist').find('.warn').remove().end().find('.filed').remove().end().append("<div class='warn'>该目录为空</div>").show();
						return;
					}
					var divParent = $('.filelist');
					var str = '';
					filelist.forEach(function(e){
						str += '<div class="filed"><input type="checkbox" /><span>'+e+'</span></div>';
					});
					divParent.find('.error').remove();
					divParent.find('.filed').empty().end().append(str).show();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					console.log(XMLHttpRequest + '#' + textStatus + '#' + errorThrown);
					$('.filelist').find('.error').remove().end().find('.filed').remove().end().append("<div class='error'>请输入正确的文件夹目录,以/结尾</div>").show();
				},
				complete: function(a,b){
					console.log(a + 'complete#' + b);
				}
			});
		}
	});

	$(document).on('click','.gl-css',function(){
			var globalFilelist = $('#globalFilelist').val();
			var params = {
				global_filelist: '' + globalFilelist,
				global_outName : '' + $('#globaloutName').val()
			};

			if(!$('#globalFilelist') || $('#globalFilelist').val().length === 0){
				alert('请先选择要合并的global css文件');
				return ;
			}

			if(globalFilelist.length === 0) return;
			else {
				$.ajax({
					url: '/global_css',
					type: 'post',
					data: params,
					datatype: 'json',
					success:function(state){
						console.log('gl-css state='+state);
						if(state === 'success'){
							global_filelist = [];
							$('#globalFilelist').val('');
							$('.global_filelist input[type=checkbox]').attr('checked',false);
							alert('合并成功');
						}
						else{
							alert('合并失败');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){
						console.log(XMLHttpRequest + '#' + textStatus + '#' + errorThrown);
					},
					complete: function(a,b){
						console.log(a + 'complete#' + b);
					}
				})
			}
	});
	
	$(document).on('change','.filelist input[type=checkbox]',function(){
		var value = $(this).parent().find('span').text();
		if($(this).is(':checked')){		
			filelist.push(value);
		}else{
			filelist.splice(filelist.indexOf(value),1);
		}
		console.log("filelist="+filelist);
		$('#filelistValue').val(filelist.join(','));

	}).on('change','.global_filelist input[type=checkbox]',function(){

		var value = $(this).parent().find('span').text();
		if($(this).is(':checked')){		
			global_filelist.push(value);
		}else{
			global_filelist.splice(global_filelist.indexOf(value),1);
		}
		console.log("global_filelist="+global_filelist);
		$('#globalFilelist').val(global_filelist.join(','));

	});

	$('.btn-set').click(function(){
		$('.baseset').toggle();
	});

	$('.check_name input[type=checkbox]').on('change',function(){
		$(this).parent().find('.outName').toggle();
	});

	$('.directBack').click(function(){
		window.location.href = '/create';
	});

	$(document).on('click','.close,.cancle-pro',function(){
		$('.popup').hide();
		$('.ui_mask').hide();
	});

	$(document).on('click','.create-pro',function(){
		$('.popup').show();
		$('.ui_mask').show();
	});
});
	
