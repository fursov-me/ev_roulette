// ЗАМЕТКА ПРО ОРУЖИЕ
// -----------------------------------------------------------------------------

// оружие -- это не константы и не просто глобальные переменные. очевидно,
// список оружия для массовки и оружие-приз должны прилетать с бекенда.

// вопрос: что такое ATTRS?
//  ответ: это атрибуты для создания объектов класса EvWeapon. внутри моего кода
//         используется класс EvWeapon, но тебе в нём разбираться не нужно. всё,
//         что нужно, -- это подсунуть правильные переменные WEAPON_PRIZE_ATTRS
//         и WEAPON_ACTORS_ATTRS

// WEAPON_PRIZE_ATTRS  <-- один набор атрибутов для оружия-приза
// WEAPON_ACTORS_ATTRS <-- массив атрибутов для оружия-актёров

// обязательные поля в атрибутах:
//     - weapon_name (строка)
//     - skin_name   (строка)
//     - rarity      (один из вариантов: 'milspec', 'restricted', 'classified',
//                                       'covert',  'rare',       'uncommon')
//     - steam_image (ссылка на картинку)

var
	WEAPON_PRIZE_ATTRS = {
		weapon_name: 'MP9',
		skin_name:   'Сектор приз на барабане',
		rarity:      'milspec',
		steam_image: 'img/steam/0.png'
	},
	WEAPON_ACTORS_ATTRS = [
		{
			weapon_name: 'Glock-18',
			skin_name:   'Королевский легион',
			rarity:      'restricted',
			steam_image: 'img/steam/1.png'
		},
		{
			weapon_name: 'AWP',
			skin_name:   'Элитное снаряжение',
			rarity:      'classified',
			steam_image: 'img/steam/2.png'
		},
		{
			weapon_name: 'AK-47',
			skin_name:   'Топливный инжектор',
			rarity:      'covert',
			steam_image: 'img/steam/3.png'
		},
		{
			weapon_name: '★ Bowie Knife',
			skin_name:   'Африканская сетка',
			rarity:      'rare',
			steam_image: 'img/steam/4.png'
		}
	];

// ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ЗДЕСЬ НАЧИНАЕТСЯ ВСЯ ДВИЖУХА
// -----------------------------------------------------------------------------

function main() {
	var
		// куда монтировать рулетку 
		el_parent = document.getElementById('ev-roulette-will-be-here'),

		// инициализировать рулетку
		roulette = new EvRoulette();

	// создать массив оружия из атрибутов
	roulette.set_weapons(WEAPON_PRIZE_ATTRS, WEAPON_ACTORS_ATTRS);

	// отрисовать рулетку вместе с оружием
	roulette.render(el_parent);

	// погнали!
	roulette.start();
}

document.addEventListener('DOMContentLoaded', main);
