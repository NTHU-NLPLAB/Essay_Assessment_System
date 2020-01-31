$(document).ready(function() {
    SearchBar.init();

    $("#send-aes").click(function() {
        $(this).text('Check again').prop('disabled', true);
        $("#keep-writing").removeClass('d-none');
        $('#score-feeback').addClass('d-none');
        $(".writeAhead").addClass('d-none');
        $('.col-prgress .progress-bar').css("background-color",'#e9ecef');

        let sentence = $("#search").text();
        if (countWords(sentence) >= 30)
            score_it_post(sentence);

        dect_it_post(sentence);

        // TODO: loading
        setTimeout(function() {
            $(".functionall").removeClass('d-none');
        }, 3000);

    });

    $('#feedback-dectect').on('click','.sent.erroneous', function() {
        $('#search-bar').val('');
        $('.linggle.search-result').addClass('d-none');
        $('#suggest-info').text('');

        sen_dect($(this).text());
    });


    $('#suggest-info').on('click', 'span.edit', function() {
        let ele = $(this);
        let index = parseInt(ele.attr('id'));
        let err_type = ele.data('etype');
        let start = (index > 0) ? index-1:index;
        let end = (err_type != 'insert' && index < sent.length-1) ? index+2:index+1;

        let query = sent.slice(start, end).join(' ');
        SearchResult.query(query, err_type);
    });

});

API_URL_d = "/api/aes_dect"
API_URL_d_sen = "/api/dect_sen"
API_URL_score = "/api/aes"

let sent = [];

function score_it_post(query){
    $.ajax({
        type: "POST",
        url: API_URL_score,
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: cerf_show, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    })
}

function cerf_show(data){
    $("#cerf-leve").text(data.cerf);
    $(`.col-prgress .progress-bar:not(#${data.cerf.toLowerCase()})`).css("background-color",'#e9ecef');
    $(`.col-prgress .progress-bar#${data.cerf.toLowerCase()}`).css("background-color",'#17a2b8');
    $('#score-feeback').removeClass('d-none');
}


function dect_it_post(query){
    $.ajax({
        type: "POST",
        url: API_URL_d,
        // TODO: typo `courpus`
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: function (data) {
            revise_content(data.sen_arry , data.score_arry);
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        },
        complete: () => {$('#send-aes').prop('disabled', false);}
    })
}


function sen_dect(query){
    $.ajax({
        type: "POST",
        url: API_URL_d_sen,
        data: JSON.stringify({courpus: query}),
        dataType: 'json',
        success: function (data) {
            revise_sentence(data.sen_arry, data.tag_arry)
        }, 
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        } 
    })
}

function revise_content(data, scores){
    $('#suggest-info').removeClass('d-none');
    let content = data.map((tokens, sent_no) => {
        let score = scores[sent_no];
        let sent = detokenize(tokens.join(' '));
        if (score >= 0.15) return `<span class="sent erroneous sen-bad"> ${sent}</span>`;
        else if (score > 0.0) return `<span class="sent erroneous sen-notok"> ${sent}</span>`;
        else return sent
    }).join(' ');
    $('#feedback-dectect').html(content).removeClass('d-none');
}

function detokenize(text) {
    return text.replace(' ,',',').replace(' .','.').replace(' ?','?');
}


function revise_sentence(data, tag_token) {
    sent = data[0];
    let tag = tag_token[0];
    let content = '';

    for(i=0;i<sent.length;i++){
        if (tag[i] == 'O')
            content += ' '+sent[i];
        else if(tag[i] == 'B-I')
            content += ` <span class="${tag[i]} edit text-nowrap" id=${i} data-etype="insert"> Insert Word </span> ${sent[i]}`;
        else if (tag[i]=='B-R')
            content += ` <span class="${tag[i]} edit text-nowrap" id=${i} data-etype="replace">${sent[i]}</span>`;
        else if (tag[i]=='B-D')
            content += ` <span class="${tag[i]} edit text-nowrap" id=${i} data-etype="delete">${sent[i]}</span>`;
    }

    content = detokenize(content.replace(' ,', ',').replace(' .', '.'));
    $('#suggest-info').html(content);
}




