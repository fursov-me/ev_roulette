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
		steam_image: 'http://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpotLO_JAlf0Ob3czRY49KJl4mfnu3xPYTdn2xZ_Pp9i_vG8ML22we18ko6Nm71JdDGdwQ7Yl3S-FXrxu27h8fqtZybwHAy6Scl43zagVXp1pQaPStA'
	},
	WEAPON_ACTORS_ATTRS = [
		{
			weapon_name: 'FAMAS',
			skin_name:   'Валентность',
			rarity:      'restricted',
			steam_image: 'http://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposLuoKhRf0uL3dzxP7c-Jl4-Fg_jhIYTdn2xZ_Pp9i_vG8MKj3VDh-kY9MWr3dYDDdwZtaQnV-Fi4k-vph8e0vcmYzXBlvCNw7X7UgVXp1iHYIfHn'
		},
		{
			weapon_name: 'Desert Eagle',
			skin_name:   'Дракон-предводитель',
			rarity:      'classified',
			steam_image: 'http://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhF2zowcDPzixc9OLcw82ZlyF8wC8wb251MW4tcifmydi7CEn4HiPlhyy1BxJbeNshqPIHELeWfJvK5CfiA'
		},
		{
			weapon_name: 'M4A4',
			skin_name:   'Звездный крейсер',
			rarity:      'covert',
			steam_image: 'http://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhnwMzFJTwW08y_m46OkuXLP7LWnn9u5MRjjeyPp4j2iwC38kA9N2j7IIeSe1M9ZQrZ-VS3wefv0ZG_tZXOyHo3uSZ34WGdwUJSqpF9BQ'
		},
		{
			weapon_name: '★ Bowie Knife',
			skin_name:   'Убийство',
			rarity:      'rare',
			steam_image: 'http://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfwObaZzRU7dCJlo-cnvLLMrbujG5T-sROhuDG_ZjKhFWmrBZyYTygdtTEe1RqYQ3Z8lTtkO6-0JC66czAzCdk73Ym7Hjemh20iREYb_sv26KxNysneA'
		}
	];

// ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ЗДЕСЬ НАЧИНАЕТСЯ ВСЯ ДВИЖУХА
// -----------------------------------------------------------------------------

function main() {
	var
		// куда монтировать рулетку 
		el_parent = document.getElementById('mysite-roulette-container'),

		// инициализировать рулетку
		roulette = new EvRoulette({
			weapon_prize_attrs:  WEAPON_PRIZE_ATTRS,
			weapon_actors_attrs: WEAPON_ACTORS_ATTRS,
			el_parent:           el_parent,
			afterparty:          function () {
				alert('Ой всё');
			}
		});

	// понеслась
	roulette.start();
}

document.addEventListener('DOMContentLoaded', main);
