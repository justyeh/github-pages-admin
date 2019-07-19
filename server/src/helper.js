exports.timeago = timestamp => {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;

    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return "不久前";
    }

    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;

    // 数值补0方法
    var zero = function(value) {
        if (value < 10) {
            return "0" + value;
        }
        return value;
    };
    // 超过1年，直接显示年月日
    if (monthC > 12) {
        var date = new Date(timestamp);
        return (
            date.getFullYear() +
            "-" +
            zero(date.getMonth() + 1) +
            "-" +
            zero(date.getDate())
        );
    } else if (monthC >= 1) {
        return parseInt(monthC) + "个月前";
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return "刚刚";
};

exports.formatTimestamp = timestamp => {
    let d = new Date(timestamp);

    let year = d.getFullYear();
    let month = d.getMonth() < 8 ? "0" + (d.getMonth()+1) : (d.getMonth()+1);
    let day = d.getDate() < 9 ? "0" + d.getDate() : d.getDate();
    return `${year}-${month}-${day}`;
};

var createPageHtml = (pageNo, pageCount, pageSize, linkTo = "/page/") => {
    var opts = {
        items_per_page: 10,
        num_display_entries: 10,
        num_edge_entries: 0,
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "..."
    };

    var pageHtml = "";
    var pageNo = parseInt(pageNo);
    var pageTotal = Math.ceil(parseInt(pageCount) / pageSize);

    if (pageNo < 1 || pageNo > pageCount) {
        return "";
    }

    //前一页
    if (pageNo == 1) {
        pageHtml += `<span class='prev current'>${opts.prev_text}</span>`;
    } else {
        pageHtml += `<a class='prev' href='${linkTo}${pageNo - 1}'>${
            opts.prev_text
        }</a>`;
    }
    //中间页码
    drawLinks();
    //后一页
    if (pageNo == pageTotal) {
        pageHtml += `<span class='next current'>${opts.next_text}</span>`;
    } else {
        pageHtml += `<a class='next' href='${linkTo}${pageNo + 1}'>${
            opts.next_text
        }</a>`;
    }

    function drawLinks() {
        //总页数小于5
        if (pageTotal <= 5) {
            for (let i = 1; i <= pageTotal; i++) {
                pageHtml += `<a class='${
                    pageNo == i ? " current" : ""
                }' href='${linkTo}${i}'>${i}</a>`;
            }
            return false;
        }
        if (pageNo <= 5) {
            for (let i = 1; i <= 5; i++) {
                pageHtml += `<a class='${
                    pageNo == i ? " current" : ""
                }' href='${linkTo}${i}'>${i}</a>`;
            }
            if (pageTotal > 6) {
                pageHtml += `<span>${opts.ellipse_text}</span>`;
                pageHtml += `<a href='${linkTo}${pageTotal}'>${pageTotal}</a>`;
            }
        } else if (pageNo > 5 && pageNo < pageTotal - 4) {
            pageHtml += `<a href='${linkTo}${1}'>${1}</a>`;
            pageHtml += `<span>${opts.ellipse_text}</span>`;
            [pageNo - 1, pageNo, pageNo + 1].forEach(item => {
                pageHtml += `<a class='${
                    pageNo == item ? " current" : ""
                }' href='${linkTo}${item}'>${item}</a>`;
            });
            pageHtml += `<span>${opts.ellipse_text}</span>`;
            pageHtml += `<a href='${linkTo}${pageTotal}'>${pageTotal}</a>`;
        } else if (pageNo >= pageTotal - 4) {
            if (pageTotal - 4 > 2) {
                pageHtml += `<a href='${linkTo}${1}'>${1}</a>`;
                pageHtml += `<span>${opts.ellipse_text}</span>`;
            }
            for (let i = pageTotal - 4; i <= pageTotal; i++) {
                pageHtml += `<a class='${
                    pageNo == i ? " current" : ""
                }' href='${linkTo}${i}'>${i}</a>`;
            }
        }
    }
    return pageHtml;
};

exports.createPageHtml = createPageHtml;
