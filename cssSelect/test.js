$(document).ready(function(){

	$(document).on('click','.btn-add',function(){
		$('.filelist').show();
	});

	$('.btn-set').click(function(){
		$('.baseset').toggle();
	});

	$('.check_name input').on('change',function(){
		$(this).parent().find('.outName').toggle();
	});

})
	
