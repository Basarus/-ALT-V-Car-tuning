import alt from 'alt-client';
import * as native from 'natives'

let lang = 0;

const name = ['Car tuning ', 'Тюнинг авто', 'Auto-Tuning']

const modTypes = [
    ['Spoiler', 'Спойлер', 'Autospoiler '], // 0
    ['Frontbumper', 'Передний бампер', 'Frontstoßstange'], // 1
    ['Rearbumper', 'Задний бампер', 'Hintere Stoßstange'], // 2
    ['Sideskirt', 'Пороги', 'Seitenrock'], // 3
    ['Exhaust', 'Выхлопные трубы', 'Auspuff'], // 4
    ['Chassis', 'Шасси', 'Chassis'], // 5
    ['Grille', 'Решетка радиатора', 'Gitter'], // 6
    ['Hood', 'Капот', 'Kapuze'], // 7
    ['Fender', 'Крылья', 'Fender'], // 8
    ['Rightfender', 'Правое крыло', 'Rechtsverteidiger'], // 9
    ['Roof', 'Крыша', 'Dach'], // 10
    ['Engine', 'Двигатель', 'Motor'], // 11
    ['Brakes', 'Тормоза', 'Bremsen'], // 12
    ['Transmission', 'Трансмиссия', 'Übertragung'], // 13
    ['Horns', 'Рога', 'Hörner'], // 14
    ['Suspension', 'Подвеска', 'Suspension'], // 15
    ['Armor', 'Броня', 'Rüstung'], // 16
    ['Unk17', '???', '???'], // 17
    ['Turbo', 'Турбо', 'Turbo'], // 18
    ['Unk19', '???', '???'], // 19
    ['Tiresmoke', 'Дым от шин', 'Reifenrauch'], // 20
    ['Unk21', '???', '???'], // 21
    ['Xenonlights', 'Тип фар', 'Xenonlichter'], // 22
    ['Frontwheels', 'Передние колеса', 'Vorderreifen'], // 23
    ['Backwheels', 'Задние колеса', 'Hinterräder'], // 24
    ['Plateholder', 'Номерной знак', 'Teller Halter'], // 25
    ['Vanityplates', 'Цвет номерного знака', 'Waschtische'], // 26
    ['Trim', 'Отделка', 'Trimmen'], // 27
    ['Ornaments', 'Узор', 'Ornamente'], // 28
    ['Dashboard', 'Приборная панель', 'Dashboard'], // 29
    ['Dial', '???', 'Wählen'], // 30
    ['Doorspeaker', 'Звук двери', 'Türsprecher'], // 31
    ['Seats', 'Сиденья', 'Sitze'], // 32
    ['Steeringwheel', 'Руль', 'Lenkrad'], // 33
    ['Shifterleavers', '????', 'Schalthebel'], // 34
    ['Plaques', '???', 'Plaketten'], // 35
    ['Speakers', 'Динамики', 'Sprecher'], // 36
    ['Trunk', 'Багажник', 'Kofferraum'], // 37
    ['Hydrulics', 'Гидравлика', 'Hydraulik'], // 38
    ['Engineblock', 'Блок двигателя', 'Motorblock'], // 39
    ['Airfilter', 'Воздушный фильтр', 'Luftfilter'], // 40
    ['Struts', 'Стойки', 'Streben'], // 41
    ['Archcover', 'Крышка арки', 'Archcover'], // 42
    ['Aerials', 'Антенны', 'Antennen'], // 43
    ['Trim', 'Отделка', 'Trimmen'], // 44
    ['Tank', 'Танк', 'Panzer'], // 45
    ['Windows', 'Окна', 'Windows'], // 46
    ['Unk47', '???', '???'], // 47
    ['Sticker', 'Наклейка', 'Aufkleber'], // 48 
    ['WheelType', 'Тип колеса', 'WheelType'], // 49
    ['Color 1', 'Цвет 1', 'Farbe 1'], // 50
    ['Color 2', 'Цвет 2', 'Farbe 2'], // 51
];

alt.setCamFrozen(false)

let color1 = { r: 0, g: 0, b: 0 };
let color2 = { r: 0, g: 0, b: 0 };



let web = undefined;
let player = alt.Player.local
let vehicle;

let cursour = true;

alt.onServer('CU::Init', Init);

function Init() {

    if (web === undefined && player.vehicle != undefined) {

        native.displayRadar(false)
        vehicle = player.vehicle.scriptID;

        web = new alt.WebView('http://resource/client/car_up/html/index.html');
        web.focus();

        alt.showCursor(cursour)
        native.freezeEntityPosition(vehicle, cursour);

        web.on('CU::Window:Load', () => OptionLoad())
        web.on('CU::Lang:Return', (_lang) => { lang = _lang; OptionLoad() })
    }

    web.on('CU::Mods:Return', (data) => {

        native.setVehicleWheelType(vehicle, data[data.length - 3].value);
        native.setVehicleMod(vehicle, 23, data[23].value, true);

        native.setVehicleModColor1(vehicle, data[data.length - 2].value, 0, 0)
        native.setVehicleCustomPrimaryColour(vehicle, color1.r, color1.g, color1.b);
        native.setVehicleModColor2(vehicle, data[data.length - 1].value, 0, 0)
        native.setVehicleCustomSecondaryColour(vehicle, color2.r, color2.g, color2.b);
      

        alt.emitServer('CU::Mods:Install', data)
    })

    web.on('CU::Color:Return', (color) => {
        if (color.type === 1) color1 = { r: color.r, g: color.g, b: color.b }
        else color2 = { r: color.r, g: color.g, b: color.b }
        native.setVehicleCustomPrimaryColour(vehicle, color1.r, color1.g, color1.b);
        native.setVehicleCustomSecondaryColour(vehicle, color2.r, color2.g, color2.b);

    })
}

alt.onServer('CU::Close', Close)
function Close() {
    if (web != undefined) {
        alt.setCamFrozen(false)
        alt.showCursor(false)
        native.freezeEntityPosition(vehicle, false);
        vehicle = undefined;
        native.displayRadar(true)
        web.destroy();
        web = undefined;
    }
}

function OptionLoad(){
    native.setVehicleModKit(vehicle, 0);
    native.setVehicleCustomPrimaryColour(vehicle, color1.r, color1.g, color1.b);
    native.setVehicleCustomSecondaryColour(vehicle, color2.r, color2.g, color2.b);

    let mods = modTypes.map((mod, index) => {
        let mod_value = native.getVehicleMod(vehicle, index);
        if (mod_value === -1) mod_value = 0;
        if (index === modTypes.length - 1)
            return {
                name: mod[lang],
                value: native.getVehicleModColor2(vehicle)[1] === 6 ? 0 : native.getVehicleModColor2(vehicle)[1],
                max_value: 5,
                show: false
            }
        else if (index === modTypes.length - 2)
            return {
                name: mod[lang],
                value: native.getVehicleModColor1(vehicle)[1] === 6 ? 0 : native.getVehicleModColor1(vehicle)[1],
                max_value: 5,
                show: false
            }
        else if (index === modTypes.length - 3)
        return {
            name: mod[lang],
            value: 0,
            max_value: 7,
            show: false
        }
        else return {
            name: mod[lang],
            value: mod_value,
            max_value: native.getNumVehicleMods(vehicle, index),
            show: false
        }

    })

    web.emit('CU::Mods:Load', mods, name[lang])
}

alt.on('keyup', handleKeyup);

function handleKeyup(key) {

    if (web == undefined) return;

    switch (key) {
        case 8:
            Close()
            break;
        case 192:
            if (cursour == false) {
                cursour = true;
                alt.showCursor(cursour)
                alt.setCamFrozen(cursour)
            } else {
                cursour = false
                alt.setCamFrozen(cursour)
                alt.showCursor(cursour)
            }
            break;
    }
}
