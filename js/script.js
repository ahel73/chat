window.onload = function () {
    queryChat();
}
document.body.addEventListener('click', function (oe) {
    queryDialog(oe)
})



function queryChat() {
    var ajax = new XMLHttpRequest();
    ajax.open('get', 'https://api.mailchat.net/test/chat.get', false);
    ajax.send()
    var arrasyMessages = JSON.parse(ajax.responseText).response.subjects;
    var listMessages = '';
    for (var index in arrasyMessages) {

        var mes = arrasyMessages[index];
        
        time = getTime(mes.message_date);
        var read = mes.message_read ? 'class="icon-blue"' : ''
        listMessages += `
        <article class="preview-post" data-id="${mes.id}">
            <div class="header-prewiew" >
                <h2 class="title">
                    ${mes.title}
                </h2>
                <div class="time">
                    ${time}
                </div>
            </div >
            <p>
                <svg viewBox="0 0 17 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-ok">
                    <path ${read}
                        d="M16.1431 0.151334C16.2337 0.0584846 16.3567 0.00433119 16.4864 0.000226577C16.587 -0.00284044 16.6855 0.025312 16.7702 0.0796638C16.855 0.134 16.9213 0.21272 16.9606 0.305463C16.9998 0.398206 17.0101 0.500654 16.9901 0.599363C16.9702 0.698072 16.9208 0.788435 16.8486 0.858579L9.85623 7.85414C9.76251 7.94769 9.63551 8.00023 9.50311 8.00023C9.37073 8.00023 9.24373 7.94769 9.15001 7.85414L7.18408 5.88731L7.89142 5.17998L9.50661 6.79291L16.1431 0.151334Z"
                        fill="#262626" />
                    <path ${read}
                        d="M10.4863 0.000225642C10.3566 0.00432737 10.2336 0.0584784 10.143 0.15133L3.50652 6.79291L0.859222 4.14929C0.813723 4.10202 0.759364 4.06419 0.699249 4.03794C0.639133 4.01169 0.57444 3.99754 0.508861 3.99631C0.443281 3.99508 0.378101 4.00678 0.317042 4.03074C0.255982 4.05471 0.20024 4.09048 0.152996 4.136C0.105752 4.18152 0.0679325 4.2359 0.0416967 4.29604C0.0154609 4.35619 0.00132213 4.42091 8.84642e-05 4.48652C-0.00240304 4.61902 0.0478207 4.74709 0.13971 4.84255L3.14991 7.85413C3.24364 7.94768 3.37063 8.00023 3.50303 8.00023C3.63542 8.00023 3.76241 7.94768 3.85614 7.85413L10.8485 0.85858C10.9207 0.788431 10.9701 0.698075 10.9901 0.599366C11.01 0.500657 10.9997 0.398208 10.9605 0.305461C10.9213 0.212715 10.8549 0.134004 10.7702 0.0796566C10.6854 0.0253096 10.5869 -0.00283429 10.4863 0.000225642Z"
                        fill="#262626" />
                </svg>                    
                ${mes.message_content}
            </p>
        </article >`;
        document.querySelector('.list-messages').innerHTML = listMessages;
    }    
}

function getTime(seconds) {
    var date = new Date(seconds * 1000);
    var arrayTime = [];
    arrayTime.push('' + date.getHours());
    arrayTime.push('' + date.getMinutes());
    var time = '';
    for (var index2 in arrayTime) {
        var elem = arrayTime[index2]
        elem = (elem.length == 1) ? '0' + elem : elem
        time += elem + ':';
    }
    return time.substring(0, time.length - 1);
}

function queryDialog(oe) {
    var post = oe.target.closest('.preview-post')
    if (!post) return;
    var id = post.dataset.id;
    var ajax = new XMLHttpRequest();
    ajax.open('get', `https://api.mailchat.net/test/message.get?id=${id}`, false);
    ajax.send()
    var arrayDialog = JSON.parse(ajax.responseText).response.messages
    if (!arrayDialog.length) return;
    console.log(arrayDialog);
    var day = '';
    var dialog = '';
    var month = {
        '1': 'января',
        '2': 'февраля',
        '3': 'марта',
        '4': 'апреля',
        '5': 'мая',
        '6': 'июня',
        '7': 'июля',
        '8': 'августа',
        '9': 'сентября',
        '10': 'октября',
        '11': 'ноября',
        '12': 'декабря',
    }
    for (var index in arrayDialog) {
        var mes = arrayDialog[index]
        console.log(mes);
        var dayFor = new Date(mes.date * 1000);
        dayFor = dayFor.getDay() + ' ' + month[dayFor.getMonth()];
        var notYou = mes.you ? '' : 'foreign-message';
        var fio = notYou.length ? '<h4>Сафронов А.</h4>' : '';
        var time = getTime(mes.date)
        // если начало диалога или продолжение диалога но день не соотвествует предыдцущему сообщению
        if ((day != dayFor && !dialog.length) || (day != dayFor && dialog.length)) {
            day = dayFor;
            dialog = dialog.length ? '</div>' : ''; // если диалог не пустой значит надо закрыть блок дня
            dialog += `
                <div class="day-dialog">
                        <h3>
                            ${dayFor}
                        </h3>
                        <div class="line-message ${notYou}">
                            ${fio}
                            <p>
                                <span class="text">
                                    ${mes.content}
                                </span>
                                <span class="time">
                                    ${time}
                                </span>
                            </p>
                        </div>
                `
        }
        // продолжение диалога за тот же день
        else if (day == dayFor && dialog.length) {
            dialog += `
                <div class="line-message ${notYou}">
                    ${fio}
                    <p>
                        <span class="text">
                            ${mes.content}
                        </span>
                        <span class="time">
                            ${time}
                        </span>
                    </p>
                </div>
            `
        }
    }
    dialog += '</div>' // закрываем блок дня в любом случае
    document.querySelector('.dialog').innerHTML = dialog;
}