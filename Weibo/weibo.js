const textColor = "#ffffff";

// 更新热搜数目
const totalCount = 5;

const apiUrl = `http://api.rosysun.cn/weibo/`;
const request = new Request(apiUrl);
const json = await request.loadString();
const data = JSON.parse(json);

if (data == undefined) {
    return
}

if (config.runsInWidget) {
    let widget = createWidget(data['data']);
    Script.setWidget(widget);
    Script.complete();
} else {
    let widget = createWidget(data['data']);
    await widget.presentMedium();
}

function createWidget(data) {
    const widget = new ListWidget();
    const title = widget.addText('🐳微博热搜🐳')
    title.textSize = 15;
    title.textColor = Color.red();
    title.textOpacity = 0.5;
    const time = widget.addText(currentTime())
    time.textSize = 15;
    time.textColor = Color.yellow();
    time.textOpacity = 0.5;

    widget.addSpacer();
    widget.spacing = 1;

    for (let index = 0; index < totalCount; index++) {
        const element = data[index];
        const title = widget.addText(element['title']);
        title.textColor = new Color(textColor);
        title.font = Font.boldSystemFont(14);
        title.leftAlignText();
    }
    return widget
}

function currentTime() {
    var now = new Date();

    return now.getFullYear() + ":" +
        formatNumber(now.getMonth()) + ":" +
        formatNumber(now.getDate()) + " " +
        formatNumber(now.getHours()) + ":" +
        formatNumber(now.getMinutes()) + ":" +
        formatNumber(now.getSeconds());
}

function formatNumber(param) {
    if (param < 10) {
        return '0' + param
    }

    return param
}