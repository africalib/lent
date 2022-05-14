var cookie = {
    get: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    set: function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
}

//윈도우 height에 target 높이를 맞춤(adjust가능)

function controlHeight($target, adjustMargin) {
    let window_h = window.innerHeight;
    // console.log(window_h);
    let targetOffset_top = $target.offset().top;
    let calcedHeight = window_h - targetOffset_top + (adjustMargin === undefined ? 0 : adjustMargin);
    $target.height(calcedHeight);
}

function chkAll($chkAll, $eachChk) {
    $chkAll.change(function () {
        let $t = $(this);
        let isChk = $t.is(':checked');
        $eachChk.each(function () {
            if ($(this).is(':visible')) {
                $(this).prop('checked', isChk);
            }
        })
    })

    $eachChk.change(function () {
        let isAllChk = true;
        $eachChk.each(function () {
            if ($(this).is(':visible')) {
                if (!$(this).is(':checked')) {
                    isAllChk = false;
                    return false;
                }
            }
        })

        $chkAll.prop('checked', isAllChk);
    })
}

function xmlToObjArr(xml, tagName) {
    let arr = [];
    let tagArr = xml.getElementsByTagName(tagName);
    // console.log(tagArr);
    for (let i = 0; i < tagArr.length; i++) {
        let tmpObj = {};
        for (let j = 0; j < tagArr[i].children.length; j++) {
            tmpObj[tagArr[i].children[j].nodeName] = tagArr[i].children[j].textContent;
        }
        arr.push(tmpObj);
    }

    return arr;
}

function getConstantVowel(kor) {	//한글 분리
    const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
        'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
        'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
        'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
        'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
    const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
        'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
        'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
        'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

    const ga = 44032;
    let uni = kor.charCodeAt(0);

    uni = uni - ga;

    let fn = parseInt(uni / 588);
    let sn = parseInt((uni - (fn * 588)) / 28);
    let tn = parseInt(uni % 28);

    return {
        f: f[fn],
        s: s[sn],
        t: t[tn]
    };
}

function is_hangul_char(ch) {	//한글인지 아닌지
    if (!ch) return false;
    c = ch.charCodeAt(0);
    if (0x1100 <= c && c <= 0x11FF) return true;
    if (0x3130 <= c && c <= 0x318F) return true;
    if (0xAC00 <= c && c <= 0xD7A3) return true;
    return false;
}

function langageIs(str) {
    let pattern_num = /[0-9]/;	// 숫자 
    let pattern_eng = /[a-zA-Z]/;	// 문자 
    let pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
    let pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

    // if( (pattern_num.test(str)) && !(pattern_eng.test(str)) && !(pattern_spc.test(str)) && !(pattern_kor.test(str)) ){
    // return true;
    // }else{
    // alert("숫자만 입력 가능합니다.")
    // return false;
    // }
    if (pattern_num.test(str)) return 'num';
    if (pattern_eng.test(str)) return 'eng';
    if (pattern_spc.test(str)) return 'spc';
    if (pattern_kor.test(str)) return 'kor';
}


function getLJC_v5(str) {	//이재철5표 ex)황순원 -> 황56
    if (!is_hangul_char(str)) return false;
    let rtnVal = str[0];
    let separatedStr = getConstantVowel(str[1]);

    let LJC_v5_cde = {	//초성이 ㅊ이면 +2
        'ㄱ': 1, 'ㄲ': 1, 'ㄴ': 19, 'ㄷ': 2, 'ㄸ': 2, 'ㄹ': 29, 'ㅁ': 3, 'ㅂ': 4, 'ㅃ': 4,
        'ㅅ': 5, 'ㅆ': 5, 'ㅇ': 6, 'ㅈ': 7, 'ㅉ': 7, 'ㅊ': 8, 'ㅋ': 87, 'ㅌ': 88, 'ㅍ': 89, 'ㅎ': 9,
        'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 3, 'ㅓ': 4, 'ㅔ': 4, 'ㅕ': 4, 'ㅖ': 4,
        'ㅗ': 5, 'ㅘ': 5, 'ㅙ': 5, 'ㅚ': 5, 'ㅛ': 5, 'ㅜ': 6, 'ㅝ': 6, 'ㅞ': 6, 'ㅟ': 6, 'ㅠ': 6,
        'ㅡ': 7, 'ㅢ': 7, 'ㅣ': 8,
        'ㅏ2': 2, 'ㅐ2': 2, 'ㅑ2': 2, 'ㅒ2': 2, 'ㅓ2': 3, 'ㅔ2': 3, 'ㅕ2': 3, 'ㅖ2': 3,
        'ㅗ2': 4, 'ㅘ2': 4, 'ㅙ2': 4, 'ㅚ2': 4, 'ㅛ2': 4, 'ㅜ2': 5, 'ㅝ2': 5, 'ㅞ2': 5, 'ㅟ2': 5, 'ㅠ2': 5,
        'ㅡ2': 5, 'ㅢ2': 5, 'ㅣ2': 6
    }

    let secondCde = String(LJC_v5_cde[separatedStr.f]);
    secondCde += secondCde === 8 ? LJC_v5_cde[separatedStr.s + 2] : LJC_v5_cde[separatedStr.s];

    return rtnVal + secondCde;
}

function getCutterTable(str) {	//보류
}

function anyChk($chkBox) {	//하나 이상 체크되어 있으면 true, 하나도 없으면 false
    let anyChk = false;
    $chkBox.each(function () {
        if ($(this).is(':checked')) {
            anyChk = true;
            return false;
        }
    })

    return anyChk;
}

function classNoToClassNm(no) {
    let num = String(no);
    let classTbl = bookClassTable;

    let rtnObj = {};

    rtnObj['classNm'] = classTbl[no[0]][0];
    rtnObj['classDtlNm'] = classTbl[no[0]][no[1]];

    return rtnObj;
}

function getAMonthAgo(date) {	//dateType: yyyy-mm-dd
    let d = new Date(date);
    let aMonthAgo = new Date(d.setMonth(d.getMonth() - 1));
    let yyyymmdd = aMonthAgo.getFullYear() + '-' + make0('', (aMonthAgo.getMonth() + 1), 2) + '-' + make0('', aMonthAgo.getDate(), 2);
    return yyyymmdd;
}

function make0(prefix, code, mx0cnt) {
    let result = prefix;
    let strCode = String(code);
    let strCodeLen = strCode.length;
    let cnt0 = mx0cnt - strCodeLen;

    for (let i = 0; i < cnt0; i++) {
        result += '0';
    }

    result += strCode;

    return result;
}

function vue_paging(dataLen, limitDataCnt, limitPageCnt, pageGroupOffset) {	//보류
    let pageCnt = Math.ceil(dataLen / limitDataCnt);
    let pageGroupCnt = Math.ceil(pageCnt / limitPageCnt);

    return {
        limitDataCnt: limitDataCnt,
        limitPageCnt: limitPageCnt,
        pageCnt: pageCnt,
        pageGroupCnt: pageGroupCnt,
        pageGroupOffset: pageGroupOffset
    }
}

function vue_findChildren(arr, findKwd, viewMsg) {
    let rtnVal;
    let tmpArr = [];
    for (let i in arr) {
        if (arr[i].name == findKwd) {
            rtnVal = arr[i];
            break;
        }
        // tmpArr.concat(arr[i].$children);	//concat is not working

        for (let j in arr[i].$children) {
            tmpArr.push(arr[i].$children[j])
        }
    }

    if (!rtnVal && !tmpArr.length) {
        if (viewMsg === undefined || viewMsg === true) console.warn(findKwd + '를 찾지 못했습니다.');
        return false;
    }


    if (!rtnVal) {
        vue_findChildren(tmpArr, findKwd);
    } else {
        return rtnVal;
    }
}

function chkValid(value, obj) {
    // sampleObj = {
    // num: true/false,	//true/false는 허용을 나타냄
    // en: true/false,
    // ko: true/false,
    // spc: true/false,
    // mxLen: 10,
    // mnLen: 0
    // }
    const ko = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const en = /[a-zA-Z]/;
    const spc = /[~!@#$%^&*()_+|<>?:{}]/;
    const num = /[0-9]/;

    let rtnObj = {
        boolean: true
    };

    for (let key in obj) {
        let isInvalid = false;
        switch (key) {
            case 'ko':
                if (!obj[key] && ko.test(value)) {
                    isInvalid = true;
                    rtnObj.invalidName = 'ko';
                }
                break;
            case 'en':
                if (!obj[key] && en.test(value)) {
                    isInvalid = true;
                    rtnObj.invalidName = 'en';
                }
                break;
            case 'num':
                if (!obj[key] && num.test(value)) {
                    isInvalid = true;
                    rtnObj.invalidName = 'num';
                }
                break;
            case 'spc':
                if (!obj[key] && spc.test(value)) {
                    isInvalid = true;
                    rtnObj.invalidName = 'spc';
                }
                break;
            case 'mxLen':
                if (value.length > obj[key]) {
                    isInvalid = true;
                    rtnObj.invalidName = 'mxLen';
                }
                break;
            case 'mnLen':
                if (value.length < obj[key]) {
                    isInvalid = true;
                    rtnObj.invalidName = 'mnLen';
                }
                break;
        }

        if (isInvalid) {
            rtnObj.boolean = false;
            break;
        }
    }

    return rtnObj;
}