API_URL_suggest = '/suggest/'

let SearchResult = {
    currentResultTime: Date.now(),
    query: function(query, err_type) {
        console.log(query);
        // TODO: add loading
        // $('.linggle.search-result').addClass('d-none');
        $.ajax({
            url: API_URL_suggest+encodeURIComponent(query),
            data: {err_type: err_type},
        })
        .done(this.renderSearchResult)
        .fail(this.renderSearchFail);
    },

    renderSearchResult: function(data) {
        //console.log(data)
        $('#search-bar').val(data.query);
        if (data.ngrams.length > 0) {
            let total = data.ngrams.reduce((a, b) => a + b[1], 0);
            data.ngrams.forEach(ngram => { ngram[2] = Math.round(ngram[1] / total * 1000) / 10; });
            let htmlFrag = data.ngrams.map(SearchResult.renderNgramRowHtml).join('');
            $('.linggle.search-result tbody').html(htmlFrag);
            Example.initExampleBtns();
        } else {
            $('.linggle.search-result tbody').html('<tr><td colspan=4>No result</td></tr>');
        }
        // TODO: remove loading
        $('.linggle.search-result').removeClass('d-none');
    },
  
    renderNgramRowHtml: function(ngramData) {
        let ngram = ngramData[0];
        let count = ngramData[1];
        let percent = ngramData[2];
        let countStr = numberWithCommas(count);
        var ngramIdstr = ngram.replace(/\ /g , '_');
        return `<tr>
            <td class="ngram">${ngram}
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${percent}%;">
            </div>
            </td>
            <td class="percent text-right">${percent} &percnt;</td>
            <td class="count text-right">${countStr}</td>
            <td class="example">
            <button class="linggle btn btn-green" type="button" data-ngram="${ngram}"
            data-loading-text="<i class='fa fa-circle-o-notch fa-spin'></i> Loading"
            data-hide-text="Hide"
            data-show-text="Show"
            >Show</button>
            </td>
        </tr>
        <tr class="examples" id="${ngramIdstr}" data-fetched="false" data-hide="true" style="display: none;">
        </tr>`;
    },
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
