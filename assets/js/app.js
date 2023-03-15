"use strict"
import datas from "./value.js";
let lengthOfImport = datas.length;
let arraydatas = datas; let length = arraydatas.length;
let body = $('tbody'), btnIndex = $('.btn-index');
let numberDataRender = 10;
let prev = $('.prev'), next = $('.next');
let indexButton = 0; let firstButton = 0; let lastButton = 0;
let filteredText = $('.filtered-text');
let showingText = $('.showing-text');
let from, to;
let renderDataTable = (indexData) => {
    let tempBody = ""; let tempNumberData;
    if (length === 0) {
        tempNumberData = 0;
        tempBody = `<tr>
                        <td valign="top" colspan="5" class="dataTables_empty" style="text-align:center; padding: 8px">No matching records found</td>
                    </tr>`;
    }
    else {
        tempNumberData = indexData + parseInt(numberDataRender) > length ? length - (indexButton - 1) * numberDataRender : numberDataRender;
    }
    for (let i = 0; i < tempNumberData; i++) {
        tempBody = tempBody + `<tr>
            <th>${arraydatas[indexData]["RenderingEngine"]}</th>
            <th>${arraydatas[indexData]["Browser"]}</th>
            <th>${arraydatas[indexData]["Platform"]}</th>
            <th>${arraydatas[indexData]["EngineVersion"]}</th>
            <th>${arraydatas[indexData]["CSSGrade"]}</th>
            </tr>`
        indexData++;
    }
    body.html(tempBody);
}
let renderButton = () => {
    let numberButton = parseInt(length / numberDataRender);
    if (numberButton * numberDataRender < length) {
        numberButton++;
    }
    let tempButton = "";
    if (numberButton === 0) {
        firstButton = indexButton = 0;
    }
    else {
        firstButton = indexButton = 1;
        for (let i = 1; i <= numberButton; i++) {
            tempButton = tempButton + `<button class="button-paging" alt=${i}>${i}</button>`;
        }
    }
    lastButton = numberButton;
    btnIndex.html(tempButton);
    if (numberButton !== 0) {
        $('button').eq(1).addClass('active');
    }
    checkCursor();
}
let checkCursor = () => {
    if (indexButton === firstButton) {
        prev.addClass('not-allowed').prop('disabled', true);
    }
    else {
        prev.removeClass('not-allowed').prop('disabled', false);
    }
    if (indexButton === lastButton) {
        next.addClass('not-allowed').prop('disabled', true);
    }
    else {
        next.removeClass('not-allowed').prop('disabled', false);
    }
}
let selectChange = () => {
    from = length < 1 ? 0 : 1;
    to = length < numberDataRender ? length : numberDataRender;
    showingText.text(`Showing ${from} to ${to} of ${length} entries`);
    renderButton();
    renderDataTable(0);
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
let changePage = index => {
    $('button').eq(indexButton).removeClass('active');
    $('button').eq(index).addClass('active');
    indexButton = index;
    renderDataTable(indexButton * numberDataRender - numberDataRender);
    checkCursor();
    from = (index - 1) * numberDataRender + 1;
    to = index * numberDataRender > length ? length : index * numberDataRender;
    showingText.text(`Showing ${from} to ${to} of ${length} entries`);
}
$(document).ready(() => {
    selectChange();
    filteredText.text(`(filtered from ${lengthOfImport} total entries)`);
    //select 
    $('.select').change(() => {
        numberDataRender = $("#myselect option:selected").text();
        selectChange();
    });
    // Phan trang
    prev.click(() => {
        changePage(indexButton - 1);
    });
    next.click(() => {
        changePage(indexButton + 1);
    });
    $('.button-paging').click(e => {
        const tempIndex = parseInt($(e.target).attr('alt'));
        if (tempIndex !== indexButton) {
            changePage(tempIndex);
        }
    });
    // Sort
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
        arraydatas = quickSort(arraydatas, altIndex, way);
        renderDataTable(0);
    });
    //Search
    $('.input-search').on('input', () => {
        let input = $('.input-search').val().toLowerCase();
        if (input === '') {
            arraydatas = datas;
            filteredText.addClass('display-none');
        }
        else {
            arraydatas = datas.filter(data => {
                for (const key in data) {
                    if (data[key].toLowerCase().includes(input)) {
                        return true;
                    }
                }
                return false;
            });
            filteredText.removeClass('display-none');
        }
        length = arraydatas.length;
        if (length === 0) {
            from = to = 0;
        }
        else {
            from = 1; to = indexButton * numberDataRender > length ? length : indexButton * numberDataRender;
        }
        showingText.text(`Showing ${from} to ${to} of ${length} entries`);
        renderButton();
        renderDataTable(0);
    });
});