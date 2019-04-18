$(".functionall").hide()

$(document).ready(function() {

	
	
if($("#search")[0].innerText == "\n") {
    $("#search")[0].innerHTML = "";
    }
  str = searchText();
  if (!(str.length==0 || str == last)) {
    spanned = false;
    showHint();
  }


  var sentence = $('#search').html().replace(/<div>/gi,' ').replace(/<\/div>/gi,'').replace(/<span>/gi,' ').replace(/<\/span>/gi,'');
  word_number = countWords(sentence)
  document.getElementById("word_count").innerHTML =word_number+' ';
  if (word_number>=5){
      document.getElementById('send-aes').disabled=false;
  }else{document.getElementById('send-aes').disabled=true;}
  if (word_number>=5){
      document.getElementById('try-aes').disabled=false;
  }else{document.getElementById('try-aes').disabled=true;}

  
});


API_URL = "/api/write_call"

last = "";
spanned = true;
//api = "http://writeahead.nlpweb.org/"

function get_pattern_post(query) {
    $.ajax({
        type: "POST",
        url: API_URL,
        data: JSON.stringify({text: query}),
        dataType: 'json',
        success: renderPatternResult, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    });
}

function _showHint(str, hover) {
  if (str.length == 0) {
    str = last
    } else {
    last = str = str.replace(/(\s+)|(&nbsp;)/g," ");
    }

    if (hover != undefined) {
      
        var res = str.split(' ')
        var q = ''
        
        for (var i = 0; i < res.length-(res.length-hover)+1; i++) {
            q += res[i]+" "
        }
    
      //var query="add?text=" + str + "&hover="+hover;
      } else {
          q = str
      //var query="add?text=" + str;
    }
    //console.log(q)
    get_pattern_post(q)
  
}



$( "#search" ).on("keyup", function(e){ 
    

  if($("#search")[0].innerText == "\n") {
    $("#search")[0].innerHTML = "";
    }
  str = searchText();
  if (!(str.length==0 || str == last)) {
    spanned = false;
    showHint();
  }

  var sentence = $('#search').html().replace(/<div>/gi,' ').replace(/<\/div>/gi,'').replace(/<span>/gi,' ').replace(/<\/span>/gi,'');
  //var sentence = $("#search").text()

    

    word_number = countWords(sentence)
    document.getElementById("word_count").innerHTML =word_number+' ';
    if (word_number>=5){
        document.getElementById('send-aes').disabled=false;
    }else{document.getElementById('send-aes').disabled=true;}
    if (word_number>=5){
        document.getElementById('try-aes').disabled=false;
    }else{document.getElementById('try-aes').disabled=true;}

});

function countWords(s){ 
  
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
  s = s.replace(/[ ]{2,}/gi," ");
  s = s.replace(/\n /,"\n");

  var tokens = s.split(/\s+/)
  
    return tokens.length
}




$( "#search" ).mousemove(function(e) {
  if (!spanned && $("#search").text().length > 0) {
    spanText(e);
  }
});

function spanText(event) {
  spanned = true;
  var str = searchText()
  if (str.slice(-1) == '\n') {
  str = str.substring(0, str.length - 1)
  }
  //$("#search")[0].innerHTML = "<span>" + str.replace(/[\xa0 ]*\n/g," <br>").split(/[\xa0\ ]/g).join("</span><span>&nbsp;") + "</span>";
  $("#search")[0].innerHTML = "<span>" +str.replace(/[\xa0 ]*\n/g," <br>").split(/[\xa0\ ]/g).join("</span><span>&nbsp;") + "</span>";
  setCaretLast();
  $("#search span").mouseenter(onHover);
}



function onHover(e) {
  node = e.currentTarget;
  showHint(getIndex(node));
}

function showHint(hover) {
  _showHint(searchText(), hover);
}


function getIndex(node) {
  i = 0;
  while( (node = node.previousSibling) != null ) i++;
  return i
}

function searchText() {
  if ($("#search")[0].innerText == undefined) {
  return $("#search")[0].innerHTML.replace(/<br>/gi,"\n").replace(/(<([^>]+)>)/g, "");
  } else {
  return $("#search")[0].innerText;
  }
}


function setCaretLast() {
  var el = $("#search")[0]
  var range = document.createRange();
  var sel = window.getSelection();
  range.setStartAfter(el.childNodes[el.childNodes.length-1]);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
}


function renderPatternResult(data) {
    var htmlFrag = '';
    //console.log(data)
    data.patterns.forEach(function(pattern) {

        res = pattern.text.split(' ')
        var coll = ''
        for (var i = 0; i < res.length-1; i++) {
            coll += res[i]+" "
        }
        var col = ''
        pattern.colls.forEach(function(c) {
            col += ' '+coll+c+', '
        });
        col = col.slice(0,-2)
        //console.log(col)

        


        htmlFrag += '<p class="pattern">' + '<span class="patt">'+'['+pattern.text+']'+'</span>' + ' <font size="3" color="green">' + pattern.percent + '</font>'+'<span class ="col">'+col+'</span>'+'</p>';
        htmlFrag += '<p class="example">';
        en_example = pattern.examples[0]
        htmlFrag += en_example + '</p>'
        htmlFrag += '<p class="example">';
        ch_example = pattern.examples[1]
        htmlFrag += ch_example + '</p>'





        $('.pattern-area').html(htmlFrag);
})
}


$("#written").click(function(){

    $(".functionall").hide()
    $(".writeAhead").show()

})
