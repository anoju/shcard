$(function(){
	mainCardInit();
	mainDirectInit();
})
var mainBanner = function(tar){
	//console.log('mainBanner');
	var $wrap = $(tar),
		$winW = $(window).width(),
		$winH = $(window).height(),
		$length = $wrap.find('.slide').length,
		$btnActive = false,
		$timer = 1000,
		$pagination = $wrap.find('.pagination'),
		$counter = $wrap.find('.counter');
	
	//첫세팅
	mainBannerFirst();
	function mainBannerFirst(){
		var $counterMax = $length;
		if(($counterMax.toString()).length == 1){
			$counter.find('p').append('<span>0'+$counterMax+'</span>');
		}else{
			$counter.find('p').append('<span>'+$counterMax+'</span>');
		}
		for(var i = 1;i <= $length;i++){
			$pagination.append('<span></span>');
			if((i.toString()).length == 1){
				$counter.find('ul').append('<li>0'+i+'</li>');
			}else{
				$counter.find('ul').append('<li>'+i+'</li>');
			}
		}
		$wrap.find('.slide').eq(0).addClass('active');
		$pagination.find('span').eq(0).addClass('active');
		btnActive(1);
	}

	//이전 다음 버튼 클릭 시
	$wrap.find('.control .btn_arr').click(function(e){
		e.preventDefault();
		var $idx = $wrap.find('.slide.active').index();
		/*if($autoplayOn == true){
			$('.main_slide .control > span > a').trigger('click');
		}*/
		if($btnActive == true){
			$btnActive = false;
			if($(this).hasClass('btn_next')){			//다음			
				
				if($idx == ($length-1)){
					$idx = 0;
					activeChage('last',$idx);
				}else{
					$idx = $idx+1;
					activeChage('next',$idx);
				}
			}else if($(this).hasClass('btn_prev')){  	//이전				
				if($idx == 0){
					$idx = ($length-1);
					activeChage('first',$idx);
				}else{
					$idx = $idx-1;
					activeChage('prev',$idx);
				}
			}
		}
	});

	//슬라이드 active 변경
	function activeChage(i,idx){
		var $ul = $('.main_slide .slide_list'),
			$active = $wrap.find('.slide.active'),
			$slide = $wrap.find('.slide');
		
		btnActive(2);
		counterAnimation(idx);
		switch(i){
			case 'next':
				$ul.removeClass('reverse');
				$active.addClass('active-out').delay($timer).queue(function(next){
					$active.removeClass('active active-out').next().addClass('active');
					next();
				});
				$pagination.find('.active').removeClass('active').next().addClass('active');
				break;
			case 'prev':
				$ul.addClass('reverse');
				$active.addClass('active-out').delay($timer).queue(function(next){
					$active.removeClass('active active-out').prev().addClass('active');
					next();
				});
				$pagination.find('.active').removeClass('active').prev().addClass('active');
				break;
			case 'last':
				$ul.removeClass('reverse');
				$active.addClass('active-out').delay($timer).queue(function(next){
					$active.removeClass('active active-out').siblings('.slide').first().addClass('active');
					next();
				});
				$pagination.find('.active').removeClass('active').siblings().first().addClass('active');
				break;
			case 'first':
				$ul.addClass('reverse');
				$active.addClass('active-out').delay($timer).queue(function(next){
					$active.removeClass('active active-out').siblings('.slide').last().addClass('active');
					next();
				});
				$pagination.find('.active').removeClass('active').siblings().last().addClass('active');
				break;
		}

		//ie 9에서 처리방법
		if($('html').hasClass('lt-ie10')){
			$slide.find('.box').stop().animate({
				'left': -500,
				'opacity': 0
			},$timer,function(){
				$(this).stop().css({
					'left': 500
				}).animate({
					'left': 0,
					'opacity': 1
				},$timer);
			})
		}
	}

	//네비 버튼 활성화
	function btnActive(num){
		clearTimeout(btnActiveTime);
		var btnActiveTime = setTimeout(function(){
			$btnActive = true;
		},($timer*num));
	}

	//page 표시
	function counterAnimation(idx){		
		var $counUl = $('.counter ul'),
			$height = $('.counter div').outerHeight();
		setTimeout(function(){
			$counUl.stop().animate({'top':$height*idx*-1},500);
		},$timer);
	}

	//resize 크기
	$(window).resize(function(){
		//console.log('slide_list padding');
		$winW = $(window).width(),
		$winH = $(window).height();

		var $list = $('.main_slide .slide_list'),
			$headH = $('#header').height(),
			$listH = $list.height(),
			$lineH = $('.main_slide .line').height(),
			$sideH = 0;

		if($winW <= 1000){
			$sideH = $('.main_side').outerHeight();
		}else{
			$sideH = 0;
		}
			
		var $padding = Math.max(0,($winH - $headH - $listH - $lineH - $sideH)/2);

		$list.css({
			'padding-top':$padding,
			'padding-bottom':$padding
		});
		$counter.css({
			'top':$padding
		});
	});
	$(window).resize();

	$wrap.swipedown(function(e,touch){
		if($winW > 1000)$('.main_slide .control .btn_prev').trigger('click');
	}).swipeup(function(e,touch){
		if($winW > 1000)$('.main_slide .control .btn_next').trigger('click');
	}).swiperight(function(e,touch){
		if($winW <= 1000)$('.main_slide .control .btn_prev').trigger('click');
	}).swipeleft(function(e,touch){
		if($winW <= 1000)$('.main_slide .control .btn_next').trigger('click');
	});

	//autoplay
	var $autoplayOn = true,
		autoplayTime;
	autoplayBanner();
	function autoplayBanner(){
		clearTimeout(autoplayTime);
		//console.log('auto',$autoplayOn);
		if($autoplayOn == true){
			//console.log('autoplay');
			autoplayTime = setTimeout(function(){				
				$('.main_slide .control .btn_next').trigger('click');
				autoplayBanner();
			},5000)
		}
	}
	//재생 정지 버튼 클릭 시
	$wrap.find('.control .btn_stop').click(function(e){
		e.preventDefault();
		var $txt =  $(this).text();
		//console.log($txt);
		if($txt == '정지'){
			$(this).addClass('play').text('재생');
			$autoplayOn = false;
		}else if($txt == '재생'){
			$(this).removeClass('play').text('정지');
			$autoplayOn = true;
		}
		autoplayBanner();
	});

	/** 혜택보기 팝업 **/
	//혜택보기 열기
	$(document).on('click','.btn_main_search',function(e){
		e.preventDefault();
		
		//혜택보기 세팅
		popMainSearch();
		function popMainSearch(){
			$('.pop_main_search .select_list > a').text($('.pop_main_search .select_list li').eq('0').text());
			$('.pop_main_search .select_list li').eq('0').addClass('selected');
			$('.pop_main_search .select_cont').eq('0').addClass('active');
		}
		
		$(window).resize(function(){
			var $popup = $('.pop_main_search'),
				$popHeight = $popup.outerHeight(),
				$wrapHeight = $('.main_slide .slide_list').outerHeight();
				$popupTop = ($wrapHeight-$popHeight)/2;

			$('.pop_main_search').css('top',$popupTop)
		})
		$(window).resize();
		$('.pop_main_search').addClass('active');
		
		mainSearchGraph(); //그래프 애니메이션 효과, 로딩영역 없애는 스크립트 포함
	});

	//혜택보기 닫기
	$(document).on('click','.btn_main_search_close',function(e){
		e.preventDefault();
		$('.pop_main_search').removeClass('active');
	});

	// 혜택보기 >  셀렉트 설정
	$(document).on('click','.pop_main_search .select_list .option',function(e){
		e.preventDefault();
		var $txt = $(this).text();
		mainSearchLoadingShow($txt);
	});
}

var mainSwiperInit = function(){
	var mainSwiper = $('.main_swiper').swiper({		
		pagination : '.main_swiper .pagination',
		calculateHeight: true,
		autoplay: '5000',
		loop:true
	});

	$('.main_swiper .navi .btn').on('click',function(e){
		e.preventDefault();
		//console.log('aaaa')
		if($(this).hasClass('play')){
			mainSwiper.startAutoplay();
			$(this).removeClass('play').text('정지');
		}else{
			mainSwiper.stopAutoplay();
			$(this).addClass('play').text('재생');			
		}
	});
}

var mainCardInit =  function(){
	$(document).on('click','.btn_main_card',function(e){
		e.preventDefault();
		$('body').addClass('hidden').scrollTop(0);
		var $this = $(this),
			$offset = $this.offset();		
		
		$('.main_card_wrap li').each(function(){
			var $idx = $(this).index();
			$(this).css('transition-delay',($idx*0.1) +'s')
		})
		$('.main_card_wrap').addClass('on').attr('tabIndex',0).focus();
		$('.btn_main_card_close').css({
			'left': $offset.left,
			'top': $offset.top
		})

		$(window).resize(function(){
			var $offset = $this.offset();
			$('.btn_main_card_close').css({
				'left': $offset.left,
				'top': $offset.top
			})	
		})
	});
	$(document).on('click','.btn_main_card_close',function(e){
		e.preventDefault();
		$('.main_card_wrap li').removeAttr('style');
		$('body').removeClass('hidden');
		$('.main_card_wrap').removeClass('on').removeAttr('tabIndex');
		$('.btn_main_card').focus();
	});

	$(document).on('focus mouseover','.main_card_wrap li',function(e){
		$(this).addClass('hover').siblings().removeClass('hover');
	}).on('mouseleave',function(){
		$(this).removeClass('hover');
	});
	$(document).on('blur','.main_card_wrap li:last-child .button',function(e){
		$('.main_card_wrap li').removeClass('hover');
	});	
}


var mainDirectInit = function(){
	if(isMobile.any() == false){
		$(window).load(function(){
			$('.dr_contents').mCustomScrollbar({
				theme:'dark',
				autoHideScrollbar:true,
				horizRailEnabled:false,
				callbacks:{
					onInit: function(){
						//console.log('aaaa')
					},
					whileScrolling: function(){
						jsScrollLineInit('.dr_contents','.dr_contents_scroll .bar');
					}
				}
			});
			$('.dr_side').mCustomScrollbar({
				theme:'dark',
				autoHideScrollbar:true,
				horizRailEnabled:false
			});
		});
	}else{
		scrollLineInit('.dr_contents','.dr_contents .dr_inner','.dr_contents_scroll .bar');
	}
	
	$(document).on('click','.btn_main_direct',function(e){
		e.preventDefault();
		if($('body').hasClass('main_direct_open')){
			mainDirectStep(1);			
			$('.dr_wrap .dr_contents_scroll .bar').css('width',0);
			$('.dr_side').removeClass('m_off');
			$('body').removeClass('main_direct_open');			
		}else{
			$('body').addClass('main_direct_open');
		}
	});
	$(document).on('click','.dr_close, .ui-dr-close',function(e){
		e.preventDefault();
		mainDirectStep(1);			
		$('.dr_wrap .dr_contents_scroll .bar').css('width',0);
		$('.dr_side').removeClass('m_off');
		$('body').removeClass('main_direct_open');	
	});

	$(window).resize(function(){
		var $winH = $(window).height(),
			$head = $('.dr_haed'),
			$headH = $head.outerHeight(),
			$cont = $('.dr_container');
		//console.log($winH,$headH)
		$cont.css('height',$winH-$headH);

		var $last = $('.dr_info_top.last'),
			$lastHeight = $('.dr_info_top.last').outerHeight(),
			$contHeight = $cont.height(),
			$contPad = parseInt($cont.find('.dr_inner').css('padding-top')) + parseInt($cont.find('.dr_inner').css('padding-bottom'));		
		
		$last.css('margin-top',($contHeight-$lastHeight-$contPad)/2);
	});

	$(document).on('click','.dr_side_list .tit > a',function(e){
		e.preventDefault();
		// if($(this).closest('li').hasClass('active')){
		// 	$(this).closest('li').toggleClass('close').siblings().removeClass('open close');
		// }else{
		// 	$(this).closest('li').siblings('.active').addClass('close');
		// 	$(this).closest('li').toggleClass('open').siblings().not('active').removeClass('open close');
		// }
		if($(this).closest('li').hasClass('active')){
			$(this).closest('li').toggleClass('close');
		}else{
			$(this).closest('li').toggleClass('open');
		}
	});
}
var mainDirectStep = function(idx){
	if(!$('body').hasClass('main_direct_open'))$('body').addClass('main_direct_open');
	var $idx = idx-1;
	$('.dr_cont_step').eq($idx).addClass('active').siblings('.dr_cont_step').removeClass('active');	
	$('.dr_flow > li').eq($idx-1).addClass('on').siblings().removeClass('on');
	if($idx == 0){
		$('.dr_haed h1').show();
		$('.dr_flow').hide();
		$('.dr_side').removeClass('m_off');
		$('.dr_side_opt').addClass('active').siblings().removeClass('active');
		$('.dr_side_info .dr_side_list > li').removeClass('active');
	}else{
		$('.dr_haed h1').hide();
		$('.dr_flow').show();
		$('.dr_side').addClass('m_off');
		$('.dr_side_info').addClass('active').siblings().removeClass('active');
		if($idx >= 4){
			$('.dr_side_info .dr_side_list > li').removeClass('active');
		}else{
			$idx = $idx-1;
			$('.dr_side_info .dr_side_list > li').eq($idx).addClass('active').siblings().removeClass('active');
		}		
	}	
	if(isMobile.any() == false){
		$('.dr_contents').mCustomScrollbar('scrollTo',0); 	//스크롤 상단으로
		$('.dr_side').mCustomScrollbar('scrollTo',0);		//스크롤 상단으로
	}else{
		$('.dr_contents').scrollTop(0); 	//스크롤 상단으로
		$('.dr_side').scrollTop(0);		//스크롤 상단으로
	}
	$(window).resize();
}

var step2Timeout;
var step2barTimeout;
var mainSearchGraph = function(){
	var $time = 500;

	$('.pop_main_search .search_loading').remove();
	$('.main_search_graph_wrap').removeClass('step1 step2');
	$('.main_search_graph').removeClass('on');
	clearTimeout(step2Timeout);
	clearTimeout(step2barTimeout);

	var $idx = $('.pop_main_search .select_list .selected').index(),
		$cont = $('.pop_main_search .select_cont').eq($idx),
		$graphWrap = $cont.find('.main_search_graph_wrap');

	$cont.addClass('active');
	$graphWrap.find('.sec1').addClass('on');
	//animation
	$cont.find('.ui-graph').each(function(i){
		//console.log('aaaa')
		var $this = $(this),
			$height = $this.find('.bar').data('height');
		//console.log(i)
		$this.find('.bar').css('height',0).stop().delay($time).animate({'height':$height+'%'},($time*2),'easeOutBack',function(){
			if(i == 1)$graphWrap.addClass('step1');
		});
	});

	step2Timeout = setTimeout(function(){
		var $time2 = 1500;
		$graphWrap.removeClass('step1').addClass('step2').find('.sec2').addClass('on').siblings().removeClass('on');
		$cont.find('.ui-graph2').each(function(i){
			var $this2 = $(this),
				$height2 = $this2.find('.bar').data('height');
			
			step2barTimeout = setTimeout(function(){
				if($graphWrap.hasClass('step2')){
					$this2.addClass('on');
					if($height2 < 100){
						$this2.addClass('anim');				
						$this2.find('.bar').stop().css({'height':'100%'}).animate({'height':$height2+'%'},$time2,function(){
							$this2.removeClass('anim');
						});
					}
				}
			},$time2*i);			
		});
	},$time*9)
}

//검색팝업 로딩 보이기
var mainSearchLoadingShow = function(txt){
	var $html = '<div class="search_loading">';
		$html += '<p class="search_loading_tit">검색하신 <strong>'+txt+'</strong>로 할인가를 계산중입니다.</p>';
		$html += '<div class="search_loading_img"><i class="ic ic1"></i><i class="ic ic2"></i><i class="ic ic3"></i></div>';
		$html += '</div>';

	clearTimeout(step2Timeout);
	clearTimeout(step2barTimeout);
	$('.main_search_graph_wrap').removeClass('step1 step2');
	$('.main_search_graph').removeClass('on');
	$('.pop_main_search').append($html);
	$('.pop_main_search .select_cont').removeClass('active');

	setTimeout(function(){
		mainSearchGraph()
	},1000)
}
//검색팝업 로딩 숨기기
var mainSearchLoadingHide = function(){
	$('.pop_main_search .search_loading').remove();
}