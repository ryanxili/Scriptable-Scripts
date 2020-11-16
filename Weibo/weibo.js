// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
const textColor = "#ffffff";

// 更新热搜数目
const totalCount = 5;

const apiUrl = `https://api.oioweb.cn/api/summary.php`;
const request = new Request(apiUrl);
const json = await request.loadString();
const data = JSON.parse(json);

if (data == undefined) {
    return
}

if (config.runsInWidget) {
    let widget = createWidget(data);
    Script.setWidget(widget);
    Script.complete();
} else {
    let widget = createWidget(data);
    await widget.presentMedium();
}

function createWidget(data) {
    const widget = new ListWidget();

    const bgColor = new LinearGradient();
    bgColor.colors = [new Color("#090808"), new Color("#111010")]
    bgColor.locations = [0.0, 1.0];
    widget.backgroundGradient = bgColor;

    var contentStack = widget.addStack();
    contentStack.layoutHorizontally();

    var leftStack = contentStack.addStack()
    layoutLeftStack(leftStack);

    var rightStack = contentStack.addStack()
    layoutRightStack(rightStack);

    return widget
}

function layoutLeftStack(stack) {
    var contentStack = stack.addStack();
    contentStack.layoutVertically();
    const title = contentStack.addText('微博热搜')
    title.font = Font.boldSystemFont(22);;
    title.textColor = new Color('#0983FE');

    const updateTime = contentStack.addText(currentTime());
    updateTime.textSize = 11;
    updateTime.textColor = new Color('FFF9F9');

    let image = contentStack.addImage(readICloudImage('images/weibo/gua.png'));
    image.imageSize = new Size(90, 78);
}

function layoutRightStack(stack) {
    var contentStack = stack.addStack();
    contentStack.layoutVertically();

    for(let index = 0; index < totalCount; index++) {
        const element = data[index];
        let itemStack = contentStack.addStack();
        itemStack.layoutHorizontally();
        itemStack.centerAlignContent();

        let indexImage = itemStack.addImage(readICloudImage('images/weibo/' + (index + 1) + '.png'));
        indexImage.imageSize = new Size(25, 25)

        const itemText = itemStack.addText(element['title']);
        itemText.textColor = new Color(textColor);
        itemText.font = Font.systemFont(12);
        itemText.leftAlignText();

        if (index == 0) {
            itemStack.addSpacer(5)

            let hotImage = itemStack.addImage(readICloudImage('images/weibo/hot.png'));
            hotImage.imageSize = new Size(25, 25);
        } 
    }
}

function readICloudImage(imagePath) {
    var fm = FileManager.iCloud();
    var imageFullPath = fm.documentsDirectory() + '/' + imagePath;
    fm.downloadFileFromiCloud(imageFullPath)
    return fm.readImage(imageFullPath);
}

function currentTime() {
    var now = new Date();

    return formatNumber(now.getHours()) + ":" +
        formatNumber(now.getMinutes()) + ":" +
        formatNumber(now.getSeconds());
}

function formatNumber(param) {
    if (param < 10) {
        return '0' + param
    }

    return param
}