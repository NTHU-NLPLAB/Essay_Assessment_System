let Example = {
    API: '/api/linggle_example',
    // exampleLock: false,
    initExampleBtns: function() {
        $('td.example button.btn').on('click', function(){
            let exampleBtn = $(this);
            let ngramstr = exampleBtn.data('ngram');
            console.log(exampleBtn)
            let exampleRow = $('#' + ngramstr.replace(/\ /g , '_'));
  
            if(!exampleRow.data('fetched')) {
                exampleBtn.button('loading');
                Example.getExampleButton(ngramstr, exampleBtn, exampleRow);
            } else {
                exampleRow.toggle();
                let t = exampleRow.data('hide');
                if(!exampleRow.data('hide')) {
                    exampleBtn.button('show');
                    exampleRow.data('hide', true);
                } else {
                    exampleBtn.button('hide');
                    exampleRow.data('hide', false);
                }
            }
        });
    },
    getExample: function(ngramstr, exampleBtn, exampleRow, url = Example.API) {
        $.ajax({
            url: url,
            type: 'POST',
            data: ngramstr,
            contentType: "application/json",
            dataType: 'json',
        }).done(function(data) {
            exampleRow.html(Example.render(data.ngram, data.examples));
            exampleRow.data('fetched', "true");
        }).fail(function(data) {
            exampleRow.html('No result.');
        }).always(function() {
            exampleRow.show();
            exampleBtn.button('hide');
            exampleRow.data('hide', false);
            // this.exampleLock = false;
        });
    },
    getExampleButton: function(ngramstr, exampleBtn, exampleRow) {
        return (function(){
            Example.getExample(ngramstr, exampleBtn, exampleRow);
        })(ngramstr, exampleBtn, exampleRow);
    },
    /* Highlight the ngram string in the example (used in `render` function)*/
    highlight: function(ngramstr, example) {
        let regexp = new RegExp(ngramstr, 'ig');
        return example.replace(regexp, '<span class="highlight">$&</span>')
    },
    /* Convert array of example string to HTML string */
    render: function(ngramstr, examples) {
        // TODO: need some design
        return `<td colspan="4"><ul>${examples.map((example) => `<li>${this.highlight(ngramstr, example)}</li>`).join('')}</ul></td>`;
    }
  };
  
