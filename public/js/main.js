
$(document).ready(function() {
    SearchBar.init();
  });
const send = $("#send");
const aes_content = $("#write-aes");
var word_number = 0;
$('#score-feeback').hide();
$("#try-aes").hide()
document.getElementById('send-aes').disabled=true;
document.getElementById('try-aes').disabled=true;


API_URL_d = "http://thor.nlplab.cc:7777/aes_dect"
API_URL_d_sen = "http://thor.nlplab.cc:7777/dect_sen"


function dect_it_post(query){
    
    $.ajax({
        type: "POST",
        url: API_URL_d,
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: function (data) {
            revise_content(data.sen_arry , data.score_arry)
            console.log(data)
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    })
}


function sen_dect(query){
    
    $.ajax({
        type: "POST",
        url: API_URL_d_sen,
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: function (data) {
            revise_sentence(data.sen_arry , data.tag_arry)
            console.log(data)
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    })
}

function revise_content(data , score){
    var content = ''
    for(i=0;i<data.length;i++){
        s = data[i].join(' ').replace(' ,',',').replace(' .','.').replace(' ?','?')
        
        grade = score[i]
        if (grade > 0.0 && grade < 0.15){
            content += '<span class="sen-notok"'+'id='+i +'>'+' '+s+'</span>'
        }
        else if(grade >= 0.15){
            content += '<span class="sen-bad"'+'id='+i+'>'+' '+s+'</span>'
        }
        else {
            content += ' '+s
        }
        
    }
    document.getElementById('feedback-dectect').innerHTML =content;
    $('#feedback-dectect').show();
}

$("#send-aes").click(function(){
    var sentence = aes_content.val()
    setTimeout(function() {
    dect_it_post(sentence);
    },2000)
    $("#send-aes").hide()
    $("#try-aes").show()
})

$("#try-aes").click(function(){
    $('.linggle.search-result').hide()
    $("#try-aes").hide()
    $('#feedback-dectect').hide();
    $('#suggest-info').hide();

    
    setTimeout(function() {
    var sentence = aes_content.val()
    dect_it_post(sentence);
    } , 2000)
    $("#send-aes").show()

})

$( "#write-aes" ).on("keyup", function(e){
    //console.log($("#mes").val());
    word_number = countWords(aes_content.val())
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
    return s.split(' ').length
}


$('.linggle.search-result').hide()

$(document).on('click','.sen-notok',function(){
    $('#suggest-info').show();
    $('.linggle.search-result').hide()
    // code here
    //var tag = $('.sen-notok').html();
    document.getElementById('suggest-info').innerHTML = ''
    console.log($(this))
    look_data = $(this).text()
    //document.getElementById('suggest-info').innerHTML =look_data;
    sen_dect(look_data)


});

$(document).on('click','.sen-bad',function(){
    $('.linggle.search-result').show()
    //$('.linggle.search-result').hide()
    // code here
    //var tag = $('.sen-notok').html();
    document.getElementById('suggest-info').innerHTML = ''
    //$('.linggle.search-result').show()
    console.log($(this))
    look_data = $(this).text()
    //document.getElementById('suggest-info').innerHTML =look_data;
    sen_dect(look_data)

});

$(document).on('click','.B-R',function(){
    
    //$('.linggle.search-result').hide()
    index = $(this).attr('id')
    console.log(sen , tag)
    var query = ''
    var tmp = []
    index_arry = [parseInt(index)-1 , parseInt(index) , parseInt(index)+1]
    console.log(index_arry)
    console.log('-----')
    
    for(i=0;i<index_arry.length;i++){
        if (index_arry[i] > 0 && index_arry[i] < tag.length+1){
            tmp.push(index_arry[i])
        }
    }
    for(i=0;i<tmp.length;i++){
        console.log(sen[5])
        if (tmp[i] == index){
            query+='_ '
        }else{
            query+= sen[[tmp[i]]]+' '
        }
    }
    //linggle_it_post(query)
    SearchResult.query(query);
    searchBar.val(query)

});

$(document).on('click','.B-II',function(){
    
    //$('.linggle.search-result').hide()
    index = $(this).attr('id')
    console.log(sen , tag)
    var query = ''
    var tmp = []
    index_arry = [parseInt(index)-1 , parseInt(index)]
    console.log(index_arry)
    console.log('-----')
    
    for(i=0;i<index_arry.length;i++){
        if (index_arry[i] > 0 && index_arry[i] < tag.length+1){
            tmp.push(index_arry[i])
        }
    }
    console.log(tmp)
    for(i=0;i<tmp.length;i++){
        console.log(sen[5])
        if (tmp[i] == index){
            query+='_ '+ sen[[tmp[i]]]+' '
        }else{
            query+= sen[[tmp[i]]]+' '
        }
    }
    SearchResult.query(query);
    var searchBar = $('#search-bar');
    searchBar.val(query)


    //linggle_it_post(query)

});




var sen = [];
var tag = [];
function revise_sentence(data , tag_token){
    sen = data[0]
    tag = tag_token[0]
    var content = '<div>'
    for(i=0;i<sen.length;i++){
        
        if (tag[i] == 'O'){
            content += ' '+sen[i]
        }
        else if(tag[i] == 'B-I'){
            //add = '<button type="button" class="btn btn-warning" id="B-I">Insert</button>'
            add = ' '+'<span class="B-II"'+'id='+i+'>'+'Insert Word '+'</span>'
            content += add + sen[i]
            //content += ' '+add+sen[i]+'</span>'
        }
        else if (tag[i]=='B-R') {
          //replace = '<button type="button" class="btn btn-success" id="B-R">Replace</button>'
            content += ' '+'<span class="B-R"'+'id='+i+'>'+sen[i]+'</span>'
        }
        else if (tag[i]=='B-D') {
            content += ' '+'<span class="B-D"'+'id='+i+'>'+sen[i]+'</span>'
        }
    }
    content+='</div>'
    
    document.getElementById('suggest-info').innerHTML =content.replace(' ,',',').replace(' .','.');
    
}




