// КЛАСС РУЛЕТКИ
// -----------------------------------------------------------------------------

function EvRoulette() {
	// тут будет всё оружие (оружие-приз + оружие-актёры)
	this.weapons = [];

	// DOM-элемент самой рулетки
	this.el = null;

	// родительский DOM-элемент для DOM-элементов оружия
	// (он вращается)
	this.el_weapons = null;
}

// ПАРАМЕТРЫ РУЛЕТКИ
// -----------------------------------------------------------------------------

// N_WEAPONS -- это общее количество оружия в рулетке
// (приз + возможно повторяющиеся актёры)
//
// всего оружия должно быть не мешьше 8 штук
// вот как оно выглядит
//
// +---+---+---+     +---+---+---+---+---+
// | 0 | 1 | 2 | ... |L-5|L-4|L-3|L-2|L-1|
// +---+---+---+     +---+---+---+---+---+
//
// L -- это N_WEAPONS
// (или после вызова метода 'set_weapons': this.weapons.length)
//
// L-3 -- на этом месте оружие-приз

// общее количество оружия
EvRoulette.N_WEAPONS = 20;

// айдишник приза
EvRoulette.WEAPON_PRIZE_ID = EvRoulette.N_WEAPONS - 3;

// время вращения (в секундах)
EvRoulette.SPIN_SECONDS = 5;

// звуки
EvRoulette.SOUND_START = 'snd/roulette_start.wav';
EvRoulette.SOUND_SPIN  = 'snd/roulette_spin.wav';
EvRoulette.SOUND_STOP  = 'snd/roulette_stop.wav';

// СОЗДАТЬ ОРУЖИЕ ИЗ АТРИБУТОВ
// -----------------------------------------------------------------------------

// вопрос: что тут происходит?
//  ответ: - создаётся массив из N_WEAPONS-1 актёров
//         - позицию WEAPON_PRIZE_ID занимает приз

EvRoulette.prototype.set_weapons = function (weapon_prize_attrs,
                                             weapon_actors_attrs) {
	var
		weapons           = [],
		weapon_actors_len = weapon_actors_attrs.length,
		j                 = 0,
		set_weapon_actors = function (from_i, to_i) {
			var i;
			for (i = from_i; i <= to_i; i += 1) {
				weapons[i] = new EvWeapon(
					i,
					weapon_actors_attrs[j]
				);
				j = (j === weapon_actors_len - 1) ? 0 : j + 1;
			}
		};

	if (weapon_actors_len === 0) {
		throw new Error('Ошибка! Нет актёров.');
	}

	set_weapon_actors(0, EvRoulette.WEAPON_PRIZE_ID - 1);

	weapons[EvRoulette.WEAPON_PRIZE_ID] = new EvWeapon(
		EvRoulette.WEAPON_PRIZE_ID,
		weapon_prize_attrs
	);

	set_weapon_actors(EvRoulette.WEAPON_PRIZE_ID + 1, EvRoulette.N_WEAPONS - 1);

	this.weapons = weapons;
};

// ОТРИСОВАТЬ НАЧАЛЬНОЕ ПОЛОЖЕНИЕ РУЛЕТКИ И ОРУЖИЯ
// -----------------------------------------------------------------------------

EvRoulette.prototype.render = function (el_parent) {
	var
		el_roulette = document.createElement('div'),
		el_target   = document.createElement('div'),
		el_weapons  = document.createElement('div');

	el_roulette.id = 'ev-roulette';
	el_target.id   = 'ev-target';
	el_weapons.id  = 'ev-weapons';

	el_weapons.style.width = (EvRoulette.N_WEAPONS * EvWeapon.EL_WIDTH) + 'px';

	// рендер оружия
	this.weapons.forEach(function (weapon) {
		weapon.render();
		el_weapons.appendChild(weapon.el);
	});

	el_roulette.appendChild(el_target);
	el_roulette.appendChild(el_weapons);

	// осталось примонтировать
	el_parent.appendChild(el_roulette);

	// рулетка готова
	this.el_weapons = el_weapons;
	this.el         = el_roulette;
};

// УЧУ РУЛЕТКУ ИЗДАВАТЬ ЗВУКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.make_sound = function (sound) {
	var audio    = new Audio(sound);
	audio.volume = 0.2;
	audio.play();
};

// ЗАПУСК РУЛЕТКИ
// -----------------------------------------------------------------------------

EvRoulette.prototype.start = function () {
	var
		self      = this,
		animation = 'spin ' + EvRoulette.SPIN_SECONDS + 's ease-in-out forwards',
		el_style  = document.createElement('style'),

		keyframes,
		keyframes_with_vendor_prefixes,

		el_weapon_width_1_2  = Math.floor(EvWeapon.EL_WIDTH / 2),
		el_weapon_width_1_20 = Math.floor(EvWeapon.EL_WIDTH / 20),

		rand = function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		// рандомная координата остановки
		rand_stop = (EvRoulette.N_WEAPONS - 5) * EvWeapon.EL_WIDTH +
		            el_weapon_width_1_2 +
		            rand(el_weapon_width_1_20, (19 * el_weapon_width_1_20));

	// генерация кейфреймов: для нормальных браузеров + для сафари
	keyframes = 'spin {' +
		' 0%   {left: 0;}' +
		' 100% {left: -' + rand_stop + 'px;}' +
	'}';
	keyframes_with_vendor_prefixes = document.createTextNode(
		'@keyframes '         + keyframes +
		'@-webkit-keyframes ' + keyframes
	);

	// хак для генерации цсс-кейфреймов через жс
	el_style.type = 'text/css';
	el_style.appendChild(keyframes_with_vendor_prefixes);
	self.el.appendChild(el_style);

	// рулетка понеслась
	self.make_sound(EvRoulette.SOUND_START);

	// активировать анимацию
	self.el_weapons.style.animation            = animation;
	self.el_weapons.style['-webkit-animation'] = animation;

	// рулетка остановится через SPIN_SECONDS
	setTimeout(function () {
		self.make_sound(EvRoulette.SOUND_STOP);
		self.weapons.forEach(function (weapon) {
			if (weapon.id !== EvRoulette.WEAPON_PRIZE_ID) {
				weapon.el.style.opacity = 0.5;
			}
		});
	}, EvRoulette.SPIN_SECONDS * 1000);
};
