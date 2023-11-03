(function () {
	'use strict';
    
    $(document).ready(() => {
        $('head').append('<link rel="stylesheet" href="https://moonlightperson.github.io/fa-6-pro/css/all.css">');
        $('head').append('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet');
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
        $('.fr-toolbar.fr-ltr.fr-desktop.fr-top.fr-basic').prepend('<button id="xf-preview-shilkin" type="button" class="button rippleButton" data-xf-click="preview-click"><span class="button-text"></span></button>');
        $('.message-editorWrapper').append('<div id="select_prefix" class="xf-select-prefix"></div');
        
        addButton('Выбрать ответ', 'selectAnswer');
        MenuButtons.forEach((btn) => {
            addMenuButton(btn.title, btn.id);
            $('button#'+btn.id).click(() => editThreadData(btn.prefix_id, btn.openedThread ?? "1", btn.sticky ?? "0"));
        });
    
        const threadData = getThreadData();
        
        $(`button#selectAnswer`).click(() => {
            XF.alert(
                buttonsMarkup(buttons), 
                null, 
                `Мой господин, царь и бог <font color="${system.user.color}"><b>${system.user.name}</b></font>, выберите ответ:`
            );
            buttons.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData));
            });
        });
    });
  
    function addButton(name, id) {
        $('.button--icon--reply').after(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }
    
    function addMenuButton(name, id) {
        $('#select_prefix').append(
            `<button type="button" class="button--link js-attachmentUpload button button--icon button--icon--attach menuButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }
  
    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
        .map(
            (btn, i) =>
                `<button type="button" id="answers-${i}" class="button--primary button ` +
                `rippleButton ${btn.separator || 'panelButton'}" style="border-color:${btn.color}"><span class="button-text">${btn.title}</span></button>`,
        )
        .join('')}</div>`;
    }
    
    function pasteContent(id, data = {}) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
    }
  
    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('.message-threadStarterPost')[0].attributes['data-author'].nodeValue;
        const date = new Date();
        const hours = date.getHours();
	    
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            time: {
                utc: `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`,
                local: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            },
            date: {
                utc: `${date.getUTCDate()}.${date.getUTCMonth()}.${date.getUTCFullYear()}`,
                local: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
            },
            greeting: () =>
            4 < hours && hours <= 11
                ? 'Доброе утро'
                : 11 < hours && hours <= 15
                ? 'Добрый день'
                : 15 < hours && hours <= 21
                ? 'Добрый вечер'
                : 'Доброй ночи',
        };
    }

    function editThreadData(prefix, opened = "1", pinned = "0") {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
    
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                discussion_open: opened,
                sticky: pinned,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
  
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();

// =InfoScript==
// @name         Auto-responses
// @namespace    https://vk.com/1j343
// @version      2.0
// @description  Tools for XenForo forums
// @author       Tumyr Zybkov

'use strict';

const system = {
    user: {
        color: "#db1616",
        name: "zybkovboss"
    },
    
    prefixes: {
        remove: 0,
        wajno: 1,
        rules: 9,
        narasspec: 12,
        narasga: 20,
        naras: 3,
        ras: 7,
        info: 2,
        obrab: 15,
        otcaz: 10,
        arena: 4,
        otchet: 13,
        superinfo: 14,
        obsujdenie: 19,
        obrabotan: 21,
        naobrabotke: 15
    },

    separators: {
        "type-one": "panelSeparator-typeone",
        "type-two": "panelSeparator-typetwo",
        "type-three": "panelSeparator-typethree",
    }
}

const buttons = [
	    {
        title: 'Приветствие',
        content: 'приветствую, {{user.mention}}!<br>закрыто.',
        color: "Turquoise",
        
    },
    {
        title: 'Жалоба на рассмотрении',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}},  {{user.id}}!<br>жалоба на [COLOR=rgb(53, 159, 73)][B]рассмотрении[B][/COLOR].[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Ожидаем ответ от адм',
        content: '[B][CENTER][SIZE=3][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>ожидайте ответ от [COLOR=rgb(53, 159, 73)][B]администратора[B][/COLOR] в течении [COLOR=rgb(53, 159, 73)][B]24-х[B][/COLOR] часов.<br>помните, если ваше нарушение подтвердится, то мы в праве [COLOR=rgb(53, 159, 73)][B]удвоить[B][/COLOR] наказание или выдать [COLOR=rgb(53, 159, 73)][B]блокировку[B][/COLOR].[/CENTER][B]',
        color: "Turquoise",
    },
    {
        title: 'Ожидаем ответ от ФД',
        content: '[B][CENTER][SIZE=3][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>передал жалобу [COLOR=rgb(53, 159, 73)][B]администратору[B][/COLOR].[/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Передам кр. администрации',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>передал жалобу [COLOR=rgb(255, 0, 0)]кр. администрации[/COLOR].[/FONT][/CENTER][/SIZE][/B][SIZE=3][CENTER]',
        color: "Turquoise",
    },
    {
        title: 'Наказание выдано верно',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>наказание выдано [COLOR=rgb(53, 159, 73)][B]верно[B][/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Ответ выше',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>ответ от [COLOR=rgb(53, 159, 73)][B]администратора[B][/COLOR] выше.<br>закрыто.[/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Не заметил нарушений',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>нарушений от [COLOR=rgb(53, 159, 73)][B]администратора[B][/COLOR] не заметил.<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Жалоба отозвана',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>жалоба отозвана по вашей[COLOR=rgb(53, 159, 73)][B] инициативе[B][/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Не по форме',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>жалоба составлена не по [COLOR=rgb(53, 159, 73)][B] форме[B][/COLOR].<br>пересоздайте жалобу с нужными [COLOR=rgb(53, 159, 73)][B]требованиями[B][/COLOR] подачи.<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Наказание аннулировано',
        content: '[SIZE=3][B][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>[/FONT][SIZE=3][FONT=trebuchet ms]наказание [COLOR=rgb(53, 159, 73)][B]аннулировано[/B][/COLOR][B][B].[/B][/B]<br>закрыто.[/FONT][/SIZE][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Наказание будет аннулировано',
        content: '[SIZE=3][B][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>[/FONT][SIZE=3][FONT=trebuchet ms]наказание будет [COLOR=rgb(53, 159, 73)][B]аннулировано[/B][/COLOR][B][B].[/B][/B]<br>закрыто.[/FONT][/SIZE][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Администратор снят',
        content: '[SIZE=3][B][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>[/FONT][SIZE=3][FONT=trebuchet ms]наказание будет [COLOR=rgb(53, 159, 73)][B]аннулировано[/B][/COLOR] в течении[B][B] [COLOR=rgb(53, 159, 73)][B]5-20[/B][/COLOR] [/B][/B]минут.<br>закрыто.[/FONT][/SIZE][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Администратор будет снят',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>администратор будет [COLOR=rgb(53, 159, 73)][B]снят[B][/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    { 
        title: 'Адм снят, наказание будет анул',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>администратор [COLOR=rgb(53, 159, 73)][B]снят[B][/COLOR], наказание будет [COLOR=rgb(53, 159, 73)][B]аннулировано[B][/COLOR] в течении [COLOR=rgb(53, 159, 73)][B]20[B][/COLOR] минут.<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Администратор уже снят',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>администратор уже [COLOR=rgb(53, 159, 73)][B]снят[B][/COLOR], наказание будет [COLOR=rgb(53, 159, 73)][B]аннулировано[B][/COLOR] в течении [COLOR=rgb(53, 159, 73)][B]5-20[B][/COLOR] минут.<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Администратор будет наказан',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>администратор будет [COLOR=rgb(53, 159, 73)][B]наказан[B][/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Проведу беседу с адм',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>проведу беседу с [COLOR=rgb(53, 159, 73)][B]администратором[B][/COLOR], при повторных [COLOR=rgb(53, 159, 73)]нарушениях[/COLOR] он будет [COLOR=rgb(53, 159, 73)]наказан[/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Выдано по форме от админа',
        content: '[COLOR=rgb(255, 255, 255)][FONT=trebuchet ms][B]Доброго времени суток.[/B][/FONT][/COLOR]<br>[COLOR=rgb(65, 168, 95)][B][FONT=trebuchet ms]Наказание выдано по форме от администратора младшего уровня.[/FONT][/B][/COLOR]<br>[COLOR=rgb(255, 255, 255)][B][FONT=trebuchet ms]Выделяю [/FONT][/B][/COLOR][COLOR=rgb(65, 168, 95)][B][FONT=trebuchet ms]24-х [/FONT][/B][/COLOR][COLOR=rgb(255, 255, 255)][B][FONT=trebuchet ms]часа на предоставления опровержения на ваше нарушение с момента моего ответа.[/FONT]<br>[FONT=trebuchet ms]В случае истекающего времени [/FONT][/B][/COLOR][COLOR=rgb(65, 168, 95)][B][FONT=trebuchet ms]наказание будет аннулировано[/FONT][/B][/COLOR][COLOR=rgb(255, 255, 255)][B][FONT=trebuchet ms], [/FONT][/B][/COLOR][COLOR=rgb(65, 168, 95)][B][FONT=trebuchet ms]а администратор наказан[/FONT][/B][/COLOR][COLOR=rgb(255, 255, 255)][B][FONT=trebuchet ms].[/FONT]<br>[FONT=trebuchet ms]На данный момент жалоба находится [/FONT][/B][/COLOR][COLOR=rgb(65, 168, 95)][B][FONT=trebuchet ms]на рассмотрении[/FONT][/B][/COLOR][COLOR=rgb(255, 255, 255)][FONT=trebuchet ms][B]![/B][/FONT][/COLOR]',
        color: "Turquoise",
    },
    {
        title: 'Бан ФА',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>выдам блокировку [COLOR=rgb(53, 159, 73)][B]форумного аккаунта[B][/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Админ не предоставил док-в',
        content: '[COLOR=rgb(255, 255, 255)][FONT=trebuchet ms][B]Доброго времени суток.[/B][/FONT]<br>[B][FONT=trebuchet ms]Опровержение от администратора так и не дошло до жалобы. [/FONT][/B][/COLOR]<br>[COLOR=rgb(65, 168, 95)][B][FONT=trebuchet ms]Наказание будет аннулировано[/FONT][/B][/COLOR][COLOR=rgb(255, 255, 255)][B][FONT=trebuchet ms], [/FONT][/B][/COLOR][COLOR=rgb(65, 168, 95)][B][FONT=trebuchet ms]а администратор наказан[/FONT][/B][/COLOR][COLOR=rgb(255, 255, 255)][B][FONT=trebuchet ms].[/FONT][/B][/COLOR]<br>[FONT=trebuchet ms][COLOR=rgb(255, 255, 255)][B]Закрыто, приятной игры![/B][/COLOR][/FONT]',
        color: "Turquoise",
    },
    {
        title: 'Опровержение',
        color: "#ffff00",
        separator: "type-four",
    },
    {
        title: 'На рассмотрении',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>опровержение на [COLOR=rgb(53, 159, 73)][B]рассмотрении[/B].[/COLOR][/CENTER]',
        color: "Turquoise",
    },
    {
        title: 'Опровержение принято',
        content: '[B][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>[/FONT][SIZE=3][FONT=trebuchet ms]опровержение [COLOR=rgb(53, 159, 73)][B]принято[/B][/COLOR].<br>закрыто.[/FONT][/SIZE][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Ожидание обработки',
        content: '[B][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>[/FONT][SIZE=3][FONT=trebuchet ms]ожидаю обработку [COLOR=rgb(53, 159, 73)][B]опровержения[/B][/COLOR].[/FONT][/SIZE][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Опровержение недоступно',
        content: '[B][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>[/FONT][SIZE=3][FONT=trebuchet ms]опровержение [COLOR=rgb(53, 159, 73)][B]недоступно[/B][/COLOR], откройте доступ к [COLOR=rgb(53, 159, 73)][B]видеоролику[/B][/COLOR].<br>закрыто.[/FONT][/SIZE][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Не по форме',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>пересоздайте опровержение по инструкции ниже.<br><br>[B][COLOR=rgb(53, 159, 73)]форма для заявления на проверку опровержения[/COLOR]:<br><br>[/B][/FONT][B][FONT=trebuchet ms][COLOR=rgb(53, 159, 73)]заголовок темы[/COLOR]:<br>[COLOR=rgb(209, 213, 216)]Подача опровержения от Nick_Name: ID словленного имущества[/COLOR][COLOR=rgb(53, 159, 73)]<br>содержимое темы[/COLOR]:<br>[COLOR=rgb(209, 213, 216)]Ваш игровой ник: "текст"<br>Игровой ник Администратора: "текст"<br>ID дома/бизнеса, который был пойман (На транспорт прочерк): "id"<br>Опровержение (видео с /time): "текст"<br>Скриншот Выдачи наказания.:<br>Дата число,месяц,год.(выдачи наказания):<br>[/COLOR][COLOR=rgb(53, 159, 73)]требования для подачи[/COLOR]:<br>[COLOR=rgb(209, 213, 216)]при подаче темы быть полностью адекватным (никакой нецензурной лексики, оскорблений,нецензурных смайлов и.т.д);<br>терпеливо ждать ответа от модератора раздела;<br>видеозапись хорошего качества (080p+);<br>не обязательно,но желательно иметь опру со звуком клавиатуры на ловлю дома;<br>опровержение на ловлю недвижимости должно начинаться до наступления payday;<br>опровержение на ловлю авто должно начинаться до начала посадки в авто.<br>опровержение должно храниться в течение 5 дней.<br>[/COLOR][COLOR=rgb(53, 159, 73)]заявка не будет рассмотрена, если[/COLOR]:<br>[COLOR=rgb(209, 213, 216)]заявка составлена не по форме;<br>нарушены требования для подачи;<br>отсутствуют необходимые доказательства;<br>доказательства обрезаны либо отредактированы;<br>на док-вах присутствуют посторонние программы, которые запрещены правилами сервера;<br>истек срок нарушения (5 реальных дней,от выдачи наказания);<br>в заявке используется нецензурная лексика, оскорбления;<br>в теме присутствует "тролинг" "унижение" администратора/игрока;<br>в теме присутствует опрос;<br>[/COLOR][COLOR=rgb(53, 159, 73)]в данном разделе запрещено (карается блокировкой форумного аккаунта)[/COLOR]:<br>[COLOR=rgb(209, 213, 216)]оффтоп;<br>поднятие тем (сообщения по типу up,поднял и т.п);<br>флуд;<br>оскорбления;<br>[/COLOR][COLOR=rgb(53, 159, 73)]видеохостинг[/COLOR]:<br>[/FONT][/B][FONT=trebuchet ms][B]www.youtube.com[/B][/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Опр не принято (Нету /id)',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>опровержение [COLOR=rgb(53, 159, 73)][B]не принято[/B][/COLOR], не пробили [COLOR=rgb(53, 159, 73)][B]/id[/B][/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Опр не принято (Нету TAB)',
        content: '[B][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>[/FONT][SIZE=3][FONT=trebuchet ms]опровержение [COLOR=rgb(53, 159, 73)][B]не принято[/B][/COLOR], не пробили [COLOR=rgb(53, 159, 73)][B]TAB[/B][/COLOR].<br>закрыто.[/FONT][/SIZE][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Опр не принято (Нету /time)',
        content: '[B][SIZE=3][CENTER][FONT=trebuchet ms]{{greeting}}, {{user.mention}}!<br>опровержение [COLOR=rgb(53, 159, 73)][B]не принято[/B][/COLOR], не пробили [COLOR=rgb(53, 159, 73)][B]/time[/B][/COLOR].<br>закрыто.[/FONT][/CENTER][/B]',
        color: "Turquoise",
    },
    {
        title: 'Технический Раздел',
        color: "#00ffff",
        separator: "type-four",
    },
    {
        title: 'Восстановление предметов',
        content: '[B][SIZE=3][FONT=trebuchet ms][CENTER]{{greeting}}, {{user.mention}}!<br>ожидаю в игре для [COLOR=rgb(53, 159, 73)]выдачи предметов[/COLOR].<br>закрыто.[/B]',
        color: "Turquoise",
    },
    {
        title: 'Восстановление аккаунта',
        content: '[B][SIZE=3][FONT=trebuchet ms][CENTER]{{greeting}}, {{user.mention}}!<br>[SIZE=3][FONT=trebuchet ms][CENTER]для восстановления доступа к [COLOR=rgb(53, 159, 73)]аккаунту[/COLOR], отпишите в вк - [COLOR=rgb(53, 159, 73)]@osnova_arena[/COLOR].<br>[SIZE=3][FONT=trebuchet ms][CENTER]закрыто.[/B]',
        color: "Turquoise",
    },
    {
        title: 'Отказано в восстановлении',
        content: '[B][SIZE=3][FONT=trebuchet ms][CENTER]{{greeting}}, {{user.mention}}!<br>[SIZE=3][FONT=trebuchet ms][CENTER]отказано в восстановлении [COLOR=rgb(53, 159, 73)]аккаунта[/COLOR].<br>[SIZE=3][FONT=trebuchet ms][CENTER]закрыто.[/B]',
        color: "Turquoise",
    },
    {
        title: 'Мало информации',
        content: '[B][SIZE=3][FONT=trebuchet ms][CENTER]{{greeting}}, {{user.mention}}!<br>[SIZE=3][FONT=trebuchet ms][CENTER]недостаточно [COLOR=rgb(53, 159, 73)]доказательств[/COLOR].[SIZE=3][FONT=trebuchet ms]<br>закрыто.[/B]',
        color: "Turquoise",
    },
    {
        title: 'Перенаправление другой раздел',
        content: '[B][SIZE=3][FONT=trebuchet ms][CENTER]{{greeting}}, {{user.mention}}!<br>[SIZE=3][FONT=trebuchet ms][CENTER]вы попали не в тот [COLOR=rgb(53, 159, 73)]раздел[/COLOR], напишите в [COLOR=rgb(53, 159, 73)]другой[/COLOR].<br>[B]закрыто.[/B]',
        color: "Turquoise",
    },
    {
        title: 'Восстановил аккаунт',
        content: '[B][SIZE=3][FONT=trebuchet ms][CENTER]{{greeting}}, [B]{{user.mention}}[/B]!<br>предоставленных вами [COLOR=rgb(53, 159, 73)]данных[/COLOR] достаточно для того, чтобы мы могли восстановить ваш [COLOR=rgb(53, 159, 73)]аккаунт[/COLOR].<br> отправил новый пароль в [COLOR=rgb(53, 159, 73)]личную переписку[/COLOR], для избежания подобных ситуаций устанавливайте защиту [COLOR=rgb(53, 159, 73)]VK GUARD[/COLOR], чтобы при утере пароля вы смогли спокойно его [COLOR=rgb(53, 159, 73)]восстановить[/COLOR].<br>желаю приятного время препровождения на нашем [COLOR=rgb(53, 159, 73)]сервере[/COLOR].<br>закрыто.[/B]',
        color: "Turquoise",
    },
    {
        title: 'Запрос данных',
        content: '[B][SIZE=3][FONT=trebuchet ms][CENTER]{{greeting}}, [B]{{user.mention}}[/B]!<br>укажите следующие [COLOR=rgb(53, 159, 73)]данные[/COLOR] об аккаунте для [COLOR=rgb(53, 159, 73)]восстановления[/COLOR] (если не знаете - прочерк):<br>введенный промокод:<br>реферал:<br>автомобили/бизнесы/дома:<br>дата регистрации аккаунта:<br>уровень [COLOR=rgb(53, 159, 73)]vip[/COLOR]:<br>скин, в котором был персонаж:<br>игровой уровень:<br>смены никнейма. если были, перечислите прошлые ники:<br>был ли установлен на ваш компьютер ддос/ракбот(да/нет):<br>у вас есть 24 часа (время идет с момента моего ответа), администрация имеет право [COLOR=rgb(53, 159, 73)]отказать[/COLOR] в восстановлении доступа к аккаунта без объяснения [COLOR=rgb(53, 159, 73)]причин[/COLOR].<br>[B]на [COLOR=rgb(53, 159, 73)]обработке[/COLOR].[/B]',
        color: "Turquoise",
    },
];

// title - Название кнопки
// id - Уникальный айди кнопки
// prefix_id - Айди префикса из system.prefixes
// openedThread - Открыта / Закрыта ли тема (0 - закрыта / 1 - открыта)
// sticky - Закрыпрена ли тема (0 - открепить / 1 - закрепить)
const MenuButtons = [
	{
        title: "Arena",
        id: "arena",
        prefix_id: system.prefixes.arena,
        openedThread: "0"
    },
    {
        title: "Важная информация",
        id: "superinfo",
        prefix_id: system.prefixes.superinfo,
        openedThread: "0",
        sticky: "1"
    },
    {
        title: "Важно",
        id: "wajno",
        prefix_id: system.prefixes.wajno,
        openedThread: "0",
        sticky: "1"
    },
    {
        title: "Информация",
        id: "info",
        prefix_id: system.prefixes.info,
        openedThread: "0",
        sticky: "1"
    },
    {
        title: "Правила",
        id: "rules",
        prefix_id: system.prefixes.rules,
        openedThread: "0",
        sticky: "1"
    },
    {
        title: "На рассмотрении",
        id: "naras",
        prefix_id: system.prefixes.naras,
        sticky: "1"
    },
    {
        title: "Обрабатывается",
        id: "obrab",
        prefix_id: system.prefixes.obrab,
        sticky: "1"
    },
    {
        title: "Рассмотрено",
        id: "ras",
        prefix_id: system.prefixes.ras,
        openedThread: "0",
        sticky: "0"
    },
    {
        title: "Отказано",
        id: "otcaz",
        prefix_id: system.prefixes.otcaz,
        openedThread: "0",
        sticky: "0"
    },
    {
        title: "Рассмотрение Кр. Адм",
        id: "narasspec",
        prefix_id: system.prefixes.narasspec,
        openedThread: "0",
        sticky: "1"
    },
    {
        title: "Рассмотрение ГА",
        id: "narasga",
        prefix_id: system.prefixes.narasga,
        openedThread: "0",
        sticky: "1"
    },
    {
        title: "Отчет",
        id: "otchet",
        prefix_id: system.prefixes.otchet,
        openedThread: "1",
        sticky: "1"
    },
    {
        title: "Обсуждение",
        id: "obsujdenie",
        prefix_id: system.prefixes.obsujdenie,
        openedThread: "1",
        sticky: "1"
    },
    {
        title: "Обработано",
        id: "obrabotan",
        prefix_id: system.prefixes.obrabotan,
        openedThread: "0",
        sticky: "0"
    },
    {
        title: "На обработке",
        id: "naobrabotke",
        prefix_id: system.prefixes.naobrabotke,
        openedThread: "0",
        sticky: "1"
    },
    {
        title: "Снять префикс",
        id: "remove",
        prefix_id: system.prefixes.remove,
        openedThread: "1",
        sticky: "0"
    },
];

