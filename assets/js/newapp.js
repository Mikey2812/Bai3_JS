"use strict"
import datas from "./value.js";
var dataTable = {
    GLOBAL: {
        listData: JSON.parse(JSON.stringify(datas)),
        length: datas.length,
        numberDataRender: 10,
        indexButton: 0,
        firstButton: 0,
        lastButton: 0,
        from: 0,
        to: 0
    },

    SELECTORS: {
        body: $('tbody'),
        btnIndex: $('.btn-index'),
        select_entries: $('select'),
        prev_button: $('.prev'),
        next_button: $('.next'),
        paging_button: $('.button-paging'),
        filteredText: $('.filtered-text'),
        showingText: $('.showing-text'),
    },

    init: function () {
        dataTable.SELECTORS.filteredText.text(`(filtered from ${dataTable.GLOBAL.length} total entries)`);
        dataTable.selectChange();
        dataTable.selectEvent();
        dataTable.indexPage();
        dataTable.search();
        dataTable.sort();
    },

    selectChange: () => {
        dataTable.renderButton();
        dataTable.renderDataTable(0);
        dataTable.GLOBAL.to = dataTable.GLOBAL.length < dataTable.GLOBAL.numberDataRender ? dataTable.GLOBAL.length : dataTable.GLOBAL.numberDataRender;
        dataTable.SELECTORS.showingText.text(`Showing ${dataTable.GLOBAL.firstButton} to ${dataTable.GLOBAL.to} of ${dataTable.GLOBAL.length} entries`);
    },

    selectEvent: function () {
        dataTable.SELECTORS.select_entries.change(function () {
            dataTable.GLOBAL.numberDataRender = parseInt(dataTable.SELECTORS.select_entries.find(":selected").text());
            dataTable.selectChange();
        })
    },

    renderDataTable: (indexData) => {
        let html = ""; let tempNumberData;
        if (dataTable.GLOBAL.length === 0) {
            tempNumberData = 0;
            html = `<tr>
                        <td valign="top" colspan="5" class="dataTables_empty" style="text-align:center; padding: 8px">No matching records found</td>
                    </tr>`;
        }

        else {
            tempNumberData = indexData + dataTable.GLOBAL.numberDataRender > dataTable.GLOBAL.length ? dataTable.GLOBAL.length - (dataTable.GLOBAL.indexButton - 1) * dataTable.GLOBAL.numberDataRender : dataTable.GLOBAL.numberDataRender;
        }
        for (let i = 0; i < tempNumberData; i++) {
            html = html + `<tr>
                <th>${dataTable.GLOBAL.listData[indexData].RenderingEngine}</th>
                <th>${dataTable.GLOBAL.listData[indexData].Browser}</th>
                <th>${dataTable.GLOBAL.listData[indexData].Platform}</th>
                <th>${dataTable.GLOBAL.listData[indexData].EngineVersion}</th>
                <th>${dataTable.GLOBAL.listData[indexData].CSSGrade}</th>
            </tr>`
            indexData++;
        }
        dataTable.SELECTORS.body.html(html);
    },

    renderButton: () => {
        dataTable.GLOBAL.lastButton = dataTable.GLOBAL.length / dataTable.GLOBAL.numberDataRender;
        dataTable.GLOBAL.lastButton = Math.ceil(dataTable.GLOBAL.lastButton);
        let html = "";
        if (dataTable.GLOBAL.lastButton === 0) {
            dataTable.GLOBAL.firstButton = dataTable.GLOBAL.indexButton = 0;
        }
        else {
            dataTable.GLOBAL.firstButton = dataTable.GLOBAL.indexButton = 1;
            for (let i = 1; i <= dataTable.GLOBAL.lastButton; i++) {
                html = html + `<button class="button-paging" alt=${i}>${i}</button>`;
            }
        }
        dataTable.SELECTORS.btnIndex.html(html);
        if (dataTable.GLOBAL.lastButton !== 0) {
            $('button').eq(1).addClass('active');
        }
        dataTable.checkCursor();
    },

    checkCursor: () => {
        if (dataTable.GLOBAL.indexButton === dataTable.GLOBAL.firstButton) {
            dataTable.SELECTORS.prev_button.addClass('not-allowed').prop('disabled', true);
        }
        else {
            dataTable.SELECTORS.prev_button.removeClass('not-allowed').prop('disabled', false);
        }
        if (dataTable.GLOBAL.indexButton === dataTable.GLOBAL.lastButton) {
            dataTable.SELECTORS.next_button.addClass('not-allowed').prop('disabled', true);
        }
        else {
            dataTable.SELECTORS.next_button.removeClass('not-allowed').prop('disabled', false);
        }
    },

    search: () => {
        $('.input-search').on('input', () => {
            let input = $('.input-search').val().toLowerCase();
            if (input === '') {
                dataTable.GLOBAL.listData = datas;
                dataTable.SELECTORS.filteredText.addClass('display-none');
            }
            else {
                dataTable.GLOBAL.listData = datas.filter(data => {
                    for (const key in data) {
                        if (data[key].toLowerCase().includes(input)) {
                            return true;
                        }
                    }
                    return false;
                });
                dataTable.SELECTORS.filteredText.removeClass('display-none');
            }
            dataTable.GLOBAL.length = dataTable.GLOBAL.listData.length;
            if (dataTable.GLOBALlength === 0) {
                dataTable.GLOBAL.from = dataTable.GLOBAL.to = 0;
            }
            else {
                dataTable.GLOBAL.from = 1; dataTable.GLOBAL.to = dataTable.GLOBAL.indexButton * dataTable.GLOBAL.numberDataRender > dataTable.GLOBAL.length ? dataTable.GLOBAL.length : dataTable.GLOBAL.indexButton * dataTable.GLOBAL.numberDataRender;
            }
            dataTable.SELECTORS.showingText.text(`Showing ${dataTable.GLOBAL.from} to ${dataTable.GLOBAL.to} of ${dataTable.GLOBAL.length} entries`);
            dataTable.renderButton();
            dataTable.renderDataTable(0);
        });
    },

    changePage: (index) => {
        $('button').eq(dataTable.GLOBAL.indexButton).removeClass('active');
        $('button').eq(index).addClass('active');
        dataTable.GLOBAL.indexButton = index;
        dataTable.renderDataTable(dataTable.GLOBAL.indexButton * dataTable.GLOBAL.numberDataRender - dataTable.GLOBAL.numberDataRender);
        dataTable.checkCursor();
        dataTable.GLOBAL.from = (index - 1) * dataTable.GLOBAL.numberDataRender + 1;
        dataTable.GLOBAL.to = index * dataTable.GLOBAL.numberDataRender > dataTable.GLOBAL.length ? dataTable.GLOBAL.length : index * dataTable.GLOBAL.numberDataRender;
        dataTable.SELECTORS.showingText.text(`Showing ${dataTable.GLOBAL.from} to ${dataTable.GLOBAL.to} of ${dataTable.GLOBAL.length} entries`);
    },

    indexPage: () => {
        dataTable.SELECTORS.prev_button.click(() => {
            dataTable.changePage(dataTable.GLOBAL.indexButton - 1);
        })
        dataTable.SELECTORS.next_button.click(() => {
            dataTable.changePage(dataTable.GLOBAL.indexButton + 1);
        })
        $('.button-paging').click((e) => {
            const tempIndex = parseInt($(e.target).attr('alt'));
            if (tempIndex !== dataTable.GLOBAL.indexButton) {
                dataTable.changePage(tempIndex);
            }
        })
    },

    sort: () => {
        let way = 'ascending';
        const normal = 'fa-solid fa-arrows-up-down', ascending = 'fa-solid fa-arrow-down-short-wide', descending = 'fa-solid fa-arrow-down-wide-short';
        let altIndex, currentAlt; altIndex = currentAlt = 'RenderingEngine';
        $('i').click(e => {
            const iconIndex = $(e.target);
            altIndex = iconIndex.attr('alt');
            if (currentAlt !== altIndex) {
                $(`i[alt="${currentAlt}"]`).attr('class', normal);
                way = 'descending';
            }
            way = way === 'ascending' ? 'descending' : 'ascending';
            currentAlt = altIndex;
            iconIndex.attr('class', iconIndex.attr('class') === ascending ? descending : ascending);
            dataTable.GLOBAL.listData = quickSort(dataTable.GLOBAL.listData, altIndex, way);
            dataTable.renderDataTable(0);
            $('button').eq(dataTable.GLOBAL.indexButton).removeClass('active');
            $('button').eq(dataTable.GLOBAL.firstButton).addClass('active');
            dataTable.GLOBAL.indexButton = dataTable.GLOBAL.firstButton;
        });
    }
}
let quickSort = (array, key, way) => {
    const length = array.length;
    if (length < 2) return array;
    const pivotIndex = parseInt((length) / 2); const pivot = array[pivotIndex][key];
    let leftArray = []; let rightArray = [];
    for (let i = 0; i < length; i++) {
        if (i === pivotIndex) {
            continue;
        }
        if (array[i][key].localeCompare(pivot, undefined, { numeric: true, sensitivity: 'base' }) <= 0) {
            if (way === 'ascending') { leftArray.push(array[i]); }
            else { rightArray.push(array[i]); }
        }
        else {
            if (way === 'ascending') { rightArray.push(array[i]); }
            else { leftArray.push(array[i]); }
        }
    }
    return [...quickSort(leftArray, key, way), array[pivotIndex], ...quickSort(rightArray, key, way)];
}
$(document).ready(function () {
    dataTable.init();
});