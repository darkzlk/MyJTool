(function($){
var webpath = "../../images7/";
var Bind = function(object, fun) {
	var args = Array.prototype.slice.call(arguments).slice(2);
	return function() {
		return fun.apply(object, args.concat(Array.prototype.slice.call(arguments)));
	}
};
var nulf = function(){};
var $$B = (function(ua){
	var b = {
		msie: /msie/.test(ua) && !/opera/.test(ua),
		opera: /opera/.test(ua),
		safari: /webkit/.test(ua) && !/chrome/.test(ua),
		firefox: /firefox/.test(ua),
		chrome: /chrome/.test(ua)
	};
	var vMark = "";
	for (var i in b) {
		if (b[i]) { vMark = "safari" == i ? "version" : i; break; }
	}
	b.version = vMark && RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";

	b.ie = b.msie;
	b.ie6 = b.msie && parseInt(b.version, 10) == 6;
	b.ie7 = b.msie && parseInt(b.version, 10) == 7;
	b.ie8 = b.msie && parseInt(b.version, 10) == 8;

	return b;
})(window.navigator.userAgent.toLowerCase());
$.fn.ccbErr = function(errMsg, autoHide, hideDelay, errClass) {
	var err = $.extend({
		errMsg       : "",
		autoHide     : true,
		hideDelay    : 5000,
		errClass     : "iErr"
	},{errMsg:errMsg, autoHide:autoHide, hideDelay:hideDelay, errClass:errClass});

	return this.each(function(){
		var isSlt = false;
		if(/select/i.test(this.tagName)){
			var $myParent = $(this).parent();
			if($myParent.get(0).className == "sltBox"){
				$myParent.addClass(err.errClass);
				isSlt = true;
			}
		}else if(/(inputtext|inputpassword)/i.test(this.tagName+this.type) || /textarea/i.test(this.tagName) || /crArea/i.test(this.className)){
			$(this).addClass(err.errClass);
		}else{
			return;
		}

		var $errPrompt = $("<div class='prompt ccbErrSty'>"+ err.errMsg +"<i></i></div>")
		$errPrompt.appendTo("body");
		for(var i = 0; $errPrompt.height() > ($(this).offset().top - 30) && i < 50; i++){
			$errPrompt.width($errPrompt.width() + 10);
		}

		//var errLeft = $(this).offset().left + $(this).width() -  $errPrompt.width();
		var errLeft = $(this).offset().left + $(this).width() - 24;
		var errTop  = $(this).offset().top - $errPrompt.outerHeight() - 8;
		var bodywidth = $("body").width();
		if(errLeft + $errPrompt.width() > bodywidth){
			errLeft = $(this).offset().left;
		}
		$errPrompt.offset({left:errLeft, top:errTop});

		$(this).click(function(){
			if(isSlt){
				$(this).parent().removeClass(err.errClass)
			}else{
				$(this).removeClass(err.errClass)
			}
			$errPrompt.fadeOut("slow", function(){
				$errPrompt.remove();
			});
		});
		if(err.autoHide){
			setTimeout(Bind(this, function(){
				if(isSlt){
					$(this).parent().removeClass(err.errClass)
				}else{
					$(this).removeClass(err.errClass)
				}
				$errPrompt.fadeOut("slow", function(){
					$errPrompt.remove();
				});
			}), err.hideDelay);
		}
    });
};

$.fn.ccbDialogBox = $.fn.ccbHelp = function(errMsg, option) {
	return this.each(function(i){
		var $helpPrompt = $("<div class='prompt ccbHelpSty'>"+ errMsg +"<i></i></div>");
		var hp = $.extend({
			width: null,
			top: 0,
			left: 0
		},option);
		$(this).hover(
			function(){
				$helpPrompt.appendTo("body");
				if(hp.width){
					$helpPrompt.width(hp.width);
				}
				for(var i = 0; $helpPrompt.height() > ($(this).offset().top - 30) && i < 50; i++){
					$helpPrompt.width($helpPrompt.width() + 10);
				}
				var $i = $helpPrompt.find("i");
				var errLeft = $(this).offset().left - ($i.offset().left - $helpPrompt.offset().left) - $i.width()/2 + $(this).width()/2 + hp.left;
				var errTop  = $(this).offset().top - $helpPrompt.outerHeight() - 14 + hp.top;
				$helpPrompt.offset({left:errLeft, top:errTop});
			},
			function(){
				$helpPrompt.remove();
			}
		);
    });
};

$.fn.ccbListBox = $.fn.ccbDownload = function(option) {
	var dl = {
		downloadAry:[],
		top :3,
		left:-11
	};
	return this.each(function(){
		var dlTmp = $.extend(dl, option);
		var text = $(this).text();
		var textClassName = $(this).attr("class").replace("tableRBtn", "");
		var html = '<div class="downloadBox"><span><a class="tableLBtn underline '+ textClassName +'">' + text + '</a></span><ul>';
		if(dlTmp.downloadAry.length == 0){
			return;
		}
		for(var i = 0; i < dlTmp.downloadAry.length; i++){
			html += dlTmp.downloadAry[i];
		}
		html += '</ul></div>';
		var $downloadBox = $(html);
		$downloadBox.appendTo("body");
		$downloadBox.find("li:first").addClass("firstLi");
		$downloadBox.offset({top:0, left:0});
		$downloadBox.hide();
		var timer = null;
		var delay = 100;
		$downloadBox.mouseover(function(){
			$(".downloadBox").hide();
			$downloadBox.show();
			clearTimeout(timer);
		});
		$downloadBox.mouseleave(function(){
			timer = setTimeout(function(){
				$downloadBox.hide();
			}, delay);
		});
		$(this).mouseover(function(){
			$(".downloadBox").hide();
			var thisTop = $(this).offset().top;
			var thisLeft = $(this).offset().left;
			clearTimeout(timer);
			$downloadBox.show();
			if(thisLeft + dlTmp.left + $downloadBox.outerWidth() > $(window).outerWidth()){
				var $spanElem = $downloadBox.find("span");
				var marginLeft = $downloadBox.outerWidth() - $spanElem.outerWidth()
				$spanElem.css({marginLeft:marginLeft});
				$downloadBox.offset({top:(thisTop + dlTmp.top), left:(thisLeft + dlTmp.left - marginLeft)});
			}else{
				$downloadBox.offset({top:(thisTop + dlTmp.top), left:(thisLeft + dlTmp.left)});
			}
		});
		$(this).mouseleave(function(){
				timer = setTimeout(function(){
				$downloadBox.hide();
			}, delay);
		});
    });
};

$.fn.ccbSortTable = function(tableId, option){
	var st = $.extend({
		imgNo:"sortNo.png",
		imgUp:"sortUp.png",
		imgDn:"sortDn.png",
		sortCol:0,
		startRow:1,
		endRow:999,
		sortByNumer:false,
		startZebra:1,
		tBodyIndex:0,
		numReg:",",
		hideNum:0,
		compare:null,
		compareEx:null,
		afterClick:nulf,
		isDelBeforeClickEvent:true
	},option);
	var tableElem = document.getElementById(tableId);

	function _sortrows(n, sortFlag) {
		var rows = tableElem.rows;
		var sortRows = [];
		var unSortRowsA = [];
		var unSortRowsB = [];
		var hideTrAry = [];

		for (var i = 0; i < rows.length;) {
			if(i < st.startRow){
				unSortRowsA.push(rows[i]);
				i++;

			}else if(i >= st.startRow && i < st.endRow) {
				sortRows.push(rows[i]);
				i++;
				if(0 != st.hideNum){
					var hideTrAryIndex = hideTrAry.length;
					rows[i - 1].hideTrAryIndex = hideTrAryIndex;
					hideTrAry[hideTrAryIndex] = new Array();
					for(var j = 0; j < st.hideNum; j++){
						if(i + j < rows.length){
							hideTrAry[hideTrAryIndex].push(rows[i + j]);
						}
					}
					i += st.hideNum;
				}

			}else if(i >= st.endRow){
				unSortRowsB.push(rows[i]);
				i++;
			}
		}

		var tbody = tableElem.tBodies[st.tBodyIndex];
		sortRows.sort(function (row1, row2) {
			var cell1 = row1.getElementsByTagName("td")[n];
			var cell2 = row2.getElementsByTagName("td")[n];

			var val1 = cell1.textContent || cell1.innerText;
			var val2 = cell2.textContent || cell2.innerText;

			if(null != st.compare && typeof(st.compare) == "function"){
				var ret = st.compare(val1, val2);
				return ret * sortFlag;

			}if(null != st.compareEx && typeof(st.compareEx) == "function"){
				var ret = st.compareEx(cell1, cell2);
				return ret * sortFlag;

			}else{
				if(st.sortByNumer){
					var ret = 0;
					try{
						while(val1.match(st.numReg)){
							val1 = val1.replace(st.numReg, "");
						}
						while(val2.match(st.numReg)){
							val2 = val2.replace(st.numReg, "");
						}

						var numVal1 = parseFloat(val1);
						var numVal2 = parseFloat(val2);
						if(isNaN(numVal1)){numVal1 = 0 - Number.MAX_VALUE};
						if(isNaN(numVal2)){numVal2 = 0 - Number.MAX_VALUE};
					}catch(e){
						return 0;
					}
					if(numVal1 < numVal2){
						ret = -1;
					}else if(numVal1 > numVal2){
						ret = 1;
					}else{
						ret = 0;
					}
					return ret * sortFlag;
				}else{
					return val1.localeCompare(val2) * sortFlag;
				}
			}
		});

		for (var i = 0; i < unSortRowsA.length; i++){
			tbody.appendChild(unSortRowsA[i]);
		}
		for (var i = 0; i < sortRows.length; i++){
			tbody.appendChild(sortRows[i]);
			for(var j = 0; j < st.hideNum; j++){
				tbody.appendChild(hideTrAry[sortRows[i].hideTrAryIndex][j]);
			}
		}
		for (var i = 0; i < unSortRowsB.length; i++){
			tbody.appendChild(unSortRowsB[i]);
		}
	}
	return this.each(function(i){
		$(this).find(".sortImgClass").remove();
		if(st.isDelBeforeClickEvent){
			var clickEventAry =  $(this).data("clickSortTable");
			if(clickEventAry){
				for(var i = 0; i < clickEventAry.length; i++)
					$(this).unbind("click", clickEventAry[i]);
			}
		}
		$(this).append('<img class="sortImgClass" src="'+ webpath + st.imgNo + '" style="vertical-align:text-bottom;_vertical-align:middle;margin-left:3px;"/>');
		$(this).css("cursor", "pointer");
		var sortFlag = 0;
		var prevAll = ("TD" == this.tagName.toUpperCase())? $(this).prevAll(): $(this).parents("td").prevAll();
		var countCol = prevAll.filter("td").length;
		var sortCol = (0 < st.sortCol)? st.sortCol: countCol;
		function clickSortTable(){
			$(tableElem).find(".sortImgClass").attr("src", webpath + st.imgNo);
			var $img = $(this).find("img");
			if(1 == sortFlag){
				$img.attr("src", webpath + st.imgDn);
				sortFlag = -1;
			}else{
				$img.attr("src", webpath + st.imgUp);
				sortFlag = 1;
			}
			_sortrows(sortCol, sortFlag);
			$("#"+tableId).find(".tableListTr").removeClass("tableListTr");
			var rows = tableElem.rows;
			var paintFlag = false;
			for(var i = st.startZebra; i < rows.length; i += (st.hideNum + 1)){
				if(paintFlag){
					var row = rows[i];
					row.className += " tableListTr";
					paintFlag = false;
				}else{
					paintFlag = true;
				}
			}
			if(st.afterClick){
				st.afterClick();
			}
		}
		$(this).click(clickSortTable);
		if(!$(this).data("clickSortTable")){
			$(this).data("clickSortTable", new Array());
		}
		$(this).data("clickSortTable").push(clickSortTable);
	});
}

$.fn.ccbScroll = function(option){
	var s = $.extend({
		wrapperClass : "ccbScrollWrap",
		width: "100%",
		height: "atuo",
		borderRadius: "7px",
		alwaysVisible: true,
		opacity: .4,
		color: "#CCC",
		size: 10,
		barClass: "ccbScrollBar"
	},option);
	return this.each(function(i){
		var barWidth, isDragg, pageX,
		divS = '<div></div>',
		minBarWidth = 100,
		$me = $(this);
		/* s */
		var $curBar = $me.parent().next();
		if($curBar.prop("className") == s.barClass){
			var $curContainer = $me.parent();
			getBarWidth($curContainer, $curBar);
			return;
		}
		/* e */
		var $wrapper = $(divS)
		.addClass(s.wrapperClass)
		.css({
			position: 'relative',
			overflow: 'hidden',
			width: s.width,
			height: s.height
		});
		var $container = $(divS)
		.css({
			overflow: 'hidden',
			width: s.width,
			height: s.height
		});

		var $bar = $(divS)
		.addClass(s.barClass)
		.css({
			background: s.color,
			height: s.size,
			position: 'absolute',
			top: $me.height() - s.size,
			left: 0,
			opacity: s.opacity,
			display: s.alwaysVisible ? 'block' : 'none',
			'border-radius' : s.borderRadius,
			BorderRadius: s.borderRadius,
			MozBorderRadius: s.borderRadius,
			WebkitBorderRadius: s.borderRadius,
			zIndex: 99
		});
		// wrap it
		$me.wrap($container);
		$container = $me.parent();
		$container.wrap($wrapper);
		$wrapper = $container.parent();

		// append to parent div
		$wrapper.append($bar);

		function getBarWidth(p$container, p$bar){
			// calculate scrollbar width and make sure it is not too small
			barWidth = Math.max((p$container.outerWidth() / p$container[0].scrollWidth) * p$container.outerWidth(), minBarWidth);
			p$bar.css({ width: barWidth + 'px' });

			// hide scrollbar if content is not long enough
			var display = barWidth == p$container.outerWidth() ? 'none' : 'block';
			p$bar.css({ display: display, top: $container.height() - s.size});

			if(display == "block"){
				var currLeft = parseFloat($bar.css('left'));
				var maxLeft = $wrapper.outerWidth() - $bar.outerWidth();
				currLeft = Math.min(Math.max(currLeft, 0), maxLeft);
				$bar.css('left', currLeft);

				// calculate actual scroll amount
				percentScroll = parseInt($bar.css('left'), 10) / maxLeft;
				var delta = percentScroll * ($container[0].scrollWidth - $container.outerWidth());

				// scroll content
				$container.scrollLeft(delta);
			}

		};
		getBarWidth($container, $bar);

		$wrapper.bind("resize", function(){
			try{
			getBarWidth($container, $bar);
			}catch(e){}
		});
		setInterval(function(){
			try{
			getBarWidth($container, $bar);
			}catch(e){}
		}, 500);

		$bar.bind("mousedown.ccbScroll", function(e) {
			var $doc = $(document);
			var isDragg = true;
			var t = parseFloat($bar.css('left'));
			var pageX = e.pageX;

			$doc.bind("mousemove.ccbScroll", function(e){
				var currLeft = t + (e.pageX - pageX);

				var maxLeft = $wrapper.outerWidth() - $bar.outerWidth();
				currLeft = Math.min(Math.max(currLeft, 0), maxLeft);
				$bar.css('left', currLeft);

				// calculate actual scroll amount
				percentScroll = parseInt($bar.css('left'), 10) / maxLeft;
				var delta = percentScroll * ($container[0].scrollWidth - $container.outerWidth());

				// scroll content
				$container.scrollLeft(delta);
			});

			$doc.bind("mouseup.ccbScroll", function(e) {
				isDragg = false;
				//hideBar();
				$doc.unbind('.ccbScroll');
			});
			return false;

		}).bind("selectstart", function(e){
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
	});
}

$.fn.ccbSelect = function(option){
	return $$B.ie6? this: this.each(function(i){
		var slt = $.extend({
			sltChange:nulf,
			maxPaddingRight:10,
			boxClass:"sltBox",
			curTxtClass:"sltCurTxt"
		},option);

		var $me = $(this);
		if($me.parent().prop("className") == slt.boxClass){
			$me.parent().find("."+slt.curTxtClass).remove();
			$me.unwrap();
		}
		$me.wrap("<label class='"+ slt.boxClass +"'></label>");
		var $wrapper = $me.parent();
		var $curTxt = $("<div class='"+ slt.curTxtClass +"'></div>");
		$wrapper.prepend($curTxt);

		var resizeSltBox = function(){
			var $cloneMe = $me.clone();//为了计算准确这里重新复制一个select放在body后面进行计算高宽，因为如果select在浏览器不展示时，高宽边距等等不正确
			$cloneMe.show();//保证复制的select是展示的
			$("body").append($cloneMe);
			$me.css({opacity:0, position:"relative", top: (0 - $cloneMe.outerHeight()) + "px"});
			var myOuterWidth = $cloneMe.outerWidth();
			var myWidth = $cloneMe.width();
			var curTxtPaddingLeft = parseInt($curTxt.css("paddingLeft"), 10);
			var curTxtPaddingRight = parseInt($curTxt.css("paddingRight"), 10);
			$wrapper.width(myOuterWidth - 2);//2线宽
			$curTxt.width(myOuterWidth - (curTxtPaddingLeft + curTxtPaddingRight + 2));
			var options = $me.get(0).options;
			var $txtBox = $("<div style='float:left'><span></span></div>");
			$("body").append($txtBox);
			var $cloneTxt = $txtBox.children();
			var maxWidth = 0;
			for(var i = 0; i < options.length; i++){
				$cloneTxt.html(options[i].text);
				var width = $cloneTxt.width();
				if(width > maxWidth){
					maxWidth = width;
				}
				$cloneTxt.html();
			}
			var maxOuterWidth = maxWidth + curTxtPaddingLeft + curTxtPaddingRight;
			maxOuterWidth = $$B.ie7? maxOuterWidth + 10: maxOuterWidth;//ie7增加10像素在文字右边
			if(maxOuterWidth > $curTxt.outerWidth()){
				$me.width(maxOuterWidth);
				$cloneMe.width(maxOuterWidth);
				myOuterWidth = $cloneMe.outerWidth();
				myWidth = $cloneMe.width();
				$wrapper.width(myOuterWidth - 2);//2线宽
				$curTxt.width(myOuterWidth - (curTxtPaddingLeft + curTxtPaddingRight + 2));
			}
			var selectedIndex = $me.get(0).selectedIndex;
			selectedIndex == -1? $curTxt.html(""): $curTxt.html(options[selectedIndex].text);
			$txtBox.remove();
			$cloneMe.remove();
		}
		resizeSltBox();
		$me.change(function(){
			$curTxt.html(this.options[this.selectedIndex].text);
			slt.sltChange();
		});
    });
};
$.fn.editColumn = function(tableId, option){
	var ec = $.extend({
		headRowIndex:0,
		exColStr:"",
		suffix:"_EditWin"
	},option);
	var $table = $("#"+tableId);
	var rows = $table.get(0).rows;
	var headCells = rows[ec.headRowIndex].cells;
	var colAry = new Array();
	var isMultiRow = false;
	var realCellLength = 0;
	var nextRowLength = 0;
	var i,j,k;

	for(i = 0; i < headCells.length; i++){
		var col = {};
		col.index = realCellLength;
		col.text = $(headCells[i]).text();
		col.colSpan = $(headCells[i]).prop("colSpan");
		col.rowSpan = $(headCells[i]).prop("rowSpan");
		col.nextRowIndex = -1;
		realCellLength += col.colSpan;
		if(col.rowSpan > 1){
			isMultiRow = true;
		}
		if(isMultiRow && col.rowSpan == 1){
			col.nextRowIndex = nextRowLength;
			nextRowLength += col.colSpan;
		}
		colAry.push(col);
	}

	var exColAry = ec.exColStr.split(",");
	for(j = 0; j < exColAry.length; j++){
		var exColNum = parseInt(exColAry[j], 10);
		if(isNaN(exColNum)){
			continue;
		}
		for(i = 0; i < colAry.length; i++){
			if(colAry[i].index == exColNum){
				colAry.splice(i, 1);
				break;
			}
		}
	}

	var winHtml = "<div class='Win' id='"+ tableId + ec.suffix + "'>";
	winHtml += "<div class='winHead'><span class='winTitle'>编辑列</span><a href='javascript:void(0)' class='winCloseBtn'></a></div>";
	winHtml += "<div class='winBody'></div>";
	winHtml += "</div>";
	var $win = $(winHtml);

	var editColBoxHtml = "<div class='editColBox'>";
	editColBoxHtml += "<label class='checkbox' style='padding-left:23px;'><input type='checkbox' name='SltAllCol' id='sltAllCol' value='1'/><span>全选</span></label>";
	editColBoxHtml += "<div class='editBorder'>";
	editColBoxHtml += "<table class='editColTable'><tr>";
	for(i = 0; i < colAry.length; i++){
		if(i != 0 && i % 4 == 0){
			editColBoxHtml += "</tr><tr>";
		}
		editColBoxHtml += "<td><label class='checkbox' style='margin-right:10px;'><input type='checkbox' checked name='col' nextRowIndex='"+ colAry[i].nextRowIndex +"' rowSpan='"+ colAry[i].rowSpan +"' colSpan='"+ colAry[i].colSpan +"' value='"+ colAry[i].index +"'/><span>" + colAry[i].text + "</span></label></td>";
	}
	editColBoxHtml += "</tr></table></div></div>";

	editColBoxHtml += "<div class='btnArea'><div class='btnLine btnCenter'>"
	editColBoxHtml += "<input type='button' class='btn bSty1' name='queding' id='editColBtn' value='确 定'>";
	editColBoxHtml += "</div></div>";

	$win.find(".winBody").append(editColBoxHtml);

	function initWin(){
		$win.find(".winCloseBtn").click(function(){
			$win.remove();
		});
		$win.find(".editColBox").find("#sltAllCol").click(function(){
			if(this.checked){
				$win.find(".editColTable").find("input").attr("checked", true);
				$win.find(".editColTable").find("input").prop("checked", true);
			}else{
				$win.find(".editColTable").find("input").attr("checked", false);
				$win.find(".editColTable").find("input").prop("checked", false);
			}
		});
		$win.find("#editColBtn").click(function(){
			$win.find(".editColTable").find("input").each(function(){
				for(i = 0; i < rows.length; i++){
					var cells = rows[i].cells;
					var colNum = 0;
					for(j = 0; j < cells.length; j++){
						var colSpan = $(cells[j]).prop("colSpan");
						if(colNum == this.value){
							var thisColSpan = $(this).attr("colSpan");
							if(thisColSpan <= colSpan){
								thisColSpan = 1;
							}
							for(k = 0; k < thisColSpan; k++){
								if(this.checked){
									$(cells[j + k]).show();
									$(cells[j + k]).data("editColumn","1");
								}else{
									$(cells[j + k]).hide();
									$(cells[j + k]).data("editColumn","0");
								}
							}
							break;
						}
						colNum += colSpan;
					}
					if(i == ec.headRowIndex){
						var nextRowIndex = parseInt($(this).attr("nextRowIndex"), 10);
						if(nextRowIndex != -1){
							var nextCells = rows[++i].cells;
							thisColSpan = $(this).attr("colSpan");
							colSpan = $(nextCells[nextRowIndex]).prop("colSpan");
							if(thisColSpan <= colSpan){
								thisColSpan = 1;
							}
							for(k = 0; k < thisColSpan; k++){
								if(this.checked){
									$(nextCells[nextRowIndex + k]).show();
									$(nextCells[nextRowIndex + k]).data("editColumn","1");
								}else{
									$(nextCells[nextRowIndex + k]).hide();
									$(nextCells[nextRowIndex + k]).data("editColumn","0");
								}
							}
						}
					}
				}
			})
			$win.remove();
		})
	}

	return this.each(function() {
		$(this).click(function(){
			$("body").append($win);
			$win.offset({top:$(this).offset().top, left:($(window).width() - $win.width())/2});
			initWin();
		})
	})
}

$.fn.floatY = function(option){
	var fy = $.extend({
	}, option);
	var scrollwin = window.parent;
	var winoffsettop = $(window.parent.document.getElementById('mainframe')).offset().top;
	return this.each(function(){
		var $me = $(this),
		myMarginTop = parseInt($me.css("marginTop")),
		myMarginRight = parseInt($me.css("marginRight")),
		myMarginBottom = parseInt($me.css("marginBottom")),
		myMarginLeft = parseInt($me.css("marginLeft")),
		myPos = $me.css("position"),
		myBackgroundColor = $me.css("backgroundColor"),
		myTop = $me.offset().top,
		myWidth = $me.outerWidth() + myMarginLeft + myMarginRight,
		myHeight = $me.outerHeight() + myMarginTop + myMarginBottom;
		$copy = $("<div style='width:"+myWidth+"px;height:"+ myHeight +"px;'></div>");
		/*
		$me.after($copy);
		$copy.hied();
		*/

		$(scrollwin).scroll(function(){
			var winScroll = $(scrollwin).scrollTop();
			if(winScroll - winoffsettop > myTop){

				$copy.show();
				$me.css({position:"absolute", zIndex:3, width:"1139px", backgroundColor:"#c8e0f5", paddingLeft:"10px", paddingRight:"10px"});//backgroundColor:"#c8e0f5",
				$me.offset({top:winScroll - winoffsettop});


			}else{

				$copy.hide();
				$me.css({position:"", backgroundColor:"", width:"", paddingLeft:"", paddingRight:""});


			}
		});
	});
}
/*
$m2.dragToHit({
	hitId        : "sidebarMain",
	onStartDarg  : showSideBar,
	onHit        : hitOnSideBar,
	onMiss       : hideSideBar
});
*/
$.fn.dragToHit = function(d){
	d = $.extend({
		hitId        : '',
		onStartDarg  : nulf,
		onHit        : nulf,
		onMiss       : nulf,
		onAfterHit   : nulf
	}, d);
	var isFrist = false;
	//nosel清除高亮文本块
	function noSel() {
		try {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		} catch(e){}
	}
	return this.each(function() {
		var clickObj = this;
		$(this).mousedown(function(e){
			document.body.style.cursor = 'pointer';
			$(document.body).append($(this).clone());
			var $dragObj = $(document.body.lastChild);
			$dragObj.css({position:"absolute", zIndex:999999});
			$dragObj.offset({top:e.pageY - ($dragObj.height()/2), left:e.pageX - ($dragObj.width()/2)});
			//$dragObj.css({backgroundColor:"#FFFFFF", display:"block"});
			$dragObj.removeAttr("href");
			$dragObj.hide();
			isFrist = true;
			$(document).bind("mousemove", dragMoving);
			$(document).bind("mouseup", dragRelease);
			function dragMoving(e){
				if(isFrist){
					$dragObj.show();
					d.onStartDarg();
					isFrist = false;
				}
				$dragObj.offset({top:e.pageY - ($dragObj.height()/2), left:e.pageX - ($dragObj.width()/2)});
				noSel();
			}
			function dragRelease(e){
				$(document).unbind("mousemove", dragMoving);
				$(document).unbind("mouseup", dragRelease);
				document.body.style.cursor = 'auto';
				var isHit = true;
				var hasHitObj = false;
				var minX = 0, minY = 0, maxX = 0, maxY = 0;
				var X=e.pageX;
				var Y=e.pageY;

				var $hitObj = $("#" + d.hitId);
				if($hitObj.length > 0){
					var minX = $hitObj.offset().left;
					var minY = $hitObj.offset().top;
					var maxX = $hitObj.offset().left + $hitObj.width();
					var maxY = $hitObj.offset().top + $hitObj.height();
					hasHitObj = true;
				}

				if(!hasHitObj || (X<minX||X>maxX||Y<minY||Y>maxY)){//没撞击物或者没撞上则为false
					isHit = false;
				}
				if(isHit){
					d.onHit(clickObj);
				}else{
					d.onMiss(clickObj);
				}
				$dragObj.remove();
				d.onAfterHit();
			}
		});
	});
}

$.cookie = function(name, value, options) {
	if(typeof value != 'undefined') {
		options = options || {};
		if(value === null) {
			value = '';
			options = $.extend({}, options);
			options.expires = -1;
		}
		var expires = '';
		if(options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if(typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000)); //这里改时间，单位毫秒，默认为1天。
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else {
		var cookieValue = null;
		if(document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for(var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				if(cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
}

!function useLayer(){
	if(layer != null){
		layer.config({
		  skin: 'ccb-class'
		})
		window.ccbLayer = layer;
	}
}()
})(jQuery);

function moveColumn(option){
	var mc = $.extend({
		tableId:"",
		minCol:-1,
		maxCol:999,
		startCol:-1,
		spaceCol:0,
		suffix:Math.random()*1000
	},option);

	var $table = $("#"+mc.tableId);

	if( $table.length < 1 ||
		mc.minCol < 0 ||
		mc.maxCol > $table.get(0).rows[0].cells.length ||
		mc.minCol > mc.startCol ||
		mc.maxCol < mc.startCol + mc.spaceCol){
		return;
	}

	var minCol = mc.minCol,
	maxCol = mc.maxCol,
	startCol = mc.startCol,
	endCol = mc.startCol + mc.spaceCol -1,
	i,j;
	var rows = $table.get(0).rows;
	for(i=0; i<rows.length; i++){
		var cells = rows[i].cells;
		j = endCol + 1;
		while(j <= maxCol){
			$(cells[j]).hide();
			j++;
		}
	}

	var cells = $table.get(0).rows[0].cells
	var width = 0, mvlLeft = 0, mvrLeft = 0;
	mvlLeft = $(cells[minCol]).offset().left - 12;
	mvlLeft = mvlLeft<0?10:mvlLeft;

	mvrLeft = $(cells[endCol]).offset().left + $(cells[endCol]).outerWidth(true);
	mvrLeft = mvrLeft>1160?1130:mvrLeft;

	var $box  = $('<div class="moveColumnBox"></div>');
	var $left = $('<a href="javascript:;" class="moveColumnLeft"></a>');
	var $right = $('<a href="javascript:;" class="moveColumnRigth"></a>');
	$table.before($box);
	$box.append($left).append($right);
	$left.offset({left:mvlLeft}).hide();
	$right.offset({left:mvrLeft});

	$left.click(function(){
		var rows = $table.get(0).rows;
		var i,j;
		for(i=0; i<rows.length; i++){
			var cells = rows[i].cells;
			$(cells[startCol - 1]).show();
			$(cells[endCol]).hide();
		}
		startCol--;
		endCol--;
		if(startCol == minCol){
			$(this).hide()
		}
		$right.show();
	});
	$right.click(function(){
		var rows = $table.get(0).rows;
		var i,j;
		for(i=0; i<rows.length; i++){
			var cells = rows[i].cells;
			$(cells[startCol]).hide();
			$(cells[endCol + 1]).show();
		}
		startCol++;
		endCol++;
		if(endCol == maxCol){
			$(this).hide()
		}
		$left.show();
	});
}
