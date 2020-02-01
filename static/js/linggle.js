API_URL_suggest = '/suggest/'

let SearchResult = {
    currentResultTime: Date.now(),
    query: function(query, err_type) {
        console.log(query)
        // TODO: add loading
        // $('.linggle.search-result').addClass('d-none');
        $.ajax({
            url: API_URL_suggest+encodeURI(query),
            data: {err_type: err_type},
        })
        .done(this.renderSearchResult)
        .fail(this.renderSearchFail);
    },
  
  
    renderSearchResult: function(data) {
        //console.log(data)
        $('#search-bar').val(data.query);
        if (data.ngrams.length > 0) {
            $('.linggle.search-result tbody').html(data.ngrams.map(function(ngramData) {
                let ngram = ngramData[0];
                let count = ngramData[1];
                let percent = Math.round(count/data.total * 1000) / 10;
                return SearchResult.renderNgramRowHtml(ngram, count, percent);
            }).join(''));
            Example.initExampleBtns();
        } else {
            $('.linggle.search-result tbody').html('<tr><td colspan=4>No result</td></tr>');
        }
        // TODO: remove loading
        $('.linggle.search-result').removeClass('d-none');
    },
  
    renderNgramRowHtml: function(ngram, count, percent) {
        //console.log(ngram, count, percent);
        let countStr = numberWithCommas(count)
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
