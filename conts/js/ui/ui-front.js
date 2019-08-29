/* SH Auto Direct UI */
var $mobileSize = 760;
$(function(){
	commonUI();
	formUI();
	tableUI();
	tabUI();
	popupUI();
	btnTopUI();
	etcUI();
	scrollItem();	

	if($('.ui-countup').length > 0)countUpInit('.ui-countup');
	if($('.ui-countuplist').length > 0)countUpListInit('.ui-countuplist');
	if($('.blue_card.owl-carousel').length > 0)blueCardSwiper('.blue_card.owl-carousel')

	$(window).load(function(){
	 	$(window).resize();
	});
});

/*resizeEnd 함수 추가
  사용법 :
  $(window).resizeEnd(function(){
	console.log('resizeEnd');
  });
*/
$(window).resize(function() {
	if(this.resizeTO) {
		clearTimeout(this.resizeTO);
	}
	this.resizeTO = setTimeout(function() {
		$(this).trigger('resizeEnd');
	},300);
});

/*scrollEnd 함수 추가
  사용법 :
  $(window).scrollEnd(function(){
	console.log('scrollEnd');
  },500);
*/
$.fn.scrollEnd = function(callback, timeout) {
	$(this).scroll(function(){
	  var $this = $(this);
	  if ($this.data('scrollTimeout')) {
		clearTimeout($this.data('scrollTimeout'));
	  }
	  $this.data('scrollTimeout', setTimeout(callback,timeout));
	});
};


/* addRemoveClass 함수 추가 : 클래스를 addClass 시켰다 removeClass
  사용법 :
  $(this).addRemoveClass('.on',500,1000);
*/
(function($){
	$.fn.addRemoveClass = function(select,timeAdd,timeRemove){
	  var element = this;
	  var addIt = function(){
		   element.addClass(select);
		};
	  var removeIt = function(){
		   element.removeClass(select);
		};
	  setTimeout(function(){addIt();setTimeout(removeIt,timeRemove);},timeAdd);
	  return this;
	};
}(jQuery));


//head common UI
var commonUI = function(){
	var $header = $('#header'),
		$lnbTxt = $('#lnb a'),
		$pageTitle = $('#pageTit strong');									//gnb, lnb, title에 쓰일 텍스트지정
		//$headTitle = $('.head_title'),										//header 타이틀 클래스
		//$logo = '<a href="/" class="logo">신한 오토 다이렉트</a>',	         //header에 들어갈 로고이미지 지정
		//$title = document.title;

	if($pageTitle.length > 0){
		var $current = $.trim($pageTitle.text());
		//document.title = $current + ' | ' +  $title;						//#pageTit 가 title태그에 삽입

		if($('#lnb').length > 0){
			//$headTitle.html('<h2><a href="#">'+$current+'</a></h2>');
			$lnbTxt.each(function() {
				if ( $(this).text() == $current) {
					$(this).parents('li').addClass('active');
					if($(this).parents('li').length > 1){
						$('.lnb_nav > .active').addClass('on');
					}
				}
			});
		}else{
			//$headTitle.html('<h2>'+$current+'</h2>');						//#pageTit 가 상단(header) 타이틀로 삽입
		}
	}else{
		//$headTitle.html('<h2>'+$logo+'</h2>');								//#pageTit 없을때 로고 이미지 삽입
	}
	//if($('body').hasClass('main')) document.title = '메인 | ' +  $title;	//메인 페이지 title태그

	//GNB UI
	//btn_gnb클릭 : html 확인용:실 사용 소스는 개발(/logic/js/adp/cmm/crust-default.js)에서 따로 관리 
	$('.btn_gnb').click(function(e){
		e.preventDefault();
		var $gnbPadding = $('.gnb_head').outerHeight() + $('.gnb_util').outerHeight();
		
		if($('body').hasClass('gnb_open')){		//닫힘
			$('body').removeClass('gnb_open');
			$('.gnb_navi').removeAttr('style');			
		}else{									//열림: LNB 열려 있으면 LNB 닫음
			$('body,html').scrollTop(0);
			$(window).scroll();
			$('body').removeClass('lnb_open').addClass('gnb_open');			
			gnbSwiper.reInit();
			
			if($(window).width() <= $mobileSize){
				$('.gnb_navi').css({'height':(($(window).height() - $gnbPadding))})
			}			
		}
	});
	$(document).on('click','#gnb li.in_sub > a', function(e){
		e.preventDefault();
		var $parent = $(this).parent();
		$('#gnb .in_sub').not($parent).removeClass('on').find('.dep3').stop().slideUp();
		$parent.toggleClass('on').find('.dep3').stop().slideToggle();
	});
	$(document).on('click','#gnb .dep1 > li > a', function(e){
		if($(window).width() <= $mobileSize && !$(this).hasClass('link')){
			e.preventDefault();
			var $parent = $(this).parent();
			$parent.siblings().removeClass('on').find('.dep2').stop().slideUp();
			$parent.toggleClass('on').find('.dep2').stop().slideToggle();
		}
	});
	// $(document).on('click','.gnb_close', function(e){
	// 	e.preventDefault();
	// 	$('body').removeClass('gnb_open');
	// });

	//GNB 리사이증 시 스크립트로 제어 항목들 리셋
	$(window).resize(function(){
		$('#gnb .dep1 > li, #gnb .dep2 > ul > li').removeClass('on');
		$('#gnb .dep2, #gnb .dep3').removeAttr('style');
	})

	//견적함 열기(html 확인용:실 사용 소스는 개발(/logic/js/adp/cmm/crust-default.js)에서 따로 관리)
	$('.head_menu .btn_cart').on('click',function(e){
		e.preventDefault();
		$('body').removeClass('gnb_open lnb_open').addClass('cart_open');
	});
	//견적함 닥기
	$(document).on('click','.cart_box .cart_close',function(e){
		$('body').removeClass('cart_open');
	});

	//LNB 열기
	//head_title a 클릭 : html 확인용:실 사용 소스는 개발(/logic/js/adp/cmm/crust-default.js)에서 따로 관리
	$('.head_title a').on('click',function(e){
		if(!$(this).hasClass('logo')){
			e.preventDefault();
			if($('body').hasClass('lnb_open')){ 	//닫힘
				$('body').removeClass('lnb_open');
			}else{									//열림: GNB 열려 있으면 GNB 닫음
				$('body').removeClass('gnb_open').addClass('lnb_open');
			}
		}
	});
	//LNB 서브열기
	$(document).on('click','.lnb_nav > li.in_sub > a', function(e){
		e.preventDefault();
		$(this).parent().toggleClass('on').siblings().removeClass('on');
	});

	//헤더 회원 정보 레이어
	$(document).on('click','.head_user dt a',function(e){
		e.preventDefault();
		$('.head_user').toggleClass('on');
	});
	$(document).on('click','.head_user .head_user_close',function(e){
		e.preventDefault();
		$('.head_user').removeClass('on');
	});

	//스크롤 시(리사이즈 시) 헤더 고정
	if($('#header').length > 0){
		$(window).on('scroll resize',function(){
			var $scrollTop = $(this).scrollTop(),
				$winW = $(window).width(),
				$contTop = $('#contents').offset().top;
			
			if($scrollTop > $contTop && !$('body').hasClass('main')){
				$('body').addClass('head_fixed');
			}else{
				$('body').removeClass('head_fixed');
			}
		});
	}

	//푸터 하단 고정을 위해 container에 min-height 값부여
	if($('#container').length > 0 && $('#footer').length > 0 && !$('body').hasClass('main')){
		$(window).on('resize',function(){
			var $winH = $(window).height(),
				$headerH = $header.outerHeight(),
				$footerH = $('#footer').outerHeight(),
				$container= $('#container');

			$container.removeAttr('style');
			var $containerH = $container.outerHeight(),
				$minHeight = $winH-$headerH-$footerH;

			if($minHeight > $containerH){
				//if($('.dr_inner').length > 0){
				//	$('.dr_inner').css('min-height',$minHeight);
				//}else{
					$container.css('min-height',$minHeight); //#container의 height 보다 클때만 min-height 부여
				//}
			}
		});
	}

	//버튼의 disabled클래스 클릭 시 무효처리
	$(document).on('click','.button.disabled',function(e) {
		e.preventDefault();
	});

	//웹일때 전화번호 링크 무효처리
	$(document).on('click','a[href^="tel"]',function(e) {
		if(isMobile.any() == false){ //모바일 체크
			e.preventDefault();
		}
	});
	gnbSwiperInit();
};

//GNB 롤링 배너
var gnbSwiper 
function gnbSwiperInit(){
	gnbSwiper = $('.gnb_swiper .swiper-container').swiper({
		//pagination : '.gnb_swiper .pagination',
		//autoplay: '5000',
		//loop:true,
		calculateHeight: true,
		onSlideChangeStart:function(e){
			var $idx = e.activeIndex,
				$length = e.slides.length;
			//console.log($length)
			if($idx == 0){
				$('.gnb_swiper .navi .btn_prev').addClass('disabled');
			}else{
				$('.gnb_swiper .navi .btn_prev').removeClass('disabled');
			}
			if($idx == ($length-1)){
				$('.gnb_swiper .navi .btn_next').addClass('disabled');
			}else{
				$('.gnb_swiper .navi .btn_next').removeClass('disabled');
			}
		},
		onInit:function(e){
			$('.gnb_swiper .navi .btn_prev').addClass('disabled');
		}
	});

	$('.gnb_swiper .navi .btn_arr').on('click',function(e){
		e.preventDefault();
		//console.log('aaaa')
		if($(this).hasClass('btn_next')){
			gnbSwiper.swipeNext();
		}else{
			gnbSwiper.swipePrev();
		}
	});
}



/* 폼요소 */
var formUI = function(){
	$('input, textarea').placeholder();

	//input:file
	$(document).on('focus','.inp_file > input',function(){
		$(this).closest('.inp_file').find('.btn_file input').trigger('click');
	});
	$(document).on('click','.inp_file .btn_file .button',function(e){
		e.preventDefault();
		$(this).closest('.inp_file').find('.btn_file input').trigger('click');
	});
	$(document).on('change','.inp_file .btn_file input',function(){
		$(this).closest('.inp_file').find('> input').val($(this).val());
	});

	//input 삭제버튼
	$(document).on('keyup focus','.ui-input-reset .input',function(){
		var $val = $(this).val();
		if($val == ''){
			$(this).closest('.ui-input-reset').removeClass('on');
		}else{
			$(this).closest('.ui-input-reset').addClass('on');
		}
	})
	// $(document).on('blur','.ui-input-reset .input',function(){
	// 	setTimeout(function(){
	// 		$(this).closest('.ui-input-reset').removeClass('on');
	// 		console.log('aaaa100')
	// 	},100);
	// });
	$(document).on('click','.btn_input_reset',function(e){
		e.preventDefault();
		var $closest = $(this).closest('.ui-input-reset');
		$closest.removeClass('on').find('.input').val('').focus();
	});

	//spinnerInit();							//jQuery UI spinner + 마크업 spinner UI
	datepickerInit();							//jQuery UI 달력 + 달력
	tooltipInit();								//jQuery UI tooltip
	selectMake();								//select 요소 마크업 생성
	selectMakeUI();								//select 요소 마크업 생성 후 클릭 UI
	textareaAutoHeightInit('.textarea-height'); //textarea 입력 시 자동으로 height 값 변경
};

/* spinner UI 사용안함 */
var spinnerInit = function(){
	//spinner
	if($('.spinner').size() > 0){
		$( '.spinner' ).spinner({
			min: 1,
			create: function( event, ui ) {
				//add custom classes and icons
				$(this)
				.next().html('<i class="icon icon-plus">더하기</i>')
				.next().html('<i class="icon icon-minus">빼기</i>');
			}
		});
	}

	//inp_spinner
	if($('.inp_spinner').length > 0){
		$('.inp_spinner').each(function(){
			var $this = $(this),
				$min = $this.data('min'),
				$max = $this.data('max'),
				$input = $this.find('.input'),
				$inputVal = $input.val(),
				$btn = $this.find('.btn');

			$input.after('<select class="select" title="수량선택"><option value="0">직접입력</option></select>');
			var $select = $this.find('.select');

			//세팅
			for(var i = $min;i <= $max;i++){
				if(i == $inputVal){
					$select.append($('<option>',{value: i, text: i, selected: 'selected'}));
				}else{
					$select.append($('<option>',{value: i, text: i}));
				}
			}
			if($inputVal == '' ||$inputVal == null){
				$input.val($min);
				$select.val($min);
			}

			//셀렉트
			$select.change(function(){
				var $val = $(this).val();
				if($val == '0'){
					$select.addClass('hide');
					$input.addClass('on').attr("readonly",false).focus();
				}else{
					$input.val($val);
				}
			});

			//숫자 입력시
			$input.change(function(){
				var $val = $(this).val();
				if($min <= $val && $val <= $max){
					$select.val($val).removeClass('hide');
					$input.removeClass('on').attr("readonly",true);
				}else{
					alert($min+'에서 '+$max+'까지만 입력 가능합니다.\n다시 입력해주세요');
					$input.val($min);
					$select.val($min);
				}
			});
			var $firstVal = '';
			$input.focusin(function(){
				$firstVal = $(this).val();
			});
			$input.focusout(function(){
				var $lastVal = $(this).val();
				if($firstVal == $lastVal){
					//console.log($firstVal,$lastVal)
					$select.val($lastVal).removeClass('hide');
					$input.removeClass('on').attr("readonly",true);
				}
			});

			//버튼 클릭
			$btn.click(function(e){
				e.preventDefault();
				var $val = $input.val(),
					$val2 = $select.val();
				if($(this).hasClass('btn_minus')){
					$val--;
					if($val < $min){
						alert('최소수량은 '+$min+'개 입니다.');
						$val = $min;
					}
				}else{
					$val++;
					if($val > $max){
						alert('최대수량은 '+$max+'개 입니다.');
						$val = $max;
					}
				}
				$input.val($val);
				$select.val($val);
			});
		});
	}
};

/* 달력 UI */
var datepickerInit = function(){
	//datepicker
	if(isMobile.any()){													//모바일인지 확인
		//$( '.datepicker, .sh-datepicker' ).attr('type','date');		//모바일 일때는 type을 date로 변경
		$( '.datepicker' ).parent().append('<input class="input inp_datepicker" type="date" title="날짜 선택">');  //모바일 일때는 input:date 추가로 기본 input UI 사용
		$('.inp_datepicker').on('change',function(){
			var $val = $(this).val(),
				$newVal = $val.split('-').join('.');
			$(this).siblings('.datepicker').val($newVal);
		});
	}else if($('.datepicker').length > 0 ){
		$( '.datepicker' ).datepicker({
			closeText: '닫기',
			prevText: '이전달',
			nextText: '다음달',
			currentText: '오늘',
			monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
			dateFormat: 'yy.mm.dd',
			yearSuffix: '.',
			showMonthAfterYear: true,
			showButtonPanel: true,
			showOn: 'both',
			//changeMonth: true,
			//changeYear: true,
			buttonText: '기간조회'
		});

		//리사이즈시 위치값 문제로 캘린더 닫기
		$(window).resize(function(){
			$('.ui-datepicker-close').trigger('click');
		});
	}

	$(window).resize(function(){
		//신한 달력 리사이즈 시 숨기기
		if($('#calendarDiv').is(':visible')){
			$('#calendarDiv').hide();
		}
	})
};

/* jQuery UI tooltip */
var tooltipInit = function(){
	$(document).tooltip({
		items:".tooltip, .tooltip-img, [data-tooltip-img]",
		track:true,
		content:function() {
			var element = $( this );
			if(element.is( "[data-tooltip-img]" ) ) {
				var img = element.data('tooltip-img'),
					  alt = element.data('tooltip-alt');
				return "<img src='"+ img +"' alt='"+alt+"'/>";
			}
			if(element.hasClass("tooltip-img")){
				return element.attr("alt" );
			}
			if(element.hasClass("tooltip")){
				return element.attr("title");
			}
		}
	});

	//도움말 툴팁
	$(document).on('click','.tooltip_wrap .btn_tooltip',function(e){
		e.preventDefault();
		var $this = $(this),
			$box = $this.siblings('.box');

		$this.closest('.tooltip_wrap').toggleClass('on');

		$(window).resize(function(){
			//console.log('resize');
			var $winW = $(window).width();
			$box.removeAttr('style');
			var $boxLeft = $box.offset().left,
				$boxMarginLeft = parseInt($box.css('margin-left'));

			if($boxLeft < 0){
				$boxLeft = Math.abs($boxLeft);
				$boxMarginLeft = $boxMarginLeft + $boxLeft + 18;
				$box.css({
					'margin-left':$boxMarginLeft,
					'max-width': $winW-36
				});
				$box.find('.arr').css({
					'left': Math.abs($boxMarginLeft)
				});
			}else{
				$box.find('.arr').removeAttr('style');
			}
		});
		$(window).resize();
	})
	$(document).on('click','.tooltip_wrap .tooltip_close',function(e){
		e.preventDefault();
		$(this).closest('.tooltip_wrap').removeClass('on').find('.btn_tooltip').focus();
	})

	ballonInit();
};

var ballonInit = function(){
	//말풍선 툴팁
	var $el = $.find('*[data-ballon]');
	$.each($el, function(e){
		var $el = $(this),
			$parent = $el.parent(),
			$parentPosition =  $parent.css('position'),
			$id = '#ballon'+e,
			$text = $el.data('ballon'),
			$direction = $el.data('ballon-direction');

		//if($el.is(':visible') == false) return;
		if($parentPosition == 'static') $parent.css({'position':'relative'})

		//말풍선 삽입
		if($direction == 'top'){
			$parent.append('<div class="balloon_box bottom" id="'+$id.substring(1)+'" data-animation="bounce"><i></i><span class="txt">'+$text+'<a href="'+$id.substring(1)+'" class="button btn_close"><span class="blind">닫기</span></a></span></div>');
		}else{
			$parent.append('<div class="balloon_box" id="'+$id.substring(1)+'" data-animation="bounceUp"><i></i><span class="txt">'+$text+'<a href="'+$id.substring(1)+'" class="button btn_close"><span class="blind">닫기</span></a></span></div>');
		}
		$(window).on('resize scroll',function(){
			//console.log('resize')
			var $winW = $(window).width(),
				$tar = $($id),
				$elTop = $el.position().top,
				$elLeft = $el.position().left,
				$elWidth = $el.outerWidth(),
				$elHeight = $el.outerHeight(),
				$ballonW = $($id).outerWidth(),
				$ballonH = $($id).outerHeight(),
				$left = $elLeft+($elWidth/2)-($ballonW/2),
				$top = $elTop+$elHeight;

			if($direction == 'top') $top = $elTop - $ballonH - 8;

			$tar.css({
				'left': Math.max(0,$left),
				'top': $top
			});

			var $tarLeft = parseInt($tar.css('left'));
			if($tarLeft <= 0){
				$tar.find('i').css({
					'left':$elLeft+($elWidth/2)
				});
			}else{
				$tar.find('i').removeAttr('style');
			}
		});
		$(window).load(function(){
			$(window).resize();
		});
		$($id).find('.btn_close').on('click',function(e){
			e.preventDefault();
			$($id).remove();
			$el.focus();
		});
	});
}
/* 셀렉트(ui-select) 만들기 */
var selectMake = function(){
	$("select.ui-select").each(function(){
		var classes = $(this).attr("class"),
			id      = $(this).attr("id"),
			name    = $(this).attr("name");
		if($(this).is(':visible')){
			var template  = '<div class="' + classes + '">';
				template += '<a href="#" class="ui-select-trigger">' + $(this).attr("placeholder") + '</a>';
				template += '<ul class="ui-select-options">';
				$(this).find("option").each(function(){
					template += '<li><a href="#" class="ui-select-option" data-value="' + $(this).attr("value") + '">' + $(this).html() + '</a></li>';
				});
				template += '</ul></div>';

			$(this).wrap('<div class="ui-select-wrap"></div>');
			$(this).hide().after(template);
		}
	});
};
/* ui-select UI */
var selectMakeUI = function(){
	$(document).on("click",".ui-select-trigger", function(e){
		e.preventDefault();
		var $parent = $(this).closest(".ui-select");
		if($parent.hasClass('on')){
			$parent.removeClass('on');
		}else{
			$('.select_list').removeClass('on');
			$(this).parent().addClass('on');
		}
		// $(this).closest(".ui-select").toggleClass("on");
		// $('html').one('click',function(){
		// 	$(".ui-select").removeClass("on");
		// });
		// event.stopPropagation();
	});
	$(document).on("click",".ui-select-option", function(e){
	  e.preventDefault();
	  var $val= $(this).data("value"),
		  $select = $(this).closest(".ui-select-wrap").find("select");

	  //console.log(".ui-select-option : "+$val)
	  $select.val($val);
	  $(this).parent().addClass("selected").siblings().removeClass("selected");
	  $(this).closest(".ui-select").removeClass("on").find(".ui-select-trigger").text($(this).text());
	  //console.log(".ui-select : "+$select.val())
	});
};

/* textarea 자동 높이값 변경 */
var textareaAutoHeightInit = function(tar){
	var $text =  $(tar);
	$text.keydown(function() {
		textareaAutoHeight($(this));
	});
	$(window).load(function(){
		$text.each(function() {
			textareaAutoHeight($(this));
		});
	});
};
var textareaAutoHeight = function(tar){
	var $el = tar,
  		$defaultHeight = 32;

  setTimeout(function(){
	$el.css({'height':$defaultHeight});

	var $scrollHeight = $el.prop('scrollHeight') + 2;//border 값때문에 +2
	$el.removeAttr('style').css({'height': + $scrollHeight + 'px'});
  },10);
};

/* TOP 버튼: 상단이동 */
var btnTopUI = function() {
	var settings = {
			button      : '#btnTop',
			text        : '컨텐츠 상단으로 이동',
			min         : 100,
			fadeIn      : 400,
			fadeOut     : 400,
			scrollSpeed : 800,
			easingType  : 'easeInOutExpo'
		};

   $('body').append('<a href="#" id="' + settings.button.substring(1) + '" title="' + settings.text + '"><i class="fa fa-arrow-up" aria-hidden="true"></i><span class="blind">' + settings.text + '</span></a>');
	$(settings.button+',.btn_top' ).on('click', function( e ){
		e.preventDefault();
		$('html, body').animate({ scrollTop : 0 }, settings.scrollSpeed, settings.easingType );
	})
	.on('mouseenter', function() {
		$( settings.button ).addClass('hover');
	})
	.on('mouseleave', function() {
		$( settings.button ).removeClass('hover');
	});

	$(window).scroll(function() {
		var position = $(window).scrollTop();
		
		if($('.at_floting_btn').length > 0)$(settings.button+', #footer').addClass('type1');
		if($('.search_option .btn_wrap').length > 0)$(settings.button+', #footer').addClass('type2');
		if($('.compare_wrap').length > 0)$(settings.button+', #footer').addClass('type3');
		if($('.total_float').length > 0)$(settings.button+', #footer').addClass('type4');

		if ( position > settings.min ) { $( settings.button ).fadeIn( settings.fadeIn );  }
		else { $( settings.button ).fadeOut( settings.fadeOut );  }
	});
};

/* table 관련 UI */
var tableUI = function(){
	$(document).on('change','.table .tbl-chk-all',function(){
		var $table = $(this).closest('table'),
			$chk = $table.find('tbody .tbl-chk');

		if($(this).prop('checked')){
			$chk.prop('checked', true).closest('tr').addClass('on');
		}else{
			$chk.prop('checked', false).closest('tr').removeClass('on');
		}
	});
	$(document).on('change','.table .tbl-chk',function(){
		var $table = $(this).closest('table'),
			$thChk = $table.find('.tbl-chk-all'),
			$tdChk = $table.find('.tbl-chk'),
			$length = $tdChk.length,
			$checked = $tdChk.filter(":checked").length;

		if( $length == $checked){
			$thChk.prop('checked', true);
		}else{
			$thChk.prop('checked', false);
		}

		if($(this).prop('checked')){
		   $(this).closest('tr').addClass('on');
		}else{
		   $(this).closest('tr').removeClass('on');
		}
	});

	//trClick
	$(document).on('click','.tr_click tbody tr',function(){
		var $chk = $(this).find('.tbl-chk');

		$(this).toggleClass('on');
		if($chk.length > 0){
			$chk.trigger('click');
		}
	}).on('click','.tbl-chk, a, button, select, input, select',function(e) {
		e.stopPropagation();
	});
};

/* tabmenu 기능 */
var tabUI = function(){
	var $tab = $('.ui-tabmenu'),
		$wrap = $('.tab_wrap');

	$(document).on('click','.ui-tabmenu a',function(e) {
		e.preventDefault();
			if(!$(this).parent().hasClass('on')){
			var href = $(this).attr('href');
			$(href).addClass('on').siblings('.tab_cont').removeClass('on');
			$(this).parent().addClass('on').siblings().removeClass('on');

			//팝업 안에 탭이 있을때 팝업 위치 재설정
			if($(this).closest('.pop_wrap').length > 0){
				var $popup = $(this).closest('.pop_wrap');
					$height1 = $popup.height(),
					$height2 = $popup.children().outerHeight();
				//console.log($height1,$height2)
				if($popup.is(':visible') && $height1 != $height2){
					popPosition($popup,300);
				}
			}
		}
	});

	// radio tab 기능 : data-id 속성 이용
	$(document).on('change','.ui-radio-tab input',function(){
		var $val = $(this).data('id');
		$('#'+$val).addClass('on').siblings('.rdo_cont').removeClass('on');
	});

	$(document).on('click','.ui-m-tabmenu a',function(e) {
		if($(this).parent().hasClass('on')){
			e.preventDefault();
			$(this).closest('.ui-m-tabmenu').toggleClass('m_tab_open');
		}
	});

	// 로딩 시 tabmenu 설정
	// ui-tabmenu: 기본 첫번째 활성화, tabIdx 파라미터로 로딩시 활성화 메뉴 설정 가능
	$(window).load(function(){
		var $href = location.href,
			$tabIdx = $.url($href).param('tabIdx');

		if($tab.length > 0){
			$tab.each(function(index, element) {
				var $this = $(this);
				if($tabIdx > 0){
					$this.find('li').eq($tabIdx).find('a').trigger('click'); 	//tabIdx 파라미터로 해당 메뉴 활성화
				}else{
					$this.find('li').eq(0).find('a').trigger('click');			//첫번쨰 활성화
				}
			});
		}

		//ui-radio-tabs는 checked된 radio 기준으로 해당 영역 show
		if($('.ui-radio-tab').length > 0){
			var $rdoId = $('.ui-radio-tab').find('input[checked]').data('id');
			$('#'+$rdoId).addClass('on');
		}

		//tabmenu3 설정
		if($('.tabmenu3').length > 0){
			var liLength = $('.tabmenu3').find('li').length;
			$('.tabmenu3 ul').addClass('col'+liLength);
			scrollCenter('.tabmenu3 > div','.on');
			//if(isMobile.any() == false){dragScroll('.tabmenu3 > div');}
		}
	});

	//.tab_wrap 감싸져 있으면 스크롤 시 상단 고정 tabmenu 기능
	if($wrap.length > 0){
		$(window).on('scroll resize load',function(){
			var $scrollTop = $(this).scrollTop(),
				$haedH = $('.head_fixed .head_cont').outerHeight();

			$wrap.each(function(index, element){
				var $this = $(this),
					$thisTop = $this.offset().top,
					$heihgt = $this.children().outerHeight(),
					$st = Math.floor($thisTop);
				if($st <= ($scrollTop+$haedH)){
					$this.addClass('fixed').css('height',$heihgt);
				}else{
					$this.removeClass('fixed').removeAttr('style');
				}
			});
		});
	}
}

/* 가로 스크롤영역에서 활성화 메뉴 센터로 스크롤 */
var scrollCenter =  function(wrap,tar){
	$(window).load(function(){
		var $tar = $(wrap).find(tar),
			$tarLeft = $tar.position().left,
			$tarWidth = $tar.outerWidth(),
			$winWidth = $(window).width(),
			$center = ($tarWidth-$winWidth)/2,
			$scrollLeft = Math.max(0,$tarLeft+$center);

		if($tarLeft > (($winWidth-$tarWidth)/2)){
			$(wrap).animate({
				'scrollLeft':$scrollLeft
			})
		}
	});
}

//입력 오류 표시1.. 사용안함~ 삭제 예정
var alertTip = function(tar,txt) {
	var $this = $(tar),
		$delay = 2000,
		$speed = 300;

	if($this.length > 0){
		var $left = $this.offset().left,
			$top = $this.offset().top,
			$width = $this.outerWidth(),
			$height = $this.outerHeight(),
			$tip = $('<div class="alert_tip" style="left:'+$left+'px;top:'+($top+$height)+'px;max-width:'+$width+'px">'+txt+'</div>');

		$('body').append($tip);
		$tip.fadeIn($speed).delay($delay).fadeOut($speed,function(){
			$tip.remove();
		});
		$this.addClass('error').focus().delay($delay).queue(function(next){
			$this.removeClass('error');
			next();
		});
	}
};

//입력 오류 표시2.. 사용안함~ 삭제 예정
var txtAlert = function(tar,txt) {
	var $this = $(tar),
		$delay = 3000;

	if($this.length > 0){
		if($this.siblings('.txt_alert').length > 0){
			$this.siblings('.txt_alert').addClass('t_red').text(txt);
		}else{
			var $txt = $('<div class="txt_alert t_red">'+txt+'</div>');
			$this.siblings().last().after($txt);
		}
		$this.addClass('error').focus().delay($delay).queue(function(next){
			$this.removeClass('error');
			next();
		});
	}
};

/* 레이어 팝업 */
var $popSpeed = 300,
	$popOpenBtn = '';
var popupUI = function(){
	$(document).on('click','.ui-pop-open',function(e) {
		e.preventDefault();
		var $pop = $(this).attr('href');
		popOpen($pop,this);
	});
	$(document).on('click','.ui-pop-close',function(e) {
		e.preventDefault();
		var $pop = $(this).closest('.pop_wrap');
		popClose($pop);
	});
	// 팝업 디자인 스크롤
	/*
	if(isMobile.any() == false){
		$('.pop_cont').mCustomScrollbar({
			theme:'dark',
			autoHideScrollbar:true,
			horizRailEnabled:false
		});
	}
	*/

	/*
	//팝업 bg 클릭시 닫힘 기능
	$('.pop_wrap').on('click',function(){
		var $pop = $(this);
		if(!$pop.hasClass('close_none')){popClose($pop);} 	//배경 클릭시 안닫히게 할때는 close_none 클래스 추가로 처리
	}).on('click','.popup',function(e) {
		e.stopPropagation();
	});
	*/
	if($('.pop_app').length > 0)popfullHeight('.pop_app .pop_cont');
};
var popfullHeight = function(tar){
	var $tar = $(tar);
	$(window).resize(function(){
		var $sum = 0,
			$winHeight = $(window).height();
		$tar.siblings('div').each(function(){
			var $height = $(this).outerHeight();
			//console.log($height);
			$sum = $sum + $height;
		});
		var $tarheight = $winHeight - $sum;
		$tar.css('height',$tarheight);
	})
}

//팝업 열기 함수
var popOpen = function(tar,btn){
	if($(tar).length < 1 || $(tar).children('.popup').length < 1) return console.log('해당팝업없음');
	var $visible = $('.pop_wrap:visible').size();
	if(btn != null || btn != window)$popOpenBtn = $(btn);
	if($visible > 0){
		$(tar).css('z-index','+='+$visible);
	}
	var $winH = $(window).height(),
		$winScrollTop = $(window).scrollTop();
	//console.log($winH,$winScrollTop)
	$('body').addClass('pop_open')
	if($(window).width() <= $mobileSize){
		//$('html').css({'height':$winH});
		$('body').css({'top': -$winScrollTop});
	}
	
	$(tar).fadeIn($popSpeed,function(){
		$(this).attr({'tabindex':0}).focus();
	});

	popPosition(tar,$popSpeed);
	$(window).on('resizeEnd',function(){
		popPosition(tar,$popSpeed);
	});
};
//팝업 닫기 함수
var popClose = function(tar){
	var $visible = $('.pop_wrap:visible').size();
	if($visible == 1){
		var $bodyTop = Math.abs(parseInt($('body').css('top')));
		//console.log($bodyTop);
		$('body').removeClass('pop_open').removeAttr('style');
		//$('html').removeAttr('style');
		if($bodyTop > 0)$('body,html').scrollTop($bodyTop);
		$(window).scroll();
	}
	$(tar).find('.popup').animate({'margin-top':0},$popSpeed,function(){
		$(this).removeAttr('style');
	});
	$(tar).fadeOut($popSpeed,function(){
		$(tar).removeAttr('style tabindex');
		if($popOpenBtn != ''){
			if($popOpenBtn != window){
				$popOpenBtn.focus();
			}
			$popOpenBtn = '';
		}
	});
};
//팝업 위치 조정 함수
var popPosition = function(tar,speed){
	setTimeout(function(){
		var $wrapH = $(tar).height(),
			$pop = $(tar).find('.popup'),
			$popCont = $pop.find('.pop_cont'),
			$popBtn = $pop.find('.pop_btn');

		$popCont.removeAttr('style');

		var $popH = $pop.outerHeight(),
			$mT = Math.max(0,($wrapH-$popH)/2),
			$popContT = $popCont.position().top,
			$popContH = $popCont.outerHeight()
			$popBtnH = $popBtn.outerHeight(),
			$popContMaxH = Math.max(0,($popH-$popContT-$popBtnH));

		if($popContH > $popContMaxH)$popCont.css({'height':$popContMaxH});

		if(speed > 100){
			$pop.stop().animate({'margin-top':$mT},speed);
		}else{
			$pop.css({'margin-top':$mT});
		}
	},10);
};

/* sameHeight: 지정 영역 같은 높이 함수 */
var sameHeight = function(tar){
	$(window).on('resize load',function(){
		var $tar = $(tar),
			$heightArry = [];
		$tar.each(function(){
			$(this).css('height','auto');
			var $height = $(this).outerHeight(true);
			$heightArry.push($height);
		});
		//console.log($heightArry)
		var $maxHeight = Math.max.apply(null, $heightArry);
		//console.log($maxHeight)
		$tar.css('height',$maxHeight);
	});
};


/* scrollItem: scroll 시 animation 효과 animate.css 랑 같이 사용*/
var scrollItem = function(){
	var $elements = $.find('*[data-animation]'),
		$window = $(window);
		  
	$(window).on('scroll resize',function(){
		$elements = $.find('*[data-animation]');
		if($elements.length > 0){
			checkInView();
		}
  	});

  function checkInView() {
	var $winHeight = $window.height(),
		$scrollTop = $window.scrollTop(),
		$winBottom = ($scrollTop + $winHeight);

	$.each($elements, function() {
	  var $el = $(this),
		  $elHeight = $($el).outerHeight(),
		  $elTop = $($el).offset().top,
		  //$elCenter = $elTop + ($elHeight/2),
		  $elBottom = $elTop + $elHeight,
		  $animationClass = $el.data('animation'),
		  $delay = $el.data('delay'),
		  $duration = $el.data('duration'),
		  $gap = 200;


	  if(!$el.hasClass('animated') && $animationClass != 'on'){
		if($delay>0){
			$el.css({
				'-webkit-animation-delay':$delay+'ms',
				'animation-delay':$delay+'ms'
			});
		}
		if($duration>0){
			$el.css({
				'-webkit-animation-duration':$duration+'ms',
				'animation-duration':$duration+'ms'
			});
		}

		$el.addClass('animated');
	  }

	  //if (($elBottom >= $scrollTop) && ($elTop <= $winBottom)) {
	  if ($elTop >= $scrollTop && $elBottom <= $winBottom) {
		$el.addClass($animationClass);
		if($el.hasClass('used_car_rate')){
			usedCarRateUI();
		}
	  } else if($elBottom < ($scrollTop-$gap) || $elTop > ($winBottom + $gap)){
		$el.removeClass($animationClass);
		if($el.hasClass('used_car_rate')){
			usedCarRateIng = true;
		}
	  }
	});
  }
};

var usedCarRateIng = true;
var usedCarRateUI = function(tar){
	if(usedCarRateIng == true){
		//console.log('aaa');
		usedCarRateIng = false;
	}
}

/* scrollOn : scroll 내리면 navi에 on클래스부여 */
var scrollOn = function (tar, navi, range){
	$(window).bind('scroll resize',function(){
		var winH = $(window).height(),
			scrollTop = $(this).scrollTop(),
			center = scrollTop+(winH/2),
			start = center-(range/2),
			end = center+(range/2);

		$(tar).each(function(e){
			var secH = $(this).outerHeight(),
				secS = $(this).offset().top,
				secE = secS+secH;

			if(secS <= end && secE >= start){
				$(this).addClass('on');
			}else{
				$(this).removeClass('on');
			}

			if(center >= secS){
				$(navi).eq(e).addClass('on').siblings().removeClass('on');
			}
		});
	});
};

/* 다중 swiper
사용법 : multiSwiper('.swiper') */
var multiSwiper = function (tar){
	var sliders = [];
	$(tar).each(function(i, element){
		var $list = $(this).find('.swiper-container'),
			$prev = $(this).find('.ui-prev'),
			$next = $(this).find('.ui-next'),
			$pagination = $(this).find('.pagination'),
			$length = $list.find('.swiper-slide').length;

		//console.log($length);

		$list.addClass('ui-swipe-s'+i);
		if($prev.length > 0){
			$prev.addClass('ui-swipe-l'+i);
		}
		if($next.length > 0){
			$next.addClass('ui-swipe-r'+i);
		}
		if($pagination.length > 0){
			$pagination.addClass('ui-swipe-p'+i);
		}
		var slider = new Swiper('.ui-swipe-s'+i, {
			slidesPerView:'auto',
			calculateHeight:true,
			pagination:'.ui-swipe-p'+i,
			paginationClickable : true,
			resizeReInit:true,
			onInit:function(swiper){
				var wid = $(swiper.container).width(),
					wid2 = $(swiper.container).find('.swiper-wrapper').width();
				//console.log(wid,wid2,i)
				$('.ui-swipe-l'+i).addClass('disabled');
				if(wid >= wid2){
					$('.ui-swipe-r'+i).addClass('disabled');
				}
			},
			onSlideChangeStart: function(swiper){
				var $i = swiper.activeIndex,
					$l = swiper.visibleSlides.length;
				//console.log($i,$l);
				if($i == 0){
					$('.ui-swipe-l'+i).addClass('disabled');
				}else{
					$('.ui-swipe-l'+i).removeClass('disabled');
				}
				if(($i+$l) == $length){
					$('.ui-swipe-r'+i).addClass('disabled');
				}else{
					$('.ui-swipe-r'+i).removeClass('disabled');
				}
			}
		});

		sliders.push(slider);

		$('.ui-swipe-l'+i).click(function(e){
			e.preventDefault();
			sliders[i].swipePrev();
		});
		$('.ui-swipe-r'+i).click(function(e){
			e.preventDefault();
			sliders[i].swipeNext();
		});
	});
};

//스크롤 만큼 표시하기
var scrollLineInit = function(wrap,inner,bar){			//기본 스크롤 사용시
	$(wrap).on('scroll resize',function(){
		var scrollTop = $(wrap).scrollTop(),
			innerHeight = $(inner).outerHeight(),
			wrapHeight = $(wrap).outerHeight(),
			scrollPercent = (scrollTop/(innerHeight-wrapHeight)) * 100;

		$(bar).css('width',(scrollPercent + '%'));
	});
}
var jsScrollLineInit = function(wrap,bar){				//mCustomScrollbar 사용시
	var $cont = $(wrap).find('.mCSB_container'),
		scrollTop = parseInt($cont.css('top')),
		innerHeight = $cont.height(),
		wrapHeight = $(wrap).height(),
		scrollPercent = (Math.abs(scrollTop)/(innerHeight-wrapHeight)) * 100;

	$(bar).css('width',(scrollPercent + '%'));
}

/* 숫자 countUp */
var countUpInit = function (tar){
	var countUpArry = [];
	$(tar).each(function(i, element){
		var $this = $(this);
		$this.attr('id','countUp'+i);

		var $numNow = $this.data('before'),
			$numUpdate = $this.text(),
			$duration = $this.data('duration'),
			$decimalArry = String($numUpdate).split('.');

		var $decimalCiphers;
		if($decimalArry[1] == null){
			$decimalCiphers = 0;
		}else{
			$decimalCiphers = $decimalArry[1].length;
		}
		if($numNow == null || $numNow == '')$numNow = 0;
		if($duration == null || $duration == '')$duration = 1;

		var countUp =  new CountUp('countUp'+i,$numNow,$numUpdate,$decimalCiphers,$duration,{
			useEasing: true,
			useGrouping: true,
			separator: ',',
			decimal: '.'
		})
		countUpArry.push(countUp);

		$(window).on('scroll resize', function(){
			var $winHeight = $(window).height(),
				$scrollTop = $(window).scrollTop(),
				$winBottom = $scrollTop + ($winHeight*(3/4)),
				$winTop = $scrollTop + ($winHeight*(1/4)),
				$elHeight = $this.outerHeight(),
				$elTop = $this.offset().top,
				$elBottom = ($elTop + $elHeight);

			if (($elBottom >= $winTop) && ($elTop <= $winBottom)) {
				if(!countUpArry[i].error){
					countUpArry[i].start();
				}else{
					console.log(countUpArry[i].error);
				}
			} else {
				countUpArry[i].reset();
			}
		});
	});
};
var countUpListInit = function (tar){
	var countUpListArry = [];
	$(tar).each(function(i, element){
		var $this = $(this);
		$this.attr('id','countUpArry'+i);

		var $numNow = $this.text(),
			$decimalArry = String($numNow).split('.'),
			$numUpdate = $this.data('count').split(','),
			$numLegnth = $numUpdate.length,
			$numIdx = 0;

		var $decimalCiphers;
		if($decimalArry[1] == null){
			$decimalCiphers = 0;
		}else{
			$decimalCiphers = $decimalArry[1].length;
		}

		var countUp =  new CountUp('countUpArry'+i,$numNow,$numUpdate[$numIdx],$decimalCiphers,0.5,{
			useGrouping: true,
			separator: ',',
			decimal: '.'
		})
		countUpListArry.push(countUp);

		function countUpfirst(){
			countUpListArry[i].start();
			$numIdx = $numIdx +1;
			countUpstart();
		}
		var countUpTime
		function countUpstart(){
			clearTimeout(countUpTime);
			countUpTime = setTimeout(function(){
				if($numIdx == 0){
					$numIdx = $numIdx +1;
				}else if($numIdx == ($numLegnth-1)){
					$numIdx = 0;
				}else{
					$numIdx = $numIdx +1;
				}
				countUpListArry[i].update($numUpdate[$numIdx]);
				countUpstart();
			},4000)
		}
		countUpfirst();
	});
};

var blueCardSwiper = function(tar){
	$(tar).owlCarousel({
		loop:false,
		responsive : {
			0 : {
				margin: 10,
				items : 1,
				stagePadding : 18
			},
			480 : {
				margin: 10,
				items : 2,
				stagePadding : 18
			},
			1028 : {
				margin: 30,
				items : 3,
				stagePadding : 0
			}
		}
	});
}

/* 로딩창 */
var loadingHtml;
var loadingShow = function(txt){
	//var $loading = $('<div id="loading"><div><i></i></div><div><i></i></div><div><i></i></div><div><i></i></div><div><i></i></div><div><i></i></div><div><i></i></div><div><i></i></div></div>'),
	var $loading =$('<div id="loading"><div><div class="ico_morse"></div><em class="txt_info">'+txt+'</em></div></div>')
		$id = $('#loading');

	loadingHtml = setTimeout(function(){
		if($id.length == 0){
			$('body').append($loading);		

			if($('html').hasClass('lt-ie10')){
				//console.log('ie9');
				loadingAnimation('#loading .ico_morse',54,23)
			}
		}
	},100);
};
//ie9 에서 로딩창 애니메이션
var $loadingNum = 0;
var $loadTimeout;
var loadingAnimation = function(tar,size,count){
	$(tar).css('background-position','50% -'+$loadingNum*size+'px');
	if($loadingNum < (count-1)){
		$loadingNum++;
	}else{
		$loadingNum = 0
	}
	//console.log($loadingNum)
	$loadTimeout = setTimeout(function(){
		loadingAnimation(tar,size,count);
	},100)
}
var loadingHide = function(){
	clearTimeout(loadingHtml);
	var $id = $('#loading');
	if($id.length > 0){
		$id.remove();
		if($('html').hasClass('lt-ie10')){
			$loadingNum = 0;
			clearTimeout($loadTimeout);
			//loadingAnimation('.ico_morse',54,23)
		}
	}
};

// 가로스크롤에서 drag로 스크롤 시키기
var dragScroll = function(tar){
	var curDown = false,
		curYPos = 0,
		curXPos = 0;
	$(tar).mousemove(function(m){
		if(curDown == true){
			$(tar).scrollTop($scrollTop + (curYPos - m.pageY));
			$(tar).scrollLeft($scrollLeft + (curXPos - m.pageX));
		}
	});

	$(tar).mousedown(function(m){
		curDown = true;
		curYPos = m.pageY;
		curXPos = m.pageX;
		$scrollTop = $(tar).scrollTop();
		$scrollLeft = $(tar).scrollLeft();
	});

	$(tar).mouseup(function(m){
		curDown = false;
	});
}

/* 오늘하루 그만보기 팝업 */
var todayPopup =function(){
	var $speed = 500;
	var popList=[];

	if($('.pop_today').length > 0){
		$('.pop_today').each(function(){
			var $id = $(this).attr('id');
			popList.push($id);
		});
	}

	$('.pop_today .pop_modal_close').click(function(e){
		var chk = $(this).closest('.pop_today').find('.today_chk'),
			$id = $(this).closest('.pop_today').attr('id');

		if (chk.is(':checked') ) {
			setCookie( $id, 'done' , 1 );
		}
		$('#'+$id).hide($speed);
	});

	for(var i in popList){
		if(cookiedata.indexOf(popList[i]+'=done') < 0) {
			$('#'+popList[i]).show($speed);
		}
	}
};

/* 모바일 에이전트 구분 */
var isMobile = {
	Android: function () {
			 return navigator.userAgent.match(/Android/i) == null ? false : true;
	},
	BlackBerry: function () {
			 return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
	},
	IOS: function () {
			 return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
	},
	Opera: function () {
			 return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
	},
	Windows: function () {
			 return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
	},
	any: function () {
			 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.IOS() || isMobile.Opera() || isMobile.Windows());
	}
};
//console.log(isMobile.any());

/* 웹 브라우저 확인 */
var broswerCheck = function(){
	var $agt = navigator.userAgent.toLowerCase();

	if($agt.indexOf('chrome') != -1){ return 'Chrome';}
	else if($agt.indexOf('msie') != -1 || $agt.indexOf('trident') != -1){ return 'Msie';}
	else if($agt.indexOf('edge') != -1){ return 'Edge';}
	else if($agt.indexOf('firefox') != -1){ return 'Firefox';}
	else if($agt.indexOf('opera') != -1){ return 'Opera';}
	else if($agt.indexOf('safari') != -1){ return 'Safari';}
	else if($agt.indexOf('NAVER(inapp') != -1){ return 'NaverApp';}
	else{return false}
}
//console.log(broswerCheck());
if(broswerCheck() != false && isMobile.any() == false){
	$('html').addClass('agt'+broswerCheck());		//html에 브라우저 클래스 부여
}

/* 오늘날짜구하기 */
var toTimeString = function (date) { //formatTime(date)
	var year  = date.getFullYear();
	var month = date.getMonth() + 1; // 1월=0,12월=11이므로 1 더함
	var day   = date.getDate();
	var hour  = date.getHours();
	var min   = date.getMinutes();

	if (("" + month).length == 1) { month = "0" + month; }
	if (("" + day).length   == 1) { day   = "0" + day;   }
	if (("" + hour).length  == 1) { hour  = "0" + hour;  }
	if (("" + min).length   == 1) { min   = "0" + min;   }

	return ("" + year + month + day + hour + min );
};
var getCurrentTime = function() {
	return toTimeString(new Date());
};
var $nowDateFull = parseInt(getCurrentTime()),					//날짜,시간,분까지 모두 포함
	$nowDateHour = parseInt(getCurrentTime().substring(0,10)),	//날짜,시간까지만 포함
	$nowDate = parseInt(getCurrentTime().substring(0,8));		//날짜만 포함
//console.log($nowDateFull);
//console.log($nowDateHour);
//console.log($nowDate);

/* 모바일일때 풀사이즈 크기 */
var mobilefullSize = function(tar){
	$(window).resize(function(){
		var $winH = $(this).height(),
			$winW = $(this).width(),
			$tarH = $(tar).height();
		//console.log($winH,$tarH);
		if($winW > $mobileSize){
			$(tar).removeAttr('style');
			return;
		}else{
			var $margin = ($winH-$tarH)/2 - 85;
			console.log($margin);
			$(tar).css ({
				'marginTop' : $margin,
				'marginBottom' : $margin
			});
		}
	});
}

/* 기타UI */
var etcUI = function(){
	if($('.ui-height').length > 0)sameHeight('.ui-height');			//ui-height 클래스로 해당요소 같이높이(요소 중 제일 큰 높이) 지정
	if($('.valign_m').length > 0)mobilefullSize(".valign_m");			//valign_m 클래스로 모바일일때 풀사이즈 크기 지정

	//select_list
	$(document).on('click','.select_list > a',function(e) {
		e.preventDefault();
		var $parent = $(this).parent();
		if($parent.hasClass('on')){
			$parent.removeClass('on');
		}else{
			$('.select_list').removeClass('on');
			$(this).parent().addClass('on');
		}
	});
	$(document).on('click','.select_list .option',function(e) {
		if(!$(this).hasClass('link')){
			e.preventDefault();
			var $html = $(this).html();
			$(this).parent().addClass('selected').siblings().removeClass('selected');
			$(this).closest('.select_list').removeClass('on').children('a').html($html);
		}
	});

	//select_tit 클릭
	$(document).on('click','.select_tit',function(e) {
		e.preventDefault();
		var $parent = $(this).closest('.select_tit_wrap');
		if($parent.hasClass('on')){
			$parent.removeClass('on');
			$('body').removeClass('select_tit_open');
		}else{
			$parent.addClass('on');
			$('body').addClass('select_tit_open');
		}
	});
	$(document).on('click','.select_tit_list_close',function(e) {
		e.preventDefault();
		var $parent = $(this).closest('.select_tit_wrap');
		$parent.removeClass('on');
		$('body').removeClass('select_tit_open');
	});

	//슬라이드
	$(document).on('click','.slide_dl > dt > a',function(e){
		e.preventDefault();
		$(this).closest('dt').toggleClass('on').next('dd').stop().slideToggle();
	});
	$(document).on('click','.slide_dl2 > dt > a',function(e){
		e.preventDefault();
		$(this).closest('dt').toggleClass('on').siblings('.cont').stop().slideToggle();
	});

	//faq_list
	$(document).on('click','.faq_list >li> p>a',function(e){
		e.preventDefault();
		$(this).parent().next('div').slideToggle(300).parent().toggleClass('on').siblings('li').removeClass('on').children('div').slideUp(300);
	});

	//btn_scroll: 클릭시 지정영역(href="#아이디")으로 스크롤
	$(document).on('click','.btn_scroll',function(e){
		e.preventDefault();
		var $speed = 500,
			$href = $(this).attr('href'),
			$id = $($href),
			$fixedTop = $('#header').outerHeight();

		if($id.length > 0 && $id.is(':visible')){
			var $top = $id.offset().top;
			//console.log($top);
			$('html,body').animate({'scrollTop':$top},$speed);
		}
	});

	//certifi_btn
	$(document).on('click','.certifi_btn a',function(e){
		e.preventDefault();

		$('.certifi_txt').stop().slideUp(500,function(){
			$(this).closest('li').removeClass('on');
		});
		//현제 자신의 리스트가 활성화일 경우 리턴
		if( $(this).closest('li').hasClass('on') ) return;
		$(this).closest('li').find('.certifi_txt').stop().slideDown(500,function(){
			$(this).closest('li').addClass('on');
		});
	})

	//rate_btn
	$(document).on('click','.rate_btn a',function(e){
		e.preventDefault();
		$('.rate_txt').stop().slideUp(500,function(){
			$(this).closest('li').removeClass('on');
		});
		//현제 자신의 리스트가 활성화일 경우 리턴
		if( $(this).closest('li').hasClass('on') ) return;
		$(this).closest('li').find('.rate_txt').stop().slideDown(500,function(){
			$(this).closest('li').addClass('on');
		});
	})

	//이용약관 아코디언
	$(document).on('click','.agree_list .btn',function(e){
		//console.log('ui-front');
		e.preventDefault();
		$(this).parent().next().stop().slideToggle(500,
			function(){
				var $maxH = parseInt($(this).css('max-height')),
					$h = $(this).outerHeight();
					
				if(isMobile.any() == false && $h >= $maxH){
					$(this).attr('tabindex',0);
				}
			}
		).parent().toggleClass('on').siblings().removeClass('on').children('.agree_txt').not('.on').slideUp();

		//팝업 안에 있을때 팝업 위치 변경
		var $popup = $(this).closest('.pop_wrap');
			$height1 = $popup.height(),
			$height2 = $popup.children().outerHeight();
		//console.log($height1,$height2)
		if($popup.is(':visible') && $height1 != $height2){
			setTimeout(function() {
				popPosition($popup,500)
			},500)
		}
	});
	//이용약관 전체선택 UI
	$(document).on('change','.agree_list .checkbox input, .agree_list .radio input',function(){
		var $this = $(this),
			$list = $this.closest('.agree_list'),
			$allChk = $list.find('.first .checkbox input'),
			$chk = $list.children().not('.first').find('.checkbox input').not('.not'),
			$chkNot1 = $list.children().not('.first').find('.checkbox input.ui-radio-chk.not'),
			$chkLength = $chk.length,													//전체 체크박스 갯수확인
			$rdo = $list.children().not('.first').find('.radio input[value="Y"]'),
			$rdoLength = $rdo.length;													//전체 라디오 갯수확인([value = 'Y'] 인것만)

		//console.log($rdoLength)
		if($this.closest('.first').length > 0){
			//전체동의 시 일반동의 체크
			if($allChk.prop('checked')){
				$chk.prop('checked', true);
				$chkNot1.prop('checked', false);
				$rdo.prop('checked', true);
			}else{
				$chk.prop('checked', false);
				$chkNot1.prop('checked', true);
				$rdo.prop('checked', false);
				$rdo.parent().parent().find('input[value="N"]').prop('checked', true);
			}
		}else{
			//상단 체크시 하단 체크
			if($this.closest('.agree_btn').length > 0){
				//console.log('agree_btn')
				var $agreeTxt = $this.closest('.agree_btn').siblings('.agree_txt'),
					$txtChk1 = $agreeTxt.find('.checkbox input').not('.not'),
					$txtChkNot1 = $agreeTxt.find('.checkbox input.ui-radio-chk.not'),
					$txtChkNot2 = $agreeTxt.find('.checkbox input.ui-ag-radio.not'),
					$txtRdo1 = $agreeTxt.find('.radio input[value="Y"]');

				if($this.prop('checked')){					
					$txtChk1.prop('checked', true);
					$txtChkNot1.prop('checked', false);
					$txtChkNot2.prop('checked', false);
					$txtRdo1.prop('checked', true);

					//간략상세 보기
					//$this.closest('.agree_btn').siblings().stop().slideDown();
					//$this.closest('li').addClass('on').siblings().removeClass('on').find('.agree_txt').stop().slideUp();
				}else{
					$txtChk1.prop('checked', false);
					$txtChkNot1.prop('checked', true);
					$txtChkNot2.prop('checked', true);
					$txtRdo1.prop('checked', false);
					$txtRdo1.parent().parent().find('input[value="N"]').prop('checked', true);

					//간략상세 숨기기
					//$this.closest('li').removeClass('on').find('.agree_txt').stop().slideUp();
				}
			}
			//하단 체크시 상단 체크
			if($this.closest('.agree_txt').length > 0){
				//console.log('agree_txt')
				if($this.hasClass('ui-ag-radio')){
					//console.log('aaa')
					var $tarChk = $this.data('ag-rdo');
					if($this.prop('checked')){
						if($('#'+$tarChk).closest('.ui-ag-chkeck-wrap').size() > 0){
							$('#'+$tarChk).closest('.ui-ag-chkeck-wrap').find('input').prop('checked', false);
						}else{
							$('#'+$tarChk).prop('checked', false);
						}
					}
				}
				if($this.hasClass('ui-ag-chkeck')){
					var $agChkWrap = $this.closest('.ui-ag-chkeck-wrap'),
						$agAllChk = $agChkWrap.find('.ui-ag-chkeck-all'),
						$agChk = $agChkWrap.find('input').not('.ui-ag-chkeck-all'),
						$agChkLength = $agChk.length;
					//console.log()
					if($this.hasClass('ui-ag-chkeck-all')){
						//console.log('aaa')
						if($this.prop('checked')){
							$agChk.prop('checked', true);
						}else{
							$agChk.prop('checked', false);
						}
					}else{
						var $agChecked = $agChk.filter(":checked").length;
						if($agChkLength == $agChecked){
							$agAllChk.prop('checked', true);
						}else{
							$agAllChk.prop('checked', false);
						}
					}
				}

				var $txtArea = $this.closest('.agree_txt'),
					$txtChk2 = $txtArea.find('.checkbox input').not('.not'),
					$radioChk2 = $txtArea.find('.radio input[value="Y"]'),
					$txtChkLength = $txtChk2.length,
					$txtRdoLength = $radioChk2.length,
					$txtChecked = $txtChk2.filter(":checked").length,
					$txtRdoChecked = $radioChk2.filter(":checked").length,
					$btnChk = $txtArea.siblings('.agree_btn').find('.checkbox input');

				if($txtChkLength+$txtRdoLength == $txtChecked+$txtRdoChecked){
					$btnChk.prop('checked', true);
				}else{
					$btnChk.prop('checked', false);
				}
				/*if($txtChecked+$txtRdoChecked == 0){
					$btnChk.prop('checked', false);
				}else{
					$btnChk.prop('checked', true);
				}*/
			}

			//console.log($chkLength,$checked)
			var $checked = $chk.filter(":checked").length,		//체크박스 전체 체크갯수확인
				$rdoChecked = $rdo.filter(":checked").length;	//라디오 전체 체크갯수확인

			//그냥 동의 시 전체동의 체크유무
			if($chkLength+$rdoLength == $checked+$rdoChecked){
				$allChk.prop('checked', true);
			}else{
				$allChk.prop('checked', false);
			}
		}
	});

	//전체 선택시
    $(document).on('change','.ui-all-check input',function(e){
        var $list = $(this).closest('.ui-all-check'),
			$allChk = $list.find('.first input'),
			$chk = $list.children().not('.first').find('input'),
			$length = $chk.length,
			$checked = $chk.filter(":checked").length;

		if($(this).closest('.first').length > 0){
			//전체동의 시 일반동의 체크
			if($allChk.prop('checked')){
				$chk.prop('checked', true);
			}else{
				$chk.prop('checked', false);
			}
		}else{
			//그냥 동의 시 전체동의 체크유무
			if( $length == $checked){
				$allChk.prop('checked', true);
			}else{
				$allChk.prop('checked', false);
			}
		}
    });

	//금액증가버튼(+1만, +10만 등등)
	/*$('.ui-add-price .button').on('click', function(){
		$('.ui-add-price .button').removeClass('active');
		$(this).addClass('active');
	});*/

	//기간선택시 달력 노출
	$(document).on('click','.date_search .date_btn .button',function(e){
		e.preventDefault();
		$(this).addClass('on').parent().siblings().find('.button').removeClass('on');
		if($(this).text() == '기간선택'){
			$('.inp_date').addClass('on');
		}else{
			$('.inp_date').removeClass('on');
		}
	})

	//견적보관함 툴팁
	$(document).on('click','.ui-tooltip-btn', function(e){
		e.preventDefault();
		if(!($(this).hasClass('disabled'))){
			$(this).toggleClass('on');
			if($(this).hasClass('on')){
				$('.tooltip_box').remove();
				$('.ui-tooltip-btn').removeClass('on');
				$(this).addClass('on');
				var toolCont = $(this).parents('.ui-tooltip-list').html();
				var tooltipBox = '<div class="tooltip_box on" id="tooltip" tabindex="0">';
				$(this).append(tooltipBox);
				$('.tooltip_box').append('<button type="button" class="button btn_close"><span class="hide">닫기</span>');
				$('.tooltip_box').prepend(toolCont);
				$('.tooltip_box .detail').removeClass('detail').addClass('txt_list2');
				$(this).focus();
				$('.btn_close').on('click', function(){
					$(this).closest('.ui-tooltip-btn').removeClass('on');
					$(this).parents('.tooltip_box').remove();
				});
			} else {
				$(this).children('.tooltip_box').remove();
				$(this).focus();
			}
		}
	});

	//folding ui
	$(document).on('click','.ui-folding-btn',function(e){
		e.preventDefault();
		var $href = $(this).attr('href');
		$(this).parent().toggleClass('on');
		$($href).stop().slideToggle();
	});

	//아코디언
	$(document).on('click','.ui-accordion .acco_head a', function(e){
		e.preventDefault();
		var acco = $(this).parents('.list_acco');
		var tog = acco.data("toggle");
		if(tog == "toggle"){
			$(this).closest('.li').toggleClass('on');
			if($(this).closest('.li').hasClass('on')){
				console.log('a');
				acco.find('.li').removeClass('on');
				acco.find('.acco_cont').stop().slideUp();
				$(this).parent().next('.acco_cont').stop().slideDown();
				$(this).closest('li').addClass('on');
			}else{
				acco.find('.acco_cont').stop().slideUp();
				//$(this).parent().next('.acco_cont').stop().slideUp();
			}
		} else {
			console.log('b');
			$(this).closest('.li').toggleClass('on');
			if($(this).closest('.li').hasClass('on')){
				$(this).parent().next('.acco_cont').stop().slideDown();
			}else{
				$(this).parent().next('.acco_cont').stop().slideUp();
			}
		}
		//팝업 안에 있을때 팝업 위치 변경
		var $pop = $(this).closest('.pop_wrap');
		if($pop.length > 0){
			setTimeout(function() {
				popPosition($pop,500)
			},500);
		}
	});

	//스크롤 후 고정영역
	var $floting = $('.ui-floting');
	if($floting.length > 0){
		$(window).scroll(function(){
			var $scrollTop = $(this).scrollTop();

			$floting.each(function(index, element){
				var $this = $(this),
					$thisTop = $this.offset().top,
					$heihgt = $this.outerHeight(),
					$st = Math.floor($thisTop+$heihgt);
				if($st <= $scrollTop){
					$this.addClass('fixed');
				}else{
					$this.removeClass('fixed');
				}
			});
		});
	}
};




//개발추가(2018.08.10)
$(document).ready(function() {
	ui.init(); /* 스크립트 초기화 */

	/*var appHidden = function() {  앱 관련 공통 스크립트
		var agent = navigator.userAgent;
		agent = agent.toLowerCase();
		if (agent.indexOf("autodirectapp") != -1) {
			$(".app_hidden").hide();
			if (agent.indexOf("ipod") != -1 || agent.indexOf("iphone") != -1 || agent.indexOf("ipad") != -1) { // iOS일때
				$(".ios_hidden").hide();
			} else { // iOS가 아닐때
				$(".android_hidden").hide();
			}
		}
	}; appHidden();*/
});
var ui = {
	init: function() {
		ui.formType(); /* 폼요소 디자인 타입 */
		ui.layerComm.init(); /* 레이어팝업 초기화 */
	},
	afterLoading: function() {
	},
	layerComm: {
		init: function() {
			ui.layerPopup();
		},
		open: function() {
			if($("#__flying_partition__ .pop_wrap").length) {				
				setTimeout(function(){
					popOpen('#__flying_partition__ .pop_wrap');
				},200)
			}
		},
		close: function() {
			console.log("close");
		}
	},
	layerPopup: function() {
		console.log('layerPopup')
//		var $button = 0;
//		var $layer = 0;
//		var verticalGap = 130;
//
//		$(".btn_layer_popup, .btn_layer_fulltype").off("click").on("click", function() {
//			$button = $(this);
//			$layer = $($button.attr("href"));
//			if($button.attr("href") == "#none" || $layer == "") return false;
//			$("body").addClass("pop_open");
//			if ($(".layer_fulltype").hasClass("show") || !$(".layer_dimmed").length) {
//				ui.layerDimmed.make($($layer));
//			}
//			$layer.addClass("show").attr("tabIndex", "0").focus();
//			if($layer.hasClass("pop_wrap")) {
//				var $scroller = $layer.find("article.cont_wrap");
//				var scroller_mg = parseInt($scroller.css("marginTop")) + parseInt($scroller.css("marginBottom"));
//				$scroller.css({
//					"maxHeight": $(window).height() - $layer.find(".popup_head").height() - $scroller.next(".btn_close").height() - scroller_mg - verticalGap
//				});
//			} else if($layer.hasClass("layer_fulltype")) {
//				$layer.find(".pop_cont").css({
//					"minHeight": $layer.height()
//				});
//			}
//
//			return false;
//		});
//		$(".pop_wrap, .layer_fulltype").find(".btn_close").off("click").on("click", function() {
//			if ($(".pop_wrap.show, .layer_fulltype.show").length <= 1) {
//				$("body").removeClass("pop_open");
//			}
//			var $layerWrap = $(this).closest(".pop_wrap.show, .layer_fulltype.show");
//
//			$layerWrap.removeClass("show")
//			ui.layerDimmed.delete($($layerWrap));
//			//$(".pop_wrap.show, .layer_fulltype.show").removeClass("show");
//			if ($button) $button.focus();
//			if ($layer) {
//				$layer.removeAttr("tabIndex");
//				$layer.find(".pop_cont").removeAttr("style");
//			}
//			return false;
//		});
	},
	formType: function() {
//		$(".form").find("select").focusin(function() {
//			$(this).parents(".form").addClass("focus");
//		}).focusout(function() {
//			$(this).parents(".form").removeClass("focus");
//		});
//
//		$(".form").find("textarea").focusin(function() {
//			$(this).parents(".form").addClass("focus");
//		}).focusout(function() {
//			$(this).parents(".form").removeClass("focus");
//		});
//
//		$(".form").find("input").focusin(function() {
//			$(this).parents(".form").addClass("focus");
//		}).focusout(function() {
//			$(this).parents(".form").removeClass("focus");
//		});
	}
};