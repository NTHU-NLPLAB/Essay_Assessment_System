$(document).ready(function() {
    onTextAreaInput();

    $("#search").on('mousemove', spanText)
        .on('mouseenter', 'span', onHover)
        .on("keyup", onTextAreaInput);

    $("#keep-writing").click(function() {
        $(".functionall").addClass('d-none');
        $(".writeAhead").removeClass('d-none');
    });
});

API_URL = "/api/write_call"

last = "";
spanned = false;

const COLL_ELEMENTS = ['v', 'n', 'adj', 'adv', 'inf', '-ing', 'wh', '(v)'];

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

function showHint(hover) {
    let str = searchText();
    if (str.length == 0)
        str = last;
    else
        last = str = str.replace(/(\s+)|(&nbsp;)/g, " ");

    if (hover != undefined) {
        let res = str.split(' ');
        let q = res.slice(0, res.length-(res.length-hover)+1).join(' ');
        get_pattern_post(q);
    } else
        get_pattern_post(str);
}

function onTextAreaInput() { 
    if($("#search")[0].innerText == "\n")
        $("#search")[0].innerHTML = "";

    let str = searchText();
    if (!(str.length == 0 || str == last)) {
        spanned = false;
        showHint();
    }
    updateTextArea();
}

function updateTextArea() {
    let sentence = $('#search').html().replace(/<div>/gi,' ').replace(/<\/div>/gi,'').replace(/<span>/gi,' ').replace(/<\/span>/gi,'');
    let length = countWords(sentence);
    $('#word_count').text(length);
    $('#send-aes').prop('disabled', !(length>=5));
}

function countWords(s){ 
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    s = s.replace(/\n /, "\n");

    let tokens = s.split(/\s+/);
    return tokens.length;
}


function setCaretLast() {
    let el = $("#search")[0];
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStartAfter(el.childNodes[el.childNodes.length-1]);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
}

function spanText() {
    if (!spanned && $("#search").text().length > 0) {
        let str = searchText().trimEnd();
        $("#search")[0].innerHTML = "<span>" + str.replace(/[\xa0 ]*\n/g," <br>").split(/[\xa0\ ]/g).join("</span><span>&nbsp;") + "</span>";
        setCaretLast();
        spanned = true;
    }
}

function onHover(e) {
    node = e.currentTarget;
    showHint(getIndex(node));
}

function getIndex(node) {
    let i = 0;
    while( (node = node.previousSibling) != null ) i++;
    return i
}

function searchText() {
    if ($("#search")[0].innerText == undefined)
        return $("#search")[0].innerHTML.replace(/<br>/gi,"\n").replace(/(<([^>]+)>)/g, "");
    else
        return $("#search")[0].innerText;
}

function renderPatternResult(data) {
    let htmlFrag = '';
    //console.log(data)
    data.patterns.forEach(function(pattern) {
        let pattern_items = pattern.text.split(' ')
        let colls_indice = [];
        pattern_items.forEach((item, index) => {
            if (COLL_ELEMENTS.indexOf(item) > 0)
            colls_indice.push(index);
        });

        let colls = pattern.colls.map((coll_items) => {
            let items = pattern_items.slice();
            coll_items.split('_').forEach((coll, index) => {
                items[colls_indice[index]] = coll;
            });
            return items.join(' ');
        }).join(', ');

        htmlFrag += `<p class="pattern">
                        <span class="patt">[${pattern.text}]</span>
                        <font size="3" color="green">${pattern.percent}</font>
                        <span class ="col">${colls}</span>
                    </p>
                    <p class="example">${pattern.examples[0]}</p>
                    <p class="example">${pattern.examples[1]}</p>
                    `;
    });
    $('.pattern-area').html(htmlFrag);
    $('.pattern-headword').text(data.headword);
}