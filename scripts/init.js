// 初始化全局变量
let searchKeyword = '', searchableAbbr = '';

let notificationCount = '';
let visibility = true;

const downloadMirrorUrl = 'https://ghproxy.cn/<T>';

const downloadSVG = '<span class="svg right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="56"></path></svg></span>';
const downloadMirror = ((url) => $('.github-proxy').is(':checked') && String(url).startsWith('https://github.com/') ? downloadMirrorUrl.replace('<T>', url) : url); // 针对大陆地区 | for Chinese Mainland
const downloadClick = (() => $('.download').click(function() {
    $('.start-download a').remove();
    $('.start-download br').after(`<a href="${this.href}">${this.href.split('/').slice(-1)[0]}</a>`);
    $('.start-download').attr('open', true);
}));

// 国际化 (internationalization)
al.setLangPropPath('locales');
al.setDefaultCountry({
    en: 'en',
    zh: 'zh-CN'
});
const i18n = ((callback = () => {}) => {
    al.setLangProp(['zh-CN.yml','en.yml'], () => {
        al.load(void 0, al.mode.HTML, callback);
    }, {url: true, yaml: true});
});


// 不记录历史滚动位置
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
};


// 监听标签页切换事件
$(document).on('visibilitychange', () => {
    if (document.visibilityState == 'hidden') {
        // 当前标签页隐藏时
        visibility = false;
    };
    if (document.visibilityState == 'visible') {
        // 当前标签页显示时
        visibility = true;
    };
});


// 读取 JSON5 文件
const read = ((file) => {
    return JSON5.parse($.ajax({
        url: `data/${file}.json5`,
        dataType: 'json',
        async: false
    }).responseText);
});


// URL哈希属性监听
const hashChanged = (() => {
    if (location.hash == '') return;
    let hash = decodeURI(location.hash).replace('/', '\\/');
    const slicedHash = hash.slice(0, -3);
    // 自动展开/收起：<details> 元素
    try {
        // 通过检测哈希属性
        if (hash == '#全部展开') $('.page-content').find('details:not(.keep)').attr('open', true);
        if (hash == '#全部收起') $('.page-content').find('details:not(.keep)').attr('open', false);
        if (hash.endsWith('-展开')) {
            $(slicedHash).find('details').attr('open', true);
            $(slicedHash).find('.to-fold').show();
            $(slicedHash).find('.to-unfold').hide();
            location.hash = slicedHash;
        };
        if (hash.endsWith('-收起')) {
            $(slicedHash).find('details:not(.keep)').attr('open', false);
            $(slicedHash).find('.to-unfold').show();
            $(slicedHash).find('.to-fold').hide();
            hash = slicedHash;
        };
        // 通过检测 <summary> 元素
        if ($(hash).html().startsWith('<summary>')) $(hash).attr('open', true);
        else $(`${hash}>*:first-child`).addClass('hash');
    } catch {};
});
$(window).on('hashchange', () => {
    $('.hash').removeClass('hash');
    hashChanged();
});


// 启动器数据
const launcherData = read('launcher');
// 各平台启动器数据
const AndroidLauncher = launcherData['AndroidLauncher'];
const iOSLauncher = launcherData['iOSLauncher'];
const WindowsLauncher = launcherData['WindowsLauncher'];
const macOSLauncher = launcherData['macOSLauncher'];
const LinuxLauncher = launcherData['LinuxLauncher'];

// 各类与搜索有关的站点数据
const searchable = read('searchable');

// 各类网站数据
const utilityWebsite = read('utilityWebsite');
const otherForum = read('otherForum');
