$.widget('custom.SuperGrid-table', 'custom.SuperGrid', {

    _bindListeners: function() {
        var context = this;

        this.element.off('click', '.supergrid_header td[data-sortable="true"]');
        this.element.on('click', '.supergrid_header td[data-sortable="true"]', function(e) {
            var $elem = $(this),
                currSort = $elem.attr('data-sort'),
                id = $elem.attr('data-id'),
                columns = context.options.columns,
                newSort;

            context.element.find('.supergrid_header td').removeAttr('data-sort');

            switch (currSort) {
                case 'asc':
                    newSort = 'desc';
                    break;
                case 'desc':
                default:
                    newSort = 'asc';
            }
            $.each(columns, function(i, col) {
                if (col.id === id) {
                    col.sort = newSort;
                    return true;
                }
                delete col.sort;
            });

            $elem.attr('data-sort', newSort);
            context._trigger('-sorted', e, {
                columns: context.options.columns
            });
            context._renderGrid();
        });

    },

    /**
     * @memberOf SuperGrid
     * @description Render data and columns
     * @private
     */
    _renderGrid: function() {
        this.element.html(this._buildGrid());
    },

    _buildGrid: function() {
        var headerHtml = this._buildHeader(),
            bodyHtml = this._buildBody(),
            html = '<table class="supergrid" style="width:100%;table-layout: fixed;">';

        /* Make header its own table */
        if (this.options.fixedHeader) {
            html = '<table class="supergrid supergrid-fheader">' + headerHtml + '</table>' +
                '<div class="supergrid-body">' + html;
        } else {
            html += headerHtml;
        }

        html += '<tbody>';
        html += bodyHtml;
        html += '</tbody>';
        html += (this.options.fixedHeader) ? '</table></div>' : '</table>';
        return html;
    },

    _buildHeader: function() {
        var headerHtml = '<thead class="supergrid_header">';
        headerHtml += '<tr>';
        $.each(this.options.columns, function(i, col) {
            var cellClass = col.cellClass || '',
                width = col.width || '',
                id = col.id || '',
                name = col.name || '',
                sort = col.sort || '',
                sortable = col.sortable || '';

            headerHtml += '<td style="width:' + col.width + 'px;" scope="col" class="' + cellClass + '" data-id="' + id + '" tabIndex="0"';
            if (sort) {
                headerHtml += 'data-sort="' + sort + '" ';
            }
            headerHtml += 'data-sortable="' + sortable + '">';
            headerHtml += '<div>';
            headerHtml += name;
            if (sort) {
                headerHtml += '<div class="sort-icon"></div>';
            }
            headerHtml += '</div>';
            headerHtml += '</td>';
        });
        headerHtml += '</tr>';
        headerHtml += '</thead>';
        return headerHtml;
    },

    _buildBody: function() {
        var data = this.options.data,
            columns = this.options.columns,
            context = this,
            bodyHtml = '';
        $.each(data, function(i, dataSet) {
            var id = dataSet.id || '';

            bodyHtml += '<tr class="section" data-id="' + id + '">';
            $.each(columns, function(i, col) {
                var cellClass = col.cellClass || '';
                bodyHtml += '<td style="width:' + col.width + 'px; class="' + cellClass + '" tabIndex="0">';
                bodyHtml += '<div>';
                bodyHtml += context._buildCell(dataSet, col);
                bodyHtml += '</div>';
                bodyHtml += '</td>';
            });
            bodyHtml += '</tr>';
        });
        return bodyHtml;
    },

    _buildCell: function(data, column) {
        var attrs = [],
            regex = /\#(.*?)\#/,
            formatter = column.formatter,
            formatterHelper = formatter,
            matchedAttr = regex.exec(formatter);
        if (!data) {
            return '';
        }
        if (typeof formatter === 'function') {
            return formatter(data);
        }
        if (typeof formatter === 'object') {
            formatter = column.formatter;
        }

        formatterHelper = formatter;
        matchedAttr = regex.exec(formatter);
        if (formatterHelper) {
            while (matchedAttr) {
                attrs.push(matchedAttr[0]);
                formatterHelper = formatterHelper.replace(matchedAttr[0], '');
                matchedAttr = regex.exec(formatterHelper);
            }
            $.each(attrs, function(index, attr) {
                var value = attr.replace(/#|_/g, '');
                formatter = formatter.replace(attr, data[value]);
            });
            return formatter;
        } else {
            return data[column.id];
        }
    }

});
