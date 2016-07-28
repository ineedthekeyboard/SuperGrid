define([
	'jquery.plugins',
	'css!widgets/simpleGrid/simpleGrid'
], function ($) {

	'use strict';
	/**
	 * @namespace SuperGrid
	 * @description A simple jquery plugin to render data into a table.
	 * @global
	 */

	return $.widget('eti.simpleGrid', {
		/**
		 * @memberOf SuperGrid
		 * @description constructor, only called once. starts the life cycle of the gadget
		 * @private
		 */
		_create: function () {
			// default column width
			$.each(this.options.columns, function (index, column) {
				if (!column.width) {
					column.width = 26;
				}
			});
			this._renderGrid();
			this._bindListeners();
		},


		_bindListeners: function () {
			var context = this;

			this.element.off('click', '.simpleTable_header td[data-sortable="true"]');
			this.element.on('click', '.simpleTable_header td[data-sortable="true"]', function (e) {
				var $elem = $(this),
					currSort = $elem.attr('data-sort'),
					id = $elem.attr('data-id'),
					columns = context.options.columns,
					newSort;

				context.element.find('.simpleTable_header td').removeAttr('data-sort');

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
				context._trigger('-sorted', e, {columns: context.options.columns});
				context._renderGrid();
			});

			this.element.off('click', '.checkbox');
			this.element.on('click', '.checkbox', function () {
				var $elem = $(this),
					$row = $elem.closest('tr'),
					prop = $elem.prop('checked'),
					numOfRows = context.element.find('.row.checkbox').length,
					numOfCheckedRows = context.element.find('.row.checkbox:checked').length;

				if ($elem.hasClass('header')) {
					//context.element.find('.row.checkbox').prop('checked', prop);
					if (prop) {
						context.element.find('tbody tr').addClass('selected').attr('draggable', true);
					} else {
						context.element.find('tbody tr').removeClass('selected').removeAttr('draggable');
					}
					return true;
				}

				if (numOfCheckedRows === numOfRows) {
					context.element.find('.header.checkbox').prop('checked', true);
				} else {
					context.element.find('.header.checkbox').prop('checked', false);
				}

				if (prop) {
					$row.removeClass('selected').addClass('selected').attr('draggable', true);
				} else {
					$row.removeClass('selected').removeAttr('draggable');
				}
			});
		},

		/**
		 * @memberOf SuperGrid
		 * @description Render data and columns
		 * @private
		 */
		_renderGrid: function () {
			this._sortData();
			this.element.html(this._buildGrid());
			this._addMetaData();
			this._trigger('-rendered');
		},

		_addMetaData: function () {
			var context = this;
			$.each(this.options.data, function (i, row) {
				context.element.find('tr[data-id="' + row.id + '"]').data(row);
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

			this.options.data.sort(function (a, b) {
				if (customSort) {
					return customSort(a, b, blnAsc);
				}
				a[field] = getSortValue ? getSortValue(a) : a[field];
				b[field] = getSortValue ? getSortValue(b) : b[field];
				if (a[field] < b[field]) {
					return blnAsc ? -1 : 1;
				}
				if (a[field] > b[field]) {
					return blnAsc ? 1 : -1;
				}
				return 0;
			});
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

		_buildGrid: function () {
			var headerHtml = this._buildHeader(),
				bodyHtml = this._buildBody(),
				html = '<table class="simpleTable" style="width:100%;table-layout: fixed;">';
			html += headerHtml;
			html += '<tbody>';
			html += bodyHtml;
			html += '</tbody>';
			html += '</table>';
			return html;
		},

		_buildHeader: function () {
			var headerHtml = '<thead class="simpleTable_header">';
			headerHtml += '<tr>';
			$.each(this.options.columns, function (i, col) {
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

		_buildBody: function () {
			var data = this.options.data,
				columns = this.options.columns,
				context = this,
				bodyHtml = '';

			$.each(data, function (i, dataSet) {
				var id = dataSet.id || '';

				bodyHtml += '<tr class="section" data-id="' + id + '">';
				$.each(columns, function (i, col) {
                    var cellClass = col.cellClass || '';
					bodyHtml += '<td class="' + cellClass + '" tabIndex="0">';
                    bodyHtml += '<div>';
					bodyHtml += context._buildCell(dataSet, col);
					bodyHtml += '</div>';
					bodyHtml += '</td>';
				});
				bodyHtml += '</tr>';
			});
			return bodyHtml;
		},

		_buildCell: function (data, column) {
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
				$.each(attrs, function (index, attr) {
					var value = attr.replace(/#|_/g, '');
					formatter = formatter.replace(attr, data[value]);
				});
				return formatter;
			} else {
				return data[column.id];
			}
		},

		/**
		 * @memberOf SuperGrid
		 * @description Updates the table with new data and optionally new column configs.
		 * @param data(required)
		 * @param columns
		 */
		updateGrid: function(data, columns) {
			data && (this.options.data = $.extend([],data));
			columns && (this.options.columns = $.extend([],columns));
			this.element.empty();
			this._renderGrid();
		}
	});
});
