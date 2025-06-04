
    /***
    * mq_html
    */
    {
        //const quizData =

        // 用户选择记录
        let userChoices = [];
        let currentQuestion = 0;

        // 初始化页面
        function initializePage() {

        const urlParams = new URLSearchParams(window.location.search);
        const titelId = urlParams.get('utm_content');
        const lang = getQueryParam("lang");

        let utm_content_url = "";
        if (lang == "fr") {
        utm_content_url = "./testname/js/fr_title/"
    } else if (lang == "es") {
        utm_content_url = "./testname/js/es_title/"
    } else if (lang == "pt") {
        utm_content_url = "./testname/js/pt_title/"
    } else if (lang == "en") {
        utm_content_url = "./testname/js/en_title/"
    } else {
        utm_content_url = "./testname/js/en_title/"
    }


        loadScript(utm_content_url + titelId + ".js", function () {

        // 设置标题
        document.getElementById('quizTitle').textContent = quizData.title;

        // 设置主图

        quizData.mainPic = quizData.mainPic
        .replace("https://identityinsight.org/testCommon4", "./testname")

        document.getElementById('mainPic').src = quizData.mainPic;
        document.getElementById('mainPic').alt = quizData.title;

        // 设置主题标签
        const themesHtml = quizData.thems.map(theme => `<a href="#">#${theme}</a>`).join('');
        document.getElementById('quizThemes').innerHTML = themesHtml;

        // 生成问题
        renderQuestions();
        const adContainers = document.querySelectorAll('.adsbygoogle');
        adContainers.forEach((adContainer, index) => {
        (adsbygoogle = window.adsbygoogle || []).push({});  // 推送广告

        // 定时检查广告容器是否已加载广告
        const checkAdStatus = setInterval(() => {
        if (adContainer.innerHTML.trim()) {
        //console.log(`广告容器 ${index + 1} 已加载广告`);
        clearInterval(checkAdStatus);  // 停止检查
    } else {
        //console.log(`广告容器 ${index + 1} 尚未加载广告，重新加载`);
        (adsbygoogle = window.adsbygoogle || []).push({});  // 重新推送广告
    }
    }, 10000);  // 每1秒检查一次
    });
    });
    }

        // 渲染问题
        function renderQuestions() {
        const questionsHtml = quizData.questions.map((q, index) => {

        q.pic = q.pic.replace("gif", "png")
        .replace("https://identityinsight.org/testCommon4", "./testname")

        let questionHTML = `
          <div class="newSelectTest-choiceType-pa-gonggong newSelectTest-choiceType-pa video_shot ${index === 0 ? 'chooseingItem' : 'nochooseItem'}">
            <div class="count_number_pa">
              <div class="count_number">
                <span>No.</span>
                <span>${index + 1}</span>
                <span>/${quizData.questions.length}</span>
              </div>
            </div>
            ${index !== 0 ? '<div class="gren grenchangye"></div>' : ''}
            <div class="newSelectTest-item-img">
              <img src="${q.pic}" alt="" loading="lazy"/>
            </div>
            <div class="newSelectTest-item-title">${q.question}</div>
            <div class="quizeselectItem">
              ${q.answers.map((answer, ansIndex) => `
            ${answer.aPic ? `
              <div class="newSelectTest-choiceType imgchoiceItem" data-question="${answer.answer}"
                     data-answer="${answer.aId}">
                <img src="${answer.aPic.replace("https://identityinsight.org/testCommon4", "./testname")}" loading="lazy"/>
                <p>${answer.answer}</p>
                </div>
            ` : `
            <div class="newSelectTest-choiceType"
                     data-question="${answer.answer}"
                     data-answer="${answer.aId}">
                  ${answer.answer}
                </div>`}
              `).join('')}
            </div>
          </div>`

        if (index % 2 != 0 && index != 0) {
        questionHTML = '<div class="advtest">' +
        returnADV_Block()
        + '</div>' + questionHTML
    }
        return questionHTML;
    }).join('');

        const langPage = getQueryParam("lang");
        let submitText = "Submit"

        if (langPage == "fr") {
        submitText = "Soumettre"
    } else if (langPage == "es") {
        submitText = "Enviar"
    } else if (langPage == "pt") {

    } else {
        submitText = "Submit"
    }

        const submitButton = `
          <div id = "thisSubmitButton" class="long_submit_all" style="display: flex; width: 100%;margin:0 auto 0; justify-content: center;line-height: 60px;">
            <div class="longSelectSubmit" style="width:225px;height:60px;font-size:24px;box-sizing:border-box;line-height:60px">`
        + submitText + `</div>
          </div>
        `;

        document.getElementById('longQuizSelect').innerHTML = questionsHtml + submitButton;

        // 绑定事件
        bindEvents();
        //bindEvents2();
    }

        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }

        function encryptBase64(text) {
        return btoa(text);
    }

        function decryptBase64(encodedText) {
        return atob(encodedText);
    }

        function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

        function loadScript(src, callback) {
        let script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.async = true;

        script.onload = function () {
        //console.log(`${src} 加载完成`);
        if (callback) callback(); // 加载完成后执行回调函数
    };

        script.onerror = function () {
        //console.error(`${src} 加载失败`);
    };

        document.head.appendChild(script); // 插入到 `head` 中
    }

        function findMostFrequentElement(arr) {
        if (arr.length === 0) return null; // 处理空数组情况

        const countMap = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

        let maxCount = 0;
        let mostFrequentElement = null;

        for (const key in countMap) {
        if (countMap[key] > maxCount) {
        maxCount = countMap[key];
        mostFrequentElement = key;
    }
    }

        return {element: mostFrequentElement, count: maxCount};
    }

        function bindEvents2() {
        $(".test_start").off('click').on('click', function () {
        const element = document.getElementById('mainPic');

        // 滚动到该元素
        element.scrollIntoView({
        behavior: 'smooth', // 平滑滚动
        block: 'start',     // 将元素定位到视口的顶部
        inline: 'nearest'   // 尽量将元素对齐到视口内
    });
    });
    }

        // 绑定事件处理
        function bindEvents() {
        // 选项点击事件
        $(".newSelectTest-choiceType").off('click').on('click', function () {
        const $this = $(this);
        // const questionIndex = parseInt($this.data('question'));
        const questionIndex = $this.closest('.newSelectTest-choiceType-pa-gonggong')
        .index('.newSelectTest-choiceType-pa-gonggong');
        const answerIndex = parseInt($this.data('answer'));

        // 记录选择
        userChoices[questionIndex] = answerIndex;

        // 更新UI
        $this
        .addClass("longSelectDivTempClasszhengchang")
        .siblings()
        .removeClass("longSelectDivTempClasszhengchang");

        // 处理下一题
        const $currentQuestion = $this.closest('.newSelectTest-choiceType-pa-gonggong');
        const $nextQuestion = $currentQuestion.next('.newSelectTest-choiceType-pa-gonggong');

        const $nextQuestion2 = $currentQuestion.nextAll('.newSelectTest-choiceType-pa-gonggong').eq(0);

        if ($nextQuestion.length) {
        $nextQuestion
        .removeClass("nochooseItem")
        .addClass("chooseingItem")
        .find(".gren")
        .remove();

        // 滚动到下一题
        $("html, body").animate({
        scrollTop: $nextQuestion.offset().top - 90
    }, 500);
    } else if ($nextQuestion2.length) {
        $nextQuestion2
        .removeClass("nochooseItem")
        .addClass("chooseingItem")
        .find(".gren")
        .remove();

        // 滚动到下一题
        $("html, body").animate({
        scrollTop: $nextQuestion2.offset().top - 90
    }, 500);
    }

        if (questionIndex == quizData.questions.length - 1) {
        let mostEl = findMostFrequentElement(userChoices)

        const result = Number(mostEl.element);
        //console.log(result); // { element: '2', count: 4 }

        const enResult = encryptBase64(result)

        localStorage.setItem('result', enResult);
        localStorage.setItem('titleid', quizData.toAnswer);

        let utm_campaign = getQueryParam("utm_campaign");
        let resultHref = "https://identityinsight.org/fr/your-result-fr/";
        const lang = getQueryParam("lang");
        let submitText = "submit"
        if (lang == "fr") {
        resultHref = "./result.html?lang=" + lang;
        submitText = "Soumettre"
    } else if (lang == "es") {
        resultHref = "./result.html?lang=" + lang;
        submitText = "Enviar"
    } else if (lang == "pt") {
        resultHref = "./result.html?lang=" + lang;
        submitText = "Enviar"
    } else if (lang == "en") {
        resultHref = "./result.html?lang=" + lang;
        submitText = "Submit"
    } else {
        resultHref = "./result.html?lang=" + lang
        submitText = "Submit"
    }

        if (!isNull(utm_campaign)) {
        resultHref = resultHref + "&utm_campaign=" + utm_campaign;
    }

        document.getElementById("thisSubmitButton").innerHTML =
        //'<a href = "https://identityinsight.org/fr/your-result-2/?result=' + enResult + '&titleid=' + quizData.toAnswer+'">'+
        `<a href = "${resultHref}">` +
        `<div class="longSelectSubmit" style="width:225px;height:60px;font-size:24px;box-sizing:border-box;line-height:60px">${submitText}</div>
        </a>`;
    }

    });

        // 提交按钮点击事件
        $(".longSelectSubmit").on('click', function () {
        if (userChoices.length < quizData.questions.length) {
        alert("Please answer all questions first!");
        return;
    }
    });

        function isNull(value) {
        return value === null;
    }
    }


        // 页面加载完成后初始化
        $(document).ready(function () {
        initializePage();
    });
    }

    /***
    * mt_html
    */
    {

        function isNull(value) {
            return value === null;
        }

        // 渲染首页数据
        function renderHomeData(data) {
        return data.map((item,index) => {

        let utm_campaign =getQueryParam("utm_campaign") ;

        item.url = item.url.replace("https://identityinsight.org/es/test-page_es/?","./mqqht.html?lang=es&")
        .replace("https://identityinsight.org/en/test-page_en/?","./mqqht.html?lang=en&")
        .replace("https://identityinsight.org/fr/test-page_fr/?","./mqqht.html?lang=fr&")
        .replace("https://identityinsight.org/pt/test-page_pt/?","./mqqht.html?lang=pt&")

        if(item.url == "#"){
        let langPage = getQueryParam("lang")
        if(langPage == "fr"){
        item.url = "./404notFound.html?lang=fr&utm_content=other"
    }else if(langPage == "es"){
        item.url = "./404notFound.html?lang=es&utm_content=other"
    }else if(langPage == "en"){
        item.url = "./404notFound.html?lang=en&utm_content=other"
    }else if(langPage == "pt"){
        item.url = "./404notFound.html?lang=pt&utm_content=other"
    }else{
        item.url = "./404notFound.html?lang=fr&utm_content=other"
    }
        if (!isNull(utm_campaign)){
        item.url = item.url + "&utm_campaign=" + utm_campaign
    }
    }else if (!isNull(utm_campaign)){
        item.url = item.url + "&utm_campaign=" + utm_campaign
    }

        item.url = item.url.replace("titleid","utm_content")
        item.pic = item.pic
        .replace("https://identityinsight.org/testCommon4","./testname").replace("gif","png")

        let moHtml = `
                <a href="${item.url}" class="container-list-item common_list_a">
                    <div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">
                        <div class="container-list-item-img">
                            <img class="lazyimg common_three_li_img"
                                data-language="en"
                                data-src="${item.pic}"
                                src="${item.pic}"
                                alt="${item.title}" loading="lazy">
                        </div>
                        <div class="container-list-item-p"  style="height: 80px">
                            <p>${item.title}</p>
                        </div>
                    </div>
                </a>
                `

        if(index == 0){
        moHtml = '<div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">' +
        returnMTADV() +
        '</div>' + moHtml
    }

        return moHtml;
    }).join('');
    }

        function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

        function initTitleMT(){
        let langPage = getQueryParam("lang")
        if(langPage=="fr"){
        document.getElementById("titleForRecMT").innerText="Les plus testés";
        //console.log("fr");
    }else if(langPage == "es"){
        document.getElementById("titleForRecMT").innerText="Más completado";
        //console.log("es");
    }else if(langPage == "pt"){
        document.getElementById("titleForRecMT").innerText="mais testado";
        //console.log("pt");
    }else{
        document.getElementById("titleForRecMT").innerText="Most Tested";
        //console.log("en");
    }
    }

        function updatePageHeight() {
        const viewportHeight = window.innerHeight; // 可视区域高度
        const pageHeight = document.documentElement.scrollHeight; // 整个页面高度

        output.innerHTML = `可视区域高度: ${viewportHeight}px<br>页面总高度: ${pageHeight}px`;
    }

        function loadScript(src, callback) {
        let script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.async = true;

        script.onload = function () {
        //console.log(`${src} 加载完成`);
        if (callback) callback(); // 加载完成后执行回调函数
    };

        script.onerror = function () {
        //console.error(`${src} 加载失败`);
    };

        document.head.appendChild(script); // 插入到 `head` 中
    }

        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }

        function updatePageHeight() {
        if(window.innerWidth > 500){
        const div = document.getElementById('this_mt_right');
        const divheight = div.offsetHeight;
        let totalHeight = 0;
        const qtq = document.querySelector('.quiz_test-question')
        const rq = document.querySelector('.recommend-quizzes')
        try{
        totalHeight = qtq.offsetHeight + rq.offsetHeight
    }catch (ex){
        totalHeight = 0
    }

        const pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        document.getElementById('adv_sticky').style.height = (totalHeight - divheight) + 'px';
        //console.log('sticky高度:', document.getElementById('adv_sticky').offsetHeight);
    }

    }

        function initHomeDataForMo() {
        // 渲染首页数据
        document.querySelector('.tested').innerHTML = renderHomeData(dataM.tested);
    }
        // 页面加载完成后初始化
        $(document).ready(function () {

        if(window.innerWidth < 500){
        document.getElementById('adv_sticky').innerHTML = ''
        document.getElementById('adv_sticky').style.height = '0px'
    }else{
        document.getElementById('RightBottom_adbox').innerHTML = returnZhongxiangGuding();
    }


        initTitleMT();

        // 监听窗口的resize事件，页面尺寸变化时触发
        //window.addEventListener('resize', updatePageHeight);

        // 监听滚动条的scroll事件，滚动时触发
        window.addEventListener('scroll', updatePageHeight);

        // 初始获取页面高度
        updatePageHeight();

        let mt_data_url = ""

        let langPage = getQueryParam("lang")
        if(langPage == "fr"){
        mt_data_url = "./testname/js/fr_most_test_data/Most Tested.js";
    }else if(langPage == "pt"){
        mt_data_url = "./testname/js/pt_most_test_data/Most Tested.js";
    }else if(langPage == "es"){
        mt_data_url = "./testname/js/es_most_test_data/Most Tested.js";
    }else if(langPage == "en"){
        mt_data_url = "./testname/js/en_most_test_data/Most Tested.js";
    }else{
        mt_data_url = "./testname/js/en_most_test_data/Most Tested.js"
    }



        loadScript(mt_data_url, function () {
        // 初始化数据
        initHomeDataForMo();
        const adContainers = document.querySelectorAll('.adsbygoogle');
        adContainers.forEach((adContainer, index) => {
        (adsbygoogle = window.adsbygoogle || []).push({});  // 推送广告

        // 定时检查广告容器是否已加载广告
        const checkAdStatus = setInterval(() => {
        if (adContainer.innerHTML.trim()) {
        //console.log(`广告容器 ${index + 1} 已加载广告`);
        clearInterval(checkAdStatus);  // 停止检查
    } else {
        //console.log(`广告容器 ${index + 1} 尚未加载广告，重新加载`);
        (adsbygoogle = window.adsbygoogle || []).push({});  // 重新推送广告
    }
    }, 10000);  // 每1秒检查一次
    });
    });
    });

        function returnMTADV(){
        let advHtml = returnADV_Block();
        return advHtml;
    }
    }

    /***
    * rc_html
    */
    {
        // 渲染首页数据
        function renderHomeDataForRQ(data) {
            return data.map((item,index) => {

                let utm_campaign =getQueryParam("utm_campaign") ;

                item.url = item.url.replace("https://identityinsight.org/es/test-page_es/?","./mqqht.html?lang=es&")
                    .replace("https://identityinsight.org/en/test-page_en/?","./mqqht.html?lang=en&")
                    .replace("https://identityinsight.org/fr/test-page_fr/?","./mqqht.html?lang=fr&")
                    .replace("https://identityinsight.org/pt/test-page_pt/?","./mqqht.html?lang=pt&")

                if(item.url == "#"){
                    let langPage = getQueryParam("lang")
                    if(langPage == "fr"){
                        item.url = "./404notFound.html?lang=fr&utm_content=other"
                    }else if(langPage == "es"){
                        item.url = "./404notFound.html?lang=es&utm_content=other"
                    }else if(langPage == "en"){
                        item.url = "./404notFound.html?lang=en&utm_content=other"
                    }else if(langPage == "pt"){
                        item.url = "./404notFound.html?lang=pt&utm_content=other"
                    }else{
                        item.url = "./404notFound.html?lang=fr&utm_content=other"
                    }
                    if (!isNull(utm_campaign)){
                        item.url = item.url + "&utm_campaign=" + utm_campaign
                    }
                }else if (!isNull(utm_campaign)){
                    item.url = item.url + "&utm_campaign=" + utm_campaign
                }


                item.url = item.url.replace("titleid","utm_content")
                item.pic = item.pic
                    .replace("https://identityinsight.org/testCommon4","./testname").replace("gif","png")

                let recHtml = `
                <a href="${item.url}" class="container-list-item common_list_a">
                    <div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">
                        <div class="container-list-item-img">
                            <img class="lazyimg common_three_li_img"
                                data-language="en"
                                data-src="${item.pic}"
                                src="${item.pic}"
                                alt="${item.title}" loading="lazy">
                        </div>
                        <div class="container-list-item-p" style="height: 80px">
                            <p>${item.title}</p>
                        </div>
                    </div>
                </a>
                `

                if(index == 0){
                    recHtml = ' <div class="container-list-item-warp" style="transition-duration: 0.3s; transform: scale(1);">' +
                        returnRQADV()+
                        '</div>' + recHtml
                }

                return recHtml;
            }).join('');
        }

        function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

        function loadScript(src, callback) {
        let script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.async = true;

        script.onload = function () {
        //console.log(`${src} 加载完成`);
        if (callback) callback(); // 加载完成后执行回调函数
    };

        script.onerror = function () {
        //console.error(`${src} 加载失败`);
    }

        document.head.appendChild(script); // 插入到 `head` 中
    }

        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }

        function initTitle(){
        let langPage = getQueryParam("lang")
        if(langPage=="fr"){
        document.getElementById("titleForRec").innerText="Quizs Recommandés"
    }else if(langPage == "es"){
        document.getElementById("titleForRec").innerText="RECOMIENDA TOMAR"
    }else if(langPage == "pt"){
        document.getElementById("titleForRecMT").innerText="RECOMENDAR QUIZZES";
    }else{
        document.getElementById("titleForRec").innerText="RECOMMEND QUIZZES "
    }
    }

        function initHomeDataForRQ() {
        // 渲染首页数据
        initTitle();
        document.querySelector('.recommend').innerHTML = renderHomeDataForRQ(dataR.recommend);
    }
        // 页面加载完成后初始化

        $(document).ready( function () {
        // 初始化数据
        let langPage = getQueryParam("lang")

        let rq_data_url = "https://min1-b8s.pages.dev/public/js/fr_recommend/recommend quizzes.js"
        if(langPage == "fr"){
        rq_data_url = "./testname/js/fr_recommend/recommend quizzes.js"
    }else if(langPage == "pt"){
        rq_data_url = "./testname/js/pt_recommend/recommend quizzes.js"
    }else if(langPage == "en"){
        rq_data_url = "./testname/js/en_recommend/recommend quizzes.js"
    }else if(langPage == "es"){
        rq_data_url = "./testname/js/es_recommend/recommend quizzes.js"
    }else{
        rq_data_url = "./testname/js/en_recommend/recommend quizzes.js"
    }


        loadScript(rq_data_url, function () {
        // 初始化数据
        initHomeDataForRQ();
        const adContainers = document.querySelectorAll('.adsbygoogle');
        adContainers.forEach((adContainer, index) => {
        (adsbygoogle = window.adsbygoogle || []).push({});  // 推送广告

        // 定时检查广告容器是否已加载广告
        const checkAdStatus = setInterval(() => {
        if (adContainer.innerHTML.trim()) {
        //console.log(`广告容器 ${index + 1} 已加载广告`);
        clearInterval(checkAdStatus);  // 停止检查
    } else {
        //console.log(`广告容器 ${index + 1} 尚未加载广告，重新加载`);
        (adsbygoogle = window.adsbygoogle || []).push({});  // 重新推送广告
    }
    }, 10000);  // 每1秒检查一次
    });
    });
    });

        function returnRQADV(){
        let advHtml = returnADV_Block();
        return advHtml;
    }

        function isNull(value) {
        return value === null;
    }
    }

    /***
    * top_html
    */
    {
        function getQueryParam(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        function bindEvents2() {
        $(".test_start").off('click').on('click', function () {
        const element = document.getElementById('mainPic');
        // 滚动到该元素
        element.scrollIntoView({
        behavior: 'smooth', // 平滑滚动
        block: 'start',     // 将元素定位到视口的顶部
        inline: 'nearest'   // 尽量将元素对齐到视口内
    });
        console.log("start")
    });
    }

        $(document).ready(function () {
        let lang = getQueryParam("lang")
        let letgoText = "";

        if(lang == "fr"){
        letgoText = "C’est parti"
    }else if(lang == "es"){
        letgoText = "Vamos a empezar"
    }else if(lang == "pt"){
        letgoText = "Vamos começar"
    }else if(lang == "en"){
        letgoText = "Let's Start"
    }else{
        letgoText = "Let's Start OP"
    }

        document.getElementById("start_button_text").innerText = letgoText;
        bindEvents2();
        //console.log("start");
        (adsbygoogle = window.adsbygoogle || []).push({});
    });

        function getLangFromPath() {
        const pathSegments = window.location.pathname.split("/");
        return pathSegments[1] || "default"; // 语言通常是路径的第一部分
    }
    }

    /***
    * header_pic_js
    */
    {

        function getLangFromPath() {
            const pathSegments = window.location.pathname.split("/");
            return pathSegments[1] || "default"; // 语言通常是路径的第一部分
        }

        function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

        function isNull(value) {
        return value === null;
    }

        $(document).ready(function () {

        let langPage = getQueryParam("lang")

        let utm_campaign =getQueryParam("utm_campaign") ;

        let indexHref = ""
        let home_str = ""

        if(langPage == "fr"){
        home_str = "Acceuil"
        indexHref = "./list.html?lang=fr"
    }else if(langPage == "es"){
        home_str = "Inicio"
        indexHref = "./list.html?lang=es"
    }else if(langPage == "en"){
        home_str = "Home"
        indexHref = "./list.html?lang=en"
    }else if(langPage == "pt"){
        home_str = "Início"
        indexHref = "./list.html?lang=pt"
    }else{
        home_str = "FGU"
        indexHref = "./list.html?lang=fr"
    }

        if(!isNull(utm_campaign)){
        indexHref = indexHref + "&utm_campaign=" +utm_campaign;
    }

        document.getElementById("menu_index_select").innerText = home_str
        document.getElementById("menu_index_select").href=indexHref
        document.getElementById("picForUrlJump").href=indexHref

    });
    }

    /***
    *
    */
    {
        function getQueryParam(name) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        $(document).ready(function () {
        let langPage = getQueryParam("lang")

        let utm_campaign =getQueryParam("utm_campaign") ;

        let aboutus_href = "./about_us.html"
        let privacy_href = "./privacy.html"
        let data_href = "./data.html"

        if(langPage == "fr"){
        aboutus_href = aboutus_href + "?lang=fr"
        privacy_href = privacy_href + "?lang=fr"
        data_href = data_href + "?lang=fr"
    }else if(langPage == "es"){
        aboutus_href = aboutus_href + "?lang=es"
        privacy_href = privacy_href + "?lang=es"
        data_href = data_href + "?lang=es"
    }else if(langPage == "en"){
        aboutus_href = aboutus_href + "?lang=en"
        privacy_href = privacy_href + "?lang=en"
        data_href = data_href + "?lang=en"
    }else if(langPage == "pt"){
        aboutus_href = aboutus_href + "?lang=pt"
        privacy_href = privacy_href + "?lang=pt"
        data_href = data_href + "?lang=pt"
    }else{
        aboutus_href = aboutus_href + "?lang=fr"
        privacy_href = privacy_href + "?lang=fr"
        data_href = data_href + "?lang=fr"
    }

        if(!isNull(utm_campaign)){
        aboutus_href = aboutus_href + "&utm_campaign=" +utm_campaign;
        privacy_href = privacy_href + "&utm_campaign=" +utm_campaign;
        data_href = data_href + "&utm_campaign=" +utm_campaign;
    }

        document.getElementById("abount_us_link").href = aboutus_href
        document.getElementById("privacy_link").href=privacy_href
        document.getElementById("data_link").href=data_href


    });
    }

    /***
    *
    */
    {
        $(document).ready(function () {
            document.getElementById("top_adv_public").innerHTML = return_adv();
            document.getElementById("bot_adv_public").innerHTML = return_adv();

            const adContainers = document.querySelectorAll('.adsbygoogle');
            adContainers.forEach((adContainer, index) => {
                (adsbygoogle = window.adsbygoogle || []).push({});  // 推送广告

                // 定时检查广告容器是否已加载广告
                const checkAdStatus = setInterval(() => {
                    if (adContainer.innerHTML.trim()) {
                        //console.log(`广告容器 ${index + 1} 已加载广告`);
                        clearInterval(checkAdStatus);  // 停止检查
                    } else {
                        //console.log(`广告容器 ${index + 1} 尚未加载广告，重新加载`);
                        (adsbygoogle = window.adsbygoogle || []).push({});  // 重新推送广告
                    }
                }, 10000);  // 每1秒检查一次
            });
        });

        function return_adv(){
        let advMqqnlHtml = returnADV_Block();
        return advMqqnlHtml;
    }
    }