/**
 *@SuperGrid
 * @version 0.1
 * @namespace custom.SuperGrid
 * @description A feature rich, developer friendly grid for client side javascript.
 */
$.widget('custom.SuperGrid', {
    /**
     * @name custom.SuperGrid#fixedHeader
     * @description Defines if the header should scroll or be fixed.
     * @type {boolean}
     * @defaultvalue false
     */
    /**
     * @name custom.SuperGrid#paginate
     * @description Defines if pagination should be enabled.
     * @type {boolean}
     * @defaultvalue false
     */
    options: {
        fixedHeader: false,
        paginate: false,
        pageSize: 27
    },
    /**
     * @name custom.SuperGrid#create
     * @function
     * @constructor
     * @description constructor, only called once. starts the life cycle of the gadget
     * @fires SuperGrid#_renderGrid
     * @fires SuperGrid#_bindListeners
     * @private
     */
    _create: function () {
        // default column width
        $.each(this.options.columns, function (index, column) {
            if (!column.width) {
                column.width = 25;
            }
        });

        //Private options defaults
        this.options._grid = [];
        this.options.pagination = {
            currentPage: 1,
            numberOfPages: 1,
            pageSize: this.options.pageSize
        };

        //Bootstrap the UI
        this._renderGrid();
        this._bindListeners();
    },

    _bindListeners: function () {
        var context = this;
        this.element.off('click', '.supergrid_header .supergrid_cell[data-sortable="true"]');
        this.element.on('click', '.supergrid_header .supergrid_cell[data-sortable="true"]', function (e) {
            var $elem = $(this),
                currSort = $elem.attr('data-sort'),
                id = $elem.attr('data-id'),
                columns = context.options.columns,
                newSort;

            context.element.find('.supergrid_header .supergrid_row').removeAttr('data-sort');

            switch (currSort) {
                case 'asc':
                    newSort = 'desc';
                    break;
                case 'desc':
                default:
                    newSort = 'asc';
            }
            $.each(columns, function (i, col) {
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
     * @name custom.SuperGrid#_renderGrid
     * @description Render data and columns
     * @private
     * @function
     * @fires SuperGrid#_sortData
     * @fires SuperGrid#_buildGrid
     * @fires SuperGrid#_addMetaData
     * @fires SuperGrid#-rendered
     */
    _renderGrid: function () {
        //Pre-sort & Pre-page
        this._sortData();
        this._pagination();

        //Build the grid
        this._buildGrid();
        this.element.html(this.options._grid.join(''));
        this.options._grid = [];

        //Finally Render Met and tell the world we rendered the grid:
        this.updatePages(this.options.pagination.currentPage);
        this._addMetaData();
        this._trigger('-rendered');
    },

    _addMetaData: function () {
        var context = this;
        $.each(this.options.data, function (i, row) {
            context.element.find('supergrid_row[data-id="' + row.id + '"]').data(row);
        });
    },

    _sortData: function () {
        var sortObj = this._getSorting(),
            blnAsc,
            getSortValue,
            customSort,
            field;
        if ($.isEmptyObject(sortObj)) {
            return false;
        }
        blnAsc = sortObj.sort === 'asc';
        field = sortObj.field;
        $.each(this.options.columns, function (i, col) {
            if (col.id === field) {
                getSortValue = col.getSortValue;
                customSort = col.sortFunc;
                return false;
            }
        });
        if (customSort) {
            this.options.data.sort(function (a, b) {
                return customSort(a, b, blnAsc);
            });
            return;
        }
        this.options.data = simpleSort(this.options.data, 0, this.options.data.length - 1, field, blnAsc);

        function simpleSort(arr, left, right, field, blnAsc) {
            var i = left;
            var j = right;
            var tmp,
                pivotidx = (left + right) / 2;
            var pivot = arr[pivotidx.toFixed()][field];
            /*Partition*/
            while (i <= j) {
                if (blnAsc) {
                    while (arr[i][field] < pivot)
                        i++;
                    while (arr[j][field] > pivot)
                        j--;
                } else { //asc order vs desc order check
                    while (arr[i][field] > pivot)
                        i++;
                    while (arr[j][field] < pivot)
                        j--;
                }
                if (i <= j) {
                    tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                    i++;
                    j--;
                }
            }
            /*Recursion*/
            if (left < j)
                simpleSort(arr, left, j, field, blnAsc);
            if (i < right)
                simpleSort(arr, i, right, field, blnAsc);
            return arr;
        }
    },

    _getSorting: function () {
        var sortObj = {};
        $.each(this.options.columns, function (i, col) {
            if (col.sort) {
                sortObj.field = col.id;
                sortObj.sort = col.sort;
                return false;
            }
        });
        return sortObj;
    },

    /**
     * @private
     * @function
     * @name custom.SuperGrid#_buildGrid
     * @description Build grid markup on to stateful array and push it into the DOM
     * @fires SuperGrid#_buildHeader
     * @fires SuperGrid@_buildBody
     */
    _buildGrid: function () {
        this.options._grid.push('<div class="supergrid">');
        this._buildHeader();
        this._buildBody();
        this._buildFooter();
        this.options._grid.push('</div>');
    },

    /**
     * @private
     * @function
     * @name custom.SuperGrid#_buildHeader
     * @description Build grid markup for header based on fixed option
     */
    _buildHeader: function () {
        if (this.options.fixedHeader) {
            this.options._grid.push('<div class="supergrid supergrid_header fixed">');
        } else {
            this.options._grid.push('<div class="supergrid supergrid_body">');
            this.options._grid.push(' <div class="supergrid_header">');
        }

        $.each(this.options.columns, function (i, col) {
            var cellClass = col.cellClass || '',
                width = col.width || '',
                id = col.id || '',
                name = col.name || '',
                sort = col.sort || '',
                sortable = col.sortable || '',
                cellStr = '';
            cellStr += '<div style="width:' + col.width + 'px;" scope="col" class="supergrid_cell ' + cellClass + '" data-id="' + id + '" tabIndex="0" ';
            if (sort)
                cellStr += 'data-sort="' + sort + '" ';
            cellStr += 'data-sortable="' + sortable + '">';
            cellStr += '<div>';
            cellStr += name;
            if (sort)
                cellStr += '<div class="sort-icon"></div>';
            cellStr += '</div>';
            cellStr += '</div>';
            this.options._grid.push(cellStr);
        }.bind(this));

        this.options._grid.push('</div>');
    },
    /**
     * @private
     * @function
     * @name custom.SuperGrid#_buildBody
     * @description Build grid markup for body
     */
    _buildBody: function () {
        var data = this.options.data,
            columns = this.options.columns,
            context = this,
            bodyHtml = '';
        if (this.options.fixedHeader)
            this.options._grid.push('<div class="supergrid supergrid_body">');

        $.each(data.slice(this.options.pagination.startIndex, this.options.pagination.endIndex), buildRow);

        this.options._grid.push('</div>');

        function buildRow(i, dataSet) {
            var id = dataSet.id || '',
                row = '';
            row += '<div class="supergrid_row section" data-id="' + id + '">';
            $.each(columns, function (i, col) {
                var cellClass = col.cellClass || '';
                row += '<div style="width:' + col.width + 'px;" class="supergrid_cell ' + cellClass + '" tabIndex="0">';
                row += '<div>';
                row += buildCell(dataSet, col);
                row += '</div>';
                row += '</div>';
            });
            row += '</div>';
            context.options._grid.push(row);
        }

        function buildCell(data, column) {
            var attrs = [],
                regex = /\#(.*?)\#/,
                formatter = column.formatter,
                formatterHelper = formatter,
                matchedAttr = regex.exec(formatter),
                context = this;
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
                $.each(attrs, function (index, attr) {
                    var value = attr.replace(/#|_/g, '');
                    formatter = formatter.replace(attr, data[value]);
                });
                return formatter;
            } else {
                return data[column.id];
            }
        }
    },
    /**
     * @private
     * @function
     * @name custom.SuperGrid#_buildFooter
     * @description Build grid markup for paging footer
     */
    _buildFooter: function() {
      var grid = this.options._grid;
      grid.push('<div class="supergrid_footer">');
      grid.push(' <button class="paginate left"><i></i><i></i></button>');
      grid.push(' <div class="counter"></div>');
      grid.push(' <button class="paginate right"><i></i><i></i></button>');
      grid.push('</div>');
    },
    /**
     * @private
     * @function
     * @name custom.SuperGrid#_pagination
     * @description Determine what the paging settings are
     *
     */
    _pagination: function () {
        var page = this.options.pagination;
        if (!this.options.paginate) {
            page.pageSize = (this.options.data.length > 0) ? this.options.data.length : 0;
            page.currentPage = 1;
            page.numberOfPages = 1;
            page.startIndex = 0;
            page.endIndex = page.pageSize;
            console.log(page);
            return;
        }
        page.startIndex = (page.currentPage - 1) * page.pageSize;
        if (page.startIndex > (this.options.data.length - 1)) {
            page.startIndex = this.options.data.length - 1;
        }
        page.endIndex = page.startIndex + page.pageSize;
        page.numberOfPages = Math.ceil(this.options.data.length / page.pageSize);
        console.log(page);

    },

    updatePages: function(currentPage){
      var $counter = this.element.find('.counter'),
          $leftArrow = this.element.find('.paginate.left'),
          $rightArrow = this.element.find('.paginate.right');
      debugger;
      if (currentPage <= 1) {
      $leftArrow.attr('data-state', 'disabled');
      }
      $counter.html(currentPage + '/' + this.options.pagination.numberOfPages);
    },
    /**
     * @name custom.SuperGrid#updateGrid
     * @description Updates the table with new data and optionally new column configs.
     * @function
     * @param {Array} data New Data to push to the grid.
     * @param {Array} columns (optional)
     * @fires SuperGrid#_renderGrid
     */
    updateGrid: function (data, columns) {
        data && (this.options.data = $.extend([], data));
        columns && (this.options.columns = $.extend([], columns));
        this.element.empty();
        this._renderGrid();
    }
});
